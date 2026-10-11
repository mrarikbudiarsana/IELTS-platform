export interface CambridgeTestInfo {
  series: number;
  testNumber: number;
}

/**
 * Extracts Cambridge IELTS series and test number from title.
 * Examples:
 * - "Cambridge IELTS 21 Academic Reading Test 4" -> { series: 21, testNumber: 4 }
 * - "Cambridge 21 Academic Listening Test 1" -> { series: 21, testNumber: 1 }
 */
export function parseCambridgeTestInfo(title: string): CambridgeTestInfo | null {
  if (!title) return null;
  const seriesMatch = title.match(/Cambridge(?:\s+IELTS)?\s*(\d+)/i);
  const testMatch = title.match(/Test\s*(\d+)/i);

  if (seriesMatch && testMatch) {
    return {
      series: parseInt(seriesMatch[1], 10),
      testNumber: parseInt(testMatch[1], 10),
    };
  }
  return null;
}

/**
 * Comparator for test ordering:
 * Order: Latest <-- earliest
 * 1. Latest Cambridge series first (e.g. 21 before 20).
 * 2. Within each series: Test 4 is latest, Test 1 is earliest (so Test 4, Test 3, Test 2, Test 1).
 * 3. Fallback to createdAt descending.
 */
export function compareTestsChronological<T extends { title: string; createdAt?: string }>(
  a: T,
  b: T
): number {
  const infoA = parseCambridgeTestInfo(a.title);
  const infoB = parseCambridgeTestInfo(b.title);

  if (infoA && infoB) {
    // 1. Series descending: Latest series first (e.g. Cambridge 21 before Cambridge 20)
    if (infoA.series !== infoB.series) {
      return infoB.series - infoA.series;
    }
    // 2. Within each series: 4 is latest, 1 is earliest (descending: 4 > 3 > 2 > 1)
    if (infoA.testNumber !== infoB.testNumber) {
      return infoB.testNumber - infoA.testNumber;
    }
  }

  // Cambridge tests prioritized over non-Cambridge
  if (infoA && !infoB) return -1;
  if (!infoA && infoB) return 1;

  // Fallback to createdAt descending
  if (a.createdAt && b.createdAt) {
    const timeA = new Date(a.createdAt).getTime();
    const timeB = new Date(b.createdAt).getTime();
    if (!isNaN(timeA) && !isNaN(timeB) && timeA !== timeB) {
      return timeB - timeA;
    }
  }

  return a.title.localeCompare(b.title);
}

/**
 * Sorts an array of tests chronologically:
 * Latest series and latest test numbers first (Test 4 -> Test 3 -> Test 2 -> Test 1).
 */
export function sortTestsChronological<T extends { title: string; createdAt?: string }>(
  tests: T[]
): T[] {
  return [...tests].sort(compareTestsChronological);
}
