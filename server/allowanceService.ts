import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import { WritingAllowanceBalance, WritingAllowanceLedger } from '../shared/types';

/**
 * Calculates user's allowance balance from the immutable ledger.
 */
export function getUserAllowanceBalance(userId: string): WritingAllowanceBalance {
  const rows = db
    .prepare(
      `SELECT transaction_type, amount 
       FROM writing_allowance_ledger 
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
      totalConsumed += 1;
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
 * Does not invent commercial pricing - used for pilot testing, class allocations, and trials.
 */
export function grantTestingAllowance(params: {
  adminId: string;
  userId: string;
  amount: number;
  notes?: string;
}): WritingAllowanceLedger {
  const { adminId, userId, amount, notes } = params;

  if (amount <= 0 || !Number.isInteger(amount)) {
    throw new Error('Allowance grant amount must be a positive integer.');
  }

  const user = db.prepare('SELECT id, role FROM users WHERE id = ?').get(userId);
  if (!user) {
    throw new Error('Target user does not exist.');
  }

  const txn = db.transaction(() => {
    const currentBalance = getUserAllowanceBalance(userId);
    const newAvailable = currentBalance.available + amount;
    const ledgerId = uuidv4();

    db.prepare(
      `INSERT INTO writing_allowance_ledger (
        id, user_id, amount, balance_after, transaction_type, notes, created_by_id
      ) VALUES (?, ?, ?, ?, 'grant', ?, ?)`
    ).run(ledgerId, userId, amount, newAvailable, notes || 'Pilot testing grant', adminId);

    return db
      .prepare('SELECT * FROM writing_allowance_ledger WHERE id = ?')
      .get(ledgerId) as any;
  });

  return txn();
}

/**
 * Atomically reserves an allowance for an AI assessment.
 * Throws an error if insufficient allowance.
 * Uses idempotencyKey to prevent duplicate reservations.
 */
export function reserveAllowance(params: {
  userId: string;
  assessmentId: string;
  responseId: string;
  idempotencyKey?: string;
  notes?: string;
}): WritingAllowanceLedger {
  const { userId, assessmentId, responseId, idempotencyKey, notes } = params;

  // Check idempotency first
  if (idempotencyKey) {
    const existing = db
      .prepare('SELECT * FROM writing_allowance_ledger WHERE idempotency_key = ?')
      .get(idempotencyKey) as any;
    if (existing) {
      return mapLedgerRow(existing);
    }
  }

  const txn = db.transaction(() => {
    const currentBalance = getUserAllowanceBalance(userId);
    if (currentBalance.available < 1) {
      throw new Error(
        'Insufficient writing assessment allowance. Available balance: ' + currentBalance.available
      );
    }

    const ledgerId = uuidv4();
    const newAvailable = currentBalance.available - 1;

    db.prepare(
      `INSERT INTO writing_allowance_ledger (
        id, user_id, amount, balance_after, transaction_type, assessment_id, response_id, idempotency_key, notes
      ) VALUES (?, ?, -1, ?, 'reservation', ?, ?, ?, ?)`
    ).run(
      ledgerId,
      userId,
      newAvailable,
      assessmentId,
      responseId,
      idempotencyKey || null,
      notes || 'AI assessment reserved'
    );

    return db
      .prepare('SELECT * FROM writing_allowance_ledger WHERE id = ?')
      .get(ledgerId) as any;
  });

  return mapLedgerRow(txn());
}

/**
 * Consumes a reserved allowance upon successful assessment completion.
 */
export function consumeAllowance(params: {
  userId: string;
  assessmentId: string;
  responseId: string;
  notes?: string;
}): void {
  const { userId, assessmentId, responseId, notes } = params;

  // Verify reservation exists
  const reservation = db
    .prepare(
      `SELECT id FROM writing_allowance_ledger 
       WHERE user_id = ? AND assessment_id = ? AND transaction_type = 'reservation'`
    )
    .get(userId, assessmentId);

  if (!reservation) {
    return; // Already processed or no reservation
  }

  // Check if already consumed
  const existingConsumption = db
    .prepare(
      `SELECT id FROM writing_allowance_ledger 
       WHERE user_id = ? AND assessment_id = ? AND transaction_type = 'consumption'`
    )
    .get(userId, assessmentId);

  if (existingConsumption) {
    return;
  }

  const currentBalance = getUserAllowanceBalance(userId);
  const ledgerId = uuidv4();

  db.prepare(
    `INSERT INTO writing_allowance_ledger (
      id, user_id, amount, balance_after, transaction_type, assessment_id, response_id, notes
    ) VALUES (?, ?, 0, ?, 'consumption', ?, ?, ?)`
  ).run(ledgerId, userId, currentBalance.available, assessmentId, responseId, notes || 'AI assessment completed');
}

/**
 * Releases a reserved allowance back to the student if the AI assessment fails or is cancelled.
 */
export function releaseAllowance(params: {
  userId: string;
  assessmentId: string;
  responseId: string;
  reason?: string;
}): void {
  const { userId, assessmentId, responseId, reason } = params;

  // Check if reserved
  const reservation = db
    .prepare(
      `SELECT id FROM writing_allowance_ledger 
       WHERE user_id = ? AND assessment_id = ? AND transaction_type = 'reservation'`
    )
    .get(userId, assessmentId);

  if (!reservation) {
    return;
  }

  // Check if already released or consumed
  const existingRelease = db
    .prepare(
      `SELECT id FROM writing_allowance_ledger 
       WHERE user_id = ? AND assessment_id = ? AND transaction_type IN ('release', 'consumption')`
    )
    .get(userId, assessmentId);

  if (existingRelease) {
    return;
  }

  const currentBalance = getUserAllowanceBalance(userId);
  const ledgerId = uuidv4();
  const restoredAvailable = currentBalance.available + 1;

  db.prepare(
    `INSERT INTO writing_allowance_ledger (
      id, user_id, amount, balance_after, transaction_type, assessment_id, response_id, notes
    ) VALUES (?, ?, 1, ?, 'release', ?, ?, ?)`
  ).run(
    ledgerId,
    userId,
    restoredAvailable,
    assessmentId,
    responseId,
    reason ? `Released: ${reason}` : 'Assessment failed/released'
  );
}

/**
 * Lists the allowance ledger history for a user.
 */
export function listAllowanceLedger(userId: string): WritingAllowanceLedger[] {
  const rows = db
    .prepare(
      `SELECT * FROM writing_allowance_ledger 
       WHERE user_id = ? 
       ORDER BY created_at DESC`
    )
    .all(userId) as any[];

  return rows.map(mapLedgerRow);
}

function mapLedgerRow(row: any): WritingAllowanceLedger {
  return {
    id: row.id,
    userId: row.user_id,
    amount: row.amount,
    balanceAfter: row.balance_after,
    transactionType: row.transaction_type,
    assessmentId: row.assessment_id || undefined,
    responseId: row.response_id || undefined,
    idempotencyKey: row.idempotency_key || undefined,
    notes: row.notes || undefined,
    createdById: row.created_by_id || undefined,
    createdAt: row.created_at,
  };
}
