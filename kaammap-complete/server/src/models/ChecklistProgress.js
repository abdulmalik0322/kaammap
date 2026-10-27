import mongoose from 'mongoose';

// completedItems holds stable item ids relative to the guide's arrays:
// "d0".."dN" for documents, "s0".."sN" for steps (validated against the guide).
const checklistProgressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    guideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide', required: true, index: true },
    completedItems: { type: [String], default: [] },
  },
  { timestamps: true }
);

checklistProgressSchema.index({ userId: 1, guideId: 1 }, { unique: true });

export const ChecklistProgress = mongoose.models.ChecklistProgress || mongoose.model('ChecklistProgress', checklistProgressSchema);
