import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Guide } from '../models/Guide.js';
import { SavedGuide } from '../models/SavedGuide.js';
import { ChecklistProgress } from '../models/ChecklistProgress.js';
import { IssueReport } from '../models/IssueReport.js';
import { ApiError, badRequest, notFound, unauthorized } from '../utils/ApiError.js';
import { ok, sanitizeUser } from '../utils/respond.js';
import { revokeAllSessions, clearRefreshCookie } from '../utils/tokens.js';

// Resolve a guide reference that may be a slug or an ObjectId.
// Private (unpublished) guides are only visible to their owner-admins.
async function resolveGuide(req, ref) {
  const value = String(ref || '');
  let guide = null;
  if (mongoose.isValidObjectId(value)) guide = await Guide.findById(value);
  if (!guide) guide = await Guide.findOne({ slug: value.toLowerCase() });
  if (!guide) throw notFound('Guide not found');
  if (guide.publicationStatus !== 'published' && req.user.role !== 'admin') throw notFound('Guide not found');
  return guide;
}

// ---------- Profile ----------
export async function getMe(req, res) {
  return ok(res, { user: sanitizeUser(req.user) });
}

export async function updateMe(req, res) {
  // Body already restricted by a strict zod allowlist (name, preferredLanguage).
  // Fields such as role/accountStatus can never be changed here.
  Object.assign(req.user, req.body);
  await req.user.save();
  return ok(res, { user: sanitizeUser(req.user) }, 'Profile updated');
}

export async function changePassword(req, res) {
  const user = await User.findById(req.user._id).select('+passwordHash');
  const matches = await bcrypt.compare(req.body.currentPassword, user.passwordHash);
  if (!matches) throw unauthorized('Current password is incorrect', 'INVALID_CREDENTIALS');
  user.passwordHash = await bcrypt.hash(req.body.newPassword, 10);
  await user.save();
  await revokeAllSessions(user._id);
  clearRefreshCookie(res);
  return ok(res, {}, 'Password changed. Please log in again.');
}

export async function deleteMe(req, res) {
  const userId = req.user._id;
  await Promise.all([
    SavedGuide.deleteMany({ userId }),
    ChecklistProgress.deleteMany({ userId }),
    // Keep the user's public reports but anonymize them.
    IssueReport.updateMany({ userId }, { $set: { userId: null } }),
  ]);
  const { RefreshSession } = await import('../models/RefreshSession.js');
  await RefreshSession.deleteMany({ userId });
  await User.deleteOne({ _id: userId });
  clearRefreshCookie(res);
  return ok(res, {}, 'Account deleted');
}

// ---------- Saved guides ----------
export async function listSaved(req, res) {
  const saved = await SavedGuide.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .populate('guideId');
  const items = saved
    .filter((s) => s.guideId)
    .map((s) => ({ savedAt: s.createdAt, guide: s.guideId }));
  return ok(res, { items });
}

export async function addSaved(req, res) {
  const guide = await resolveGuide(req, req.params.guideId);
  const existing = await SavedGuide.findOne({ userId: req.user._id, guideId: guide._id });
  if (existing) {
    return ok(res, { saved: existing, guide }, 'Guide is already in your saved list');
  }
  try {
    const saved = await SavedGuide.create({ userId: req.user._id, guideId: guide._id });
    return ok(res, { saved, guide }, 'Guide saved', 201);
  } catch (err) {
    if (err.code === 11000) {
      const dup = await SavedGuide.findOne({ userId: req.user._id, guideId: guide._id });
      return ok(res, { saved: dup, guide }, 'Guide is already in your saved list');
    }
    throw err;
  }
}

export async function removeSaved(req, res) {
  const guide = await resolveGuide(req, req.params.guideId);
  await SavedGuide.deleteOne({ userId: req.user._id, guideId: guide._id });
  return ok(res, { guideSlug: guide.slug }, 'Guide removed from your saved list');
}

// ---------- Checklist progress ----------
export async function getProgress(req, res) {
  const guide = await resolveGuide(req, req.params.guideSlug);
  const progress = await ChecklistProgress.findOne({ userId: req.user._id, guideId: guide._id });
  return ok(res, {
    guideSlug: guide.slug,
    completedItems: progress ? progress.completedItems : [],
    updatedAt: progress ? progress.updatedAt : null,
  });
}

const ITEM_ID = /^[ds]\d+$/;

export async function putProgress(req, res) {
  const guide = await resolveGuide(req, req.params.guideSlug);
  const items = [...new Set(req.body.completedItems)];
  // Validate every id against the guide's real structure — never trust the client.
  for (const id of items) {
    if (!ITEM_ID.test(id)) {
      throw badRequest(`Invalid checklist item id: ${id}`, 'INVALID_ITEM_ID', [{ path: 'completedItems', message: `Invalid item id ${id}` }]);
    }
    const index = parseInt(id.slice(1), 10);
    const max = id[0] === 'd' ? guide.documents.length : guide.steps.length;
    if (index >= max) {
      throw badRequest(`Checklist item id out of range for this guide: ${id}`, 'ITEM_OUT_OF_RANGE', [
        { path: 'completedItems', message: `Item ${id} does not exist in this guide` },
      ]);
    }
  }
  const progress = await ChecklistProgress.findOneAndUpdate(
    { userId: req.user._id, guideId: guide._id },
    { $set: { completedItems: items } },
    { upsert: true, new: true }
  );
  return ok(res, { guideSlug: guide.slug, completedItems: progress.completedItems, updatedAt: progress.updatedAt }, 'Progress saved');
}

export async function deleteProgress(req, res) {
  const guide = await resolveGuide(req, req.params.guideSlug);
  await ChecklistProgress.deleteOne({ userId: req.user._id, guideId: guide._id });
  return ok(res, { guideSlug: guide.slug, completedItems: [] }, 'Progress reset');
}

// ---------- My issue reports (adminNotes is select:false, never returned) ----------
export async function myReports(req, res) {
  const reports = await IssueReport.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(100);
  return ok(res, { items: reports });
}
