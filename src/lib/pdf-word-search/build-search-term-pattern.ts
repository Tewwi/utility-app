import { escapeRegex } from "./escape-regex";

export function buildSearchTermPattern(term: string): string {
  return term
    .normalize("NFC")
    .trim()
    .split(/\s+/)
    .map(escapeRegex)
    .join("\\s+");
}
