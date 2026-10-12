import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import { WritingAllowanceBalance, WritingAllowanceLedger } from '../shared/types';

/**
 * Calculates user's allowance balance from the immutable ledger.
 */
export async function getUserAllowanceBalance(userId: string): Promise<WritingAllowanceBalance> {
  const rows = (await db
    .prepare(
      `SELECT transaction_type, amount 
       FROM writing_allowance_ledger 
       WHERE user_id = ?`
    )
    .all(userId)) as { transaction_type: string; amount: number }[];

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
 * Does not invent commercial pricing - used for pilot testing, class allocations, and trials.
 */
export async function grantTestingAllowance(params: {
  adminId: string;
  userId: string;
  amount: number;
  notes?: string;
  idempotencyKey?: string;
}): Promise<WritingAllowanceLedger> {
  const { adminId, userId, amount, notes, idempotencyKey } = params;

  if (amount <= 0 || !Number.isInteger(amount)) {
    throw new Error('Allowance grant amount must be a positive integer.');
  }

  const user = (await db.prepare('SELECT id, role FROM users WHERE id = ?').get(userId));
  if (!user) {
    throw new Error('Target user does not exist.');
  }

  if (idempotencyKey) {
    const existing = (await db
      .prepare('SELECT * FROM writing_allowance_ledger WHERE idempotency_key = ?')
      .get(idempotencyKey)) as any;
    if (existing) {
      return {
        id: existing.id,
        userId: existing.user_id,
        amount: existing.amount,
        balanceAfter: existing.balance_after,
        transactionType: existing.transaction_type,
        assessmentId: existing.assessment_id || undefined,
        responseId: existing.response_id || undefined,
        idempotencyKey: existing.idempotency_key || undefined,
        notes: existing.notes || undefined,
        createdById: existing.created_by_id || undefined,
        createdAt: existing.created_at,
      };
    }
  }

  const txn = db.transaction(async () => {
    const currentBalance = (await getUserAllowanceBalance(userId));
    const newAvailable = currentBalance.available + amount;
    const ledgerId = uuidv4();

    (await db.prepare(
      `INSERT INTO writing_allowance_ledger (
        id, user_id, amount, balance_after, transaction_type, notes, created_by_id, idempotency_key
      ) VALUES (?, ?, ?, ?, 'grant', ?, ?, ?)`
    ).run(ledgerId, userId, amount, newAvailable, notes || 'Pilot testing grant', adminId, idempotencyKey || null));

    return (await db
      .prepare('SELECT * FROM writing_allowance_ledger WHERE id = ?')
      .get(ledgerId)) as any;
  });

  return (await txn());
}

/**
 * Atomically reserves an allowance for an AI assessment.
 * Throws an error if insufficient allowance.
 * Uses idempotencyKey to prevent duplicate reservations.
 */
export async function reserveAllowance(params: {
  userId: string;
  assessmentId: string;
  responseId: string;
  idempotencyKey?: string;
  notes?: string;
}): Promise<WritingAllowanceLedger> {
  const { userId, assessmentId, responseId, idempotencyKey, notes } = params;

  // Check idempotency first
  if (idempotencyKey) {
    const existing = (await db
      .prepare('SELECT * FROM writing_allowance_ledger WHERE idempotency_key = ?')
      .get(idempotencyKey)) as any;
    if (existing) {
      return mapLedgerRow(existing);
    }
  }

  const txn = db.transaction(async () => {
    const currentBalance = (await getUserAllowanceBalance(userId));
    if (currentBalance.available < 1) {
      throw new Error(
        'Insufficient writing assessment allowance. Available balance: ' + currentBalance.available
      );
    }

    const ledgerId = uuidv4();
    const newAvailable = currentBalance.available - 1;

    (await db.prepare(
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
    ));

    return (await db
      .prepare('SELECT * FROM writing_allowance_ledger WHERE id = ?')
      .get(ledgerId)) as any;
  });

  return mapLedgerRow((await txn()));
}

/**
 * Consumes a reserved allowance upon successful assessment completion.
 */
export async function consumeAllowance(params: {
  userId: string;
  assessmentId: string;
  responseId: string;
  notes?: string;
}): Promise<void> {
  const { userId, assessmentId, responseId, notes } = params;

  // Verify reservation exists
  const reservation = (await db
    .prepare(
      `SELECT id FROM writing_allowance_ledger 
       WHERE user_id = ? AND assessment_id = ? AND transaction_type = 'reservation'`
    )
    .get(userId, assessmentId));

  if (!reservation) {
    return; // Already processed or no reservation
  }

  // Check if already consumed
  const existingConsumption = (await db
    .prepare(
      `SELECT id FROM writing_allowance_ledger 
       WHERE user_id = ? AND assessment_id = ? AND transaction_type = 'consumption'`
    )
    .get(userId, assessmentId));

  if (existingConsumption) {
    return;
  }

  const currentBalance = (await getUserAllowanceBalance(userId));
  const ledgerId = uuidv4();

  (await db.prepare(
    `INSERT INTO writing_allowance_ledger (
      id, user_id, amount, balance_after, transaction_type, assessment_id, response_id, notes
    ) VALUES (?, ?, 0, ?, 'consumption', ?, ?, ?)`
  ).run(ledgerId, userId, currentBalance.available, assessmentId, responseId, notes || 'AI assessment completed'));
}

/**
 * Releases a reserved allowance back to the student if the AI assessment fails or is cancelled.
 */
export async function releaseAllowance(params: {
  userId: string;
  assessmentId: string;
  responseId: string;
  reason?: string;
}): Promise<void> {
  const { userId, assessmentId, responseId, reason } = params;

  // Check if reserved
  const reservation = (await db
    .prepare(
      `SELECT id FROM writing_allowance_ledger 
       WHERE user_id = ? AND assessment_id = ? AND transaction_type = 'reservation'`
    )
    .get(userId, assessmentId));

  if (!reservation) {
    return;
  }

  // Check if already released or consumed
  const existingRelease = (await db
    .prepare(
      `SELECT id FROM writing_allowance_ledger 
       WHERE user_id = ? AND assessment_id = ? AND transaction_type IN ('release', 'consumption')`
    )
    .get(userId, assessmentId));

  if (existingRelease) {
    return;
  }

  const currentBalance = (await getUserAllowanceBalance(userId));
  const ledgerId = uuidv4();
  const restoredAvailable = currentBalance.available + 1;

  (await db.prepare(
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
  ));
}

/**
 * Lists the allowance ledger history for a user.
 */
export async function listAllowanceLedger(userId: string): Promise<WritingAllowanceLedger[]> {
  const rows = (await db
    .prepare(
      `SELECT * FROM writing_allowance_ledger 
       WHERE user_id = ? 
       ORDER BY created_at DESC`
    )
    .all(userId)) as any[];

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
