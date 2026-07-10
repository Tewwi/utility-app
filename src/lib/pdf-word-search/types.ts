export type PdfWordSearchOptions = {
  caseSensitive: boolean;
  wholeWord: boolean;
  enableOcr: boolean;
  ocrLanguages: string[];
};

export type PdfFileRecord = {
  id: string;
  file: File;
  name: string;
  size: number;
  status: "queued" | "reading" | "ocr" | "complete" | "error";
  error?: string;
};

export type PdfPageText = {
  fileId: string;
  fileName: string;
  pageNumber: number;
  text: string;
  source: "text-layer" | "ocr";
};

export type SearchTermResult = {
  term: string;
  count: number;
  fileCount: number;
  matchesByFile: SearchTermFileResult[];
  percentage: number;
};

export type SearchTermFileResult = {
  fileId: string;
  fileName: string;
  count: number;
  pages: number[];
};
