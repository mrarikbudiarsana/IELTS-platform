import type { ReadingPdfImportResult } from '../../shared/readingPdfImport';
import type { TextImportResults, TextImportSkill } from '../../shared/textImport';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export function getStoredToken(): string | null {
  return localStorage.getItem('ielts_auth_token');
}

export function setStoredToken(token: string | null) {
  if (token) {
    localStorage.setItem('ielts_auth_token', token);
  } else {
    localStorage.removeItem('ielts_auth_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

type ImportSkill = TextImportSkill | 'reading';
const pendingImportKey = (skill: ImportSkill) => {
  let userId = 'signed-out';
  try { userId = JSON.parse(atob(getStoredToken()!.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).id || userId; } catch { /* No current session. */ }
  return `ielts_import_${userId}_${skill}`;
};
async function waitForImport<T>(jobId: string, storageKey: string): Promise<T> {
  const deadline = Date.now() + 12 * 60 * 1000;
  let dispatched = false;
  while (Date.now() < deadline) {
    let response: Response;
    try {
      const token = getStoredToken();
      response = await fetch(`${API_BASE}/imports/${encodeURIComponent(jobId)}`, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }, signal: AbortSignal.timeout(15_000),
      });
    } catch {
      await new Promise(resolve => setTimeout(resolve, 2500));
      continue;
    }
    const data = await response.json().catch(() => ({}));
    if (response.status >= 500 || response.status === 429) {
      await new Promise(resolve => setTimeout(resolve, 2500));
      continue;
    }
    if (!response.ok || data.status === 'failed') {
      if (localStorage.getItem(storageKey) === jobId) localStorage.removeItem(storageKey);
      throw new Error(data.error || 'Import failed. Please retry.');
    }
    if (data.status === 'completed') {
      if (localStorage.getItem(storageKey) === jobId) localStorage.removeItem(storageKey);
      return data.result as T;
    }
    if (data.status === 'queued' && data.dispatch && !dispatched) {
      // Use the user's existing protected-site session; keep the job grant in memory only.
      if (data.dispatch.path !== '/.netlify/functions/import-questions-background' || typeof data.dispatch.token !== 'string') {
        throw new Error('Invalid extraction worker configuration.');
      }
      try {
        const started = await fetch(data.dispatch.path, {
          method: 'POST', credentials: 'same-origin', redirect: 'error',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${data.dispatch.token}` },
          body: JSON.stringify({ jobId }), signal: AbortSignal.timeout(15_000),
        });
        if (!started.ok) throw new Error(`Extraction worker returned HTTP ${started.status}. Refresh this page to restore your site session and retry.`);
        dispatched = true;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Could not start extraction. Reopen this editor to retry.');
      }
    }
    await new Promise(resolve => setTimeout(resolve, 2500));
  }
  throw new Error('Extraction is taking longer than expected. Reopen this editor to check the running import.');
}
function resumeImport<T>(skill: ImportSkill): Promise<T> | null {
  const key = pendingImportKey(skill);
  const jobId = localStorage.getItem(key);
  return jobId ? waitForImport<T>(jobId, key) : null;
}
async function importSource<T>(skill: ImportSkill, source: 'text' | 'pdf', body: object): Promise<T> {
  const key = pendingImportKey(skill);
  const { jobId } = await request<{ jobId: string }>(`/imports/${skill}/${source}`, {
    method: 'POST', body: JSON.stringify(body), signal: AbortSignal.timeout(30_000),
  });
  localStorage.setItem(key, jobId);
  return waitForImport<T>(jobId, key);
}

export const api = {
  resumeEditorImport: <K extends TextImportSkill>(skill: K) => resumeImport<TextImportResults[K]>(skill),
  resumeReadingImport: () => resumeImport<ReadingPdfImportResult>('reading'),
  importEditorPdf: <K extends TextImportSkill>(skill: K, body: { pdfBase64: string; focus: string }) => importSource<TextImportResults[K]>(skill, 'pdf', body),
  importEditorText: <K extends TextImportSkill>(skill: K, body: { text: string; focus: string }) => importSource<TextImportResults[K]>(skill, 'text', body),
  // Auth
  register: (body: any) => request<{ user: any; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<{ user: any; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request<{ user: any }>('/auth/me'),
  updateProfile: (body: { targetBand?: number | null; testDate?: string | null; testTypePreference?: string }) => request<{ user: any }>('/auth/profile', { method: 'PATCH', body: JSON.stringify(body) }),
  forgotPassword: (email: string) => request<{ message: string; resetToken?: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (body: any) => request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  elevate: (body: { secretKey?: string; targetRole: string }) => request<{ message: string; user: any; token: string }>('/auth/elevate', { method: 'POST', body: JSON.stringify(body) }),

  // Reading Tests
  importReadingText: (body: { text: string; focus: string }) => importSource<ReadingPdfImportResult>('reading', 'text', body),
  importReadingPdf: (body: { pdfBase64: string; focus: string }) => importSource<ReadingPdfImportResult>('reading', 'pdf', body),
  getTests: (params?: { testType?: string; category?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<{ tests: any[] }>(`/reading/tests${q ? `?${q}` : ''}`);
  },
  getTest: (id: string) => request<{ test: any; version: any }>(`/reading/tests/${id}`),
  createTest: (body: any) => request<{ test: any; version: any }>('/reading/tests', { method: 'POST', body: JSON.stringify(body) }),
  updateDraft: (testId: string, versionId: string, body: any) => request<{ version: any; errors: string[] }>(`/reading/tests/${testId}/versions/${versionId}`, { method: 'PUT', body: JSON.stringify(body) }),
  forkDraft: (testId: string) => request<{ message: string; version: any }>(`/reading/tests/${testId}/fork`, { method: 'POST' }),
  publishVersion: (testId: string, versionId: string) => request<{ message: string }>(`/reading/tests/${testId}/versions/${versionId}/publish`, { method: 'POST' }),
  archiveTest: (testId: string) => request<{ message: string }>(`/reading/tests/${testId}/archive`, { method: 'POST' }),

  // Reading Attempts
  startAttempt: (testId: string, options?: { modeOverride?: string; assignmentId?: string; packageAttemptId?: string } | string) => {
    const body = typeof options === 'string' ? { modeOverride: options } : options || {};
    return request<{ attempt: any; testVersion: any }>(`/reading/tests/${testId}/start`, { method: 'POST', body: JSON.stringify(body) });
  },
  getAttempt: (id: string) => request<{ attempt: any; testVersion: any }>(`/attempts/${id}`),
  saveAnswer: (attemptId: string, body: any) => request<{ saved: boolean; isExpired?: boolean }>(`/attempts/${attemptId}/save`, { method: 'POST', body: JSON.stringify(body) }),
  submitAttempt: (attemptId: string) => request<{ attempt: any }>(`/attempts/${attemptId}/submit`, { method: 'POST' }),
  getAttempts: () => request<{ attempts: any[] }>('/attempts'),

  // Listening Tests
  getListeningTests: (params?: { category?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<{ tests: any[] }>(`/listening/tests${q ? `?${q}` : ''}`);
  },
  getListeningTest: (id: string) => request<{ test: any; version: any }>(`/listening/tests/${id}`),
  createListeningTest: (body: any) => request<{ test: any; version: any }>('/listening/tests', { method: 'POST', body: JSON.stringify(body) }),
  updateListeningDraft: (testId: string, versionId: string, body: any) => request<{ version: any; errors: string[] }>(`/listening/tests/${testId}/versions/${versionId}`, { method: 'PUT', body: JSON.stringify(body) }),
  forkListeningDraft: (testId: string) => request<{ message: string; version: any }>(`/listening/tests/${testId}/fork`, { method: 'POST' }),
  publishListeningVersion: (testId: string, versionId: string) => request<{ message: string }>(`/listening/tests/${testId}/versions/${versionId}/publish`, { method: 'POST' }),
  archiveListeningTest: (testId: string) => request<{ message: string }>(`/listening/tests/${testId}/archive`, { method: 'POST' }),

  // Listening Attempts
  startListeningAttempt: (testId: string, options?: { modeOverride?: string; assignmentId?: string; packageAttemptId?: string } | string) => {
    const body = typeof options === 'string' ? { modeOverride: options } : options || {};
    return request<{ attempt: any; testVersion: any }>(`/listening/tests/${testId}/start`, { method: 'POST', body: JSON.stringify(body) });
  },
  getListeningAttempt: (id: string) => request<{ attempt: any; testVersion: any }>(`/listening/attempts/${id}`),
  saveListeningAnswer: (attemptId: string, body: any) => request<{ saved: boolean; isExpired?: boolean }>(`/listening/attempts/${attemptId}/save`, { method: 'POST', body: JSON.stringify(body) }),
  recordListeningInterruption: (attemptId: string, body: any) => request<{ success: boolean }>(`/listening/attempts/${attemptId}/interruption`, { method: 'POST', body: JSON.stringify(body) }),
  submitListeningAttempt: (attemptId: string) => request<{ attempt: any }>(`/listening/attempts/${attemptId}/submit`, { method: 'POST' }),
  getListeningAttempts: () => request<{ attempts: any[] }>('/listening/attempts'),

  // Classes & Enrolment
  getClasses: () => request<{ classes: any[] }>('/classes'),
  getClass: (id: string) => request<{ class: any }>(`/classes/${id}`),
  createClass: (body: { title: string; description?: string; testType: string }) => request<{ class: any }>('/classes', { method: 'POST', body: JSON.stringify(body) }),
  updateClass: (id: string, body: any) => request<{ class: any }>(`/classes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  joinClass: (invitationCode: string) => request<{ class: any; message: string }>('/classes/join', { method: 'POST', body: JSON.stringify({ invitationCode }) }),
  enrolStudent: (classId: string, email: string) => request<{ enrolment: any; message: string }>(`/classes/${classId}/enrol`, { method: 'POST', body: JSON.stringify({ email }) }),
  removeStudent: (classId: string, studentId: string) => request<{ message: string }>(`/classes/${classId}/enrolments/${studentId}`, { method: 'DELETE' }),
  getClassEnrolments: (classId: string) => request<{ enrolments: any[] }>(`/classes/${classId}/enrolments`),
  getClassOverview: (classId: string) => request<any>(`/classes/${classId}/overview`),

  // Test Packages
  getTestPackages: (testType?: string) => {
    const q = testType ? `?testType=${encodeURIComponent(testType)}` : '';
    return request<{ testPackages: any[] }>(`/test-packages${q}`);
  },
  getTestPackage: (id: string) => request<{ testPackage: any }>(`/test-packages/${id}`),
  createTestPackage: (body: any) => request<{ testPackage: any }>('/test-packages', { method: 'POST', body: JSON.stringify(body) }),

  // Assignments
  getClassAssignments: (classId: string) => request<{ assignments: any[] }>(`/classes/${classId}/assignments`),
  getAssignment: (id: string) => request<{ assignment: any }>(`/assignments/${id}`),
  createAssignment: (classId: string, body: any) => request<{ assignment: any; warning?: string }>(`/classes/${classId}/assignments`, { method: 'POST', body: JSON.stringify(body) }),
  releaseAssignment: (assignmentId: string) => request<{ assignment: any; message: string }>(`/assignments/${assignmentId}/release`, { method: 'POST' }),
  startPackageAttempt: (assignmentId: string, mode?: string) => request<{ packageAttempt: any; testPackage: any }>(`/assignments/${assignmentId}/start-package`, { method: 'POST', body: JSON.stringify({ mode }) }),
  getPackageAttempt: (attemptId: string) => request<{ packageAttempt: any }>(`/package-attempts/${attemptId}`),
  getComparisonReport: (classId: string, studentId: string) => request<{ report: any }>(`/classes/${classId}/students/${studentId}/comparison`),

  // Admin & Teacher
  getAdminUsers: () => request<{ users: any[] }>('/admin/users'),
  updateUserRole: (userId: string, role: string) => request<{ message: string }>(`/admin/users/${userId}/role`, { method: 'POST', body: JSON.stringify({ role }) }),
  getTeacherAttempts: () => request<{ attempts: any[] }>('/teacher/attempts'),
  getTeacherListeningAttempts: () => request<{ attempts: any[] }>('/teacher/listening-attempts'),

  // Speaking Sets
  getSpeakingSets: (params?: { status?: string; includeArchived?: boolean }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<{ sets: any[] }>(`/speaking/sets${q ? `?${q}` : ''}`);
  },
  getSpeakingSet: (id: string) => request<{ set: any }>(`/speaking/sets/${id}`),
  getSpeakingSetVersion: (id: string, versionId: string) => request<{ version: any }>(`/speaking/sets/${id}/versions/${versionId}`),
  createSpeakingSet: (body: any) => request<{ set: any; version: any }>('/speaking/sets', { method: 'POST', body: JSON.stringify(body) }),
  updateSpeakingDraft: (id: string, versionId: string, body: any) => request<{ version: any; errors: string[] }>(`/speaking/sets/${id}/versions/${versionId}`, { method: 'PUT', body: JSON.stringify(body) }),
  publishSpeakingSet: (id: string, versionId: string) => request<{ message: string }>(`/speaking/sets/${id}/publish`, { method: 'POST', body: JSON.stringify({ versionId }) }),
  forkSpeakingDraft: (id: string) => request<{ version: any }>(`/speaking/sets/${id}/fork`, { method: 'POST' }),
  archiveSpeakingSet: (id: string) => request<{ message: string }>(`/speaking/sets/${id}/archive`, { method: 'POST' }),

  // Speaking Assessments
  recordSpeakingAssessment: (body: any) => request<{ assessment: any }>('/speaking/assessments', { method: 'POST', body: JSON.stringify(body) }),
  releaseSpeakingAssessment: (id: string) => request<{ assessment: any; message: string }>(`/speaking/assessments/${id}/release`, { method: 'POST' }),
  correctSpeakingScores: (id: string, body: { updatedScores: any; reason: string }) => request<{ assessment: any; message: string }>(`/speaking/assessments/${id}/correct`, { method: 'POST', body: JSON.stringify(body) }),
  getSpeakingAssessment: (id: string) => request<{ assessment: any }>(`/speaking/assessments/${id}`),
  getTeacherSpeakingQueue: (params?: { classId?: string; status?: string; sessionType?: string }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<{ queue: any[] }>(`/speaking/teacher/queue${q ? `?${q}` : ''}`);
  },
  getMySpeakingAssessments: () => request<{ assessments: any[] }>('/speaking/my-assessments'),

  // Live AI Speaking Simulation (Milestone 6)
  runVoiceTrial: (body: any) => request<any>('/speaking/voice-trial', { method: 'POST', body: JSON.stringify(body) }),
  getSpeakingRealtimeToken: () => request<any>('/speaking/realtime/token', { method: 'POST' }),
  startSpeakingSession: (body: any) => request<{ session: any }>('/speaking/sessions', { method: 'POST', body: JSON.stringify(body) }),
  getSpeakingSession: (id: string) => request<{ session: any }>(`/speaking/sessions/${id}`),
  advanceSpeakingStage: (id: string, targetStage: string) => request<{ session: any }>(`/speaking/sessions/${id}/stage`, { method: 'POST', body: JSON.stringify({ targetStage }) }),
  savePart2Notes: (id: string, notes: string) => request<{ message: string }>(`/speaking/sessions/${id}/part2-notes`, { method: 'POST', body: JSON.stringify({ notes }) }),
  submitSpeakingTurn: (id: string, body: any) => request<{ session: any; examinerTurn: any; acoustic: any }>(`/speaking/sessions/${id}/turn`, { method: 'POST', body: JSON.stringify(body) }),
  finishSpeakingSession: (id: string) => request<{ assessment: any; message: string }>(`/speaking/sessions/${id}/finish`, { method: 'POST' }),
  abandonSpeakingSession: (id: string, reason?: string) => request<{ message: string }>(`/speaking/sessions/${id}/abandon`, { method: 'POST', body: JSON.stringify({ reason }) }),
  getSpeakingAllowanceBalance: () => request<{ balance: { totalGranted: number; totalConsumed: number; totalReserved: number; available: number } }>('/speaking/allowances/balance'),
  grantSpeakingAllowance: (body: { userId: string; amount: number; notes?: string }) => request<{ ledgerEntry: any; balance: any }>('/speaking/allowances/grant', { method: 'POST', body: JSON.stringify(body) }),

  // Writing Tasks
  getWritingTasks: (params?: { status?: string; taskType?: string; testType?: string; taskNumber?: number }) => {
    const q = new URLSearchParams(params as any).toString();
    return request<{ tasks: any[] }>(`/writing/tasks${q ? `?${q}` : ''}`);
  },
  getWritingTask: (id: string) => request<{ task: any }>(`/writing/tasks/${id}`),
  createWritingTask: (body: any) => request<{ task: any }>('/writing/tasks', { method: 'POST', body: JSON.stringify(body) }),
  updateWritingDraft: (id: string, body: any) => request<{ task: any }>(`/writing/tasks/${id}/draft`, { method: 'PUT', body: JSON.stringify(body) }),
  publishWritingTask: (id: string) => request<{ task: any }>(`/writing/tasks/${id}/publish`, { method: 'POST' }),
  forkWritingDraft: (id: string) => request<{ task: any }>(`/writing/tasks/${id}/fork`, { method: 'POST' }),
  archiveWritingTask: (id: string) => request<{ task: any }>(`/writing/tasks/${id}/archive`, { method: 'POST' }),

  // Writing Attempts & Responses
  startWritingAttempt: (body: { mode?: string; task1Id?: string; task2Id?: string; assignmentId?: string; packageAttemptId?: string; durationMinutes?: number }) =>
    request<{ attempt: any }>('/writing/attempts', { method: 'POST', body: JSON.stringify(body) }),
  getWritingAttempts: () => request<{ attempts: any[] }>('/writing/attempts'),
  getWritingAttempt: (id: string) => request<{ attempt: any }>(`/writing/attempts/${id}`),
  saveWritingDraft: (attemptId: string, body: { taskNumber: number; responseText: string }) =>
    request<{ responseId: string; wordCount: number; lastSavedAt: string }>(`/writing/attempts/${attemptId}/save`, { method: 'POST', body: JSON.stringify(body) }),
  submitWritingAttempt: (attemptId: string) =>
    request<{ attempt: any }>(`/writing/attempts/${attemptId}/submit`, { method: 'POST' }),
  createWritingRevision: (attemptId: string, taskNumber: number) =>
    request<{ response: any }>(`/writing/attempts/${attemptId}/revisions`, { method: 'POST', body: JSON.stringify({ attemptId, taskNumber }) }),

  // AI Writing Assessment
  requestWritingAssessment: (responseId: string) =>
    request<{ assessment: any }>('/writing/assessments/request', { method: 'POST', body: JSON.stringify({ responseId }) }),
  getWritingAssessment: (id: string) =>
    request<{ assessment: any }>(`/writing/assessments/${id}`),

  // Allowances
  getWritingAllowanceBalance: () =>
    request<{ balance: { totalGranted: number; totalConsumed: number; totalReserved: number; available: number } }>('/writing/allowances/balance'),
  getMyAllowanceBalance: () =>
    request<{ balance: { totalGranted: number; totalConsumed: number; totalReserved: number; available: number } }>('/writing/allowances/balance'),
  getWritingAllowanceLedger: () =>
    request<{ ledger: any[] }>('/writing/allowances/ledger'),
  grantWritingAllowance: (body: { userId: string; amount: number; notes?: string }) =>
    request<{ entry: any; balance: any }>('/writing/allowances/grant', { method: 'POST', body: JSON.stringify(body) }),

  // Commercial Products & Checkout (Milestone 7)
  getCommercialProducts: () => request<{ products: any[] }>('/commerce/products'),
  createCommercialProduct: (body: any) => request<{ product: any }>('/commerce/products', { method: 'POST', body: JSON.stringify(body) }),
  updateCommercialProduct: (id: string, body: any) => request<{ product: any }>(`/commerce/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  publishCommercialProduct: (id: string) => request<{ product: any }>(`/commerce/products/${id}/publish`, { method: 'POST' }),
  archiveCommercialProduct: (id: string) => request<{ product: any }>(`/commerce/products/${id}/archive`, { method: 'POST' }),
  getCheckoutPreview: (productId: string) => request<any>(`/commerce/checkout/preview/${productId}`),
  createOrder: (body: { productId: string; provider?: string }) => request<{ order: any; checkoutUrl: string }>('/commerce/checkout/create-order', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => request<{ orders: any[] }>('/commerce/orders/my'),
  getOrder: (id: string) => request<{ order: any }>(`/commerce/orders/${id}`),
  reconcileOrder: (id: string) => request<{ order: any }>(`/commerce/orders/${id}/reconcile`, { method: 'POST' }),
  refundOrder: (id: string, body: { reason: string; amount?: number }) => request<any>(`/commerce/orders/${id}/refund`, { method: 'POST', body: JSON.stringify(body) }),

  // Teacher Codes
  getTeacherCodes: () => request<{ codes: any[] }>('/commerce/codes'),
  createTeacherCode: (body: any) => request<{ code: any }>('/commerce/codes', { method: 'POST', body: JSON.stringify(body) }),
  updateTeacherCode: (id: string, body: any) => request<{ code: any }>(`/commerce/codes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  revokeTeacherCode: (id: string) => request<{ code: any }>(`/commerce/codes/${id}/revoke`, { method: 'POST' }),
  previewTeacherCode: (code: string) => request<any>(`/commerce/codes/${encodeURIComponent(code)}/preview`),
  redeemTeacherCode: (code: string) => request<{ success: boolean; code: any; message: string }>('/commerce/codes/redeem', { method: 'POST', body: JSON.stringify({ code }) }),

  // Entitlements & Admin Operations
  getMyCommercialEntitlements: () => request<any>('/commerce/entitlements/my'),
  getAdminCommercialSummary: () => request<any>('/commerce/admin/summary'),
  adjustUserBalance: (body: { userId: string; skill: 'writing' | 'speaking'; amount: number; reason: string }) =>
    request<{ success: boolean; newBalance: number }>('/commerce/admin/adjust-balance', { method: 'POST', body: JSON.stringify(body) }),
};



