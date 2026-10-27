import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, trim: true },
    normalizedEmail: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    accountStatus: { type: String, enum: ['active', 'suspended'], default: 'active', index: true },
    emailVerifiedAt: { type: Date, default: null },
    preferredLanguage: { type: String, default: 'en', maxlength: 10 },
    lastLoginAt: { type: Date, default: null },
    // Password reset uses a 6-digit code (like real-world OTP flows). Only the
    // SHA-256 hash of the code (bound to the account email) is stored — never
    // the raw code. Attempts are counted and the code locks after a few tries.
    resetCodeHash: { type: String, default: null, select: false },
    resetCodeExpires: { type: Date, default: null, select: false },
    resetCodeAttempts: { type: Number, default: 0, select: false },
    verifyTokenHash: { type: String, default: null, select: false },
    verifyTokenExpires: { type: Date, default: null, select: false },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);
