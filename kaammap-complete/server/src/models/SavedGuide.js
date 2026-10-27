import mongoose from 'mongoose';

const savedGuideSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', required: true, index: true },
  },
  { timestamps: true }
);

// One record per (user, guide) — duplicates are prevented at the database level.
savedGuideSchema.index({ userId: 1, guideId: 1 }, { unique: true });

export const SavedGuide = mongoose.models.SavedGuide || mongoose.model('SavedGuide', savedGuideSchema);
