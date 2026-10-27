import mongoose from 'mongoose';
import { Guide } from '../models/Guide.js';
import { Category } from '../models/Category.js';
import { Source } from '../models/Source.js';
import { IssueReport, REPORT_STATUSES } from '../models/IssueReport.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { AuditLog } from '../models/AuditLog.js';
import { User } from '../models/User.js';
import { ApiError, badRequest, conflict, notFound } from '../utils/ApiError.js';
import { ok, created, paginated, parsePagination, sanitizeUser, escapeRegex } from '../utils/respond.js';
import { writeAudit } from '../utils/audit.js';
import { revokeAllSessions } from '../utils/tokens.js';

function ensureObjectId(id) {
  if (!mongoose.isValidObjectId(id)) throw badRequest('The provided id is not valid', 'INVALID_ID');
  return id;
}

async function ensureCategoryExists(slug) {
  const cat = await Category.findOne({ slug });
  if (!cat) throw badRequest(`Category does not exist: ${slug}`, 'CATEGORY_NOT_FOUND');
  return cat;
}

// ---------- Dashboard ----------
export async function dashboard(req, res) {
  const [publishedGuides, draftGuides, needsReviewGuides, pendingReports, activeCategories, totalUsers, recentActivity] =
    await Promise.all([
      Guide.countDocuments({ publicationStatus: 'published' }),
      Guide.countDocuments({ publicationStatus: 'draft' }),
      Guide.countDocuments({ publicationStatus: 'needs_review' }),
      IssueReport.countDocuments({ status: 'pending' }),
      Category.countDocuments({ isActive: true }),
      User.countDocuments({}),
      AuditLog.find({}).sort({ createdAt: -1 }).limit(10),
    ]);
  return ok(res, {
    stats: { publishedGuides, draftGuides, needsReviewGuides, pendingReports, activeCategories, totalUsers },
    recentActivity,
  });
}

// ---------- Guides ----------
export async function adminListGuides(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};
  if (req.query.status) filter.publicationStatus = String(req.query.status);
  if (req.query.category) filter.categorySlug = String(req.query.category).toLowerCase();
  if (req.query.q) filter.title = new RegExp(escapeRegex(String(req.query.q)), 'i');
  const [totalItems, guides] = await Promise.all([
    Guide.countDocuments(filter),
    Guide.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
  ]);
  return ok(res, paginated(guides, page, limit, totalItems));
}

export async function adminCreateGuide(req, res) {
  await ensureCategoryExists(req.body.categorySlug);
  const dupe = await Guide.findOne({ slug: req.body.slug });
  if (dupe) throw conflict('A guide with this slug already exists', 'DUPLICATE');
  const guide = await Guide.create({ ...req.body, createdBy: req.user._id, updatedBy: req.user._id });
  await writeAudit(req.user._id, 'guide.created', 'Guide', guide._id, `Created draft guide "${guide.title}"`);
  return created(res, { guide }, 'Guide created as draft');
}

export async function adminGetGuide(req, res) {
  ensureObjectId(req.params.id);
  const guide = await Guide.findById(req.params.id);
  if (!guide) throw notFound('Guide not found');
  return ok(res, { guide });
}

const GUIDE_PATCH_FIELDS = [
  'slug', 'title', 'short', 'categorySlug', 'scope', 'applies', 'authority', 'whoFor', 'level',
  'verifiedDate', 'verifyNote', 'keywords', 'documents', 'fees', 'feesUnavailable', 'steps',
  'applyAt', 'notes', 'faqs', 'sources', 'related', 'heroImage', 'ur', 'reviewStatus', 'lastReviewedAt', 'nextReviewAt',
];

