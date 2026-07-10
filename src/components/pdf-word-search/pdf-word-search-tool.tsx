"use client";

import { FileSearch, Play, RotateCcw, X } from "lucide-react";
import { usePdfWordSearch } from "@/hooks/use-pdf-word-search";
import { PdfUploadPanel } from "./pdf-upload-panel";
import { SearchTermsPanel } from "./search-terms-panel";
import { PdfProcessingStatus } from "./pdf-processing-status";
import { PdfSummaryPanel } from "./pdf-summary-panel";
import { SearchResultsTable } from "./search-results-table";
import { FileResultsTable } from "./file-results-table";

type PdfWordSearchToolProps = {
  utility: {
    title: string;
    description: string;
    category: string;
    accent: string;
  };
  details: readonly string[];
};

export function PdfWordSearchTool({
  utility,
  details,
}: PdfWordSearchToolProps) {
  const {
    files,
    searchTerms,
    setSearchTerms,
    options,
    setOptions,
    progress,
    results,
    errors,
    hasRun,
    termWarnings,
    totalFiles,
    totalPages,
    totalChars,
    totalKeywords,
    totalMatches,
    addFiles,
    removeFile,
    runSearch,
    reset,
    clearErrors,
    isProcessing,
  } = usePdfWordSearch();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div
            className={`flex size-11 items-center justify-center rounded-md ${utility.accent}`}
          >
            <FileSearch className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {utility.category}
            </p>
            <h1 className="font-heading text-2xl font-semibold leading-9 md:text-3xl">
              {utility.title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {utility.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent"
            aria-label="Reset"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            onClick={runSearch}
            disabled={isProcessing || files.length === 0}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Play className="size-4" />
            Search
          </button>
        </div>
      </section>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-card p-3 text-sm text-destructive shadow-sm"
            >
              <span className="flex-1">{error}</span>
              <button
                type="button"
                onClick={clearErrors}
                className="mt-0.5 flex size-5 items-center justify-center rounded hover:bg-destructive/10"
                aria-label="Dismiss error"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Processing status */}
      <PdfProcessingStatus
        isProcessing={progress.isProcessing}
        files={progress.files}
      />

      {/* Summary */}
      <PdfSummaryPanel
        totalFiles={totalFiles}
        totalPages={totalPages}
        totalChars={totalChars}
        totalKeywords={totalKeywords}
        totalMatches={totalMatches}
        hasRun={hasRun}
        hasFiles={files.length > 0}
      />

      {/* Input grid */}
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        {/* Upload panel */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-base font-semibold">
              Upload PDFs
            </h2>
            <span className="text-xs text-muted-foreground">
              {files.length}/5 files
            </span>
          </div>
          <div className="mt-4">
            <PdfUploadPanel
              files={files}
              onAddFiles={addFiles}
              onRemoveFile={removeFile}
              disabled={isProcessing}
            />
          </div>
        </div>

        {/* Search terms */}
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-base font-semibold">
              Search terms
            </h2>
          </div>
          <div className="mt-4">
            <SearchTermsPanel
              searchTerms={searchTerms}
              onSearchTermsChange={setSearchTerms}
              options={options}
              onOptionsChange={setOptions}
              termWarnings={termWarnings}
              onClearWarnings={() => {}}
              disabled={isProcessing}
            />
          </div>
        </div>
      </section>

      {/* Results */}
      {hasRun && results.length > 0 && (
        <section className="space-y-4">
          <SearchResultsTable results={results} />
          <FileResultsTable results={results} />
        </section>
      )}

      {/* Empty state */}
      {hasRun && results.length === 0 && !isProcessing && (
        <div className="flex min-h-[160px] items-center justify-center rounded-lg border border-dashed border-border bg-card p-8 text-center">
          <p className="text-sm leading-6 text-muted-foreground">
            No matches found. Try adjusting your search terms or options.
          </p>
        </div>
      )}

      {/* Details */}
      {!hasRun && !isProcessing && (
        <section className="grid gap-4 md:grid-cols-3">
          {details.map((detail) => (
            <div
              key={detail}
              className="rounded-lg border border-border bg-card p-4 text-sm leading-6 text-muted-foreground shadow-sm"
            >
              {detail}
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
