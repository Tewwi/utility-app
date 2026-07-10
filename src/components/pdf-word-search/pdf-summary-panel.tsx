"use client";

import { FileText, FileSearch, Type, Hash, Layers } from "lucide-react";

type PdfSummaryPanelProps = {
  totalFiles: number;
  totalPages: number;
  totalChars: number;
  totalKeywords: number;
  totalMatches: number;
  hasRun: boolean;
  hasFiles: boolean;
};

export function PdfSummaryPanel({
  totalFiles,
  totalPages,
  totalChars,
  totalKeywords,
  totalMatches,
  hasRun,
  hasFiles,
}: PdfSummaryPanelProps) {
  if (!hasFiles) return null;

  const items = [
    {
      icon: FileText,
      label: "Files",
      value: totalFiles,
    },
    {
      icon: Layers,
      label: "Pages",
      value: totalPages,
    },
    {
      icon: Type,
      label: "Characters",
      value: totalChars.toLocaleString(),
    },
    {
      icon: FileSearch,
      label: "Keywords",
      value: hasRun ? totalKeywords : "-",
    },
    {
      icon: Hash,
      label: "Matches",
      value: hasRun ? totalMatches.toLocaleString() : "-",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-sm"
          >
            <Icon
              className="size-5 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">
                {item.label}
              </p>
              <p className="text-lg font-semibold text-foreground">
                {item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
