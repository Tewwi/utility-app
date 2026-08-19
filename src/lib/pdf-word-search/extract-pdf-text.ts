import type { PdfPageText } from "./types";
import { isInvisibleTextScan } from "./is-invisible-text-scan";
import { createPdfDocumentLoadOptions } from "./create-pdf-document-load-options";
import { configurePdfJsLib } from "./configure-pdf-js-lib";

const OCR_TEXT_THRESHOLD = 20;

export async function extractPdfText(
  file: File,
  fileId: string,
  fileName: string,
  abortSignal?: AbortSignal,
): Promise<{
  pages: PdfPageText[];
  totalPages: number;
}> {
  const pdfjsLib = await import("pdfjs-dist");
  configurePdfJsLib(pdfjsLib);

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).href;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(
    createPdfDocumentLoadOptions(arrayBuffer),
  ).promise;

  if (abortSignal?.aborted) throw new DOMException("Aborted", "AbortError");

  const totalPages = pdf.numPages;
  const pages: PdfPageText[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (abortSignal?.aborted) throw new DOMException("Aborted", "AbortError");

    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const text = textContent.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    const operatorList =
      text.trim().length >= OCR_TEXT_THRESHOLD
        ? await page.getOperatorList()
        : null;

    pages.push({
      fileId,
      fileName,
      pageNumber: i,
      text,
      source: "text-layer",
      requiresOcr: operatorList
        ? isInvisibleTextScan(operatorList, pdfjsLib.OPS)
        : false,
    });
  }

  return { pages, totalPages };
}
