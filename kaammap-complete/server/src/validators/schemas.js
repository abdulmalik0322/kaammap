import { z } from 'zod';
import { ISSUE_TYPES, REPORT_STATUSES } from '../models/IssueReport.js';
import { SOURCE_TYPES } from '../models/Source.js';

const email = z.string().trim().toLowerCase().email('A valid email address is required').max(200);
const password = z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password must be at most 72 characters');
const slug = z
  .string()
  .trim()
  .toLowerCase()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must contain only lowercase letters, numbers and hyphens')
  .max(120);
const httpUrl = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === '' || /^https?:\/\//i.test(v), 'URL must start with http:// or https://');

// ---------- Auth ----------
export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
    email,
    password,
    preferredLanguage: z.string().max(10).optional(),
    // NOTE: `role` is intentionally NOT accepted — .strict() rejects it.
  })
  .strict();

export const loginSchema = z
  .object({
    email,
    password: z.string().min(1, 'Password is required').max(72),
  })
  .strict();

export const forgotPasswordSchema = z.object({ email }).strict();
export const resendVerificationSchema = z.object({ email }).strict();

export const resetPasswordSchema = z
  .object({
    email,
    code: z
      .string()
      .trim()
      .regex(/^\d{6}$/, 'Enter the 6-digit reset code'),
    password,
  })
  .strict();

export const verifyEmailSchema = z
  .object({
    token: z.string().min(20, 'A valid verification token is required').max(200),
  })
  .strict();

// ---------- User profile ----------
export const updateMeSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    preferredLanguage: z.string().max(10).optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1).max(72),
    newPassword: password,
  })
  .strict();

export const deleteMeSchema = z.object({ confirm: z.literal(true) }).strict();

export const progressSchema = z
  .object({
    completedItems: z.array(z.string().max(20)).max(500),
  })
  .strict();

// ---------- Reports & contact ----------
export const reportIssueSchema = z
  .object({
    issueType: z.enum(ISSUE_TYPES).optional().default('other'),
    description: z.string().trim().min(5, 'Please describe the issue').max(2000),
    relevantSection: z.string().trim().max(200).optional().default(''),
  })
  .strict();

export const contactSchema = z
  .object({
    name: z.string().trim().min(2).max(80),
    email,
    subject: z.string().trim().min(3).max(150),
    message: z.string().trim().min(10).max(5000),
  })
  .strict();

// ---------- Admin: categories ----------
export const categoryCreateSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    slug,
    description: z.string().max(500).optional().default(''),
    icon: z.string().max(100).optional().default(''),
    image: httpUrl.optional().default(''),
    displayOrder: z.number().int().min(0).max(10000).optional().default(0),
    isActive: z.boolean().optional().default(true),
  })
  .strict();

export const categoryPatchSchema = categoryCreateSchema.partial().omit({ slug: true }).extend({ slug: slug.optional() }).strict();

// ---------- Admin: guides ----------
const documentItem = z
  .object({
    name: z.string().trim().min(1).max(300),
    desc: z.string().max(2000).optional().default(''),
    status: z.enum(['required', 'conditional']).optional().default('required'),
    note: z.string().max(1000).optional().default(''),
  })
  .passthrough();

const feeItem = z
  .object({
    name: z.string().trim().min(1).max(300),
    amount: z.number().nonnegative().nullable().optional().default(null),
    applies: z.string().max(500).optional().default(''),
    source: z.string().max(500).optional().default(''),
    checked: z.string().max(50).optional().default(''),
  })
  .passthrough();

const stepLink = z
  .object({
    label: z.string().trim().min(1).max(300),
    url: httpUrl.optional().default(''),
  })
  .passthrough();

const stepItem = z
  .object({
    title: z.string().trim().min(1).max(300),
    desc: z.string().max(3000).optional().default(''),
    link: stepLink.nullable().optional().default(null),
  })
  .passthrough();

const faqItem = z
  .object({
    q: z.string().trim().min(1).max(500),
    a: z.string().trim().min(1).max(3000),
  })
  .passthrough();

const sourceRefItem = z
  .object({
    name: z.string().trim().min(1).max(300),
    url: httpUrl.optional().default(''),
    desc: z.string().max(1000).optional().default(''),
  })
  .passthrough();

const applyAtItem = z
  .object({
    label: z.string().trim().min(1).max(300),
    url: httpUrl.optional().default(''),
    desc: z.string().max(1000).optional().default(''),
  })
  .passthrough();

const guideFields = {
  slug,
  title: z.string().trim().min(3).max(200),
  short: z.string().max(600).optional().default(''),
  categorySlug: slug,
  scope: z.string().max(200).optional().default(''),
  applies: z.string().max(500).optional().default(''),
  authority: z.string().max(300).optional().default(''),
  whoFor: z.string().max(2000).optional().default(''),
  level: z.enum(['checked', 'partial', 'preparation']).optional().default('preparation'),
  verifiedDate: z.string().max(50).optional().default(''),
  verifyNote: z.string().max(2000).optional().default(''),
  keywords: z.array(z.string().max(100)).max(100).optional().default([]),
  documents: z.array(documentItem).max(200).optional().default([]),
  fees: z.array(feeItem).max(200).optional().default([]),
  feesUnavailable: z.string().max(1000).optional().default(''),
  ur: z.any().nullable().optional(),
  steps: z.array(stepItem).max(200).optional().default([]),
  applyAt: z.array(applyAtItem).max(50).optional().default([]),
  notes: z.array(z.string().max(2000)).max(100).optional().default([]),
  faqs: z.array(faqItem).max(100).optional().default([]),
  sources: z.array(sourceRefItem).max(100).optional().default([]),
  related: z.array(slug).max(50).optional().default([]),
  heroImage: httpUrl.optional().default(''),
};

export const guideCreateSchema = z.object(guideFields).strict();
// PATCH: everything optional (slug handled by the immutability rule in the controller).
export const guidePatchSchema = z.object(guideFields).partial().strict();

// ---------- Admin: sources ----------
export const sourceCreateSchema = z
  .object({
    title: z.string().trim().min(3).max(200),
    officialUrl: z
      .string()
      .trim()
      .max(1000)
      .refine((v) => /^https?:\/\//i.test(v), 'officialUrl must be an http(s) URL'),
    organization: z.string().max(200).optional().default(''),
    sourceType: z.enum(SOURCE_TYPES).optional().default('government-website'),
    guideSlugs: z.array(slug).max(100).optional().default([]),
    checkedAt: z.coerce.date().nullable().optional(),
    lastModifiedAt: z.coerce.date().nullable().optional(),
    notes: z.string().max(2000).optional().default(''),
  })
  .strict();

export const sourcePatchSchema = sourceCreateSchema.partial().strict();

// ---------- Admin: moderation ----------
export const reportPatchSchema = z
  .object({
    status: z.enum(REPORT_STATUSES).optional(),
    adminNotes: z.string().max(2000).optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });

export const contactPatchSchema = z
  .object({
    status: z.enum(['new', 'read', 'replied', 'archived']),
  })
  .strict();

export const adminUserPatchSchema = z
  .object({
    role: z.enum(['user', 'admin']).optional(),
    accountStatus: z.enum(['active', 'suspended']).optional(),
  })
  .strict()
  .refine((v) => Object.keys(v).length > 0, { message: 'Nothing to update' });
