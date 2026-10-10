import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import { SpeakingAllowanceBalance, SpeakingAllowanceLedger } from '../shared/types';

/**
 * Calculates user's Speaking allowance balance from the immutable ledger.
 * 1 credit = 1 complete live AI Speaking simulation session + 4-criteria assessment.
 */
export function getUserSpeakingAllowanceBalance(userId: string): SpeakingAllowanceBalance {
  const rows = db
    .prepare(
      `SELECT transaction_type, amount 
       FROM speaking_allowance_ledger 
       WHERE user_id = ?`
    )
    .all(userId) as { transaction_type: string; amount: number }[];

  let totalGranted = 0;
  let totalReserved = 0;
  let totalConsumed = 0;
  let totalReleased = 0;

  for (const row of rows) {
    if (row.transaction_type === 'grant') {
      totalGranted += row.amount;
    } else if (row.transaction_type === 'reservation') {
      totalReserved += Math.abs(row.amount);
    } else if (row.transaction_type === 'consumption') {
      totalConsumed += Math.abs(row.amount);
    } else if (row.transaction_type === 'release') {
      totalReleased += row.amount;
    }
  }

  // Active reservations = totalReserved - (totalConsumed + totalReleased)
  const activeReserved = Math.max(0, totalReserved - (totalConsumed + totalReleased));

  // Current available balance: totalGranted - totalConsumed - activeReserved
  const available = Math.max(0, totalGranted - totalConsumed - activeReserved);

  return {
    userId,
    totalGranted,
    totalConsumed,
    totalReserved: activeReserved,
    available,
  };
}

/**
 * Grants testing allowances to a student (Admin/Authorized teacher operation).
 * Used for pilot testing, class allocations, and trial sessions without inventing commercial pricing.
 */
export function grantSpeakingAllowance(params: {
  adminId: string;
  userId: string;
  amount: number;
  notes?: string;
  idempotencyKey?: string;
}): SpeakingAllowanceLedger {
  const { adminId, userId, amount, notes, idempotencyKey } = params;

  if (amount <= 0 || !Number.isInteger(amount)) {
    throw new Error('Speaking allowance grant amount must be a positive integer.');
  }

  const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(userId);
  if (!user) {
    throw new Error('Target user does not exist.');
  }

  if (idempotencyKey) {
    const existing = db
      .prepare('SELECT * FROM speaking_allowance_ledger WHERE idempotency_key = ?')
      .get(idempotencyKey) as any;
    if (existing) {
      return {
        id: existing.id,
        userId: existing.user_id,
        amount: existing.amount,
        balanceAfter: existing.balance_after,
        transactionType: existing.transaction_type,
        sessionId: existing.session_id || undefined,
        assessmentId: existing.assessment_id || undefined,
        idempotencyKey: existing.idempotency_key || undefined,
        notes: existing.notes || undefined,
        createdById: existing.created_by_id || undefined,
        createdAt: existing.created_at,
      };
    }
  }

  const txn = db.transaction(() => {
    const currentBalance = getUserSpeakingAllowanceBalance(userId);
    const newAvailable = currentBalance.available + amount;
    const ledgerId = uuidv4();

    db.prepare(
      `INSERT INTO speaking_allowance_ledger (
        id, user_id, amount, balance_after, transaction_type, notes, created_by_id, idempotency_key
      ) VALUES (?, ?, ?, ?, 'grant', ?, ?, ?)`
    ).run(ledgerId, userId, amount, newAvailable, notes || 'Pilot speaking grant', adminId, idempotencyKey || null);

    return db
      .prepare('SELECT * FROM speaking_allowance_ledger WHERE id = ?')
      .get(ledgerId) as any;
  });

  return txn();
}

/**
 * Atomically reserves 1 allowance for an AI Speaking simulation session.
 * Throws an error if insufficient allowance.
 * Uses idempotencyKey to prevent duplicate reservations.
 */
