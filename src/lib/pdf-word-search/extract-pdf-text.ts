import type { PdfPageText } from "./types";

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

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).href;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

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

    pages.push({
      fileId,
      fileName,
      pageNumber: i,
      text,
      source: "text-layer",
    });
  }

  return { pages, totalPages };
}
