import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Load server/.env into process.env BEFORE validation. This file lives in
// src/config/, so ../../.env is the server root's .env — the location the
// setup docs tell the user to create. Values already present in the real
// environment always win (tests and hosting platforms inject their own).
try {
  const envFile = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '.env');
  if (fs.existsSync(envFile)) {
    for (const line of fs.readFileSync(envFile, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!m) continue;
      const key = m[1];
      let value = m[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = value;
    }
  }
} catch {
  // An unreadable .env must not mask the clear validation errors below.
}

// Central environment validation. The server refuses to start when required
// configuration is missing or malformed, with a clear human-readable message.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  MONGODB_URI: z.string({ required_error: 'MONGODB_URI is required' }).min(1, 'MONGODB_URI is required'),
  JWT_ACCESS_SECRET: z
    .string({ required_error: 'JWT_ACCESS_SECRET is required' })
    .min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z
    .string({ required_error: 'JWT_REFRESH_SECRET is required' })
    .min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  APP_BASE_URL: z.string().url().optional(),
  CLIENT_BASE_URL: z.string().url().default('http://localhost:5173'),
  ENABLE_SWAGGER: z.string().optional(),
  SMTP_HOST: z.string().optional().default(''),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  SMTP_USER: z.string().optional().default(''),
  SMTP_PASS: z.string().optional().default(''),
  EMAIL_FROM: z.string().default('KAAMMAP <no-reply@example.com>'),
  SEED_ADMIN_EMAIL: z.string().email().optional().or(z.literal('')),
  SEED_ADMIN_PASSWORD: z.string().optional().default(''),
  SEED_CONFIRM: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  console.error(
    `\n[KAAMMAP] Invalid or missing environment configuration:\n${issues}\n` +
      `Copy server/.env.example to server/.env and fill in the required values.\n`
  );
  process.exit(1);
}

export const env = parsed.data;
export const isProd = env.NODE_ENV === 'production';
export const clientOrigins = env.CLIENT_ORIGIN.split(',').map((s) => s.trim()).filter(Boolean);
