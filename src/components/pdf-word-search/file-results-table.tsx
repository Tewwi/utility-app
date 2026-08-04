"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, FileText } from "lucide-react";
import type { SearchTermResult } from "@/lib/pdf-word-search/types";
import { formatPageRanges } from "@/lib/pdf-word-search/format-page-ranges";

type FileResultsTableProps = {
  results: SearchTermResult[];
};

export function FileResultsTable({ results }: FileResultsTableProps) {
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  if (results.length === 0) return null;

  // Collect unique file entries with their match data
  const fileMap = new Map<
    string,
    {
      fileId: string;
      fileName: string;
      matches: {
        id: string;
        term: string;
        caseSensitive: boolean;
        wholeWord: boolean;
        count: number;
        pages: number[];
        source: string;
      }[];
    }
  >();

  for (const result of results) {
    for (const fileResult of result.matchesByFile) {
      if (!fileMap.has(fileResult.fileId)) {
        fileMap.set(fileResult.fileId, {
          fileId: fileResult.fileId,
          fileName: fileResult.fileName,
          matches: [],
        });
      }
      fileMap.get(fileResult.fileId)!.matches.push({
        id: result.id,
        term: result.term,
        caseSensitive: result.caseSensitive,
        wholeWord: result.wholeWord,
        count: fileResult.count,
        pages: fileResult.pages,
        source: "",
      });
    }
  }

  const fileEntries = [...fileMap.values()];

  function toggleFile(fileId: string) {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(fileId)) {
        next.delete(fileId);
      } else {
        next.add(fileId);
      }
      return next;
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <h3 className="font-heading text-base font-semibold text-foreground">
          Results by file
        </h3>
      </div>

      <div className="divide-y divide-border">
        {fileEntries.map((entry) => (
          <div key={entry.fileId}>
            <button
              type="button"
              onClick={() => toggleFile(entry.fileId)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30"
            >
              {expandedFiles.has(entry.fileId) ? (
                <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              )}
              <FileText className="size-4 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate font-medium text-foreground">
                {entry.fileName}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {entry.matches.reduce((s, m) => s + m.count, 0)} match(es)
              </span>
            </button>

            {expandedFiles.has(entry.fileId) && (
              <div className="overflow-x-auto border-t border-border">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-muted/20">
                      <th className="px-4 py-2 font-medium text-foreground">
                        Term
                      </th>
                      <th className="px-4 py-2 font-medium text-foreground">
                        Count
                      </th>
                      <th className="px-4 py-2 font-medium text-foreground">
                        Pages
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entry.matches.map((match) => (
                      <tr key={match.id} className="border-t border-border">
                        <td className="px-4 py-2 font-medium text-foreground">
                          <div>{match.term}</div>
                          <div className="mt-0.5 text-[11px] font-normal text-muted-foreground">
                            {match.caseSensitive
                              ? "Case sensitive"
                              : "Ignore case"}
                            {" / "}
                            {match.wholeWord ? "Whole word" : "Partial match"}
                          </div>
                        </td>
                        <td className="px-4 py-2 text-foreground">
                          {match.count}
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {formatPageRanges(match.pages)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
