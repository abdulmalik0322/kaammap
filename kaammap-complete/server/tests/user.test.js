import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { getApp, createUser, loginAs, seedCategory, seedPublishedGuide } from './helpers.js';

let app;
beforeAll(async () => {
  app = await getApp();
});

async function twoUsers() {
  await seedCategory();
  const guide = await seedPublishedGuide();
  await createUser({ email: 'one@example.com' });
  await createUser({ email: 'two@example.com', name: 'User Two' });
  const one = await loginAs(request, app, 'one@example.com');
  const two = await loginAs(request, app, 'two@example.com');
  return { guide, one, two };
}

describe('saved guides', () => {
  it('saves, prevents duplicates, lists and removes', async () => {
    const { guide, one } = await twoUsers();
    const save = await request(app)
      .post(`/api/v1/users/me/saved-guides/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`);
    expect(save.status).toBe(201);

    const again = await request(app)
      .post(`/api/v1/users/me/saved-guides/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`);
    expect(again.status).toBe(200); // idempotent — no duplicate record

    const list = await request(app)
      .get('/api/v1/users/me/saved-guides')
      .set('Authorization', `Bearer ${one.token}`);
    expect(list.body.data.items).toHaveLength(1);
    expect(list.body.data.items[0].guide.slug).toBe(guide.slug);

    const remove = await request(app)
      .delete(`/api/v1/users/me/saved-guides/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`);
    expect(remove.status).toBe(200);
    const after = await request(app)
      .get('/api/v1/users/me/saved-guides')
      .set('Authorization', `Bearer ${one.token}`);
    expect(after.body.data.items).toHaveLength(0);
  });

  it("isolates one user's saved guides from another", async () => {
    const { guide, one, two } = await twoUsers();
    await request(app)
      .post(`/api/v1/users/me/saved-guides/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`);
    const listTwo = await request(app)
      .get('/api/v1/users/me/saved-guides')
      .set('Authorization', `Bearer ${two.token}`);
    expect(listTwo.body.data.items).toHaveLength(0);
  });

  it('requires auth', async () => {
    const res = await request(app).get('/api/v1/users/me/saved-guides');
    expect(res.status).toBe(401);
  });
});

describe('checklist progress', () => {
  it('saves valid progress and reads it back', async () => {
    const { guide, one } = await twoUsers();
    const put = await request(app)
      .put(`/api/v1/users/me/progress/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`)
      .send({ completedItems: ['d0', 's0'] });
    expect(put.status).toBe(200);
    expect(put.body.data.completedItems).toEqual(['d0', 's0']);

    const get = await request(app)
      .get(`/api/v1/users/me/progress/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`);
    expect(get.body.data.completedItems).toEqual(['d0', 's0']);
  });

  it('rejects bogus item ids with 400', async () => {
    const { guide, one } = await twoUsers();
    const bogus = await request(app)
      .put(`/api/v1/users/me/progress/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`)
      .send({ completedItems: ['x99'] });
    expect(bogus.status).toBe(400);
    const outOfRange = await request(app)
      .put(`/api/v1/users/me/progress/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`)
      .send({ completedItems: ['d42'] });
    expect(outOfRange.status).toBe(400);
    expect(outOfRange.body.error.code).toBe('ITEM_OUT_OF_RANGE');
  });

  it("isolates progress between users and supports reset", async () => {
    const { guide, one, two } = await twoUsers();
    await request(app)
      .put(`/api/v1/users/me/progress/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`)
      .send({ completedItems: ['d0'] });
    const other = await request(app)
      .get(`/api/v1/users/me/progress/${guide.slug}`)
      .set('Authorization', `Bearer ${two.token}`);
    expect(other.body.data.completedItems).toEqual([]);

    const reset = await request(app)
      .delete(`/api/v1/users/me/progress/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`);
    expect(reset.status).toBe(200);
    const after = await request(app)
      .get(`/api/v1/users/me/progress/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`);
    expect(after.body.data.completedItems).toEqual([]);
  });
});

describe('profile', () => {
  it('updates allowlisted fields only', async () => {
    const { one } = await twoUsers();
    const res = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${one.token}`)
      .send({ name: 'New Name', preferredLanguage: 'ur' });
    expect(res.status).toBe(200);
    expect(res.body.data.user.name).toBe('New Name');
    expect(res.body.data.user.preferredLanguage).toBe('ur');
  });

  it('role self-promotion via PATCH /users/me is rejected and role stays user', async () => {
    const { one } = await twoUsers();
    const res = await request(app)
      .patch('/api/v1/users/me')
      .set('Authorization', `Bearer ${one.token}`)
      .send({ role: 'admin' });
    expect(res.status).toBe(400); // strict allowlist schema rejects `role`
    const me = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${one.token}`);
    expect(me.body.data.user.role).toBe('user');
  });

  it('changes password with the correct current password only', async () => {
    await createUser({ email: 'pw@example.com' });
    const { token } = await loginAs(request, app, 'pw@example.com');
    const wrong = await request(app)
      .patch('/api/v1/users/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'nope-nope', newPassword: 'BrandNew123' });
    expect(wrong.status).toBe(401);
    const right = await request(app)
      .patch('/api/v1/users/me/password')
      .set('Authorization', `Bearer ${token}`)
      .send({ currentPassword: 'TestPass123', newPassword: 'BrandNew123' });
    expect(right.status).toBe(200);
    const relogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'pw@example.com', password: 'BrandNew123' });
    expect(relogin.status).toBe(200);
  });

  it('deletes the account only with {confirm:true} and removes private data', async () => {
    const { guide, one } = await twoUsers();
    await request(app)
      .post(`/api/v1/users/me/saved-guides/${guide.slug}`)
      .set('Authorization', `Bearer ${one.token}`);
    const noConfirm = await request(app)
      .delete('/api/v1/users/me')
      .set('Authorization', `Bearer ${one.token}`)
      .send({});
    expect(noConfirm.status).toBe(400);
    const del = await request(app)
      .delete('/api/v1/users/me')
      .set('Authorization', `Bearer ${one.token}`)
      .send({ confirm: true });
    expect(del.status).toBe(200);
    const me = await request(app)
      .get('/api/v1/users/me')
      .set('Authorization', `Bearer ${one.token}`);
    expect(me.status).toBe(401);
  });
});