export async function adminPatchGuide(req, res) {
  ensureObjectId(req.params.id);
  const guide = await Guide.findById(req.params.id);
  if (!guide) throw notFound('Guide not found');

  // Slugs are immutable once a guide is published (public URLs depend on them).
  if (guide.publicationStatus === 'published' && req.body.slug && req.body.slug !== guide.slug) {
    throw badRequest('The slug of a published guide cannot be changed. Archive it and create a new guide instead.', 'SLUG_IMMUTABLE');
  }
  if (req.body.categorySlug && req.body.categorySlug !== guide.categorySlug) {
    await ensureCategoryExists(req.body.categorySlug);
  }

  const feesChanged = req.body.fees && JSON.stringify(req.body.fees) !== JSON.stringify(guide.fees);
  const sourcesChanged = req.body.sources && JSON.stringify(req.body.sources) !== JSON.stringify(guide.sources);

  for (const field of GUIDE_PATCH_FIELDS) {
    if (req.body[field] !== undefined) guide[field] = req.body[field];
  }
  guide.updatedBy = req.user._id;
  await guide.save();

  if (feesChanged) await writeAudit(req.user._id, 'guide.fees_updated', 'Guide', guide._id, `Updated fees for "${guide.title}"`);
  if (sourcesChanged) await writeAudit(req.user._id, 'guide.sources_updated', 'Guide', guide._id, `Updated sources for "${guide.title}"`);
  if (!feesChanged && !sourcesChanged) await writeAudit(req.user._id, 'guide.updated', 'Guide', guide._id, `Updated guide "${guide.title}"`);
  return ok(res, { guide }, 'Guide updated');
}

export async function adminDeleteGuide(req, res) {
  ensureObjectId(req.params.id);
  const guide = await Guide.findById(req.params.id);
  if (!guide) throw notFound('Guide not found');
  if (guide.publicationStatus !== 'draft') {
    throw conflict('Only draft guides can be deleted. Archive this guide instead.', 'DELETE_REQUIRES_DRAFT');
  }
  await guide.deleteOne();
  await writeAudit(req.user._id, 'guide.deleted', 'Guide', guide._id, `Deleted draft guide "${guide.title}"`);
  return ok(res, {}, 'Draft guide deleted');
}

export async function adminPublishGuide(req, res) {
  ensureObjectId(req.params.id);
  const guide = await Guide.findById(req.params.id);
  if (!guide) throw notFound('Guide not found');

  // Publication policy: a guide may only be published when it is structurally
  // complete, and factual ("checked") guides must cite at least one source.
  const problems = [];
  if (!guide.title) problems.push('title is required');
  if (!guide.slug) problems.push('slug is required');
  if (!guide.categorySlug) problems.push('categorySlug is required');
  if (guide.categorySlug) {
    const cat = await Category.findOne({ slug: guide.categorySlug });
    if (!cat) problems.push(`category does not exist: ${guide.categorySlug}`);
  }
  if (!guide.documents || guide.documents.length < 1) problems.push('at least one required document is needed');
  if (!guide.steps || guide.steps.length < 1) problems.push('at least one step is needed');
  if (guide.level === 'checked' && (!guide.sources || guide.sources.length < 1)) {
    problems.push('guides with level "checked" must cite at least one official source');
  }
  if (problems.length) {
    throw badRequest('Guide is not ready to publish', 'PUBLISH_VALIDATION', problems.map((p) => ({ message: p })));
  }

  guide.publicationStatus = 'published';
  guide.publishedAt = new Date();
  guide.lastReviewedAt = new Date();
  guide.reviewStatus = 'reviewed';
  guide.updatedBy = req.user._id;
  await guide.save();
  await writeAudit(req.user._id, 'guide.published', 'Guide', guide._id, `Published guide "${guide.title}"`);
  return ok(res, { guide }, 'Guide published');
}

export async function adminArchiveGuide(req, res) {
  ensureObjectId(req.params.id);
  const guide = await Guide.findById(req.params.id);
  if (!guide) throw notFound('Guide not found');
  guide.publicationStatus = 'archived';
  guide.updatedBy = req.user._id;
  await guide.save();
  await writeAudit(req.user._id, 'guide.archived', 'Guide', guide._id, `Archived guide "${guide.title}"`);
  return ok(res, { guide }, 'Guide archived');
}

