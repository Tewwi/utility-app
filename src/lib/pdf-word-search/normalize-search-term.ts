export const MAX_TERM_LENGTH = 300;

export function normalizeSearchTerms(input: string): {
  terms: string[];
  longTerms: string[];
} {
  const raw = input
    .split("\n")
    .map((line) => line.normalize("NFC").trim())
    .filter((line) => line.length > 0);

  const seen = new Set<string>();
  const terms: string[] = [];
  const longTerms: string[] = [];

  for (const line of raw) {
    if (seen.has(line)) continue;
    seen.add(line);

    if (line.length > MAX_TERM_LENGTH) {
      longTerms.push(line);
    } else {
      terms.push(line);
    }
  }

  return { terms, longTerms };
}
