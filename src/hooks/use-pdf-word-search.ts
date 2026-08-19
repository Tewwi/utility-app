"use client";

import { useCallback, useRef, useState } from "react";
import type {
  PdfFileRecord,
  PdfPageText,
  PdfWordSearchOptions,
  SearchTermGroup,
  SearchTermResult,
} from "@/lib/pdf-word-search/types";
import { createPdfFileRecord } from "@/lib/pdf-word-search/create-pdf-file-record";
import { extractPdfText } from "@/lib/pdf-word-search/extract-pdf-text";
import { extractScannedPageText } from "@/lib/pdf-word-search/extract-scanned-page-text";
import { createOcrWorker } from "@/lib/pdf-word-search/create-ocr-worker";
import { countSearchTermGroups } from "@/lib/pdf-word-search/count-search-term-groups";
import { createSearchTermGroup } from "@/lib/pdf-word-search/create-search-term-group";
import {
  MAX_TERM_LENGTH,
  normalizeSearchTerms,
} from "@/lib/pdf-word-search/normalize-search-term";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
const MAX_TOTAL_SIZE = 200 * 1024 * 1024; // 200 MB
const OCR_TEXT_THRESHOLD = 20;

export type ProcessingFile = {
  fileId: string;
  fileName: string;
  currentPage: number;
  totalPages: number;
  stage: "reading" | "ocr" | "complete" | "error";
};

export type ProcessingState = {
  isProcessing: boolean;
  files: ProcessingFile[];
};

