import type { PdfPageText } from "./types";

type OcrWorker = {
  recognize: (image: string) => Promise<{ data: { text: string } }>;
};

export async function extractScannedPageText(
  file: File,
  fileId: string,
  fileName: string,
  pageNumber: number,
  ocrLanguages: string[],
  abortSignal?: AbortSignal,
  ocrWorker?: OcrWorker,
): Promise<PdfPageText> {
  const pdfjsLib = await import("pdfjs-dist");

  pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).href;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  if (abortSignal?.aborted) throw new DOMException("Aborted", "AbortError");

  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: 2 });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvas, viewport }).promise;

  if (abortSignal?.aborted) throw new DOMException("Aborted", "AbortError");

  const imageData = canvas.toDataURL("image/png");

  let result: { data: { text: string } };

  if (ocrWorker) {
    result = await ocrWorker.recognize(imageData);
  } else {
    const Tesseract = await import("tesseract.js");
    const langParam = ocrLanguages.length > 0 ? ocrLanguages.join("+") : "eng";
    result = await Tesseract.recognize(imageData, langParam, {
      logger: () => {},
    });
  }

  canvas.remove();

  return {
    fileId,
    fileName,
    pageNumber,
    text: result.data.text,
    source: "ocr",
  };
}
