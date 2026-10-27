import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { getApp, createUser, loginAs, seedCategory, seedPublishedGuide, guidePayload } from './helpers.js';
import { Guide } from '../src/models/Guide.js';

let app;
beforeAll(async () => {
  app = await getApp();
});

async function adminToken() {
  await createUser({ email: 'admin@example.com', role: 'admin' });
  return loginAs(request, app, 'admin@example.com');
}

describe('public categories', () => {
  it('lists active categories only', async () => {
    await seedCategory();
    const res = await request(app).get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(res.body.data.items).toHaveLength(1);
    expect(res.body.data.items[0].slug).toBe('travel-passport');
  });

  it('404s for an unknown category', async () => {
    const res = await request(app).get('/api/v1/categories/nope');
    expect(res.status).toBe(404);
  });
});

describe('public guides', () => {
  it('fetches a published guide by slug', async () => {
    await seedCategory();
    await seedPublishedGuide();
    const res = await request(app).get('/api/v1/guides/test-passport-guide');
    expect(res.status).toBe(200);
    expect(res.body.data.guide.title).toBe('Test Passport Guide');
    expect(res.body.data.guide.documents).toHaveLength(1);
  });

  it('hides draft guides from the public (404)', async () => {
    await seedCategory();
    await Guide.create({ ...guidePayload({ slug: 'secret-draft' }), publicationStatus: 'draft' });
    const res = await request(app).get('/api/v1/guides/secret-draft');
    expect(res.status).toBe(404);
    const list = await request(app).get('/api/v1/guides');
    expect(list.body.data.items.map((g) => g.slug)).not.toContain('secret-draft');
  });

  it('404s for an unknown guide slug', async () => {
    const res = await request(app).get('/api/v1/guides/there-is-no-such-guide');
    expect(res.status).toBe(404);
  });

  it('search matches title and keywords', async () => {
    await seedCategory();
    await seedPublishedGuide();
    const byTitle = await request(app).get('/api/v1/guides?q=Passport');
    expect(byTitle.body.data.totalItems).toBe(1);
    const byKeyword = await request(app).get('/api/v1/guides?q=test%20passport');
    expect(byKeyword.body.data.totalItems).toBe(1);
    const noMatch = await request(app).get('/api/v1/guides?q=zzzz-nothing');
    expect(noMatch.body.data.totalItems).toBe(0);
  });

  it('filters by category and paginates with metadata', async () => {
    await seedCategory();
    await seedCategory('identity-civil', 'Identity & Civil Documents');
    await seedPublishedGuide();
    await seedPublishedGuide({ slug: 'cnic-guide', title: 'CNIC Guide', categorySlug: 'identity-civil' });
    await seedPublishedGuide({ slug: 'passport-two', title: 'Passport Two' });

    const filtered = await request(app).get('/api/v1/guides?category=identity-civil');
    expect(filtered.body.data.totalItems).toBe(1);
    expect(filtered.body.data.items[0].slug).toBe('cnic-guide');

    const page1 = await request(app).get('/api/v1/guides?limit=2&page=1');
    expect(page1.body.data.items).toHaveLength(2);
    expect(page1.body.data.totalItems).toBe(3);
    expect(page1.body.data.totalPages).toBe(2);
    const page2 = await request(app).get('/api/v1/guides?limit=2&page=2');
    expect(page2.body.data.items).toHaveLength(1);
  });

  it('clamps limit to 50', async () => {
    await seedCategory();
    await seedPublishedGuide();
    const res = await request(app).get('/api/v1/guides?limit=500');
    expect(res.body.data.limit).toBe(50);
  });

  it('featured returns checked guides only, max 6', async () => {
    await seedCategory();
    await seedPublishedGuide();
    await seedPublishedGuide({ slug: 'prep-guide', title: 'Prep Guide', level: 'preparation' });
    const res = await request(app).get('/api/v1/guides/featured');
    expect(res.status).toBe(200);
    expect(res.body.data.items.map((g) => g.slug)).toEqual(['test-passport-guide']);
  });

  it('related returns published related guides', async () => {
    await seedCategory();
    await seedPublishedGuide({ related: ['passport-two'] });
    await seedPublishedGuide({ slug: 'passport-two', title: 'Passport Two' });
    const res = await request(app).get('/api/v1/guides/test-passport-guide/related');
    expect(res.status).toBe(200);
    expect(res.body.data.items.map((g) => g.slug)).toEqual(['passport-two']);
  });
});

