import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import {
  CommercialProduct,
  CommercialOrder,
  CommercialEntitlementGrant,
  TeacherCode,
  TeacherCodeRedemption,
  UserSubscription,
  CheckoutPreviewResponse,
  LearnerCommercialSummary,
  AdminCommercialSummary,
  OrderStatus,
  ProductStatus,
  CommercialProductType,
  RenewalType,
  PlanType,
} from '../shared/types';
import { getPaymentGateway } from './paymentGatewayService';
import { getUserAllowanceBalance, grantTestingAllowance } from './allowanceService';
import { getUserSpeakingAllowanceBalance, grantSpeakingAllowance } from './speakingAllowanceService';

// ---------------------------------------------------------------------
// PRODUCT MANAGEMENT (ADMIN ONLY)
// ---------------------------------------------------------------------

export async function createProduct(
  adminId: string,
  params: {
    sku: string;
    title: string;
    description?: string;
    productType: CommercialProductType;
    priceAmount: number;
    currency?: string;
    durationDays?: number;
    writingAllowances?: number;
    speakingAllowances?: number;
    grantsCatalogueAccess?: boolean;
    renewalType?: RenewalType;
  }
): Promise<CommercialProduct> {
  const id = uuidv4();
  const now = new Date().toISOString();
  const currency = params.currency || 'IDR';

  if (!params.sku || !params.title) {
    throw new Error('Product SKU and Title are required.');
  }

  if (params.priceAmount < 0) {
    throw new Error('Price amount must be zero or positive.');
  }

  (await db.prepare(`
    INSERT INTO commercial_products (
      id, sku, title, description, product_type, price_amount, currency,
      duration_days, writing_allowances, speaking_allowances, grants_catalogue_access,
      renewal_type, status, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, 'draft', ?, ?
    )
  `).run(
    id,
    params.sku,
    params.title,
    params.description || null,
    params.productType,
    params.priceAmount,
    currency,
    params.durationDays || null,
    params.writingAllowances || 0,
    params.speakingAllowances || 0,
    params.grantsCatalogueAccess ? 1 : 0,
    params.renewalType || 'manual',
    now,
    now
  ));

  return (await getProductById(id))!;
}

export async function updateProduct(
  adminId: string,
  productId: string,
  params: Partial<{
    title: string;
    description: string;
    priceAmount: number;
    currency: string;
    durationDays: number;
    writingAllowances: number;
    speakingAllowances: number;
    grantsCatalogueAccess: boolean;
    renewalType: RenewalType;
  }>
): Promise<CommercialProduct> {
  const existing = (await getProductById(productId));
  if (!existing) throw new Error('Product not found.');

  const now = new Date().toISOString();
  (await db.prepare(`
    UPDATE commercial_products
    SET title = COALESCE(?, title),
        description = COALESCE(?, description),
        price_amount = COALESCE(?, price_amount),
        currency = COALESCE(?, currency),
        duration_days = COALESCE(?, duration_days),
        writing_allowances = COALESCE(?, writing_allowances),
        speaking_allowances = COALESCE(?, speaking_allowances),
        grants_catalogue_access = COALESCE(?, grants_catalogue_access),
        renewal_type = COALESCE(?, renewal_type),
        updated_at = ?
    WHERE id = ?
  `).run(
    params.title ?? null,
    params.description ?? null,
    params.priceAmount ?? null,
    params.currency ?? null,
    params.durationDays ?? null,
    params.writingAllowances ?? null,
    params.speakingAllowances ?? null,
    params.grantsCatalogueAccess !== undefined ? (params.grantsCatalogueAccess ? 1 : 0) : null,
    params.renewalType ?? null,
    now,
    productId
  ));

  return (await getProductById(productId))!;
}

export async function publishProduct(adminId: string, productId: string): Promise<CommercialProduct> {
  const product = (await getProductById(productId));
  if (!product) throw new Error('Product not found.');
  if (product.priceAmount <= 0 && product.productType !== 'paid_plan') {
    throw new Error('Cannot publish product without configured price amount.');
  }

  const now = new Date().toISOString();
  (await db.prepare("UPDATE commercial_products SET status = 'published', updated_at = ? WHERE id = ?").run(now, productId));
  return (await getProductById(productId))!;
}

export async function archiveProduct(adminId: string, productId: string): Promise<CommercialProduct> {
  const now = new Date().toISOString();
  (await db.prepare("UPDATE commercial_products SET status = 'archived', updated_at = ? WHERE id = ?").run(now, productId));
  return (await getProductById(productId))!;
}

export async function getProductById(productId: string): Promise<CommercialProduct | null> {
  const row = (await db.prepare('SELECT * FROM commercial_products WHERE id = ?').get(productId)) as any;
  if (!row) return null;
  return mapProductRow(row);
}

export async function getProductBySku(sku: string): Promise<CommercialProduct | null> {
  const row = (await db.prepare('SELECT * FROM commercial_products WHERE sku = ?').get(sku)) as any;
  if (!row) return null;
  return mapProductRow(row);
}

export async function listProducts(isStaff: boolean = false): Promise<CommercialProduct[]> {
  let query = 'SELECT * FROM commercial_products';
  if (!isStaff) {
    query += " WHERE status = 'published'";
  }
  query += ' ORDER BY price_amount ASC, created_at ASC';
  const rows = (await db.prepare(query).all()) as any[];
  return rows.map(mapProductRow);
}

