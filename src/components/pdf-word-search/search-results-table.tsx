"use client";

import type { SearchTermResult } from "@/lib/pdf-word-search/types";
import { formatPageRanges } from "@/lib/pdf-word-search/format-page-ranges";

type SearchResultsTableProps = {
  results: SearchTermResult[];
};

export function SearchResultsTable({ results }: SearchResultsTableProps) {
  if (results.length === 0) return null;

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Search results
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-2.5 font-medium text-foreground">Term</th>
              <th className="px-4 py-2.5 font-medium text-foreground">Count</th>
              <th className="px-4 py-2.5 font-medium text-foreground">Files</th>
              <th className="hidden px-4 py-2.5 font-medium text-foreground md:table-cell">
                Pages
              </th>
              <th className="hidden px-4 py-2.5 font-medium text-foreground md:table-cell">
                Share
              </th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr
                key={result.id}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-2.5 font-medium text-foreground">
                  <div>{result.term}</div>
                  <div className="mt-0.5 text-[11px] font-normal text-muted-foreground">
                    {result.caseSensitive ? "Case sensitive" : "Ignore case"}
                    {" / "}
                    {result.wholeWord ? "Whole word" : "Partial match"}
                  </div>
                </td>
                <td className="px-4 py-2.5 text-foreground">{result.count}</td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  <span
                    title={result.matchesByFile
                      .map((m) => m.fileName)
                      .join(", ")}
                    className="cursor-help"
                  >
                    {result.fileCount}
                  </span>
                </td>
                <td className="hidden px-4 py-2.5 text-muted-foreground md:table-cell">
                  <span
                    className="line-clamp-2 text-xs"
                    title={result.matchesByFile
                      .map((m) => `${m.fileName}: ${formatPageRanges(m.pages)}`)
                      .join("; ")}
                  >
                    {result.matchesByFile
                      .map((m) => `${m.fileName}: ${formatPageRanges(m.pages)}`)
                      .join("; ")}
                  </span>
                </td>
                <td className="hidden px-4 py-2.5 md:table-cell">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-full max-w-[100px] overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${result.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {result.percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
