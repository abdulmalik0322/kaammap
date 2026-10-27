import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  resendVerificationSchema,
} from '../validators/schemas.js';
import * as auth from '../controllers/authController.js';

const router = Router();

router.post('/register', authLimiter, validate(registerSchema), asyncHandler(auth.register));
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(auth.login));
router.post('/logout', asyncHandler(auth.logout));
router.get('/me', requireAuth, asyncHandler(auth.me));
router.post('/refresh', authLimiter, asyncHandler(auth.refresh));
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), asyncHandler(auth.forgotPassword));
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), asyncHandler(auth.resetPassword));
router.post('/verify-email', authLimiter, validate(verifyEmailSchema), asyncHandler(auth.verifyEmail));
router.post('/resend-verification', authLimiter, validate(resendVerificationSchema), asyncHandler(auth.resendVerification));

export default router;