export async function adminRequestReview(req, res) {
  ensureObjectId(req.params.id);
  const guide = await Guide.findById(req.params.id);
  if (!guide) throw notFound('Guide not found');
  guide.reviewStatus = 'review_requested';
  if (guide.publicationStatus === 'draft') guide.publicationStatus = 'needs_review';
  guide.updatedBy = req.user._id;
  await guide.save();
  await writeAudit(req.user._id, 'guide.review_requested', 'Guide', guide._id, `Review requested for "${guide.title}"`);
  return ok(res, { guide }, 'Review requested');
}

// ---------- Categories ----------
export async function adminCreateCategory(req, res) {
  const dupe = await Category.findOne({ slug: req.body.slug });
  if (dupe) throw conflict('A category with this slug already exists', 'DUPLICATE');
  const category = await Category.create(req.body);
  await writeAudit(req.user._id, 'category.created', 'Category', category._id, `Created category "${category.name}"`);
  return created(res, { category }, 'Category created');
}

export async function adminPatchCategory(req, res) {
  ensureObjectId(req.params.id);
  const category = await Category.findById(req.params.id);
  if (!category) throw notFound('Category not found');
  if (req.body.slug && req.body.slug !== category.slug) {
    const dupe = await Category.findOne({ slug: req.body.slug });
    if (dupe) throw conflict('A category with this slug already exists', 'DUPLICATE');
    const inUse = await Guide.countDocuments({ categorySlug: category.slug });
    if (inUse > 0) {
      throw conflict('This category slug is used by guides and cannot be renamed. Create a new category instead.', 'CATEGORY_IN_USE');
    }
  }
  Object.assign(category, req.body);
  await category.save();
  await writeAudit(req.user._id, 'category.updated', 'Category', category._id, `Updated category "${category.name}"`);
  return ok(res, { category }, 'Category updated');
}

export async function adminDeleteCategory(req, res) {
  ensureObjectId(req.params.id);
  const category = await Category.findById(req.params.id);
  if (!category) throw notFound('Category not found');
  const inUse = await Guide.countDocuments({ categorySlug: category.slug });
  if (inUse > 0) {
    throw conflict(
      `This category is used by ${inUse} guide(s) and cannot be deleted. Deactivate it instead (isActive=false).`,
      'CATEGORY_IN_USE'
    );
  }
  await category.deleteOne();
  await writeAudit(req.user._id, 'category.deleted', 'Category', category._id, `Deleted category "${category.name}"`);
  return ok(res, {}, 'Category deleted');
}

// ---------- Sources ----------
export async function adminListSources(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};
  if (req.query.guideSlug) filter.guideSlugs = String(req.query.guideSlug).toLowerCase();
  const [totalItems, sources] = await Promise.all([
    Source.countDocuments(filter),
    Source.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limit),
  ]);
  return ok(res, paginated(sources, page, limit, totalItems));
}

export async function adminCreateSource(req, res) {
  const source = await Source.create({ ...req.body, createdBy: req.user._id, updatedBy: req.user._id });
  await writeAudit(req.user._id, 'source.created', 'Source', source._id, `Added source "${source.title}"`);
  return created(res, { source }, 'Source created');
}

export async function adminPatchSource(req, res) {
  ensureObjectId(req.params.id);
  const source = await Source.findById(req.params.id);
  if (!source) throw notFound('Source not found');
  Object.assign(source, req.body);
  source.updatedBy = req.user._id;
  await source.save();
  await writeAudit(req.user._id, 'source.updated', 'Source', source._id, `Updated source "${source.title}"`);
  return ok(res, { source }, 'Source updated');
}

