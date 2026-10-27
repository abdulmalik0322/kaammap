import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import { parse as parseYaml } from 'yaml';
import { env, isProd, clientOrigins } from './config/env.js';
import { dbStatus } from './config/db.js';
import { requestId } from './middleware/requestId.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { ok } from './utils/respond.js';
import authRoutes from './routes/auth.routes.js';
import publicRoutes from './routes/public.routes.js';
import userRoutes from './routes/user.routes.js';
import adminRoutes from './routes/admin.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function createApp() {
  const app = express();
  app.set('trust proxy', 1);
  app.disable('x-powered-by');

  app.use(requestId);
  app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(
    cors({
      origin(origin, callback) {
        // Allow non-browser clients (no Origin header) and allowlisted origins only.
        if (!origin || clientOrigins.includes(origin)) return callback(null, true);
        return callback(null, false);
      },
      credentials: true,
    })
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));
  app.use(cookieParser());
  app.use(globalLimiter);

  // Health — basic status only; no secrets or infrastructure details.
  app.get('/api/v1/health', (req, res) => ok(res, { status: 'ok', db: dbStatus() }, 'KAAMMAP API is running'));

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users/me', userRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1', publicRoutes);

  // API documentation (Swagger UI) — development, or when explicitly enabled.
  if (!isProd || env.ENABLE_SWAGGER === 'true') {
    try {
      const spec = parseYaml(fs.readFileSync(path.join(__dirname, 'openapi.yaml'), 'utf8'));
      app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
    } catch (err) {
      console.error(`[KAAMMAP] Could not load OpenAPI spec: ${err.message}`);
    }
  }

  app.use(notFound);
  app.use(errorHandler);
  return app;
}

export default createApp;
