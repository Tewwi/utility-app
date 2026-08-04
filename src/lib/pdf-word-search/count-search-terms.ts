import type {
  PdfPageText,
  SearchTermResult,
  SearchTermFileResult,
} from "./types";
import { buildSearchRegex } from "./build-search-regex";
import { normalizeSearchText } from "./normalize-search-text";

type CountOptions = {
  groupId: string;
  caseSensitive: boolean;
  wholeWord: boolean;
};

export function countSearchTerms(
  terms: string[],
  pages: PdfPageText[],
  options: CountOptions,
): SearchTermResult[] {
  if (terms.length === 0 || pages.length === 0) return [];

  return terms.map((term, termIndex) => {
    const regex = buildSearchRegex(term, options);
    const fileMatches = new Map<
      string,
      { count: number; pages: Set<number> }
    >();

    for (const page of pages) {
      const matches = normalizeSearchText(page.text).match(regex);
      if (!matches) continue;

      const count = matches.length;
      if (!fileMatches.has(page.fileId)) {
        fileMatches.set(page.fileId, { count: 0, pages: new Set() });
      }
      const fileMatch = fileMatches.get(page.fileId)!;
      fileMatch.count += count;
      fileMatch.pages.add(page.pageNumber);
    }

    const matchesByFile: SearchTermFileResult[] = [];
    let termTotal = 0;

    for (const [fileId, match] of fileMatches) {
      const fileName =
        pages.find((p) => p.fileId === fileId)?.fileName ?? fileId;
      matchesByFile.push({
        fileId,
        fileName,
        count: match.count,
        pages: [...match.pages].sort((a, b) => a - b),
      });
      termTotal += match.count;
    }

    matchesByFile.sort((a, b) => b.count - a.count);
    return {
      id: `${options.groupId}:${termIndex}`,
      groupId: options.groupId,
      term,
      caseSensitive: options.caseSensitive,
      wholeWord: options.wholeWord,
      count: termTotal,
      fileCount: matchesByFile.length,
      matchesByFile,
      percentage: 0,
    };
  });
}