export async function adminDeleteSource(req, res) {
  ensureObjectId(req.params.id);
  const source = await Source.findById(req.params.id);
  if (!source) throw notFound('Source not found');
  await source.deleteOne();
  await writeAudit(req.user._id, 'source.deleted', 'Source', req.params.id, `Deleted source "${source.title}"`);
  return ok(res, {}, 'Source deleted');
}

// ---------- Issue reports ----------
export async function adminListReports(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};
  if (req.query.status) {
    if (!REPORT_STATUSES.includes(req.query.status)) throw badRequest('Invalid report status filter', 'VALIDATION_ERROR');
    filter.status = req.query.status;
  }
  if (req.query.guideSlug) filter.guideSlug = String(req.query.guideSlug).toLowerCase();
  const [totalItems, reports] = await Promise.all([
    IssueReport.countDocuments(filter),
    IssueReport.find(filter).select('+adminNotes').sort({ createdAt: -1 }).skip(skip).limit(limit),
  ]);
  return ok(res, paginated(reports, page, limit, totalItems));
}

export async function adminPatchReport(req, res) {
  ensureObjectId(req.params.id);
  const report = await IssueReport.findById(req.params.id);
  if (!report) throw notFound('Report not found');
  if (req.body.status !== undefined) report.status = req.body.status;
  if (req.body.adminNotes !== undefined) report.adminNotes = req.body.adminNotes;
  report.reviewedBy = req.user._id;
  report.reviewedAt = new Date();
  await report.save();
  await writeAudit(req.user._id, 'report.updated', 'IssueReport', report._id, `Report for guide "${report.guideSlug}" -> ${report.status}`);
  const full = await IssueReport.findById(report._id).select('+adminNotes');
  return ok(res, { report: full }, 'Report updated');
}

// ---------- Contact messages ----------
export async function adminListContactMessages(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};
  if (req.query.status) filter.status = String(req.query.status);
  const [totalItems, messages] = await Promise.all([
    ContactMessage.countDocuments(filter),
    ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
  ]);
  return ok(res, paginated(messages, page, limit, totalItems));
}

export async function adminPatchContactMessage(req, res) {
  ensureObjectId(req.params.id);
  const message = await ContactMessage.findById(req.params.id);
  if (!message) throw notFound('Contact message not found');
  message.status = req.body.status;
  await message.save();
  return ok(res, { message }, 'Contact message updated');
}

// ---------- Users ----------
export async function adminListUsers(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = {};
  if (req.query.role) filter.role = String(req.query.role);
  if (req.query.q) filter.normalizedEmail = new RegExp(escapeRegex(String(req.query.q)), 'i');
  const [totalItems, users] = await Promise.all([
    User.countDocuments(filter),
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
  ]);
  return ok(res, paginated(users.map(sanitizeUser), page, limit, totalItems));
}

export async function adminPatchUser(req, res) {
  ensureObjectId(req.params.id);
  const target = await User.findById(req.params.id);
  if (!target) throw notFound('User not found');
  const isSelf = String(target._id) === String(req.user._id);
  if (isSelf && req.body.role && req.body.role !== target.role) {
    throw badRequest('You cannot change your own role', 'SELF_ROLE_CHANGE');
  }
  const changes = [];
  if (req.body.role && req.body.role !== target.role) {
    changes.push(`role ${target.role} -> ${req.body.role}`);
    target.role = req.body.role;
  }
  if (req.body.accountStatus && req.body.accountStatus !== target.accountStatus) {
    changes.push(`status ${target.accountStatus} -> ${req.body.accountStatus}`);
    target.accountStatus = req.body.accountStatus;
    if (target.accountStatus === 'suspended') await revokeAllSessions(target._id);
  }
  await target.save();
  if (changes.length) {
    await writeAudit(req.user._id, 'user.updated', 'User', target._id, `User ${target.normalizedEmail}: ${changes.join(', ')}`);
  }
  return ok(res, { user: sanitizeUser(target) }, 'User updated');
}
