import type { PdfFileRecord } from "./types";

let counter = 0;

export function createPdfFileRecord(file: File): PdfFileRecord {
  counter += 1;

  return {
    id: `pdf-${counter}-${Date.now()}`,
    file,
    name: file.name,
    size: file.size,
    status: "queued",
  };
}
