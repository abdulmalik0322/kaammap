import mongoose from 'mongoose';

// Persistent refresh sessions. Only the SHA-256 hash of the refresh token is
// stored; the raw token lives only in the user's HttpOnly cookie.
const refreshSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenHash: { type: String, required: true, unique: true, index: true },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    revokedAt: { type: Date, default: null },
    userAgent: { type: String, default: '' },
  },
  { timestamps: true }
);

export const RefreshSession = mongoose.models.RefreshSession || mongoose.model('RefreshSession', refreshSessionSchema);
