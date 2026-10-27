// Test setup: environment + in-memory MongoDB.
// Runs before any test file imports the app, so config/env.js validates
// against these test values. Tests NEVER touch a real/production database.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, afterAll, afterEach } from 'vitest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

// Use the mongod binary already downloaded into node_modules/.cache so the
// suite never depends on network access at test time.
if (!process.env.MONGOMS_SYSTEM_BINARY) {
  const cacheDir = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    '..',
    'node_modules',
    '.cache',
    'mongodb-memory-server'
  );
  try {
    const binary = fs.readdirSync(cacheDir).find((f) => f.startsWith('mongod-'));
    if (binary) process.env.MONGOMS_SYSTEM_BINARY = path.join(cacheDir, binary);
  } catch {
    /* fall back to mongodb-memory-server's own download/cache resolution */
  }
}

process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/kaammap-test-placeholder'; // replaced by in-memory URI below
process.env.JWT_ACCESS_SECRET = 'test-access-secret-at-least-32-chars-long';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-at-least-32-chars-long';
process.env.CLIENT_ORIGIN = 'http://localhost:5173';

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  await mongoose.connect(mongo.getUri());
});

afterEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongo) await mongo.stop();
});
