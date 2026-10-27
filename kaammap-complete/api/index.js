import createApp from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';
import { env } from '../server/src/config/env.js';

const app = createApp();
let dbPromise = null;

function ensureDB() {
  if (!dbPromise) {
    dbPromise = connectDB(env.MONGODB_URI).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

export default async function handler(req, res) {
  try {
    await ensureDB();
    return app(req, res);
  } catch {
    return res.status(503).json({
      success: false,
      error: {
        code: 'DATABASE_UNAVAILABLE',
        message: 'KAAMMAP server is temporarily unavailable. Please try again shortly.',
      },
    });
  }
}
