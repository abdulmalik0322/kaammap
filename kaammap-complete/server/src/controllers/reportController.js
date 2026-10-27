import { Guide } from '../models/Guide.js';
import { IssueReport } from '../models/IssueReport.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { notFound } from '../utils/ApiError.js';
import { created } from '../utils/respond.js';

// POST /api/v1/guides/:slug/report-issue — public (optional auth).
export async function reportIssue(req, res) {
  const slug = String(req.params.slug).toLowerCase();
  const guide = await Guide.findOne({ slug, publicationStatus: 'published' });
  if (!guide) throw notFound('Guide not found');
  const report = await IssueReport.create({
    guideSlug: slug,
    userId: req.user ? req.user._id : null,
    issueType: req.body.issueType,
    description: req.body.description,
    relevantSection: req.body.relevantSection || '',
  });
  // Never expose internal admin fields to the reporter (select:false does not
  // apply to freshly created documents, so strip explicitly).
  const publicReport = report.toObject();
  delete publicReport.adminNotes;
  return created(res, { report: publicReport }, 'Thank you. Your report has been received and will be reviewed.');
}

// POST /api/v1/contact — public.
export async function contact(req, res) {
  const message = await ContactMessage.create(req.body);
  return created(res, { message: { id: message._id, status: message.status } }, 'Your message has been received.');
}
