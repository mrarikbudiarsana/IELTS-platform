import type { ReadingPassage, QuestionGroup, ReadingTestType } from './types';

export const PDF_IMPORT_MAX_BYTES = 3 * 1024 * 1024;
export const PDF_IMPORT_MAX_PAGES = 20;
export interface ReadingPdfImportResult {
  title: string;
  testType: ReadingTestType;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
  warnings: string[];
}

// Page numbers refer to physical PDF pages, including covers and front matter.
export function parsePdfPages(value: string, pageCount: number): number[] {
  if (!value.trim()) {
    if (pageCount > PDF_IMPORT_MAX_PAGES) throw new Error('Select up to 20 pages, including the answer key.');
    return Array.from({ length: pageCount }, (_, i) => i);
  }
  const pages = new Set<number>();
  for (const part of value.split(',')) {
    const match = part.trim().match(/^(\d+)(?:\s*-\s*(\d+))?$/);
    if (!match) throw new Error('Use page numbers such as 5-12, 28.');
    const start = Number(match[1]);
    const end = Number(match[2] || match[1]);
    if (start < 1 || end < start || end > pageCount) throw new Error(`Pages must be between 1 and ${pageCount}.`);
    if (end - start + 1 > PDF_IMPORT_MAX_PAGES) throw new Error('Select up to 20 pages.');
    for (let page = start; page <= end; page++) pages.add(page - 1);
    if (pages.size > PDF_IMPORT_MAX_PAGES) throw new Error('Select up to 20 pages.');
  }
  return [...pages].sort((a, b) => a - b);
}
