import type { SearchTermResult } from "./types";
import { formatPageRanges } from "./format-page-ranges";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function generateResultsCsv(
  results: SearchTermResult[],
  allSearchedTerms: string[],
): string {
  const header = "Term,Count,Files,Pages,Share";
  const resultMap = new Map(results.map((r) => [r.term, r]));

  const rows = allSearchedTerms.map((term) => {
    const r = resultMap.get(term);
    if (!r) {
      return [escapeCsv(term), 0, 0, "", "0%"].join(",");
    }

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

export function generateFileDetailCsv(
  results: SearchTermResult[],
  allSearchedTerms: string[],
): string {
  const header = "File,Term,Count,Pages";
  const resultMap = new Map(results.map((r) => [r.term, r]));

  const rows: string[] = [];

  for (const term of allSearchedTerms) {
    const r = resultMap.get(term);
    if (!r) {
      rows.push([escapeCsv("(all files)"), escapeCsv(term), 0, ""].join(","));
      continue;
    }
    for (const fileResult of r.matchesByFile) {
      rows.push(
        [
          escapeCsv(fileResult.fileName),
          escapeCsv(r.term),
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
