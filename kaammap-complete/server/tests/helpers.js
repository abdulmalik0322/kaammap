import bcrypt from 'bcryptjs';
import { User } from '../src/models/User.js';
import { Category } from '../src/models/Category.js';
import { Guide } from '../src/models/Guide.js';

let appPromise = null;
export async function getApp() {
  if (!appPromise) {
    appPromise = import('../src/app.js').then((m) => m.createApp());
  }
  return appPromise;
}

export const TEST_PASSWORD = 'TestPass123';

export async function createUser({ name = 'Test User', email = 'user@example.com', role = 'user' } = {}) {
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 10);
  return User.create({
    name,
    email: email.toLowerCase(),
    normalizedEmail: email.toLowerCase(),
    passwordHash,
    role,
    emailVerifiedAt: new Date(),
  });
}

export async function loginAs(request, app, email) {
  const res = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: TEST_PASSWORD });
  if (res.status !== 200) throw new Error(`loginAs failed for ${email}: ${res.status} ${JSON.stringify(res.body)}`);
  return {
    token: res.body.data.accessToken,
    cookies: res.headers['set-cookie'],
    user: res.body.data.user,
  };
}

export async function seedCategory(slug = 'travel-passport', name = 'Travel & Passport') {
  return Category.create({ name, slug, description: 'Test category', displayOrder: 1, isActive: true });
}

export function guidePayload(overrides = {}) {
  return {
    slug: 'test-passport-guide',
    title: 'Test Passport Guide',
    short: 'A test guide about passports.',
    categorySlug: 'travel-passport',
    scope: 'Pakistan (nationwide)',
    authority: 'DGIP',
    level: 'checked',
    keywords: ['passport', 'test passport'],
    documents: [{ name: 'Original CNIC', desc: 'Your identity card', status: 'required', note: '' }],
    fees: [{ name: 'Test fee', amount: 1000, applies: 'Test', source: 'Test source', checked: '2026-10-24' }],
    steps: [{ title: 'Visit office', desc: 'Go to the office', link: null }],
    notes: ['A note'],
    faqs: [{ q: 'A question?', a: 'An answer.' }],
    sources: [{ name: 'DGIP', url: 'https://dgip.gov.pk', desc: 'Official' }],
    related: [],
    ...overrides,
  };
}

export async function seedPublishedGuide(overrides = {}) {
  const payload = guidePayload(overrides);
  return Guide.create({ ...payload, publicationStatus: 'published', publishedAt: new Date() });
}
