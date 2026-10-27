import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    description: { type: String, default: '', maxlength: 500 },
    icon: { type: String, default: '' },
    image: { type: String, default: '' },
    displayOrder: { type: Number, default: 0, index: true },
    // Urdu translation: { name, desc } — null when untranslated.
    ur: { type: mongoose.Schema.Types.Mixed, default: null },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
