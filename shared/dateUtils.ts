/**
 * IELTS Preparation Platform - Date & Time Utilities
 * Display scheduling in Asia/Makassar (WITA, UTC+8) while storing timestamps in ISO 8601 UTC.
 */

export const MAKASSAR_TIMEZONE = 'Asia/Makassar';

/**
 * Formats an ISO date string into a localized Asia/Makassar date and time string.
 * Example: "08 Oct 2026, 15:30 WITA"
 */
export function formatMakassarDateTime(isoDateStr?: string | null): string {
  if (!isoDateStr) return '—';
  try {
    const date = new Date(isoDateStr);
    if (isNaN(date.getTime())) return '—';

    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: MAKASSAR_TIMEZONE,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    return `${formatter.format(date)} WITA`;
  } catch (err) {
    return String(isoDateStr);
  }
}

/**
 * Formats an ISO date string into a localized Asia/Makassar date string.
 * Example: "08 Oct 2026"
 */
export function formatMakassarDate(isoDateStr?: string | null): string {
  if (!isoDateStr) return '—';
  try {
    const date = new Date(isoDateStr);
    if (isNaN(date.getTime())) return '—';

    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: MAKASSAR_TIMEZONE,
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    return formatter.format(date);
  } catch (err) {
    return String(isoDateStr);
  }
}

/**
 * Checks if a given deadline timestamp in ISO is overdue relative to now.
 */
export function isOverdue(deadlineIso?: string | null): boolean {
  if (!deadlineIso) return false;
  const deadline = new Date(deadlineIso).getTime();
  if (isNaN(deadline)) return false;
  return Date.now() > deadline;
}

/**
 * Checks if an assignment is currently released based on releaseAt timestamp and isReleased boolean flag.
 */
export function isAssignmentAvailable(releaseAtIso: string, isReleasedFlag: boolean): boolean {
  if (!isReleasedFlag) return false;
  const releaseTime = new Date(releaseAtIso).getTime();
  if (isNaN(releaseTime)) return false;
  return Date.now() >= releaseTime;
}
