"use client";

import type { PdfWordSearchOptions } from "@/lib/pdf-word-search/types";

type SearchTermsPanelProps = {
  searchTerms: string;
  onSearchTermsChange: (value: string) => void;
  options: PdfWordSearchOptions;
  onOptionsChange: (options: PdfWordSearchOptions) => void;
  termWarnings: string[];
  onClearWarnings: () => void;
  disabled: boolean;
};

export function SearchTermsPanel({
  searchTerms,
  onSearchTermsChange,
  options,
  onOptionsChange,
  termWarnings,
  onClearWarnings,
  disabled,
}: SearchTermsPanelProps) {
  const languages = [
    { value: "eng", label: "English" },
    { value: "vie", label: "Vietnamese" },
  ];

  function toggleOption(key: keyof PdfWordSearchOptions) {
    if (key === "ocrLanguages") return;
    onOptionsChange({ ...options, [key]: !options[key as never] });
  }

  function toggleOcrLanguage(lang: string) {
    const current = options.ocrLanguages;
    const next = current.includes(lang)
      ? current.filter((l) => l !== lang)
      : [...current, lang];
    onOptionsChange({ ...options, ocrLanguages: next });
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="search-terms"
          className="mb-2 block text-sm font-medium text-foreground"
        >
          Search terms
        </label>
        <textarea
          id="search-terms"
          value={searchTerms}
          onChange={(e) => onSearchTermsChange(e.target.value)}
          placeholder="Enter words or phrases, one per line&#10;e.g.&#10;budget&#10;Q4 report&#10;revenue growth"
          className="min-h-[120px] w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-sm leading-6 outline-none placeholder:text-muted-foreground focus:border-ring"
          disabled={disabled}
        />
        <p className="mt-1 text-xs text-muted-foreground">
          {searchTerms.trim()
            ? searchTerms.trim().split("\n").filter(Boolean).length
            : 0}{" "}
          unique term(s)
        </p>

        {termWarnings.length > 0 && (
          <div className="mt-2 space-y-1">
            {termWarnings.map((w, i) => (
              <p
                key={i}
                className="flex items-start gap-1.5 text-xs text-destructive"
              >
                <span className="mt-0.5 shrink-0">⚠</span>
                <span>{w}</span>
              </p>
            ))}
            <button
              type="button"
              onClick={onClearWarnings}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
        <p className="text-xs font-medium text-muted-foreground">
          Search options
        </p>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={options.caseSensitive}
            onChange={() => toggleOption("caseSensitive")}
            disabled={disabled}
            className="size-4 rounded border-input text-primary focus:ring-ring"
          />
          Case sensitive
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={options.wholeWord}
            onChange={() => toggleOption("wholeWord")}
            disabled={disabled}
            className="size-4 rounded border-input text-primary focus:ring-ring"
          />
          Match whole word
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={options.enableOcr}
            onChange={() => toggleOption("enableOcr")}
            disabled={disabled}
            className="size-4 rounded border-input text-primary focus:ring-ring"
          />
          Enable OCR for scanned pages
        </label>

        {options.enableOcr && (
          <fieldset className="space-y-1.5">
            <legend className="text-sm text-muted-foreground">
              OCR languages:
            </legend>
            {languages.map((lang) => (
              <label
                key={lang.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={options.ocrLanguages.includes(lang.value)}
                  onChange={() => toggleOcrLanguage(lang.value)}
                  disabled={disabled}
                  className="size-4 rounded border-input text-primary focus:ring-ring"
                />
                {lang.label}
              </label>
            ))}
          </fieldset>
        )}
      </div>
    </div>
  );
}
