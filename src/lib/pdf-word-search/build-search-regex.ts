import { buildSearchTermPattern } from "./build-search-term-pattern";

export function buildSearchRegex(
  term: string,
  options: { caseSensitive: boolean; wholeWord: boolean },
): RegExp {
  const termPattern = buildSearchTermPattern(term);
  const pattern = options.wholeWord
    ? `(^|[^\\p{L}\\p{N}_])${termPattern}(?=$|[^\\p{L}\\p{N}_])`
    : termPattern;
  const flags = options.caseSensitive ? "gu" : "giu";

  return new RegExp(pattern, flags);
}
