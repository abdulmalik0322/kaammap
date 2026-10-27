import { Category } from '../models/Category.js';
import { Guide } from '../models/Guide.js';
import { notFound } from '../utils/ApiError.js';
import { ok, paginated, parsePagination, escapeRegex } from '../utils/respond.js';

function publicGuide(guide) {
  if (!guide) return null;
  const g = typeof guide.toObject === 'function' ? guide.toObject() : { ...guide };
  delete g.__v;
  delete g.createdBy;
  delete g.updatedBy;
  // Frontend contract: the React app reads `category` (slug) and category `desc`.
  if (g.categorySlug && !g.category) g.category = g.categorySlug;
  return g;
}

// ---------- Categories (public: active only) ----------
const publicCategory = (c) => { const o = typeof c.toObject === 'function' ? c.toObject() : { ...c }; if (o.description && !o.desc) o.desc = o.description; return o };
export async function listCategories(req, res) {
  const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
  return ok(res, { items: categories.map(publicCategory) });
}

export async function getCategory(req, res) {
  const category = await Category.findOne({ slug: String(req.params.slug).toLowerCase(), isActive: true });
  if (!category) throw notFound('Category not found');
  return ok(res, { category: publicCategory(category) });
}

// ---------- Guides (public: published only) ----------
const GUIDE_SORTS = ['relevant', 'title', 'recent'];

export async function listGuides(req, res) {
  const { page, limit, skip } = parsePagination(req.query);
  const filter = { publicationStatus: 'published' };

  const category = String(req.query.category || '').trim().toLowerCase();
  if (category) filter.categorySlug = category;

  const province = String(req.query.province || req.query.scope || '').trim();
  if (province) filter.scope = new RegExp(escapeRegex(province), 'i');

  const level = String(req.query.level || '').trim();
  if (['checked', 'partial', 'preparation'].includes(level)) filter.level = level;

  const q = String(req.query.q || '').trim();
  if (q) {
    const regex = new RegExp(escapeRegex(q), 'i');
    // Also match guides whose category NAME matches the query.
    const matchingCats = await Category.find({ name: regex }).select('slug');
    const catSlugs = matchingCats.map((c) => c.slug);
    filter.$or = [
      { title: regex },
      { short: regex },
      { keywords: regex },
      { authority: regex },
      ...(catSlugs.length ? [{ categorySlug: { $in: catSlugs } }] : []),
    ];
  }

  const sortParam = GUIDE_SORTS.includes(req.query.sort) ? req.query.sort : 'relevant';
  const sort =
    sortParam === 'title' ? { title: 1 } : sortParam === 'recent' ? { publishedAt: -1, createdAt: -1 } : { publishedAt: -1, createdAt: -1 };

  const [totalItems, guides] = await Promise.all([
    Guide.countDocuments(filter),
    Guide.find(filter).sort(sort).skip(skip).limit(limit),
  ]);
  return ok(res, paginated(guides.map(publicGuide), page, limit, totalItems));
}

export async function featuredGuides(req, res) {
  const guides = await Guide.find({ publicationStatus: 'published', level: 'checked' })
    .sort({ publishedAt: -1 })
    .limit(6);
  return ok(res, { items: guides.map(publicGuide) });
}

export async function getGuide(req, res) {
  const guide = await Guide.findOne({
    slug: String(req.params.slug).toLowerCase(),
    publicationStatus: 'published',
  });
  if (!guide) throw notFound('Guide not found');
  return ok(res, { guide: publicGuide(guide) });
}

export async function relatedGuides(req, res) {
  const guide = await Guide.findOne({
    slug: String(req.params.slug).toLowerCase(),
    publicationStatus: 'published',
  }).select('related');
  if (!guide) throw notFound('Guide not found');
  const related = guide.related?.length
    ? await Guide.find({ slug: { $in: guide.related }, publicationStatus: 'published' })
    : [];
  return ok(res, { items: related.map(publicGuide) });
}
