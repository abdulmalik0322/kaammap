import mongoose from 'mongoose';

export const ISSUE_TYPES = ['outdated-fee', 'wrong-document', 'broken-link', 'wrong-steps', 'wrong-information', 'other'];
export const REPORT_STATUSES = ['pending', 'reviewing', 'resolved', 'rejected'];

const issueReportSchema = new mongoose.Schema(
  {
    guideSlug: { type: String, required: true, index: true, trim: true, lowercase: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    issueType: { type: String, enum: ISSUE_TYPES, default: 'other' },
    description: { type: String, required: true, maxlength: 2000 },
    relevantSection: { type: String, default: '', maxlength: 200 },
    status: { type: String, enum: REPORT_STATUSES, default: 'pending', index: true },
    // Internal only: select:false so it is never exposed to ordinary users.
    adminNotes: { type: String, default: '', maxlength: 2000, select: false },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

export const IssueReport = mongoose.models.IssueReport || mongoose.model('IssueReport', issueReportSchema);