export function usePdfWordSearch() {
  const [files, setFiles] = useState<PdfFileRecord[]>([]);
  const [searchTermGroups, setSearchTermGroups] = useState<SearchTermGroup[]>(
    () => [createSearchTermGroup()],
  );
  const [options, setOptions] = useState<PdfWordSearchOptions>({
    enableOcr: true,
    ocrLanguages: ["vie", "eng"],
  });
  const [progress, setProgress] = useState<ProcessingState>({
    isProcessing: false,
    files: [],
  });
  const [results, setResults] = useState<SearchTermResult[]>([]);
  const [allPages, setAllPages] = useState<PdfPageText[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [termWarnings, setTermWarnings] = useState<string[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const totalFiles = files.length;
  const totalPages = allPages.length;
  const totalChars = allPages.reduce((sum, p) => sum + p.text.length, 0);
  const totalKeywords = results.length;
  const totalMatches = results.reduce((sum, r) => sum + r.count, 0);

  const addFiles = useCallback((incoming: FileList | File[]) => {
    const fileArray = Array.from(incoming);
    const newErrors: string[] = [];

    const validFiles = fileArray.filter((f) => {
      if (
        f.type !== "application/pdf" &&
        !f.name.toLowerCase().endsWith(".pdf")
      ) {
        newErrors.push(`"${f.name}" is not a valid PDF file.`);
        return false;
      }
      if (f.size > MAX_FILE_SIZE) {
        newErrors.push(`"${f.name}" exceeds the 100 MB size limit.`);
        return false;
      }
      return true;
    });

    const currentTotalSize = validFiles.reduce((s, f) => s + f.size, 0);

    setFiles((prev) => {
      const remaining = MAX_FILES - prev.length;
      if (remaining <= 0) {
        newErrors.push(
          `Maximum of ${MAX_FILES} files allowed. Remove some files first.`,
        );
        return prev;
      }

      const totalSize =
        prev.reduce((s, f) => s + f.file.size, 0) + currentTotalSize;
      if (totalSize > MAX_TOTAL_SIZE) {
        newErrors.push("Total file size exceeds the 200 MB limit.");
        return prev;
      }

      const toAdd = validFiles.slice(0, remaining).map(createPdfFileRecord);
      return [...prev, ...toAdd];
    });

    if (newErrors.length > 0) {
      setErrors((prev) => [...prev, ...newErrors]);
    }
  }, []);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setAllPages((prev) => prev.filter((p) => p.fileId !== id));
    setResults([]);
    setHasRun(false);
  }, []);

  const addSearchTermGroup = useCallback(() => {
    setSearchTermGroups((previous) => [...previous, createSearchTermGroup()]);
  }, []);

  const updateSearchTermGroup = useCallback(
    (id: string, updates: Partial<Omit<SearchTermGroup, "id">>) => {
      setSearchTermGroups((previous) =>
        previous.map((group) =>
          group.id === id ? { ...group, ...updates } : group,
        ),
      );
    },
    [],
  );

  const removeSearchTermGroup = useCallback((id: string) => {
    setSearchTermGroups((previous) => {
      if (previous.length === 1) return previous;
      return previous.filter((group) => group.id !== id);
    });
  }, []);

  const updateFileStatus = useCallback(
    (id: string, status: PdfFileRecord["status"], error?: string) => {
      setFiles((prev) =>
        prev.map((f) => (f.id === id ? { ...f, status, error } : f)),
      );
    },
    [],
  );

  const updateProcessingFile = useCallback(
    (
      fileId: string,
      updates: Partial<{
        currentPage: number;
        totalPages: number;
        stage: ProcessingFile["stage"];
      }>,
    ) => {
      setProgress((prev) => ({
        ...prev,
        files: prev.files.map((pf) =>
          pf.fileId === fileId ? { ...pf, ...updates } : pf,
        ),
      }));
    },
    [],
  );

  const runSearch = useCallback(async () => {
    const normalizedGroups = searchTermGroups.map((group) => {
      const { terms, longTerms } = normalizeSearchTerms(group.searchTerms);

      return { ...group, terms, longTerms };
    });
    const searchableGroups = normalizedGroups.filter(
      (group) => group.terms.length > 0,
    );
    const longTerms = normalizedGroups.flatMap((group) => group.longTerms);

    if (searchableGroups.length === 0) {
      setErrors((prev) => [...prev, "Please enter at least one search term."]);
      return;
    }
    if (files.length === 0) {
      setErrors((prev) => [...prev, "Please upload at least one PDF file."]);
      return;
    }

    if (longTerms.length > 0) {
      setTermWarnings(
        longTerms.map(
          (t) =>
            `"${t.slice(0, 50)}…" exceeds the ${MAX_TERM_LENGTH}-character limit and will be skipped.`,
        ),
      );
    } else {
      setTermWarnings([]);
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    setResults([]);
    setAllPages([]);
    setErrors([]);
    setHasRun(false);

    setProgress({
      isProcessing: true,
      files: files.map((f) => ({
        fileId: f.id,
        fileName: f.name,
        currentPage: 0,
        totalPages: 0,
        stage: "reading" as const,
      })),
    });

    const allPageTexts: PdfPageText[] = [];
    const ocrPageKeys = new Set<string>();
    let ocrWorker: Awaited<ReturnType<typeof createOcrWorker>> | null = null;

    try {
      for (const file of files) {
        if (signal.aborted) break;

        updateFileStatus(file.id, "reading");
        updateProcessingFile(file.id, { stage: "reading" });

        const result = await extractPdfText(
          file.file,
          file.id,
          file.name,
          signal,
        );

        updateProcessingFile(file.id, { totalPages: result.totalPages });

        const pagesToOcr: number[] = [];

        for (const page of result.pages) {
          if (signal.aborted) break;

          updateProcessingFile(file.id, { currentPage: page.pageNumber });

          if (
            options.enableOcr &&
            (page.requiresOcr ||
              page.text.trim().length < OCR_TEXT_THRESHOLD)
          ) {
            pagesToOcr.push(page.pageNumber);
          } else {
            allPageTexts.push(page);
          }
        }

        if (options.enableOcr && pagesToOcr.length > 0) {
          updateFileStatus(file.id, "ocr");
          updateProcessingFile(file.id, { stage: "ocr", currentPage: 0 });

          for (const pageNum of pagesToOcr) {
            if (signal.aborted) break;

            updateProcessingFile(file.id, { currentPage: pageNum });
            ocrWorker ??= await createOcrWorker(options.ocrLanguages);

            const ocrText = await extractScannedPageText(
              file.file,
              file.id,
              file.name,
              pageNum,
              options.ocrLanguages,
              signal,
              ocrWorker,
            );

            ocrPageKeys.add(`${file.id}:${pageNum}`);
            allPageTexts.push(ocrText);
          }
        }

        if (!signal.aborted) {
          updateFileStatus(file.id, "complete");
          updateProcessingFile(file.id, { stage: "complete" });
        }
      }

      if (signal.aborted) {
        throw new DOMException("Aborted", "AbortError");
      }

      setAllPages(allPageTexts);

      let counted = countSearchTermGroups(searchableGroups, allPageTexts);

      const foundInitialMatches = counted.some((result) => result.count > 0);

      if (options.enableOcr && !foundInitialMatches) {
        const textLayerPages = allPageTexts.filter(
          (page) =>
            page.source === "text-layer" &&
            !ocrPageKeys.has(`${page.fileId}:${page.pageNumber}`),
        );

        if (textLayerPages.length > 0) {
          const pagesByFile = new Map<string, PdfPageText[]>();
          for (const page of textLayerPages) {
            const current = pagesByFile.get(page.fileId) ?? [];
            current.push(page);
            pagesByFile.set(page.fileId, current);
          }

          for (const file of files) {
            const pages = pagesByFile.get(file.id);
            if (!pages || signal.aborted) continue;

            updateFileStatus(file.id, "ocr");
            updateProcessingFile(file.id, {
              stage: "ocr",
              currentPage: 0,
              totalPages: pages.length,
            });

            for (let index = 0; index < pages.length; index += 1) {
              const page = pages[index];
              if (signal.aborted) break;

              updateProcessingFile(file.id, {
                currentPage: index + 1,
              });
              ocrWorker ??= await createOcrWorker(options.ocrLanguages);

              const ocrText = await extractScannedPageText(
                file.file,
                file.id,
                file.name,
                page.pageNumber,
                options.ocrLanguages,
                signal,
                ocrWorker,
              );

              ocrPageKeys.add(`${file.id}:${page.pageNumber}`);
              const existingIndex = allPageTexts.findIndex(
                (existing) =>
                  existing.fileId === file.id &&
                  existing.pageNumber === page.pageNumber,
              );

              if (existingIndex >= 0) {
                allPageTexts[existingIndex] = ocrText;
              } else {
                allPageTexts.push(ocrText);
              }
            }

            if (!signal.aborted) {
              updateFileStatus(file.id, "complete");
              updateProcessingFile(file.id, { stage: "complete" });
            }
          }

          counted = countSearchTermGroups(searchableGroups, allPageTexts);
          setAllPages([...allPageTexts]);
        }
      }

      setResults(counted);
      setHasRun(true);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;

      const message =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrors((prev) => [...prev, message]);
    } finally {
      await ocrWorker?.terminate().catch(() => undefined);
      setProgress({ isProcessing: false, files: [] });
    }
  }, [
    files,
    searchTermGroups,
    options,
    updateFileStatus,
    updateProcessingFile,
  ]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setFiles([]);
    setSearchTermGroups([createSearchTermGroup()]);
    setOptions({
      enableOcr: true,
      ocrLanguages: ["vie", "eng"],
    });
    setProgress({ isProcessing: false, files: [] });
    setResults([]);
    setAllPages([]);
    setErrors([]);
    setTermWarnings([]);
    setHasRun(false);
  }, []);

  const clearErrors = useCallback(() => setErrors([]), []);
  const clearTermWarnings = useCallback(() => setTermWarnings([]), []);

  return {
    files,
    searchTermGroups,
    options,
    setOptions,
    progress,
    results,
    allPages,
    errors,
    hasRun,
    totalFiles,
    totalPages,
    totalChars,
    totalKeywords,
    totalMatches,
    addFiles,
    removeFile,
    addSearchTermGroup,
    updateSearchTermGroup,
    removeSearchTermGroup,
    runSearch,
    reset,
    clearErrors,
    clearTermWarnings,
    termWarnings,
    isProcessing: progress.isProcessing,
  };
}
