import { PDF_IMPORT_MAX_BYTES, parsePdfPages } from '../../../shared/readingPdfImport';

export async function prepareImportPdf(file: File, pages: string): Promise<string> {
  if (!file.name.toLowerCase().endsWith('.pdf')) throw new Error('Select a PDF file.');
  if (file.size > 30 * 1024 * 1024) throw new Error('Use a PDF smaller than 30 MB.');
  const { PDFDocument } = await import('pdf-lib');
  let original;
  try { original = await PDFDocument.load(await file.arrayBuffer()); }
  catch { throw new Error('This PDF is damaged or password protected. Select an unlocked PDF.'); }
  const selected = parsePdfPages(pages, original.getPageCount());
  const pdf = await PDFDocument.create();
  (await pdf.copyPages(original, selected)).forEach(page => pdf.addPage(page));
  const bytes = await pdf.save();
  if (bytes.length > PDF_IMPORT_MAX_BYTES) throw new Error('Selected pages exceed 3 MB. Select fewer pages or compress the PDF.');
  let binary = '';
  for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
  return btoa(binary);
}
