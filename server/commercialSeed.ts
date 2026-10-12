import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import {
  createProduct,
  publishProduct,
  createTeacherCode,
  listProducts,
  listTeacherCodes,
} from './commercialService';

export async function seedCommercialProductsAndCodes() {
  const existingProducts = (await listProducts(true));
  const adminUser = (await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get()) as any;
  const adminId = adminUser?.id || uuidv4();

  // 1. Seed Paid Practice Plan (Pilot Sandbox)
  if (!existingProducts.some((p) => p.sku === 'paid_plan_pilot_30d')) {
    const plan = (await createProduct(adminId, {
      sku: 'paid_plan_pilot_30d',
      title: 'IELTS Comprehensive Practice Plan (30 Days)',
      description: 'Complete access to all published Reading and Listening mocks, plus 5 AI Writing assessments and 3 Live AI Speaking simulation sessions.',
      productType: 'paid_plan',
      priceAmount: 149000, // IDR 149,000 (~$9.50)
      currency: 'IDR',
      durationDays: 30,
      writingAllowances: 5,
      speakingAllowances: 3,
      grantsCatalogueAccess: true,
      renewalType: 'manual',
    }));
    (await publishProduct(adminId, plan.id));
  }

  // 2. Seed Individual Writing Assessment
  if (!existingProducts.some((p) => p.sku === 'single_writing_assessment')) {
    const writingProduct = (await createProduct(adminId, {
      sku: 'single_writing_assessment',
      title: 'Individual AI Writing Task Assessment',
      description: 'Detailed official 4-criteria evaluation for Academic Task 1, General Training Task 1, or Task 2 essay with evidence quotes and actionable sentence corrections.',
      productType: 'writing_assessment',
      priceAmount: 25000, // IDR 25,000 (~$1.60)
      currency: 'IDR',
      durationDays: undefined, // Non-expiring per-assessment credit
      writingAllowances: 1,
      speakingAllowances: 0,
      grantsCatalogueAccess: false, // Does not unlock full catalogue
      renewalType: 'manual',
    }));
    (await publishProduct(adminId, writingProduct.id));
  }

  // 3. Seed Individual AI Speaking Session
  if (!existingProducts.some((p) => p.sku === 'single_speaking_session')) {
    const speakingProduct = (await createProduct(adminId, {
      sku: 'single_speaking_session',
      title: 'Individual Live AI Speaking Simulation Session',
      description: 'Complete 3-part live examiner conversation with acoustic rhythm evaluation, phonemic clarity observations, and 4-criteria official score breakdown.',
      productType: 'speaking_session',
      priceAmount: 59000, // IDR 59,000 (~$3.75)
      currency: 'IDR',
      durationDays: undefined,
      writingAllowances: 0,
      speakingAllowances: 1,
      grantsCatalogueAccess: false,
      renewalType: 'manual',
    }));
    (await publishProduct(adminId, speakingProduct.id));
  }

  // 4. Seed Unconfigured Draft Product (Unpublished - cannot be purchased)
  if (!existingProducts.some((p) => p.sku === 'draft_unconfigured_bundle')) {
    (await createProduct(adminId, {
      sku: 'draft_unconfigured_bundle',
      title: 'Unconfigured Institutional Premium Bundle (Draft)',
      description: 'Pending administrative agreement on terms, pricing, and volume allowances.',
      productType: 'bundle',
      priceAmount: 0,
      currency: 'IDR',
      durationDays: 60,
      writingAllowances: 10,
      speakingAllowances: 5,
      grantsCatalogueAccess: true,
      renewalType: 'manual',
    }));
    // Deliberately NOT published!
  }

  // 5. Seed Demonstration Teacher Codes
  const existingCodes = (await listTeacherCodes(true));
  if (!existingCodes.some((c) => c.code === 'PILOT-INTENSIVE-2026')) {
    const classRow = (await db.prepare('SELECT id FROM classes LIMIT 1').get()) as any;
    (await createTeacherCode(adminId, {
      code: 'PILOT-INTENSIVE-2026',
      label: 'Cohort Pilot Access Pass',
      description: 'Complimentary pilot voucher providing 30 days full catalogue access, 3 discretionary Writing evaluations, 2 AI Speaking sessions, and 2 protected Pre/Post test allowances.',
      accessDurationDays: 30,
      maxRedemptions: 50,
      classId: classRow?.id || undefined,
      grantsCatalogueAccess: true,
      writingAllowances: 3,
      speakingAllowances: 2,
      protectedPrepostAllowances: 2,
    }));
  }

  // 6. Ensure sample tests have is_free_tier = 1 for free accounts
  (await db.prepare("UPDATE reading_tests SET is_free_tier = 1 WHERE title LIKE '%Practice%' OR category = 'practice'").run());
  (await db.prepare("UPDATE listening_tests SET is_free_tier = 1 WHERE title LIKE '%Practice%' OR category = 'practice'").run());
  (await db.prepare('UPDATE writing_tasks SET is_free_tier = 1 WHERE task_number = 1').run());
  (await db.prepare('UPDATE speaking_sets SET is_free_tier = 1 WHERE id IN (SELECT id FROM speaking_sets LIMIT 1)').run());
}