export function reserveSpeakingAllowance(params: {
  userId: string;
  sessionId: string;
  idempotencyKey?: string;
  notes?: string;
}): SpeakingAllowanceLedger {
  const { userId, sessionId, idempotencyKey, notes } = params;

  const txn = db.transaction(() => {
    if (idempotencyKey) {
      const existing = db
        .prepare('SELECT * FROM speaking_allowance_ledger WHERE idempotency_key = ?')
        .get(idempotencyKey) as any;
      if (existing) {
        return existing;
      }
    }

    const currentBalance = getUserSpeakingAllowanceBalance(userId);
    if (currentBalance.available < 1) {
      throw new Error(
        `Insufficient AI Speaking allowances (available: ${currentBalance.available}, required: 1). Please contact your instructor for pilot allocation.`
      );
    }

    const newAvailable = currentBalance.available - 1;
    const ledgerId = uuidv4();

    db.prepare(
      `INSERT INTO speaking_allowance_ledger (
        id, user_id, amount, balance_after, transaction_type, session_id, idempotency_key, notes
      ) VALUES (?, ?, -1, ?, 'reservation', ?, ?, ?)`
    ).run(ledgerId, userId, newAvailable, sessionId, idempotencyKey || null, notes || 'Speaking session reservation');

    return db
      .prepare('SELECT * FROM speaking_allowance_ledger WHERE id = ?')
      .get(ledgerId) as any;
  });

  return txn();
}

/**
 * Permanently consumes a reserved allowance upon successful completion of the speaking session and assessment.
 */
export function consumeSpeakingAllowance(params: {
  userId: string;
  sessionId: string;
  assessmentId?: string;
  notes?: string;
}): SpeakingAllowanceLedger {
  const { userId, sessionId, assessmentId, notes } = params;

  const txn = db.transaction(() => {
    const idempotencyKey = `consume-speaking-${sessionId}`;
    const existing = db
      .prepare('SELECT * FROM speaking_allowance_ledger WHERE idempotency_key = ?')
      .get(idempotencyKey) as any;
    if (existing) {
      return existing;
    }

    const currentBalance = getUserSpeakingAllowanceBalance(userId);
    const ledgerId = uuidv4();

    db.prepare(
      `INSERT INTO speaking_allowance_ledger (
        id, user_id, amount, balance_after, transaction_type, session_id, assessment_id, idempotency_key, notes
      ) VALUES (?, ?, -1, ?, 'consumption', ?, ?, ?, ?)`
    ).run(
      ledgerId,
      userId,
      currentBalance.available, // Available stays same because reservation was already held
      sessionId,
      assessmentId || null,
      idempotencyKey,
      notes || 'Completed AI Speaking assessment consumption'
    );

    return db
      .prepare('SELECT * FROM speaking_allowance_ledger WHERE id = ?')
      .get(ledgerId) as any;
  });

  return txn();
}

/**
 * Releases a reserved allowance back to the student if a session is cancelled or fails before assessment.
 */
export function releaseSpeakingAllowance(params: {
  userId: string;
  sessionId: string;
  reason?: string;
}): SpeakingAllowanceLedger {
  const { userId, sessionId, reason } = params;

  const txn = db.transaction(() => {
    const idempotencyKey = `release-speaking-${sessionId}`;
    const existing = db
      .prepare('SELECT * FROM speaking_allowance_ledger WHERE idempotency_key = ?')
      .get(idempotencyKey) as any;
    if (existing) {
      return existing;
    }

    const currentBalance = getUserSpeakingAllowanceBalance(userId);
    const newAvailable = currentBalance.available + 1;
    const ledgerId = uuidv4();

    db.prepare(
      `INSERT INTO speaking_allowance_ledger (
        id, user_id, amount, balance_after, transaction_type, session_id, idempotency_key, notes
      ) VALUES (?, ?, 1, ?, 'release', ?, ?, ?)`
    ).run(ledgerId, userId, newAvailable, sessionId, idempotencyKey, reason || 'Released unused speaking reservation');

    return db
      .prepare('SELECT * FROM speaking_allowance_ledger WHERE id = ?')
      .get(ledgerId) as any;
  });

  return txn();
}
