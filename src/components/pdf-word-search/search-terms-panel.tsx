"use client";

import { Plus, Trash2 } from "lucide-react";
import type {
  PdfWordSearchOptions,
  SearchTermGroup,
} from "@/lib/pdf-word-search/types";

type SearchTermsPanelProps = {
  groups: SearchTermGroup[];
  onAddGroup: () => void;
  onUpdateGroup: (
    id: string,
    updates: Partial<Omit<SearchTermGroup, "id">>,
  ) => void;
  onRemoveGroup: (id: string) => void;
  options: PdfWordSearchOptions;
  onOptionsChange: (options: PdfWordSearchOptions) => void;
  termWarnings: string[];
  onClearWarnings: () => void;
  disabled: boolean;
};

export function SearchTermsPanel({
  groups,
  onAddGroup,
  onUpdateGroup,
  onRemoveGroup,
  options,
  onOptionsChange,
  termWarnings,
  onClearWarnings,
  disabled,
}: SearchTermsPanelProps) {
  const languages = [
    { value: "vie", label: "Vietnamese" },
    { value: "eng", label: "English" },
  ];

  function toggleOcrLanguage(language: string) {
    const isSelected = options.ocrLanguages.includes(language);
    const nextLanguages = isSelected
      ? options.ocrLanguages.filter((item) => item !== language)
      : [...options.ocrLanguages, language];

    if (nextLanguages.length === 0) return;

    onOptionsChange({ ...options, ocrLanguages: nextLanguages });
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {groups.map((group, index) => {
          const textareaId = `search-terms-${group.id}`;
          const termCount = group.searchTerms.trim()
            ? group.searchTerms.trim().split("\n").filter(Boolean).length
            : 0;

          return (
            <fieldset
              key={group.id}
              className="space-y-3 rounded-md border border-border bg-muted/20 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor={textareaId}
                  className="text-sm font-medium text-foreground"
                >
                  Term group {index + 1}
                </label>
                <button
                  type="button"
                  onClick={() => onRemoveGroup(group.id)}
                  disabled={disabled || groups.length === 1}
                  className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label={`Remove term group ${index + 1}`}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>

              <textarea
                id={textareaId}
                value={group.searchTerms}
                onChange={(event) =>
                  onUpdateGroup(group.id, { searchTerms: event.target.value })
                }
                placeholder="Enter words or phrases, one per line"
                className="min-h-[104px] w-full resize-y rounded-md border border-input bg-background p-3 font-mono text-sm leading-6 outline-none placeholder:text-muted-foreground focus:border-ring"
                disabled={disabled}
              />

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-xs text-muted-foreground">
                  {termCount} term(s)
                </span>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={group.caseSensitive}
                    onChange={() =>
                      onUpdateGroup(group.id, {
                        caseSensitive: !group.caseSensitive,
                      })
                    }
                    disabled={disabled}
                    className="size-4 rounded border-input text-primary focus:ring-ring"
                  />
                  Case sensitive
                </label>
                <label className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={group.wholeWord}
                    onChange={() =>
                      onUpdateGroup(group.id, { wholeWord: !group.wholeWord })
                    }
                    disabled={disabled}
                    className="size-4 rounded border-input text-primary focus:ring-ring"
                  />
                  Match whole word
                </label>
              </div>
            </fieldset>
          );
        })}

        <button
          type="button"
          onClick={onAddGroup}
          disabled={disabled}
          className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-background px-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="size-4" aria-hidden="true" />
          Add term group
        </button>
      </div>

      {termWarnings.length > 0 && (
        <div className="space-y-1">
          {termWarnings.map((warning, index) => (
            <p
              key={`${warning}-${index}`}
              className="flex items-start gap-1.5 text-xs text-destructive"
            >
              <span>{warning}</span>
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

      <div className="space-y-3 rounded-md border border-border bg-muted/30 p-3">
        <p className="text-xs font-medium text-muted-foreground">OCR options</p>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={options.enableOcr}
            onChange={() =>
              onOptionsChange({ ...options, enableOcr: !options.enableOcr })
            }
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
            {languages.map((language) => (
              <label
                key={language.value}
                className="flex items-center gap-2 text-sm"
              >
                <input
                  type="checkbox"
                  checked={options.ocrLanguages.includes(language.value)}
                  onChange={() => toggleOcrLanguage(language.value)}
                  disabled={
                    disabled ||
                    (options.ocrLanguages.length === 1 &&
                      options.ocrLanguages.includes(language.value))
                  }
                  className="size-4 rounded border-input text-primary focus:ring-ring"
                />
                {language.label}
              </label>
            ))}
          </fieldset>
        )}
      </div>
    </div>
  );
}
