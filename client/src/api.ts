const API_BASE = '/api';

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

export const api = {
  // Auth
  register: (body: any) => request<{ user: any; token: string }>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<{ user: any; token: string }>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  me: () => request<{ user: any }>('/auth/me'),
  forgotPassword: (email: string) => request<{ message: string; resetToken?: string }>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  resetPassword: (body: any) => request<{ message: string }>('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),
  elevate: (body: { secretKey?: string; targetRole: string }) => request<{ message: string; user: any; token: string }>('/auth/elevate', { method: 'POST', body: JSON.stringify(body) }),

  // Reading Tests
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
};

