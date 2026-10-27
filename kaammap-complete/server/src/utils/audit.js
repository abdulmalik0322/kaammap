import { AuditLog } from '../models/AuditLog.js';

// Record an administrator action. Never pass secrets/tokens/passwords here.
export async function writeAudit(actorId, action, entityType, entityId, summary = '') {
  try {
    await AuditLog.create({
      actorId: actorId || null,
      action,
      entityType,
      entityId: entityId ? String(entityId) : '',
      summary: String(summary || '').slice(0, 500),
    });
  } catch (err) {
    console.error(`[KAAMMAP] Failed to write audit log (${action}): ${err.message}`);
  }
}
