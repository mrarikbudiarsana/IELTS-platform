// Retain database records for content ownership and history, but retire demo access.
export const retiredDemoEmails = [
  'arik@ieltsplatform.test',
  'teacher@ieltsplatform.test',
  'student@ieltsplatform.test',
  'independent@ieltsplatform.test',
];

export function isRetiredDemoAccount(email: unknown): boolean {
  return typeof email === 'string' && retiredDemoEmails.includes(email.trim().toLowerCase());
}
