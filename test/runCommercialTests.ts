import assert from 'assert';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from '../server/db';
import {
  createProduct,
  updateProduct,
  publishProduct,
  archiveProduct,
  getProductById,
  getCheckoutPreview,
  createOrder,
  getOrderById,
  processPaymentWebhook,
  reconcileOrder,
  refundOrder,
  createTeacherCode,
  updateTeacherCode,
  revokeTeacherCode,
  previewTeacherCode,
  redeemTeacherCode,
  getUserCommercialSummary,
  canUserAccessTest,
  getAdminCommercialSummary,
  adjustUserBalance,
} from '../server/commercialService';
import { getUserAllowanceBalance } from '../server/allowanceService';
import { getUserSpeakingAllowanceBalance } from '../server/speakingAllowanceService';
import { getPaymentGateway, MockSandboxAdapter } from '../server/paymentGatewayService';
import { createClass, enrolStudentByEmail } from '../server/classService';
import { createAssignment } from '../server/assignmentService';
import { createTest } from '../server/readingService';

export async function runCommercialTestSuite() {
  console.log('\n=============================================================');
  console.log('  RUNNING MILESTONE 7: COMMERCIAL ACCESS & PAYMENTS SUITE   ');
  console.log('=============================================================\n');

  (await initDatabase());

  // Setup test users
  const adminId = uuidv4();
  const teacherId = uuidv4();
  const learnerId1 = uuidv4();
  const learnerId2 = uuidv4();
  const learner1Email = `commercial_learner1_${Date.now()}@test.com`;
  const learner2Email = `commercial_learner2_${Date.now()}@test.com`;

  (await db.prepare(`INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'dummy', 'Admin Boss', 'admin')`).run(adminId, `admin_comm_${Date.now()}@test.com`));
  (await db.prepare(`INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'dummy', 'Teacher Sarah', 'teacher')`).run(teacherId, `teacher_comm_${Date.now()}@test.com`));
  (await db.prepare(`INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'dummy', 'Learner Dian', 'student')`).run(learnerId1, learner1Email));
  (await db.prepare(`INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'dummy', 'Learner Budi', 'student')`).run(learnerId2, learner2Email));

  // ---------------------------------------------------------------------
  // TEST 1: Product Configuration & Draft Status Rejection
  // Unconfigured/draft products must remain unpurchasable.
  // ---------------------------------------------------------------------
  console.log('Test 1: Product configuration & draft status rejection (unpurchasable)...');
  const draftProduct = (await createProduct(adminId, {
    sku: `SKU-DRAFT-${Date.now()}`,
    title: 'Draft Unconfigured Bundle',
    description: 'Not yet finalized product',
    productType: 'bundle',
    priceAmount: 150000,
    currency: 'IDR',
    durationDays: 30,
    writingAllowances: 5,
    speakingAllowances: 1,
    grantsCatalogueAccess: true,
    renewalType: 'manual',
  }));

  assert.strictEqual(draftProduct.status, 'draft', 'Newly created product must be in draft status');

  let draftOrderThrew = false;
  try {
    await createOrder(learnerId1, draftProduct.id, 'mock');
  } catch (err: any) {
    draftOrderThrew = true;
    assert(err.message.includes('unpublished') || err.message.includes('cannot be purchased'), 'Should reject purchase of draft product');
  }
  assert.strictEqual(draftOrderThrew, true, 'Draft product cannot be purchased');

  // Publish product for subsequent tests
  (await publishProduct(adminId, draftProduct.id));
  const publishedProduct = (await getProductById(draftProduct.id))!;
  assert.strictEqual(publishedProduct.status, 'published', 'Product should now be published');
  console.log('✓ Passed: Draft products rejected from order creation; published successfully.');

  // ---------------------------------------------------------------------
  // TEST 2: Server-Side Price Calculation & Pre-Payment Checkout Disclosure
  // ---------------------------------------------------------------------
  console.log('\nTest 2: Server-side price calculation & pre-payment checkout disclosure...');
  const preview = (await getCheckoutPreview(learnerId1, draftProduct.id));
  assert.strictEqual(preview.product.id, draftProduct.id, 'Preview matches product');
  assert.strictEqual(preview.product.priceAmount, 150000, 'Server calculated price matches');
  assert.strictEqual(preview.currency, 'IDR', 'Currency matches IDR');
  assert.strictEqual(preview.currentAccessSummary.planType, 'free', 'Current plan reported as free');
  assert.strictEqual(preview.product.grantsCatalogueAccess, true, 'Product will unlock catalogue');
  assert.strictEqual(preview.product.writingAllowances, 5, 'Writing allowances added reported');
  assert.strictEqual(preview.product.speakingAllowances, 1, 'Speaking allowances added reported');
  assert(preview.renewalNotice.includes('Manual renewal'), 'Reports manual renewal type');
  assert(preview.cancellationRefundTerms.includes('Refund Policy'), 'Discloses refund terms');
  console.log('✓ Passed: Pre-payment checkout disclosure provides authoritative server calculation.');

  // ---------------------------------------------------------------------
  // TEST 3: Sandbox Checkout Order Creation
  // ---------------------------------------------------------------------
  console.log('\nTest 3: Sandbox checkout order creation...');
  const orderRes = await createOrder(learnerId1, draftProduct.id, 'mock');
  assert(orderRes.order.id.startsWith('ORD-'), 'Order ID starts with prefix');
  assert.strictEqual(orderRes.order.status, 'pending', 'Initial status is pending');
  assert.strictEqual(orderRes.order.grossAmount, 150000, 'Order amount matches product price');
  assert.strictEqual(orderRes.order.currency, 'IDR', 'Currency is IDR');
  assert(orderRes.checkoutUrl.includes(orderRes.order.id), 'Checkout URL contains order ID');
  console.log(`✓ Passed: Order ${orderRes.order.id} created with pending status in mock sandbox.`);

  // ---------------------------------------------------------------------
  // TEST 4: Webhook Notification Verification with SHA-512 & Idempotent Processing
  // ---------------------------------------------------------------------
  console.log('\nTest 4: Webhook verification with SHA-512 & idempotent processing...');
  // 4a: Test Midtrans SHA-512 signature computation
  const midtransOrderId = `ORD-MID-${Date.now()}`;
  const midtransGross = 250000;
  const serverKey = 'SB-Mid-server-TEST-KEY-IELTS-SANDBOX';
  const rawSignatureString = `${midtransOrderId}200${midtransGross}${serverKey}`;
  const sha512Signature = crypto.createHash('sha512').update(rawSignatureString).digest('hex');

  // Insert mock order to verify webhook processing on Midtrans
  (await db.prepare(`
    INSERT INTO commercial_orders (
      id, user_id, product_id, product_sku, product_title, gross_amount,
      currency, payment_provider, status, created_at, updated_at
    ) VALUES (?, ?, ?, 'SKU-TEST', 'Midtrans Plan', ?, 'IDR', 'midtrans', 'pending', datetime('now'), datetime('now'))
  `).run(midtransOrderId, learnerId2, draftProduct.id, midtransGross));

  const midtransTransactionId = `midtrans-txn-${midtransOrderId}`;
  const midtransWebhookResult = await processPaymentWebhook('midtrans', {
    order_id: midtransOrderId,
    transaction_id: midtransTransactionId,
    status_code: '200',
    gross_amount: midtransGross,
    transaction_status: 'settlement',
    payment_type: 'qris',
    signature_key: sha512Signature,
  });

  assert.strictEqual(midtransWebhookResult.success, true, 'Midtrans webhook successfully processed');
  assert.strictEqual(midtransWebhookResult.status, 'paid', 'Order transitioned to paid');

  const paidOrder = (await getOrderById(midtransOrderId))!;
  assert.strictEqual(paidOrder.status, 'paid', 'Database record transitioned to paid');
  assert.strictEqual(paidOrder.paymentMethod, 'qris', 'Payment method saved');

  // 4b: Idempotent duplicate delivery test
  const duplicateWebhookResult = await processPaymentWebhook('midtrans', {
    order_id: midtransOrderId,
    transaction_id: midtransTransactionId,
    status_code: '200',
    gross_amount: midtransGross,
    transaction_status: 'settlement',
    payment_type: 'qris',
    signature_key: sha512Signature,
  });

  assert.strictEqual(duplicateWebhookResult.success, true, 'Duplicate webhook returns success');
  assert.strictEqual(duplicateWebhookResult.wasAlreadyProcessed, true, 'Flagged as duplicate delivery');
  console.log('✓ Passed: SHA-512 signature verified and duplicate webhook processed idempotently.');

  // ---------------------------------------------------------------------
  // TEST 5: Out-of-Order Webhook Delivery Protection
  // A delayed 'pending' webhook must not overwrite an already 'paid' order.
  // ---------------------------------------------------------------------
  console.log('\nTest 5: Out-of-order webhook delivery protection...');
  const latePendingResult = await processPaymentWebhook('midtrans', {
    order_id: midtransOrderId,
    status_code: '201',
    gross_amount: midtransGross,
    transaction_status: 'pending',
    payment_type: 'qris',
    signature_key: sha512Signature,
  });

  assert.strictEqual(latePendingResult.success, true);
  const stillPaidOrder = (await getOrderById(midtransOrderId))!;
  assert.strictEqual(stillPaidOrder.status, 'paid', 'Order remains paid; late pending status ignored');
  console.log('✓ Passed: Out-of-order pending notification did not regress paid status.');

  // ---------------------------------------------------------------------
  // TEST 6: Missed-Notification Reconciliation
  // ---------------------------------------------------------------------
  console.log('\nTest 6: Missed-notification reconciliation (reconcileOrder)...');
  const pendingOrderRes = await createOrder(learnerId1, draftProduct.id, 'mock');
  const mockGateway = getPaymentGateway('mock') as MockSandboxAdapter;
  mockGateway.setMockOrderStatus(pendingOrderRes.order.id, 'paid');

  const reconciledOrder = await reconcileOrder(pendingOrderRes.order.id);
  assert.strictEqual(reconciledOrder.status, 'paid', 'Order status reconciled to paid');
  assert(reconciledOrder.paidAt !== undefined, 'paidAt timestamp set');
  console.log('✓ Passed: reconcileOrder successfully synced status from payment gateway.');

  // ---------------------------------------------------------------------
  // TEST 7: Entitlement & Allowance Activation
  // Verify plan duration, catalogue access, and allowance ledger credits.
  // ---------------------------------------------------------------------
  console.log('\nTest 7: Entitlement & allowance activation for paid practice plan...');
  const learnerCommercial = (await getUserCommercialSummary(learnerId1));
  assert.strictEqual(learnerCommercial.planType, 'paid_plan', 'User plan_type upgraded to paid_plan');
  assert.strictEqual(learnerCommercial.hasCatalogueAccess, true, 'User has full catalogue access');
  assert(learnerCommercial.planExpiresAt !== undefined, 'User plan expiry date set');
  assert(learnerCommercial.writingBalance.total >= 5, 'Writing allowances credited');
  assert(learnerCommercial.speakingBalance.total >= 1, 'Speaking allowances credited');

  // Verify ledgers have idempotency keys
  const writingLedger = (await db.prepare('SELECT * FROM writing_allowance_ledger WHERE user_id = ?').all(learnerId1)) as any[];
  assert(writingLedger.some((e) => e.idempotency_key && e.idempotency_key.includes(pendingOrderRes.order.id)), 'Writing ledger recorded with order idempotency key');
  console.log('✓ Passed: Subscriptions and ledger entries activated with idempotency protection.');

  // ---------------------------------------------------------------------
  // TEST 8: Individual Assessment Purchases (No Full Catalogue Access)
  // ---------------------------------------------------------------------
  console.log('\nTest 8: Individual assessment purchases (credits without catalogue access)...');
  const individualWritingProduct = (await createProduct(adminId, {
    sku: `SKU-W-SINGLE-${Date.now()}`,
    title: 'Single AI Writing Assessment',
    description: 'Evaluate one Task 1 or Task 2 essay',
    productType: 'writing_assessment',
    priceAmount: 49000,
    currency: 'IDR',
    durationDays: 0,
    writingAllowances: 1,
    speakingAllowances: 0,
    grantsCatalogueAccess: false,
    renewalType: 'manual',
  }));
  (await publishProduct(adminId, individualWritingProduct.id));

  const freshLearnerId = uuidv4();
  (await db.prepare(`INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'dummy', 'Fresh Learner', 'student')`).run(freshLearnerId, `fresh_${Date.now()}@test.com`));

  const singleOrderRes = await createOrder(freshLearnerId, individualWritingProduct.id, 'mock');
  await processPaymentWebhook('mock', {
    order_id: singleOrderRes.order.id,
    transaction_status: 'paid',
    payment_method: 'gopay',
    gross_amount: 49000,
  });

  const freshCommercial = (await getUserCommercialSummary(freshLearnerId));
  assert.strictEqual(freshCommercial.planType, 'free', 'Plan remains free');
  assert.strictEqual(freshCommercial.hasCatalogueAccess, false, 'Catalogue access remains false');
  assert.strictEqual(freshCommercial.writingBalance.total, 1, 'Exactly 1 writing allowance granted');
  assert.strictEqual(freshCommercial.speakingBalance.total, 0, 'Zero speaking allowances');
  console.log('✓ Passed: Individual assessment purchase granted credit without unlocking paid catalogue.');

  // ---------------------------------------------------------------------
  // TEST 9: Atomic Teacher Code Redemption & Max Redemptions Enforcement
  // ---------------------------------------------------------------------
  console.log('\nTest 9: Atomic teacher code redemption & max limit enforcement...');
  const cohortCode = (await createTeacherCode(teacherId, {
    code: `PILOT-LIMIT-2-${Date.now()}`,
    label: 'Pilot Cohort 2 Seats',
    description: 'Strict 2-seat limit',
    maxRedemptions: 2,
    accessDurationDays: 14,
    grantsCatalogueAccess: true,
    writingAllowances: 3,
    speakingAllowances: 1,
    protectedPrepostAllowances: 2,
  }));

  assert.strictEqual(cohortCode.maxRedemptions, 2);
  assert.strictEqual(cohortCode.redemptionCount, 0);

  // Seat 1 redemption
  const seat1User = uuidv4();
  (await db.prepare(`INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'dummy', 'Seat 1 User', 'student')`).run(seat1User, `seat1_${Date.now()}@test.com`));
  const redeem1 = (await redeemTeacherCode(seat1User, cohortCode.code));
  assert.strictEqual(redeem1.success, true, 'First redemption succeeded');
  assert.strictEqual(redeem1.code.redemptionCount, 1, 'Redemption count is 1');
  assert.strictEqual(redeem1.code.status, 'active', 'Code remains active');

  // Seat 2 redemption (hits limit)
  const seat2User = uuidv4();
  (await db.prepare(`INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'dummy', 'Seat 2 User', 'student')`).run(seat2User, `seat2_${Date.now()}@test.com`));
  const redeem2 = (await redeemTeacherCode(seat2User, cohortCode.code));
  assert.strictEqual(redeem2.success, true, 'Second redemption succeeded');
  assert.strictEqual(redeem2.code.redemptionCount, 2, 'Redemption count is 2');
  assert.strictEqual(redeem2.code.status, 'exhausted', 'Code automatically transitioned to exhausted');

  // Seat 3 redemption (must reject)
  const seat3User = uuidv4();
  (await db.prepare(`INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'dummy', 'Seat 3 User', 'student')`).run(seat3User, `seat3_${Date.now()}@test.com`));
  let seat3Threw = false;
  try {
    (await redeemTeacherCode(seat3User, cohortCode.code));
  } catch (err: any) {
    seat3Threw = true;
    assert(err.message.includes('exhausted') || err.message.includes('maximum'), 'Rejection message reflects exhaustion');
  }
  assert.strictEqual(seat3Threw, true, 'Exhausted code rejected seat 3 redemption');
  console.log('✓ Passed: Atomic teacher code redemption enforced max usage limit.');

  // ---------------------------------------------------------------------
  // TEST 10: One-Redemption-Per-Learner Rule & Expired/Revoked Code Handling
  // ---------------------------------------------------------------------
  console.log('\nTest 10: One-redemption-per-learner rule & revoked code rejection...');
  let duplicateRedeemThrew = false;
  try {
    (await redeemTeacherCode(seat1User, cohortCode.code));
  } catch (err: any) {
    duplicateRedeemThrew = true;
    assert(err.message.includes('already redeemed'), 'Rejects duplicate redemption by same learner');
  }
  assert.strictEqual(duplicateRedeemThrew, true, 'Learner cannot redeem the same code twice');

  // Revoke code test
  const revokableCode = (await createTeacherCode(teacherId, {
    code: `REVOKE-TEST-${Date.now()}`,
    label: 'Revokable Test Code',
    maxRedemptions: 10,
    accessDurationDays: 7,
    grantsCatalogueAccess: true,
  }));
  (await revokeTeacherCode(teacherId, revokableCode.id));

  let revokedRedeemThrew = false;
  try {
    (await redeemTeacherCode(seat3User, revokableCode.code));
  } catch (err: any) {
    revokedRedeemThrew = true;
    assert(err.message.includes('revoked') || err.message.includes('inactive'), 'Rejection reflects revoked status');
  }
  assert.strictEqual(revokedRedeemThrew, true, 'Revoked code rejects redemption');
  console.log('✓ Passed: Duplicate redemptions and revoked codes correctly blocked.');

  // ---------------------------------------------------------------------
  // TEST 11: Protected Pre/Post-Test Allowance Isolation
  // ---------------------------------------------------------------------
  console.log('\nTest 11: Protected pre/post-test allowance isolation...');
  const protectedUser = uuidv4();
  (await db.prepare(`INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'dummy', 'Protected Cohort User', 'student')`).run(protectedUser, `protected_${Date.now()}@test.com`));

  const codeWithProtected = (await createTeacherCode(teacherId, {
    code: `PROTECTED-${Date.now()}`,
    label: 'Protected Test Package Code',
    maxRedemptions: 5,
    accessDurationDays: 30,
    grantsCatalogueAccess: true,
    writingAllowances: 4, // Discretionary
    speakingAllowances: 2, // Discretionary
    protectedPrepostAllowances: 2, // 2 Protected pre/post slots
  }));

  (await redeemTeacherCode(protectedUser, codeWithProtected.code));
  const commSummary = (await getUserCommercialSummary(protectedUser));

  // Both writing and speaking total must include the 2 protected slots
  assert.strictEqual(commSummary.writingBalance.protectedPrepost, 2, '2 protected pre/post writing slots identified');
  assert.strictEqual(commSummary.speakingBalance.protectedPrepost, 2, '2 protected pre/post speaking slots identified');
  assert.strictEqual(commSummary.writingBalance.discretionary, 4, '4 discretionary writing allowances identified');
  assert.strictEqual(commSummary.speakingBalance.discretionary, 2, '2 discretionary speaking allowances identified');
  assert.strictEqual(commSummary.writingBalance.total, 6, 'Total writing = 4 discretionary + 2 protected');
  assert.strictEqual(commSummary.speakingBalance.total, 4, 'Total speaking = 2 discretionary + 2 protected');
  console.log('✓ Passed: Protected pre/post-test allowances tracked separately from self-study balances.');

  // ---------------------------------------------------------------------
  // TEST 12: Compensating Ledger Refunds (Unused vs Consumed Allowances)
  // ---------------------------------------------------------------------
  console.log('\nTest 12: Compensating ledger refunds without deleting history...');
  const refundLearnerId = uuidv4();
  (await db.prepare(`INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'dummy', 'Refund User', 'student')`).run(refundLearnerId, `refund_${Date.now()}@test.com`));

  const refundableProduct = (await createProduct(adminId, {
    sku: `SKU-REF-${Date.now()}`,
    title: 'Refundable Plan',
    productType: 'paid_plan',
    priceAmount: 200000,
    currency: 'IDR',
    durationDays: 30,
    writingAllowances: 4,
    speakingAllowances: 2,
    grantsCatalogueAccess: true,
    renewalType: 'manual',
  }));
  (await publishProduct(adminId, refundableProduct.id));

  const orderToRefund = await createOrder(refundLearnerId, refundableProduct.id, 'mock');
  await processPaymentWebhook('mock', {
    order_id: orderToRefund.order.id,
    transaction_status: 'paid',
    payment_method: 'qris',
    gross_amount: 200000,
  });

  // Verify initial balances before refund
  const beforeRefundCommercial = (await getUserCommercialSummary(refundLearnerId));
  assert.strictEqual(beforeRefundCommercial.writingBalance.total, 4);
  assert.strictEqual(beforeRefundCommercial.speakingBalance.total, 2);
  assert.strictEqual(beforeRefundCommercial.hasCatalogueAccess, true);

  // Consume 1 writing allowance before refund
  (await db.prepare(`
    INSERT INTO writing_allowance_ledger (
      id, user_id, amount, balance_after, transaction_type, notes, created_at
    ) VALUES (?, ?, -1, 3, 'consumption', 'Student essay evaluated', datetime('now'))
  `).run(uuidv4(), refundLearnerId));

  // Execute compensating refund
  const refundResult = await refundOrder({
    adminId,
    orderId: orderToRefund.order.id,
    reason: 'Student cancelled within cooling-off period',
  });

  assert.strictEqual(refundResult.order.status, 'refunded', 'Order marked refunded');
  assert.strictEqual(refundResult.refundAudit.remainingWritingAllowancesRevoked, 3, 'Revoked remaining 3 writing allowances');
  assert.strictEqual(refundResult.refundAudit.remainingSpeakingAllowancesRevoked, 2, 'Revoked remaining 2 speaking allowances');
  assert.strictEqual(refundResult.refundAudit.consumedAllowancesRevoked, 1, 'Audited 1 consumed allowance');

  const afterRefundCommercial = (await getUserCommercialSummary(refundLearnerId));
  assert.strictEqual(afterRefundCommercial.writingBalance.total, 0, 'Writing balance returned to 0 (no negative balance)');
  assert.strictEqual(afterRefundCommercial.speakingBalance.total, 0, 'Speaking balance returned to 0');
  assert.strictEqual(afterRefundCommercial.hasCatalogueAccess, false, 'Catalogue access revoked');

  // Verify ledger retains complete immutable audit history
  const refundLedgerEntries = (await db.prepare('SELECT * FROM writing_allowance_ledger WHERE user_id = ?').all(refundLearnerId)) as any[];
  assert(refundLedgerEntries.some((e) => e.notes && e.notes.includes('Compensating')), 'Ledger contains explicit compensating entry');
  console.log('✓ Passed: Compensating refund processed safely without negative balances or history loss.');

  // ---------------------------------------------------------------------
  // TEST 13: Separation of Class Assignment Access from Commercial Plan Access
  // ---------------------------------------------------------------------
  console.log('\nTest 13: Separation of class assignment access from commercial plan access...');
  const freeLearner = uuidv4();
  const freeEmail = `free_learner_${Date.now()}@test.com`;
  (await db.prepare(`INSERT INTO users (id, email, password_hash, full_name, role) VALUES (?, ?, 'dummy', 'Free Learner', 'student')`).run(freeLearner, freeEmail));

  // Non-free practice test
  const testId = uuidv4();
  (await db.prepare(`
    INSERT INTO reading_tests (id, title, test_type, category, is_free_tier, created_by_id, created_at, updated_at)
    VALUES (?, 'Exclusive Academic Mock 10', 'academic', 'mock', 0, ?, datetime('now'), datetime('now'))
  `).run(testId, teacherId));

  // 1. Direct catalogue access without paid plan -> DENIED
  const directAccess = (await canUserAccessTest({
    userId: freeLearner,
    isTeacherOrAdmin: false,
    isFreeTier: false,
  }));
  assert.strictEqual(directAccess.allowed, false, 'Free learner cannot access non-free catalogue item directly');
  assert(directAccess.reason?.includes('Paid Practice Plan'), 'Rejection message explains plan requirement');

  // 2. Class teacher assigns this test to a class and enrols free learner
  const testClass = (await createClass(teacherId, {
    title: 'IELTS Band 7 Class',
    testType: 'academic',
  }));
  (await enrolStudentByEmail(teacherId, testClass.id, freeEmail));

  const { assignment: classAssignment } = (await createAssignment(teacherId, testClass.id, {
    title: 'Mandatory Reading Mock',
    purpose: 'practice',
    skill: 'reading',
    testId,
  }));

  // 3. Free learner accesses test via assignment -> ALLOWED!
  const assignmentAccess = (await canUserAccessTest({
    userId: freeLearner,
    isTeacherOrAdmin: false,
    isFreeTier: false,
    assignmentId: classAssignment.id,
  }));
  assert.strictEqual(assignmentAccess.allowed, true, 'Enrolled student accesses assignment test regardless of plan');

  // 4. Free tier test -> ALLOWED for everyone
  const freeTierAccess = (await canUserAccessTest({
    userId: freeLearner,
    isTeacherOrAdmin: false,
    isFreeTier: true,
  }));
  assert.strictEqual(freeTierAccess.allowed, true, 'Free tier test accessible by any registered learner');

  // Clean up temporary mock test
  (await db.prepare('DELETE FROM assignments WHERE test_id = ?').run(testId));
  (await db.prepare('DELETE FROM reading_tests WHERE id = ?').run(testId));

  console.log('✓ Passed: Class assignments and free-tier items strictly separated from commercial plan rules.');

  // ---------------------------------------------------------------------
  // ADMIN SUMMARY & AUDITED ADJUSTMENT VERIFICATION
  // ---------------------------------------------------------------------
  console.log('\nAdmin Commercial Summary & Balance Adjustment check...');
  const adminSummary = (await getAdminCommercialSummary());
  assert(adminSummary.activeSubscribersCount >= 1, 'Active subscribers tallied');
  assert(adminSummary.totalRevenueByCurrency['IDR'] > 0, 'Revenue by currency aggregated');
  assert(adminSummary.teacherCodes.length > 0, 'Teacher codes listed in admin summary');

  // Staff audited balance adjustment
  const adjResult = (await adjustUserBalance({
    adminId,
    userId: freeLearner,
    skill: 'writing',
    amount: 2,
    reason: 'Compensation for technical outage during mock exam',
  }));
  assert.strictEqual(adjResult.success, true);
  assert.strictEqual(adjResult.newBalance, 2);
  const updatedFreeBal = (await getUserAllowanceBalance(freeLearner));
  assert.strictEqual(updatedFreeBal.available, 2, 'Free learner received audited adjustment');
  console.log('✓ Passed: Admin commercial summary and audited balance adjustments verified.');

  console.log('\n=============================================================');
  console.log('  MILESTONE 7 VERIFICATION COMPLETE: ALL 13 ACCEPTANCE TESTS PASSED!  ');
  console.log('=============================================================\n');
}

// Allow direct CLI execution
async function runEntryPoint() {
if (require.main === module || process.env.NODE_ENV === 'test') {
  await runCommercialTestSuite();
}

}
export const testCompleted = runEntryPoint();
testCompleted.catch(error => { console.error(error); process.exitCode = 1; });
