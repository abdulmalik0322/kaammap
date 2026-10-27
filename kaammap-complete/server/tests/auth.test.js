import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { getApp, createUser, TEST_PASSWORD } from './helpers.js';

let app;
beforeAll(async () => {
  app = await getApp();
});

const registerBody = { name: 'Ayesha Khan', email: 'ayesha@example.com', password: 'Secret123!' };

describe('health', () => {
  it('GET /api/v1/health returns ok + db status', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe('ok');
    expect(res.body.data.db).toBe('connected');
  });
});

describe('registration', () => {
  it('registers successfully and never returns the password hash', async () => {
    const res = await request(app).post('/api/v1/auth/register').send(registerBody);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('ayesha@example.com');
    expect(res.body.data.user.role).toBe('user');
    expect(res.body.data.accessToken).toBeTruthy();
    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
    // Refresh cookie is HttpOnly
    const cookies = res.headers['set-cookie'] || [];
    expect(cookies.some((c) => c.startsWith('km_refresh=') && c.includes('HttpOnly'))).toBe(true);
    // Dev-mode verification token is present outside production
    expect(res.body.data.devToken).toBeTruthy();
  });

  it('rejects duplicate email with 409', async () => {
    await request(app).post('/api/v1/auth/register').send(registerBody);
    const res = await request(app).post('/api/v1/auth/register').send(registerBody);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects invalid registration data with 400', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ name: 'A', email: 'not-an-email', password: 'short' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects role self-assignment at register (mass assignment)', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ ...registerBody, email: 'sneaky@example.com', role: 'admin' });
    expect(res.status).toBe(400); // strict schema rejects unknown field
  });
});