describe('admin guide workflow', () => {
  it('non-admin cannot create a guide (403)', async () => {
    await seedCategory();
    await createUser({ email: 'plain@example.com' });
    const { token } = await loginAs(request, app, 'plain@example.com');
    const res = await request(app)
      .post('/api/v1/admin/guides')
      .set('Authorization', `Bearer ${token}`)
      .send(guidePayload());
    expect(res.status).toBe(403);
  });

  it('unauthenticated admin access is 401', async () => {
    const res = await request(app).get('/api/v1/admin/guides');
    expect(res.status).toBe(401);
  });

  it('admin creates a draft, publishes it, and it becomes public', async () => {
    await seedCategory();
    const { token } = await adminToken();
    const create = await request(app)
      .post('/api/v1/admin/guides')
      .set('Authorization', `Bearer ${token}`)
      .send(guidePayload());
    expect(create.status).toBe(201);
    const id = create.body.data.guide._id;
    expect(create.body.data.guide.publicationStatus).toBe('draft');

    const before = await request(app).get('/api/v1/guides/test-passport-guide');
    expect(before.status).toBe(404);

    const publish = await request(app)
      .post(`/api/v1/admin/guides/${id}/publish`)
      .set('Authorization', `Bearer ${token}`);
    expect(publish.status).toBe(200);
    expect(publish.body.data.guide.publicationStatus).toBe('published');

    const after = await request(app).get('/api/v1/guides/test-passport-guide');
    expect(after.status).toBe(200);
  });

  it('publish is rejected when a "checked" guide has no sources', async () => {
    await seedCategory();
    const { token } = await adminToken();
    const create = await request(app)
      .post('/api/v1/admin/guides')
      .set('Authorization', `Bearer ${token}`)
      .send(guidePayload({ slug: 'no-source-guide', sources: [] }));
    const id = create.body.data.guide._id;
    const publish = await request(app)
      .post(`/api/v1/admin/guides/${id}/publish`)
      .set('Authorization', `Bearer ${token}`);
    expect(publish.status).toBe(400);
    expect(publish.body.error.code).toBe('PUBLISH_VALIDATION');
  });

  it('rejects invalid guide data and unknown category', async () => {
    const { token } = await adminToken();
    const bad = await request(app)
      .post('/api/v1/admin/guides')
      .set('Authorization', `Bearer ${token}`)
      .send({ slug: 'x' });
    expect(bad.status).toBe(400);

    await seedCategory();
    const noCat = await request(app)
      .post('/api/v1/admin/guides')
      .set('Authorization', `Bearer ${token}`)
      .send(guidePayload({ slug: 'orphan-guide', categorySlug: 'missing-category' }));
    expect(noCat.status).toBe(400);
    expect(noCat.body.error.code).toBe('CATEGORY_NOT_FOUND');
  });

  it('invalid ObjectId returns 400, not 500', async () => {
    const { token } = await adminToken();
    const res = await request(app)
      .get('/api/v1/admin/guides/not-a-real-id')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_ID');
  });

  it('published guide slug cannot be changed; draft cannot be hard-deleted after publish', async () => {
    await seedCategory();
    const { token } = await adminToken();
    const create = await request(app)
      .post('/api/v1/admin/guides')
      .set('Authorization', `Bearer ${token}`)
      .send(guidePayload());
    const id = create.body.data.guide._id;
    await request(app).post(`/api/v1/admin/guides/${id}/publish`).set('Authorization', `Bearer ${token}`);

    const rename = await request(app)
      .patch(`/api/v1/admin/guides/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ slug: 'renamed-guide' });
    expect(rename.status).toBe(400);
    expect(rename.body.error.code).toBe('SLUG_IMMUTABLE');

    const del = await request(app)
      .delete(`/api/v1/admin/guides/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(del.status).toBe(409);
  });

  it('admin dashboard returns real counts', async () => {
    await seedCategory();
    await seedPublishedGuide();
    const { token } = await adminToken();
    const res = await request(app).get('/api/v1/admin/dashboard').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.stats.publishedGuides).toBe(1);
    expect(res.body.data.stats.activeCategories).toBe(1);
  });
});
