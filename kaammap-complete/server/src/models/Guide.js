import mongoose from 'mongoose';

// Guide content fields mirror the existing frontend data shape
// (src/data/guides.js) so the seed can import that file directly and the API
// can serve the frontend without shape translation.
// Frontend field `category` is stored here as `categorySlug`.
const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String, default: '' },
    status: { type: String, enum: ['required', 'conditional'], default: 'required' },
    note: { type: String, default: '' },
  },
  { _id: false }
);

const feeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: Number, default: null },
    applies: { type: String, default: '' },
    source: { type: String, default: '' },
    checked: { type: String, default: '' },
  },
  { _id: false }
);

// Frontend step links are objects { label, url } or null — mirrored exactly.
const stepLinkSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, default: '' },
  },
  { _id: false }
);

const stepSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, default: '' },
    link: { type: stepLinkSchema, default: null },
  },
  { _id: false }
);

const faqSchema = new mongoose.Schema(
  {
    q: { type: String, required: true },
    a: { type: String, required: true },
  },
  { _id: false }
);

const sourceRefSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, default: '' },
    desc: { type: String, default: '' },
  },
  { _id: false }
);

const applyAtSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    url: { type: String, default: '' },
    desc: { type: String, default: '' },
  },
  { _id: false }
);

const guideSchema = new mongoose.Schema(
  {
    // --- content (mirrors frontend) ---
    slug: { type: String, required: true, unique: true, index: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    short: { type: String, default: '', maxlength: 600 },
    categorySlug: { type: String, required: true, index: true, trim: true, lowercase: true },
    scope: { type: String, default: '' },
    applies: { type: String, default: '' },
    authority: { type: String, default: '' },
    whoFor: { type: String, default: '' },
    level: { type: String, enum: ['checked', 'partial', 'preparation'], default: 'preparation', index: true },
    verifiedDate: { type: String, default: '' },
    verifyNote: { type: String, default: '' },
    keywords: { type: [String], default: [], index: true },
    documents: { type: [documentSchema], default: [] },
    fees: { type: [feeSchema], default: [] },
    feesUnavailable: { type: String, default: '' },
    // Full Urdu translation of the translatable content, mirroring the
    // English fields (index-aligned arrays). Null when untranslated.
    ur: { type: mongoose.Schema.Types.Mixed, default: null },
    steps: { type: [stepSchema], default: [] },
    applyAt: { type: [applyAtSchema], default: [] },
    notes: { type: [String], default: [] },
    faqs: { type: [faqSchema], default: [] },
    sources: { type: [sourceRefSchema], default: [] },
    related: { type: [String], default: [] },
    heroImage: { type: String, default: '' },
    // --- backend / workflow fields ---
    publicationStatus: {
      type: String,
      enum: ['draft', 'published', 'archived', 'needs_review'],
      default: 'draft',
      index: true,
    },
    reviewStatus: { type: String, default: 'not_reviewed' },
    publishedAt: { type: Date, default: null },
    lastReviewedAt: { type: Date, default: null },
    nextReviewAt: { type: Date, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

guideSchema.index({ categorySlug: 1, publicationStatus: 1 });
guideSchema.index({ publicationStatus: 1, level: 1 });

export const Guide = mongoose.models.Guide || mongoose.model('Guide', guideSchema);
