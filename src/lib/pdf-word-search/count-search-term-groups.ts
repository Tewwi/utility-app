import type {
  CountSearchTermGroup,
  PdfPageText,
  SearchTermResult,
} from "./types";
import { countSearchTerms } from "./count-search-terms";

export function countSearchTermGroups(
  groups: CountSearchTermGroup[],
  pages: PdfPageText[],
): SearchTermResult[] {
  const results = groups.flatMap((group) =>
    countSearchTerms(group.terms, pages, {
      groupId: group.id,
      caseSensitive: group.caseSensitive,
      wholeWord: group.wholeWord,
    }),
  );
  const grandTotal = results.reduce((sum, result) => sum + result.count, 0);

  for (const result of results) {
    result.percentage =
      grandTotal > 0 ? Math.round((result.count / grandTotal) * 100) : 0;
  }

  return results.sort((a, b) => b.count - a.count);
}
