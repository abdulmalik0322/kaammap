import mongoose from 'mongoose';

export const SOURCE_TYPES = [
  'government-website',
  'application-portal',
  'fee-schedule',
  'official-notification',
  'university-website',
  'other-authoritative',
];

function isHttpUrl(value) {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

const sourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    officialUrl: {
      type: String,
      required: true,
      trim: true,
      validate: { validator: isHttpUrl, message: 'officialUrl must be a valid http(s) URL' },
    },
    organization: { type: String, default: '', maxlength: 200 },
    sourceType: { type: String, enum: SOURCE_TYPES, default: 'government-website' },
    guideSlugs: { type: [String], default: [], index: true },
    checkedAt: { type: Date, default: null },
    lastModifiedAt: { type: Date, default: null },
    notes: { type: String, default: '', maxlength: 2000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export const Source = mongoose.models.Source || mongoose.model('Source', sourceSchema);
