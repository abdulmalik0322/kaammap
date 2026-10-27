// KAAMMAP development seed.
//
// - Upserts the 8 categories and 8 guides from the EXISTING frontend data file
//   (src/data/guides.js) — the same researched content the frontend ships with.
//   No fees or requirements are invented here; the data comes from that file.
// - Idempotent: safe to re-run, it updates in place by slug and never duplicates.
// - Optionally creates/updates ONE admin from SEED_ADMIN_EMAIL + SEED_ADMIN_PASSWORD.
// - Refuses to run against NODE_ENV=production unless SEED_CONFIRM=yes.
//
// Usage:  cd server && cp .env.example .env (fill values) && npm run seed
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import { Category } from '../models/Category.js';
import { Guide } from '../models/Guide.js';
import { User } from '../models/User.js';
import { guides, guideCategories } from '../../../src/data/guides.js';

if (env.NODE_ENV === 'production' && env.SEED_CONFIRM !== 'yes') {
  console.error(
    '[seed] Refusing to run with NODE_ENV=production. Set SEED_CONFIRM=yes if you really intend to seed this database.'
  );
  process.exit(1);
}

await connectDB(env.MONGODB_URI);

let catCount = 0;
for (const [index, c] of guideCategories.entries()) {
  await Category.findOneAndUpdate(
    { slug: c.slug },
    {
      $set: {
        name: c.name,
        slug: c.slug,
        description: c.desc || '',
        ur: c.ur || null,
        displayOrder: index,
        isActive: true,
      },
    },
    { upsert: true, new: true, runValidators: true }
  );
  catCount += 1;
}
console.log(`[seed] Categories upserted: ${catCount}`);

let guideCount = 0;
for (const g of guides) {
  await Guide.findOneAndUpdate(
    { slug: g.slug },
    {
      $set: {
        slug: g.slug,
        title: g.title,
        short: g.short || '',
        categorySlug: g.category,
        scope: g.scope || '',
        applies: g.scope || '',
        authority: g.authority || '',
        whoFor: g.whoFor || '',
        level: g.level || 'preparation',
        verifiedDate: g.verifiedDate || '',
        verifyNote: g.verifyNote || '',
        keywords: g.keywords || [],
        documents: g.documents || [],
        fees: g.fees || [],
        feesUnavailable: g.feesUnavailable || '',
        ur: g.ur || null,
        steps: g.steps || [],
        applyAt: g.applyAt || [],
        notes: g.notes || [],
        faqs: g.faqs || [],
        sources: g.sources || [],
        related: g.related || [],
        publicationStatus: 'published',
        reviewStatus: 'reviewed',
        publishedAt: new Date(),
        lastReviewedAt: new Date(),
      },
    },
    { upsert: true, new: true, runValidators: true }
  );
  guideCount += 1;
}
console.log(`[seed] Guides upserted (published): ${guideCount}`);

if (env.SEED_ADMIN_EMAIL && env.SEED_ADMIN_PASSWORD) {
  const normalizedEmail = env.SEED_ADMIN_EMAIL.trim().toLowerCase();
  const passwordHash = await bcrypt.hash(env.SEED_ADMIN_PASSWORD, 10);
  await User.findOneAndUpdate(
    { normalizedEmail },
    {
      $set: {
        name: 'KAAMMAP Admin',
        email: normalizedEmail,
        normalizedEmail,
        passwordHash,
        role: 'admin',
        accountStatus: 'active',
        emailVerifiedAt: new Date(),
      },
    },
    { upsert: true, new: true, runValidators: true }
  );
  console.log(`[seed] Admin user seeded for ${normalizedEmail} (password taken from SEED_ADMIN_PASSWORD, not printed).`);
} else {
  console.log('[seed] SEED_ADMIN_EMAIL/SEED_ADMIN_PASSWORD not set — no admin user created.');
}

await disconnectDB();
console.log('[seed] Done.');
process.exit(0);
