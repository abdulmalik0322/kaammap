import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import {
  updateMeSchema,
  changePasswordSchema,
  deleteMeSchema,
  progressSchema,
} from '../validators/schemas.js';
import * as user from '../controllers/userController.js';

const router = Router();
router.use(requireAuth);

// Profile
router.get('/', asyncHandler(user.getMe));
router.patch('/', validate(updateMeSchema), asyncHandler(user.updateMe));
router.patch('/password', validate(changePasswordSchema), asyncHandler(user.changePassword));
router.delete('/', validate(deleteMeSchema), asyncHandler(user.deleteMe));

// Saved guides (:guideId accepts a guide slug or ObjectId)
router.get('/saved-guides', asyncHandler(user.listSaved));
router.post('/saved-guides/:guideId', asyncHandler(user.addSaved));
router.delete('/saved-guides/:guideId', asyncHandler(user.removeSaved));

// Checklist progress
router.get('/progress/:guideSlug', asyncHandler(user.getProgress));
router.put('/progress/:guideSlug', validate(progressSchema), asyncHandler(user.putProgress));
router.delete('/progress/:guideSlug', asyncHandler(user.deleteProgress));

// Own issue reports
router.get('/reports', asyncHandler(user.myReports));

export default router;
