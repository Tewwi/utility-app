import type { SearchTermResult } from "./types";
import { formatPageRanges } from "./format-page-ranges";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateResultsCsv(results: SearchTermResult[]): string {
  const header = "Term,Count,Files,Pages,Share";

  const rows = results.map((r) => {
    const pagesStr = r.matchesByFile
      .map((m) => `${m.fileName}: ${formatPageRanges(m.pages)}`)
      .join("; ");
    return [
      escapeCsv(r.term),
      r.count,
      r.fileCount,
      escapeCsv(pagesStr),
      `${r.percentage}%`,
    ].join(",");
  });

  return [header, ...rows].join("\n");
}

export function generateFileDetailCsv(results: SearchTermResult[]): string {
  const header = "File,Term,Count,Pages";

  const rows: string[] = [];

  for (const result of results) {
    for (const fileResult of result.matchesByFile) {
      rows.push(
        [
          escapeCsv(fileResult.fileName),
          escapeCsv(result.term),
          fileResult.count,
          escapeCsv(formatPageRanges(fileResult.pages)),
        ].join(","),
      );
    }
  }

  return [header, ...rows].join("\n");
}

export function downloadCsv(content: string, filename: string) {
  const blob = new Blob([content], {
    type: "text/csv;charset=utf-8;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string) {
  await navigator.clipboard.writeText(text);
}