describe('issue reports + contact', () => {
  it('submits a report; admin can review it; non-admin cannot', async () => {
    const { guide, one } = await twoUsers();
    await createUser({ email: 'boss@example.com', role: 'admin' });
    const admin = await loginAs(request, app, 'boss@example.com');

    const submit = await request(app)
      .post(`/api/v1/guides/${guide.slug}/report-issue`)
      .set('Authorization', `Bearer ${one.token}`)
      .send({ issueType: 'outdated-fee', description: 'The fee listed here changed last month.', relevantSection: 'Fees' });
    expect(submit.status).toBe(201);
    const reportId = submit.body.data.report._id;
    // adminNotes must never leak to ordinary users
    expect(JSON.stringify(submit.body)).not.toContain('adminNotes');

    const forbiddenPatch = await request(app)
      .patch(`/api/v1/admin/reports/${reportId}`)
      .set('Authorization', `Bearer ${one.token}`)
      .send({ status: 'resolved' });
    expect(forbiddenPatch.status).toBe(403);

    const patch = await request(app)
      .patch(`/api/v1/admin/reports/${reportId}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ status: 'resolved', adminNotes: 'Fee updated on the guide.' });
    expect(patch.status).toBe(200);
    expect(patch.body.data.report.status).toBe('resolved');

    const mine = await request(app)
      .get('/api/v1/users/me/reports')
      .set('Authorization', `Bearer ${one.token}`);
    expect(mine.body.data.items).toHaveLength(1);
    expect(JSON.stringify(mine.body)).not.toContain('adminNotes');
  });

  it('rejects an invalid report and reports for unknown guides', async () => {
    const { guide } = await twoUsers();
    const invalid = await request(app)
      .post(`/api/v1/guides/${guide.slug}/report-issue`)
      .send({ description: 'no' });
    expect(invalid.status).toBe(400);
    const unknown = await request(app)
      .post('/api/v1/guides/no-such-guide/report-issue')
      .send({ issueType: 'other', description: 'This guide does not exist at all.' });
    expect(unknown.status).toBe(404);
  });

  it('validates the contact form and stores the message', async () => {
    const bad = await request(app)
      .post('/api/v1/contact')
      .send({ name: 'A', email: 'bad', subject: 'Hi', message: 'short' });
    expect(bad.status).toBe(400);
    const good = await request(app)
      .post('/api/v1/contact')
      .send({ name: 'Site Visitor', email: 'visitor@example.com', subject: 'Guide suggestion', message: 'Please add a guide for domicile certificates.' });
    expect(good.status).toBe(201);
  });
});

describe('admin user management', () => {
  it('admin can change a role; the promoted user gains admin access; self-demotion blocked', async () => {
    await createUser({ email: 'boss@example.com', role: 'admin' });
    const target = await createUser({ email: 'promote@example.com' });
    const admin = await loginAs(request, app, 'boss@example.com');

    const patch = await request(app)
      .patch(`/api/v1/admin/users/${target._id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ role: 'admin' });
    expect(patch.status).toBe(200);
    expect(patch.body.data.user.role).toBe('admin');
    expect(JSON.stringify(patch.body)).not.toContain('passwordHash');

    const selfDemote = await request(app)
      .patch(`/api/v1/admin/users/${admin.user.id || admin.user._id}`)
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ role: 'user' });
    expect(selfDemote.status).toBe(400);
    expect(selfDemote.body.error.code).toBe('SELF_ROLE_CHANGE');
  });

  it('admin categories: create, delete blocked while guides use it', async () => {
    await createUser({ email: 'boss@example.com', role: 'admin' });
    const admin = await loginAs(request, app, 'boss@example.com');
    const cat = await request(app)
      .post('/api/v1/admin/categories')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ name: 'Travel & Passport', slug: 'travel-passport', description: 'x' });
    expect(cat.status).toBe(201);
    await seedPublishedGuide();
    const del = await request(app)
      .delete(`/api/v1/admin/categories/${cat.body.data.category._id}`)
      .set('Authorization', `Bearer ${admin.token}`);
    expect(del.status).toBe(409);
    expect(del.body.error.code).toBe('CATEGORY_IN_USE');
  });

  it('admin sources CRUD with URL scheme validation', async () => {
    await createUser({ email: 'boss@example.com', role: 'admin' });
    const admin = await loginAs(request, app, 'boss@example.com');
    const badUrl = await request(app)
      .post('/api/v1/admin/sources')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({ title: 'Bad Source', officialUrl: 'javascript:alert(1)' });
    expect(badUrl.status).toBe(400);
    const good = await request(app)
      .post('/api/v1/admin/sources')
      .set('Authorization', `Bearer ${admin.token}`)
      .send({
        title: 'DGIP Official Website',
        officialUrl: 'https://dgip.gov.pk',
        organization: 'DGIP',
        sourceType: 'government-website',
        guideSlugs: ['new-passport'],
        checkedAt: '2026-10-24',
      });
    expect(good.status).toBe(201);
    const list = await request(app).get('/api/v1/admin/sources').set('Authorization', `Bearer ${admin.token}`);
    expect(list.body.data.totalItems).toBe(1);
  });
});