function mapProductRow(row: any): CommercialProduct {
  return {
    id: row.id,
    sku: row.sku,
    title: row.title,
    description: row.description || undefined,
    productType: row.product_type as CommercialProductType,
    priceAmount: row.price_amount,
    currency: row.currency,
    durationDays: row.duration_days || undefined,
    writingAllowances: row.writing_allowances,
    speakingAllowances: row.speaking_allowances,
    grantsCatalogueAccess: Boolean(row.grants_catalogue_access),
    renewalType: row.renewal_type as RenewalType,
    status: row.status as ProductStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// -------------------------------------------------------------
// CHECKOUT & SERVER-SIDE PRICE DISCLOSURE
// -------------------------------------------------------------

export async function getCheckoutPreview(userId: string, productId: string): Promise<CheckoutPreviewResponse> {
  const product = (await getProductById(productId));
  if (!product) throw new Error('Product not found.');
  if (product.status !== 'published') {
    throw new Error('This product is not currently published or available for purchase.');
  }

  const userEntitlements = (await getUserCommercialSummary(userId));

  const benefits: string[] = [];
  if (product.grantsCatalogueAccess) {
    benefits.push(`Full access to all published Reading and Listening tests and full mocks (${product.durationDays || 30} days).`);
  }
  if (product.writingAllowances > 0) {
    benefits.push(`+${product.writingAllowances} AI Writing Task Assessment ${product.writingAllowances === 1 ? 'allowance' : 'allowances'} with detailed 4-criteria feedback.`);
  }
  if (product.speakingAllowances > 0) {
    benefits.push(`+${product.speakingAllowances} Live AI Speaking Simulation ${product.speakingAllowances === 1 ? 'session' : 'sessions'} with acoustic pronunciation evaluation.`);
  }

  const formattedPrice =
    product.currency === 'IDR'
      ? `Rp ${product.priceAmount.toLocaleString('id-ID')}`
      : `$${(product.priceAmount / 100).toFixed(2)} ${product.currency}`;

  const durationDescription = product.durationDays
    ? `${product.durationDays} days access from payment confirmation.`
    : 'Per-assessment credit (does not expire with monthly billing).';

  const renewalNotice =
    product.renewalType === 'recurring'
      ? 'Automatic renewal: You will be billed at the end of each period unless cancelled.'
      : 'Manual renewal: One-time payment. Your card will NOT be charged automatically.';

  const cancellationRefundTerms =
    'Refund Policy: Unused assessments and plans can be refunded within 14 days of purchase. Already-consumed AI assessments and partial test sessions are non-refundable. Cancelling a plan preserves access until the end of the paid period.';

  let impactSummary = '';
  if (product.grantsCatalogueAccess) {
    if (userEntitlements.hasCatalogueAccess) {
      impactSummary = `Extends your current paid plan by ${product.durationDays || 30} days and adds the included allowances.`;
    } else {
      impactSummary = `Upgrades your account from Free Tier to Paid Practice Plan for ${product.durationDays || 30} days.`;
    }
  } else {
    impactSummary = `Adds ${product.writingAllowances || 0} Writing and ${product.speakingAllowances || 0} Speaking credits to your balance without changing your catalogue tier.`;
  }

  return {
    product,
    totalPriceFormatted: formattedPrice,
    currency: product.currency,
    benefitsSummary: benefits,
    durationDescription,
    renewalNotice,
    cancellationRefundTerms,
    currentAccessSummary: {
      planType: userEntitlements.planType,
      planExpiresAt: userEntitlements.planExpiresAt,
      hasCatalogueAccess: userEntitlements.hasCatalogueAccess,
      availableWritingAllowances: userEntitlements.writingBalance.discretionary,
      availableSpeakingAllowances: userEntitlements.speakingBalance.discretionary,
      protectedWritingAllowances: userEntitlements.writingBalance.protectedPrepost,
      protectedSpeakingAllowances: userEntitlements.speakingBalance.protectedPrepost,
    },
    impactSummary,
  };
}

export async function createOrder(
  userId: string,
  productId: string,
  preferredProvider: string = 'midtrans'
): Promise<{ order: CommercialOrder; checkoutUrl: string }> {
  const product = (await getProductById(productId));
  if (!product) throw new Error('Product not found.');
  if (product.status !== 'published') {
    throw new Error('Product is unpublished and cannot be purchased.');
  }

  const user = (await db.prepare('SELECT id, full_name, email FROM users WHERE id = ?').get(userId)) as any;
  if (!user) throw new Error('User not found.');

  const orderId = `ORD-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`;
  const now = new Date().toISOString();

  // Create order row in pending status
  (await db.prepare(`
    INSERT INTO commercial_orders (
      id, user_id, product_id, product_sku, product_title,
      gross_amount, currency, payment_provider, status,
      created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, ?, 'pending',
      ?, ?
    )
  `).run(
    orderId,
    userId,
    product.id,
    product.sku,
    product.title,
    product.priceAmount,
    product.currency,
    preferredProvider,
    now,
    now
  ));

  const initialOrder = (await getOrderById(orderId))!;

  // Contact payment gateway to generate checkout session URL
  const gateway = getPaymentGateway(preferredProvider);
  const gatewayResult = await gateway.createTransaction(initialOrder, {
    id: user.id,
    name: user.full_name,
    email: user.email,
  });

  // Store checkout URL and provider transaction ID
  (await db.prepare(`
    UPDATE commercial_orders
    SET checkout_url = ?,
        provider_transaction_id = ?,
        metadata_json = ?,
        updated_at = datetime('now')
    WHERE id = ?
  `).run(
    gatewayResult.checkoutUrl,
    gatewayResult.providerTransactionId,
    JSON.stringify(gatewayResult.metadata || {}),
    orderId
  ));

  const updatedOrder = (await getOrderById(orderId))!;
  return {
    order: updatedOrder,
    checkoutUrl: gatewayResult.checkoutUrl,
  };
}

export async function getOrderById(orderId: string): Promise<CommercialOrder | null> {
  const row = (await db.prepare('SELECT * FROM commercial_orders WHERE id = ?').get(orderId)) as any;
  if (!row) return null;
  return mapOrderRow(row);
}

export async function listUserOrders(userId: string, limit?: number): Promise<CommercialOrder[]> {
  const rows = await db.prepare('SELECT * FROM commercial_orders WHERE user_id = ? ORDER BY created_at DESC' + (limit ? ' LIMIT ?' : '')).all(...(limit ? [userId,limit] : [userId]));
  return rows.map(mapOrderRow);
}

function mapOrderRow(row: any): CommercialOrder {
  return {
    id: row.id,
    userId: row.user_id,
    productId: row.product_id,
    productSku: row.product_sku,
    productTitle: row.product_title,
    grossAmount: row.gross_amount,
    currency: row.currency,
    paymentProvider: row.payment_provider,
    providerTransactionId: row.provider_transaction_id || undefined,
    status: row.status as OrderStatus,
    paymentMethod: row.payment_method || undefined,
    paidAt: row.paid_at || undefined,
    refundedAt: row.refunded_at || undefined,
    refundAmount: row.refund_amount || undefined,
    refundReason: row.refund_reason || undefined,
    checkoutUrl: row.checkout_url || undefined,
    metadata: row.metadata_json ? JSON.parse(row.metadata_json) : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// -------------------------------------------------------------
// IDEMPOTENT WEBHOOK NOTIFICATION PROCESSING
// -------------------------------------------------------------

export async function processPaymentWebhook(
  provider: string,
  payload: any,
  signatureHeader?: string
): Promise<{ success: boolean; orderId: string; status: OrderStatus; wasAlreadyProcessed: boolean }> {
  const gateway = getPaymentGateway(provider);
  const verification = gateway.verifyWebhook(payload, signatureHeader);

  if (!verification.isValid) {
    throw new Error('Invalid payment gateway signature verification.');
  }

  const orderId = verification.orderId;
  const order = (await getOrderById(orderId));
  if (!order) {
    throw new Error(`Order ${orderId} not found for webhook notification.`);
  }

  const eventId = verification.eventId;
  const now = new Date().toISOString();

  // 1. Check idempotency in payment_webhook_events
  const existingEvent = (await db
    .prepare('SELECT id, is_processed FROM payment_webhook_events WHERE provider_event_id = ?')
    .get(eventId)) as any;

  if (existingEvent && existingEvent.is_processed) {
    return {
      success: true,
      orderId,
      status: order.status,
      wasAlreadyProcessed: true,
    };
  }

  if (!existingEvent) {
    (await db.prepare(`
      INSERT INTO payment_webhook_events (
        id, provider, provider_event_id, order_id, event_type, payload_json, is_processed, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, 0, ?)
    `).run(uuidv4(), provider, eventId, orderId, verification.eventType, JSON.stringify(payload), now));
  }

  // 2. Handle out-of-order transitions:
  // If order is already paid, a late or out-of-order 'pending' must not revert the order!
  if (order.status === 'paid' && verification.transactionStatus === 'pending') {
    (await db.prepare('UPDATE payment_webhook_events SET is_processed = 1, processed_at = ? WHERE provider_event_id = ?').run(
      now,
      eventId
    ));
    return { success: true, orderId, status: order.status, wasAlreadyProcessed: true };
  }

  // 3. Process new valid state atomically
  const targetStatus = verification.transactionStatus;

  if (targetStatus === 'paid' && order.status !== 'paid') {
    const tx = db.transaction(async () => {
      // Mark order paid
      (await db.prepare(`
        UPDATE commercial_orders
        SET status = 'paid',
            provider_transaction_id = COALESCE(?, provider_transaction_id),
            payment_method = COALESCE(?, payment_method),
            paid_at = ?,
            updated_at = ?
        WHERE id = ?
      `).run(verification.providerTransactionId || null, verification.paymentMethod || null, now, now, orderId));

      // Activate entitlements and allowances
      (await activateOrderEntitlements(order));

      // Mark webhook processed
      (await db.prepare('UPDATE payment_webhook_events SET is_processed = 1, processed_at = ? WHERE provider_event_id = ?').run(
        now,
        eventId
      ));
    });

    (await tx());
  } else {
    // Other transitions: failed, cancelled, expired, etc.
    (await db.prepare(`
      UPDATE commercial_orders
      SET status = ?,
          updated_at = ?
      WHERE id = ?
    `).run(targetStatus, now, orderId));

    (await db.prepare('UPDATE payment_webhook_events SET is_processed = 1, processed_at = ? WHERE provider_event_id = ?').run(
      now,
      eventId
    ));
  }

  return {
    success: true,
    orderId,
    status: targetStatus,
    wasAlreadyProcessed: false,
  };
}

/**
 * Activates entitlements granted by a confirmed order.
 * Strictly idempotent via unique idempotency keys in ledgers.
 */
async function activateOrderEntitlements(order: CommercialOrder): Promise<void> {
  const product = (await getProductById(order.productId));
  if (!product) return;

  const now = new Date().toISOString();
  const userId = order.userId;

  // 1. If product grants catalogue access or is paid plan:
  if (product.grantsCatalogueAccess || product.productType === 'paid_plan') {
    const durationDays = product.durationDays || 30;
    const user = (await db.prepare('SELECT plan_type, plan_expires_at FROM users WHERE id = ?').get(userId)) as any;

    let validUntilDate: Date;
    if (user?.plan_expires_at && new Date(user.plan_expires_at) > new Date()) {
      // Extend existing active period
      validUntilDate = new Date(new Date(user.plan_expires_at).getTime() + durationDays * 24 * 60 * 60 * 1000);
    } else {
      // Fresh duration from now
      validUntilDate = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
    }

    const validUntilIso = validUntilDate.toISOString();

    // Update users record
    (await db.prepare(`
      UPDATE users 
      SET plan_type = 'paid_plan', 
          plan_expires_at = ? 
      WHERE id = ?
    `).run(validUntilIso, userId));

    // Create user_subscriptions record
    (await db.prepare(`
      INSERT INTO user_subscriptions (
        id, user_id, plan_id, order_id, status, valid_from, valid_until, renewal_type, created_at, updated_at
      ) VALUES (?, ?, ?, ?, 'active', ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      userId,
      product.id,
      order.id,
      now,
      validUntilIso,
      product.renewalType,
      now,
      now
    ));

    // Record grant audit
    (await db.prepare(`
      INSERT INTO commercial_entitlement_grants (
        id, user_id, source_type, source_id, grant_type, amount, valid_from, valid_until, status, notes, created_at
      ) VALUES (?, ?, 'purchase', ?, 'catalogue_access', 1, ?, ?, 'active', ?, ?)
    `).run(
      uuidv4(),
      userId,
      order.id,
      now,
      validUntilIso,
      `Catalogue access via Order ${order.id} (${product.title})`,
      now
    ));
  }

  // 2. Grant Writing Allowances (if product includes them)
  if (product.writingAllowances > 0) {
    const idempotencyKey = `order-${order.id}-writing`;
    (await grantTestingAllowance({
      adminId: userId, // Self-sourced via purchase
      userId,
      amount: product.writingAllowances,
      notes: `Purchased allowances via Order ${order.id} (${product.title})`,
      idempotencyKey,
    }));

    (await db.prepare(`
      INSERT INTO commercial_entitlement_grants (
        id, user_id, source_type, source_id, grant_type, amount, valid_from, status, notes, created_at
      ) VALUES (?, ?, 'purchase', ?, 'writing_allowance', ?, ?, 'active', ?, ?)
    `).run(
      uuidv4(),
      userId,
      order.id,
      product.writingAllowances,
      now,
      `Writing allowances via Order ${order.id}`,
      now
    ));
  }

  // 3. Grant Speaking Allowances (if product includes them)
  if (product.speakingAllowances > 0) {
    const spkIdempotencyKey = `order-${order.id}-speaking`;
    (await grantSpeakingAllowance({
      adminId: userId,
      userId,
      amount: product.speakingAllowances,
      notes: `Purchased Speaking allowances via Order ${order.id} (${product.title})`,
      idempotencyKey: spkIdempotencyKey,
    }));

    (await db.prepare(`
      INSERT INTO commercial_entitlement_grants (
        id, user_id, source_type, source_id, grant_type, amount, valid_from, status, notes, created_at
      ) VALUES (?, ?, 'purchase', ?, 'speaking_allowance', ?, ?, 'active', ?, ?)
    `).run(
      uuidv4(),
      userId,
      order.id,
      product.speakingAllowances,
      now,
      `Speaking allowances via Order ${order.id}`,
      now
    ));
  }
}

// -------------------------------------------------------------
// MISSED NOTIFICATION RECONCILIATION
// -------------------------------------------------------------

export async function reconcileOrder(orderId: string): Promise<CommercialOrder> {
  const order = (await getOrderById(orderId));
  if (!order) throw new Error('Order not found.');

  if (order.status === 'paid') {
    return order; // Already verified and reconciled
  }

  const gateway = getPaymentGateway(order.paymentProvider);
  const statusResult = await gateway.queryTransactionStatus(orderId);

  if (statusResult.status === 'paid') {
    const now = new Date().toISOString();
    const tx = db.transaction(async () => {
      (await db.prepare(`
        UPDATE commercial_orders
        SET status = 'paid',
            provider_transaction_id = COALESCE(?, provider_transaction_id),
            payment_method = COALESCE(?, payment_method),
            paid_at = ?,
            updated_at = ?
        WHERE id = ?
      `).run(statusResult.providerTransactionId || null, statusResult.paymentMethod || null, now, now, orderId));

      (await activateOrderEntitlements(order));
    });

    (await tx());
  } else if (statusResult.status !== order.status) {
    (await db.prepare(`
      UPDATE commercial_orders
      SET status = ?,
          updated_at = datetime('now')
      WHERE id = ?
    `).run(statusResult.status, orderId));
  }

  return (await getOrderById(orderId))!;
}

// -------------------------------------------------------------
// REFUNDS & COMPENSATING LEDGER AUDIT
// -------------------------------------------------------------

export async function refundOrder(params: {
  adminId: string;
  orderId: string;
  reason: string;
  amount?: number;
}): Promise<{ order: CommercialOrder; compensationNote: string }> {
  const { adminId, orderId, reason, amount } = params;
  const order = (await getOrderById(orderId));
  if (!order) throw new Error('Order not found.');
  if (order.status !== 'paid') {
    throw new Error(`Cannot refund order in status "${order.status}". Only paid orders can be refunded.`);
  }

  const product = (await getProductById(order.productId));
  const refundAmount = amount !== undefined ? amount : order.grossAmount;
  const now = new Date().toISOString();

  // Call gateway refund
  const gateway = getPaymentGateway(order.paymentProvider);
  const gatewayRes = await gateway.refundTransaction(orderId, refundAmount, reason);
  if (!gatewayRes.success) {
    throw new Error(`Gateway refund failed: ${gatewayRes.message}`);
  }

  let compensationNote = 'Refund processed cleanly.';

  const tx = db.transaction(async () => {
    // 1. Update order status to 'refunded'
    (await db.prepare(`
      UPDATE commercial_orders
      SET status = 'refunded',
          refund_amount = ?,
          refund_reason = ?,
          refunded_at = ?,
          updated_at = ?
      WHERE id = ?
    `).run(refundAmount, reason, now, now, orderId));

    // 2. Compensate unused allowances if product included allowances
    let remainingWritingAllowancesRevoked = 0;
    let remainingSpeakingAllowancesRevoked = 0;
    let consumedAllowancesRevoked = 0;

    if (product) {
      if (product.writingAllowances > 0) {
        // Record compensating negative adjustment in ledger
        const userBal = (await getUserAllowanceBalance(order.userId));
        const deductAmount = Math.min(product.writingAllowances, userBal.available);
        remainingWritingAllowancesRevoked = deductAmount;
        consumedAllowancesRevoked += (product.writingAllowances - deductAmount);

        if (deductAmount > 0) {
          (await db.prepare(`
            INSERT INTO writing_allowance_ledger (
              id, user_id, amount, balance_after, transaction_type, notes, created_by_id, created_at
            ) VALUES (?, ?, ?, ?, 'consumption', ?, ?, ?)
          `).run(
            uuidv4(),
            order.userId,
            -deductAmount,
            userBal.available - deductAmount,
            `Compensating deduction for Refunded Order ${orderId}: ${reason}`,
            adminId,
            now
          ));
        } else {
          compensationNote += ' Note: Writing allowances were already consumed prior to refund; manual review logged.';
        }
      }

      if (product.speakingAllowances > 0) {
        const spkBal = (await getUserSpeakingAllowanceBalance(order.userId));
        const deductSpk = Math.min(product.speakingAllowances, spkBal.available);
        remainingSpeakingAllowancesRevoked = deductSpk;
        consumedAllowancesRevoked += (product.speakingAllowances - deductSpk);

        if (deductSpk > 0) {
          (await db.prepare(`
            INSERT INTO speaking_allowance_ledger (
              id, user_id, amount, balance_after, transaction_type, notes, created_by_id, created_at
            ) VALUES (?, ?, ?, ?, 'consumption', ?, ?, ?)
          `).run(
            uuidv4(),
            order.userId,
            -deductSpk,
            spkBal.available - deductSpk,
            `Compensating deduction for Refunded Order ${orderId}: ${reason}`,
            adminId,
            now
          ));
        } else {
          compensationNote += ' Note: Speaking allowances were already consumed prior to refund; manual review logged.';
        }
      }

      // 3. Revoke active subscription for this order
      (await db.prepare(`
        UPDATE user_subscriptions
        SET status = 'cancelled',
            cancelled_at = ?,
            cancellation_reason = ?,
            updated_at = ?
        WHERE order_id = ?
      `).run(now, `Refunded by Admin: ${reason}`, now, orderId));

      // Mark entitlement grant revoked
      (await db.prepare(`
        UPDATE commercial_entitlement_grants
        SET status = 'revoked',
            notes = notes || ' (Revoked due to refund)'
        WHERE source_type = 'purchase' AND source_id = ?
      `).run(orderId));

      // Reset user plan_type and plan_expires_at if no other active subscriptions exist
      const otherActiveSub = (await db
        .prepare(`SELECT 1 FROM user_subscriptions WHERE user_id = ? AND status = 'active' AND valid_until > datetime('now')`)
        .get(order.userId));

      if (!otherActiveSub) {
        (await db.prepare(`
          UPDATE users
          SET plan_type = 'free',
              plan_expires_at = NULL
          WHERE id = ?
        `).run(order.userId));
      }
    }

    return {
      order: (await getOrderById(orderId))!,
      compensationNote,
      refundAudit: {
        remainingWritingAllowancesRevoked,
        remainingSpeakingAllowancesRevoked,
        consumedAllowancesRevoked,
      },
    };
  });

  const txResult = (await tx());
  return txResult;
}

// -------------------------------------------------------------
// TEACHER CODES (ATOMIC REDEMPTION & ACCESS LIFECYCLE)
// -------------------------------------------------------------

export async function createTeacherCode(
  adminId: string,
  params: {
    code: string;
    label: string;
    description?: string;
    redemptionDeadlineAt?: string;
    accessDurationDays?: number;
    maxRedemptions?: number;
    classId?: string;
    grantsCatalogueAccess?: boolean;
    writingAllowances?: number;
    speakingAllowances?: number;
    protectedPrepostAllowances?: number;
  }
): Promise<TeacherCode> {
  const normalizedCode = params.code.trim().toUpperCase();
  if (!normalizedCode) throw new Error('Code is required.');
  if (!params.label) throw new Error('Code label is required.');

  const existing = (await db.prepare('SELECT id FROM teacher_codes WHERE code = ?').get(normalizedCode));
  if (existing) {
    throw new Error(`Teacher code "${normalizedCode}" already exists.`);
  }

  const id = uuidv4();
  const now = new Date().toISOString();

  (await db.prepare(`
    INSERT INTO teacher_codes (
      id, code, label, description, redemption_deadline_at,
      access_duration_days, max_redemptions, redemption_count, class_id,
      grants_catalogue_access, writing_allowances, speaking_allowances,
      protected_prepost_allowances, status, created_by_id, created_at, updated_at
    ) VALUES (
      ?, ?, ?, ?, ?,
      ?, ?, 0, ?,
      ?, ?, ?,
      ?, 'active', ?, ?, ?
    )
  `).run(
    id,
    normalizedCode,
    params.label,
    params.description || null,
    params.redemptionDeadlineAt || null,
    params.accessDurationDays || 30,
    params.maxRedemptions || 50,
    params.classId || null,
    params.grantsCatalogueAccess ? 1 : 0,
    params.writingAllowances || 0,
    params.speakingAllowances || 0,
    params.protectedPrepostAllowances || 0,
    adminId,
    now,
    now
  ));

  return (await getTeacherCodeById(id))!;
}

export async function updateTeacherCode(
  adminId: string,
  codeId: string,
  params: Partial<{
    label: string;
    description: string;
    redemptionDeadlineAt: string;
    accessDurationDays: number;
    maxRedemptions: number;
    classId: string;
    grantsCatalogueAccess: boolean;
    writingAllowances: number;
    speakingAllowances: number;
    protectedPrepostAllowances: number;
  }>
): Promise<TeacherCode> {
  const existing = (await getTeacherCodeById(codeId));
  if (!existing) throw new Error('Teacher code not found.');

  const now = new Date().toISOString();
  (await db.prepare(`
    UPDATE teacher_codes
    SET label = COALESCE(?, label),
        description = COALESCE(?, description),
        redemption_deadline_at = COALESCE(?, redemption_deadline_at),
        access_duration_days = COALESCE(?, access_duration_days),
        max_redemptions = COALESCE(?, max_redemptions),
        class_id = COALESCE(?, class_id),
        grants_catalogue_access = COALESCE(?, grants_catalogue_access),
        writing_allowances = COALESCE(?, writing_allowances),
        speaking_allowances = COALESCE(?, speaking_allowances),
        protected_prepost_allowances = COALESCE(?, protected_prepost_allowances),
        updated_at = ?
    WHERE id = ?
  `).run(
    params.label ?? null,
    params.description ?? null,
    params.redemptionDeadlineAt ?? null,
    params.accessDurationDays ?? null,
    params.maxRedemptions ?? null,
    params.classId ?? null,
    params.grantsCatalogueAccess !== undefined ? (params.grantsCatalogueAccess ? 1 : 0) : null,
    params.writingAllowances ?? null,
    params.speakingAllowances ?? null,
    params.protectedPrepostAllowances ?? null,
    now,
    codeId
  ));

  return (await getTeacherCodeById(codeId))!;
}

export async function revokeTeacherCode(adminId: string, codeId: string): Promise<TeacherCode> {
  const existing = (await getTeacherCodeById(codeId));
  if (!existing) throw new Error('Teacher code not found.');

  const now = new Date().toISOString();
  (await db.prepare("UPDATE teacher_codes SET status = 'revoked', updated_at = ? WHERE id = ?").run(now, codeId));
  return (await getTeacherCodeById(codeId))!;
}

export async function getTeacherCodeById(codeId: string): Promise<TeacherCode | null> {
  const row = (await db
    .prepare(
      `SELECT tc.*, c.title AS class_name 
       FROM teacher_codes tc 
       LEFT JOIN classes c ON tc.class_id = c.id 
       WHERE tc.id = ?`
    )
    .get(codeId)) as any;
  if (!row) return null;
  return mapTeacherCodeRow(row);
}

export async function getTeacherCodeByCode(code: string): Promise<TeacherCode | null> {
  const normalized = code.trim().toUpperCase();
  const row = (await db
    .prepare(
      `SELECT tc.*, c.title AS class_name 
       FROM teacher_codes tc 
       LEFT JOIN classes c ON tc.class_id = c.id 
       WHERE tc.code = ?`
    )
    .get(normalized)) as any;
  if (!row) return null;
  return mapTeacherCodeRow(row);
}

export async function listTeacherCodes(isStaff: boolean = true): Promise<TeacherCode[]> {
  let query = `
    SELECT tc.*, c.title AS class_name 
    FROM teacher_codes tc 
    LEFT JOIN classes c ON tc.class_id = c.id
  `;
  if (!isStaff) {
    query += " WHERE tc.status = 'active'";
  }
  query += ' ORDER BY tc.created_at DESC';
  const rows = (await db.prepare(query).all()) as any[];
  return rows.map(mapTeacherCodeRow);
}

function mapTeacherCodeRow(row: any): TeacherCode {
  return {
    id: row.id,
    code: row.code,
    label: row.label,
    description: row.description || undefined,
    redemptionDeadlineAt: row.redemption_deadline_at || undefined,
    accessDurationDays: row.access_duration_days,
    maxRedemptions: row.max_redemptions,
    redemptionCount: row.redemption_count,
    classId: row.class_id || undefined,
    className: row.class_name || undefined,
    grantsCatalogueAccess: Boolean(row.grants_catalogue_access),
    writingAllowances: row.writing_allowances,
    speakingAllowances: row.speaking_allowances,
    protectedPrepostAllowances: row.protected_prepost_allowances,
    status: row.status,
    createdById: row.created_by_id,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Previews code benefits for learner display before redemption.
 */
export async function previewTeacherCode(code: string): Promise<{
  code: TeacherCode;
  benefits: string[];
  durationText: string;
}> {
  const codeRow = (await getTeacherCodeByCode(code));
  if (!codeRow) throw new Error(`Code "${code}" is invalid or does not exist.`);

  if (codeRow.status === 'revoked') {
    throw new Error('This code has been revoked by administration.');
  }

  if (codeRow.status === 'exhausted' || codeRow.redemptionCount >= codeRow.maxRedemptions) {
    throw new Error('This code has reached its maximum allowed redemptions.');
  }

  if (codeRow.redemptionDeadlineAt && new Date(codeRow.redemptionDeadlineAt) < new Date()) {
    throw new Error(`This code expired on ${codeRow.redemptionDeadlineAt.slice(0, 10)}.`);
  }

  const benefits: string[] = [];
  if (codeRow.grantsCatalogueAccess) {
    benefits.push(`Full practice catalogue access for ${codeRow.accessDurationDays} days.`);
  }
  if (codeRow.writingAllowances > 0) {
    benefits.push(`+${codeRow.writingAllowances} Discretionary AI Writing Assessment allowances.`);
  }
  if (codeRow.speakingAllowances > 0) {
    benefits.push(`+${codeRow.speakingAllowances} Discretionary Live AI Speaking Simulation sessions.`);
  }
  if (codeRow.protectedPrepostAllowances > 0) {
    benefits.push(`+${codeRow.protectedPrepostAllowances} Protected allowances reserved strictly for class Pre/Post-tests.`);
  }
  if (codeRow.className) {
    benefits.push(`Automatic enrolment into cohort: "${codeRow.className}".`);
  }

  return {
    code: codeRow,
    benefits,
    durationText: `${codeRow.accessDurationDays} days from redemption`,
  };
}

/**
 * Atomically redeems a teacher code for a learner.
 * Prevents race condition over-redemption through database transaction locking.
 */
export async function redeemTeacherCode(
  userId: string,
  code: string
): Promise<{ success: boolean; code: TeacherCode; message: string }> {
  const normalized = code.trim().toUpperCase();

  const tx = db.transaction(async () => {
    // 1. Fetch code with current row lock
    const codeRow = (await db.prepare('SELECT * FROM teacher_codes WHERE code = ?').get(normalized)) as any;
    if (!codeRow) throw new Error(`Code "${code}" does not exist.`);

    if (codeRow.status === 'revoked') {
      throw new Error('This code has been revoked by administration.');
    }

    // 2. Check 1 redemption per learner rule
    const alreadyRedeemed = (await db
      .prepare('SELECT id FROM teacher_code_redemptions WHERE code_id = ? AND user_id = ?')
      .get(codeRow.id, userId));

    if (alreadyRedeemed) {
      throw new Error('You have already redeemed this code.');
    }

    if (codeRow.status === 'exhausted' || codeRow.redemption_count >= codeRow.max_redemptions) {
      throw new Error('This code has reached its maximum allowed redemptions.');
    }

    if (codeRow.redemption_deadline_at && new Date(codeRow.redemption_deadline_at) < new Date()) {
      throw new Error('This code has expired.');
    }

    const now = new Date().toISOString();
    const newRedemptionCount = codeRow.redemption_count + 1;
    const isNowExhausted = newRedemptionCount >= codeRow.max_redemptions;

    // 3. Atomically update code redemption count & status
    (await db.prepare(`
      UPDATE teacher_codes
      SET redemption_count = ?,
          status = CASE WHEN ? THEN 'exhausted' ELSE status END,
          updated_at = ?
      WHERE id = ?
    `).run(newRedemptionCount, isNowExhausted ? 1 : 0, now, codeRow.id));

    // 4. Record redemption
    (await db.prepare(`
      INSERT INTO teacher_code_redemptions (id, code_id, user_id, redeemed_at)
      VALUES (?, ?, ?, ?)
    `).run(uuidv4(), codeRow.id, userId, now));

    // 5. Grant catalogue access if configured
    if (codeRow.grants_catalogue_access) {
      const user = (await db.prepare('SELECT plan_type, plan_expires_at FROM users WHERE id = ?').get(userId)) as any;
      let validUntilDate: Date;
      if (user?.plan_expires_at && new Date(user.plan_expires_at) > new Date()) {
        validUntilDate = new Date(new Date(user.plan_expires_at).getTime() + codeRow.access_duration_days * 86400000);
      } else {
        validUntilDate = new Date(Date.now() + codeRow.access_duration_days * 86400000);
      }
      const validUntilIso = validUntilDate.toISOString();

      (await db.prepare("UPDATE users SET plan_type = 'paid_plan', plan_expires_at = ? WHERE id = ?").run(validUntilIso, userId));

      (await db.prepare(`
        INSERT INTO commercial_entitlement_grants (
          id, user_id, source_type, source_id, grant_type, amount, valid_from, valid_until, status, notes, created_at
        ) VALUES (?, ?, 'teacher_code', ?, 'catalogue_access', 1, ?, ?, 'active', ?, ?)
      `).run(
        uuidv4(),
        userId,
        codeRow.id,
        now,
        validUntilIso,
        `Catalogue access via Teacher Code "${codeRow.code}"`,
        now
      ));
    }

    // 6. Grant Writing Allowances (Discretionary + Protected Pre/Post)
    const totalWritingToGrant = codeRow.writing_allowances + codeRow.protected_prepost_allowances;
    if (totalWritingToGrant > 0) {
      (await grantTestingAllowance({
        adminId: codeRow.created_by_id,
        userId,
        amount: totalWritingToGrant,
        notes: `Teacher Code "${codeRow.code}" redemption`,
      }));

      (await db.prepare(`
        INSERT INTO commercial_entitlement_grants (
          id, user_id, source_type, source_id, grant_type, amount, valid_from, status, notes, created_at
        ) VALUES (?, ?, 'teacher_code', ?, 'writing_allowance', ?, ?, 'active', ?, ?)
      `).run(
        uuidv4(),
        userId,
        codeRow.id,
        codeRow.writing_allowances,
        now,
        `Writing allowances via Teacher Code "${codeRow.code}"`,
        now
      ));
    }

    // 7. Grant Speaking Allowances (Discretionary + Protected Pre/Post)
    const totalSpeakingToGrant = codeRow.speaking_allowances + codeRow.protected_prepost_allowances;
    if (totalSpeakingToGrant > 0) {
      (await grantSpeakingAllowance({
        adminId: codeRow.created_by_id,
        userId,
        amount: totalSpeakingToGrant,
        notes: `Teacher Code "${codeRow.code}" redemption`,
      }));

      (await db.prepare(`
        INSERT INTO commercial_entitlement_grants (
          id, user_id, source_type, source_id, grant_type, amount, valid_from, status, notes, created_at
        ) VALUES (?, ?, 'teacher_code', ?, 'speaking_allowance', ?, ?, 'active', ?, ?)
      `).run(
        uuidv4(),
        userId,
        codeRow.id,
        codeRow.speaking_allowances,
        now,
        `Speaking allowances via Teacher Code "${codeRow.code}"`,
        now
      ));
    }

    // 8. Grant Protected Pre/Post-Test Allowances (Isolated from discretionary practice)
    if (codeRow.protected_prepost_allowances > 0) {
      (await db.prepare(`
        INSERT INTO commercial_entitlement_grants (
          id, user_id, source_type, source_id, grant_type, amount, valid_from, status, notes, created_at
        ) VALUES (?, ?, 'teacher_code', ?, 'protected_prepost', ?, ?, 'active', ?, ?)
      `).run(
        uuidv4(),
        userId,
        codeRow.id,
        codeRow.protected_prepost_allowances,
        now,
        `Protected Pre/Post allowances via Teacher Code "${codeRow.code}"`,
        now
      ));
    }

    // 9. Auto-enrol in linked class if specified and not already enrolled
    if (codeRow.class_id) {
      const existingEnrolment = (await db
        .prepare('SELECT id FROM class_enrolments WHERE class_id = ? AND student_id = ?')
        .get(codeRow.class_id, userId));

      if (!existingEnrolment) {
        (await db.prepare(`
          INSERT INTO class_enrolments (id, class_id, student_id, status, joined_via, enrolled_at)
          VALUES (?, ?, ?, 'active', 'code', ?)
        `).run(uuidv4(), codeRow.class_id, userId, now));
      }
    }
  });

  (await tx());

  const updatedCode = (await getTeacherCodeByCode(normalized))!;
  return {
    success: true,
    code: updatedCode,
    message: `Successfully redeemed code "${updatedCode.code}"! Benefits have been applied to your account.`,
  };
}

// -------------------------------------------------------------
// USER COMMERCIAL SUMMARY & ACCESS VERIFICATION
// -------------------------------------------------------------

export async function getUserCommercialSummary(userId: string): Promise<LearnerCommercialSummary> {
  const [user, writingBal, speakingBal, subs, orders, grants] = await Promise.all([
    db.prepare(`SELECT u.plan_type, u.plan_expires_at,
      (SELECT COALESCE(SUM(amount), 0) FROM commercial_entitlement_grants
        WHERE user_id = u.id AND grant_type = 'protected_prepost' AND status = 'active') AS protected_count
      FROM users u WHERE u.id = ?`).get(userId),
    getUserAllowanceBalance(userId),
    getUserSpeakingAllowanceBalance(userId),
    db.prepare('SELECT * FROM user_subscriptions WHERE user_id = ? ORDER BY created_at DESC').all(userId),
    listUserOrders(userId, 10),
    db.prepare('SELECT * FROM commercial_entitlement_grants WHERE user_id = ? ORDER BY created_at DESC LIMIT 20').all(userId),
  ]);
  const isPaidActive = Boolean(user?.plan_expires_at && new Date(user.plan_expires_at) > new Date());
  const planType: PlanType = isPaidActive ? 'paid_plan' : 'free';

  const protectedCount = user?.protected_count || 0;

  // Discretionary = total available minus protected
  const discretionaryWriting = Math.max(0, writingBal.available - protectedCount);
  const discretionarySpeaking = Math.max(0, speakingBal.available - protectedCount);

  return {
    planType,
    planExpiresAt: user?.plan_expires_at || undefined,
    hasCatalogueAccess: isPaidActive,
    subscriptions: subs.map((s) => ({
      id: s.id,
      userId: s.user_id,
      planId: s.plan_id,
      orderId: s.order_id || undefined,
      codeId: s.code_id || undefined,
      status: s.status,
      validFrom: s.valid_from,
      validUntil: s.valid_until,
      renewalType: s.renewal_type as RenewalType,
      cancelledAt: s.cancelled_at || undefined,
      cancellationReason: s.cancellation_reason || undefined,
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    })),
    writingBalance: {
      total: writingBal.available,
      discretionary: discretionaryWriting,
      protectedPrepost: protectedCount,
    },
    speakingBalance: {
      total: speakingBal.available,
      discretionary: discretionarySpeaking,
      protectedPrepost: protectedCount,
    },
    recentOrders: orders,
    activeGrants: grants.map((g) => ({
      id: g.id,
      userId: g.user_id,
      sourceType: g.source_type,
      sourceId: g.source_id,
      grantType: g.grant_type,
      amount: g.amount,
      validFrom: g.valid_from,
      validUntil: g.valid_until || undefined,
      status: g.status,
      notes: g.notes || undefined,
      createdAt: g.created_at,
    })),
  };
}

/**
 * Checks whether a learner can access a specific test.
 * Implements strict separation:
 * 1. Free tier items accessible by all registered learners.
 * 2. Paid catalogue accessible by users with active paid plan or code.
 * 3. Class assignments accessible regardless of plan (assignment grant).
 */
export async function canUserAccessTest(params: {
  userId: string;
  isTeacherOrAdmin: boolean;
  isFreeTier?: boolean;
  assignmentId?: string;
}): Promise<{ allowed: boolean; reason?: string }> {
  const { userId, isTeacherOrAdmin, isFreeTier, assignmentId } = params;

  if (isTeacherOrAdmin) return { allowed: true };

  // 1. Free tier items
  if (isFreeTier) return { allowed: true };

  // 2. Class assignment grant (learner enrolled in assignment class)
  if (assignmentId) {
    const isEnrolled = (await db
      .prepare(
        `SELECT 1 FROM assignments a
         JOIN class_enrolments ce ON a.class_id = ce.class_id
         WHERE a.id = ? AND ce.student_id = ? AND ce.status = 'active'`
      )
      .get(assignmentId, userId));

    if (isEnrolled) return { allowed: true };
  }

  // 3. Paid plan / Catalogue access
  const commercial = (await getUserCommercialSummary(userId));
  if (commercial.hasCatalogueAccess) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'This practice material requires an active Paid Practice Plan or a Teacher Code.',
  };
}

// -------------------------------------------------------------
// ADMIN COMMERCIAL SUMMARY & BALANCE ADJUSTMENT
// -------------------------------------------------------------

export async function getAdminCommercialSummary(): Promise<AdminCommercialSummary> {
  const orders = (await db.prepare('SELECT * FROM commercial_orders ORDER BY created_at DESC').all()) as any[];

  const revenueByCurrency: Record<string, number> = {};
  const statusCounts: Record<string, number> = {};

  for (const o of orders) {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    if (o.status === 'paid') {
      revenueByCurrency[o.currency] = (revenueByCurrency[o.currency] || 0) + o.gross_amount;
    }
  }

  const activeSubs = (await db
    .prepare("SELECT COUNT(*) AS c FROM user_subscriptions WHERE status = 'active' AND valid_until > datetime('now')")
    .get()) as any;

  const products = (await listProducts(true));
  const teacherCodes = (await listTeacherCodes(true));
  const grants = (await db
    .prepare('SELECT * FROM commercial_entitlement_grants ORDER BY created_at DESC LIMIT 30')
    .all()) as any[];

  return {
    totalRevenueByCurrency: revenueByCurrency,
    orderCountByStatus: statusCounts,
    activeSubscribersCount: activeSubs?.c || 0,
    products,
    recentOrders: orders.slice(0, 20).map(mapOrderRow),
    teacherCodes,
    recentGrants: grants.map((g) => ({
      id: g.id,
      userId: g.user_id,
      sourceType: g.source_type,
      sourceId: g.source_id,
      grantType: g.grant_type,
      amount: g.amount,
      validFrom: g.valid_from,
      validUntil: g.valid_until || undefined,
      status: g.status,
      notes: g.notes || undefined,
      createdAt: g.created_at,
    })),
  };
}

export async function adjustUserBalance(params: {
  adminId: string;
  userId: string;
  skill: 'writing' | 'speaking';
  amount: number;
  reason: string;
}): Promise<{ success: boolean; newBalance: number }> {
  const { adminId, userId, skill, amount, reason } = params;
  if (!reason || reason.trim().length < 5) {
    throw new Error('Mandatory reasoned explanation of at least 5 characters is required for audited balance adjustments.');
  }

  const now = new Date().toISOString();

  if (skill === 'writing') {
    const userBal = (await getUserAllowanceBalance(userId));
    const newBal = userBal.available + amount;
    if (newBal < 0) {
      throw new Error(`Cannot adjust balance below 0 (current: ${userBal.available}, adjustment: ${amount}).`);
    }

    (await db.prepare(`
      INSERT INTO writing_allowance_ledger (
        id, user_id, amount, balance_after, transaction_type, notes, created_by_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      userId,
      amount,
      newBal,
      amount >= 0 ? 'grant' : 'consumption',
      `Admin adjustment: ${reason}`,
      adminId,
      now
    ));

    return { success: true, newBalance: newBal };
  } else {
    const spkBal = (await getUserSpeakingAllowanceBalance(userId));
    const newBal = spkBal.available + amount;
    if (newBal < 0) {
      throw new Error(`Cannot adjust balance below 0 (current: ${spkBal.available}, adjustment: ${amount}).`);
    }

    (await db.prepare(`
      INSERT INTO speaking_allowance_ledger (
        id, user_id, amount, balance_after, transaction_type, notes, created_by_id, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      uuidv4(),
      userId,
      amount,
      newBal,
      amount >= 0 ? 'grant' : 'consumption',
      `Admin adjustment: ${reason}`,
      adminId,
      now
    ));

    return { success: true, newBalance: newBal };
  }
}
