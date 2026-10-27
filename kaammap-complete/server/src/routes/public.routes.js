import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { optionalAuth } from '../middleware/auth.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import { reportIssueSchema, contactSchema } from '../validators/schemas.js';
import * as pub from '../controllers/publicController.js';
import * as reports from '../controllers/reportController.js';

const router = Router();

// Categories
router.get('/categories', asyncHandler(pub.listCategories));
router.get('/categories/:slug', asyncHandler(pub.getCategory));

// Guides (order matters: /featured before /:slug)
router.get('/guides', asyncHandler(pub.listGuides));
router.get('/guides/featured', asyncHandler(pub.featuredGuides));
router.get('/guides/:slug/related', asyncHandler(pub.relatedGuides));
router.get('/guides/:slug', asyncHandler(pub.getGuide));

// Outdated-information reports (public, optional auth, rate limited)
router.post(
  '/guides/:slug/report-issue',
  writeLimiter,
  optionalAuth,
  validate(reportIssueSchema),
  asyncHandler(reports.reportIssue)
);

// Contact (public, rate limited)
router.post('/contact', writeLimiter, validate(contactSchema), asyncHandler(reports.contact));

export default router;
