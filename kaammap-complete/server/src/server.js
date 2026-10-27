import { env } from './config/env.js'; // validates env first — fails fast with a clear message
import { connectDB, disconnectDB } from './config/db.js';
import { mailConfigured } from './utils/mailer.js';
import createApp from './app.js';

const app = createApp();

let server;
try {
  await connectDB(env.MONGODB_URI);
  server = app.listen(env.PORT, () => {
    console.log(`[KAAMMAP] API listening on port ${env.PORT} (${env.NODE_ENV})`);
    console.log(
      mailConfigured()
        ? '[KAAMMAP] Email mode: SMTP configured — real emails will be sent.'
        : '[KAAMMAP] Email mode: DEV — SMTP not configured, emails are only logged to this console (nothing is actually sent).'
    );
  });
} catch (err) {
  console.error('[KAAMMAP] Startup failed. Check MONGODB_URI and that MongoDB is reachable.');
  process.exit(1);
}

// Graceful shutdown: stop accepting requests, then close the DB connection.
async function shutdown(signal) {
  console.log(`[KAAMMAP] ${signal} received — shutting down gracefully`);
  if (server) {
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  } else {
    await disconnectDB();
    process.exit(0);
  }
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (err) => {
  console.error(`[KAAMMAP] Unhandled rejection: ${err && err.message}`);
});