describe('login + me', () => {
  it('logs in with correct credentials', async () => {
    await createUser({ email: 'login@example.com' });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login@example.com', password: TEST_PASSWORD });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeTruthy();
    expect(JSON.stringify(res.body)).not.toContain('passwordHash');
  });

  it('rejects wrong password with generic 401', async () => {
    await createUser({ email: 'login2@example.com' });
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'login2@example.com', password: 'WrongPass999' });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_CREDENTIALS');
  });

  it('GET /auth/me without token is 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /auth/me with token returns the user', async () => {
    await request(app).post('/api/v1/auth/register').send(registerBody);
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: registerBody.email, password: registerBody.password });
    const res = await request(app)
      .get('/api/v1/auth/me')
      .set('Authorization', `Bearer ${login.body.data.accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('ayesha@example.com');
  });
});

describe('refresh rotation + logout revocation', () => {
  it('rotates the refresh token and rejects the old one', async () => {
    await createUser({ email: 'rotate@example.com' });
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'rotate@example.com', password: TEST_PASSWORD });
    const oldCookies = login.headers['set-cookie'];

    const refreshed = await request(app).post('/api/v1/auth/refresh').set('Cookie', oldCookies);
    expect(refreshed.status).toBe(200);
    expect(refreshed.body.data.accessToken).toBeTruthy();
    const newCookies = refreshed.headers['set-cookie'];
    expect(newCookies.join(' ')).not.toBe(oldCookies.join(' '));

    // Old refresh cookie has been revoked by rotation
    const reuse = await request(app).post('/api/v1/auth/refresh').set('Cookie', oldCookies);
    expect(reuse.status).toBe(401);
  });

  it('rejects refresh after logout (session revoked)', async () => {
    await createUser({ email: 'logout@example.com' });
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'logout@example.com', password: TEST_PASSWORD });
    const cookies = login.headers['set-cookie'];
    const out = await request(app).post('/api/v1/auth/logout').set('Cookie', cookies);
    expect(out.status).toBe(200);
    const after = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookies);
    expect(after.status).toBe(401);
  });
});

describe('email verification + password reset (dev tokens)', () => {
  it('verifies the email with the dev token', async () => {
    const reg = await request(app).post('/api/v1/auth/register').send(registerBody);
    const verify = await request(app)
      .post('/api/v1/auth/verify-email')
      .send({ token: reg.body.data.devToken });
    expect(verify.status).toBe(200);
    expect(verify.body.data.user.emailVerifiedAt).toBeTruthy();
  });

  it('forgot -> reset with the 6-digit code works, code is single-use, sessions are revoked', async () => {
    await request(app).post('/api/v1/auth/register').send(registerBody);
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: registerBody.email, password: registerBody.password });
    const cookies = login.headers['set-cookie'];

    const forgot = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: registerBody.email });
    expect(forgot.status).toBe(200);
    const devCode = forgot.body.data.devCode;
    expect(devCode).toMatch(/^\d{6}$/);

    // A wrong code is rejected and does NOT consume the code
    const wrongCode = String((Number(devCode) + 1) % 1000000).padStart(6, '0');
    const wrong = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ email: registerBody.email, code: wrongCode, password: 'NewSecret456' });
    expect(wrong.status).toBe(400);
    expect(wrong.body.error.code).toBe('INVALID_CODE');

    const reset = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ email: registerBody.email, code: devCode, password: 'NewSecret456' });
    expect(reset.status).toBe(200);

    // Code reuse must be rejected
    const reuse = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ email: registerBody.email, code: devCode, password: 'AnotherPass789' });
    expect(reuse.status).toBe(400);

    // Old sessions revoked by the reset
    const refreshAfter = await request(app).post('/api/v1/auth/refresh').set('Cookie', cookies);
    expect(refreshAfter.status).toBe(401);

    // Old password no longer works, new password does
    const oldLogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: registerBody.email, password: registerBody.password });
    expect(oldLogin.status).toBe(401);
    const relogin = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: registerBody.email, password: 'NewSecret456' });
    expect(relogin.status).toBe(200);
  });

  it('locks the reset code after 5 wrong attempts', async () => {
    const body = { name: 'Bilal Ahmed', email: 'bilal@example.com', password: 'Secret123!' };
    await request(app).post('/api/v1/auth/register').send(body);
    const forgot = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: body.email });
    const devCode = forgot.body.data.devCode;
    const wrongCode = String((Number(devCode) + 1) % 1000000).padStart(6, '0');
    let last;
    for (let i = 0; i < 5; i++) {
      last = await request(app)
        .post('/api/v1/auth/reset-password')
        .send({ email: body.email, code: wrongCode, password: 'NewSecret456' });
    }
    expect(last.status).toBe(400);
    expect(last.body.error.code).toBe('CODE_ATTEMPTS_EXCEEDED');
    // Even the correct code is dead now
    const after = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ email: body.email, code: devCode, password: 'NewSecret456' });
    expect(after.status).toBe(400);
  });

  it('rejects an expired reset code', async () => {
    const body = { name: 'Fatima Noor', email: 'fatima@example.com', password: 'Secret123!' };
    await request(app).post('/api/v1/auth/register').send(body);
    const forgot = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: body.email });
    const devCode = forgot.body.data.devCode;
    const { User } = await import('../src/models/User.js');
    await User.updateOne(
      { normalizedEmail: body.email },
      { resetCodeExpires: new Date(Date.now() - 1000) }
    );
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ email: body.email, code: devCode, password: 'NewSecret456' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_CODE');
  });

  it('forgot-password never reveals whether the account exists', async () => {
    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'ghost@example.com' });
    expect(res.status).toBe(200);
    expect(res.body.data.devCode).toBeUndefined();
    expect(res.body.data.devToken).toBeUndefined();
  });

  it('rejects an invalid reset code', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ email: 'ghost@example.com', code: '123456', password: 'NewSecret456' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('INVALID_CODE');
  });
});

describe('error format', () => {
  it('malformed JSON returns 400 MALFORMED_JSON', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .set('Content-Type', 'application/json')
      .send('{"email": broken');
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('MALFORMED_JSON');
  });

  it('unknown route returns 404 in the standard envelope', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });
});
