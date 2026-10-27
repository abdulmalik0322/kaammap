import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  categoryCreateSchema,
  categoryPatchSchema,
  guideCreateSchema,
  guidePatchSchema,
  sourceCreateSchema,
  sourcePatchSchema,
  reportPatchSchema,
  contactPatchSchema,
  adminUserPatchSchema,
} from '../validators/schemas.js';
import * as admin from '../controllers/adminController.js';

const router = Router();
// Every admin endpoint requires a valid session AND the admin role.
// Authorization is enforced here on the server — never trust the frontend.
router.use(requireAuth, requireAdmin);

router.get('/dashboard', asyncHandler(admin.dashboard));

// Guides
router.get('/guides', asyncHandler(admin.adminListGuides));
router.post('/guides', validate(guideCreateSchema), asyncHandler(admin.adminCreateGuide));
router.get('/guides/:id', asyncHandler(admin.adminGetGuide));
router.patch('/guides/:id', validate(guidePatchSchema), asyncHandler(admin.adminPatchGuide));
router.delete('/guides/:id', asyncHandler(admin.adminDeleteGuide));
router.post('/guides/:id/publish', asyncHandler(admin.adminPublishGuide));
router.post('/guides/:id/archive', asyncHandler(admin.adminArchiveGuide));
router.post('/guides/:id/request-review', asyncHandler(admin.adminRequestReview));

// Categories
router.post('/categories', validate(categoryCreateSchema), asyncHandler(admin.adminCreateCategory));
router.patch('/categories/:id', validate(categoryPatchSchema), asyncHandler(admin.adminPatchCategory));
router.delete('/categories/:id', asyncHandler(admin.adminDeleteCategory));

// Official sources
router.get('/sources', asyncHandler(admin.adminListSources));
router.post('/sources', validate(sourceCreateSchema), asyncHandler(admin.adminCreateSource));
router.patch('/sources/:id', validate(sourcePatchSchema), asyncHandler(admin.adminPatchSource));
router.delete('/sources/:id', asyncHandler(admin.adminDeleteSource));

// Issue reports
router.get('/reports', asyncHandler(admin.adminListReports));
router.patch('/reports/:id', validate(reportPatchSchema), asyncHandler(admin.adminPatchReport));

// Contact messages
router.get('/contact-messages', asyncHandler(admin.adminListContactMessages));
router.patch('/contact-messages/:id', validate(contactPatchSchema), asyncHandler(admin.adminPatchContactMessage));

// Users
router.get('/users', asyncHandler(admin.adminListUsers));
router.patch('/users/:id', validate(adminUserPatchSchema), asyncHandler(admin.adminPatchUser));

export default router;
