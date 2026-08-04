export type PdfWordSearchOptions = {
  enableOcr: boolean;
  ocrLanguages: string[];
};

export type SearchTermGroup = {
  id: string;
  searchTerms: string;
  caseSensitive: boolean;
  wholeWord: boolean;
};

export type CountSearchTermGroup = Omit<SearchTermGroup, "searchTerms"> & {
  terms: string[];
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
  requiresOcr?: boolean;
};

export type SearchTermResult = {
  id: string;
  groupId: string;
  term: string;
  caseSensitive: boolean;
  wholeWord: boolean;
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
