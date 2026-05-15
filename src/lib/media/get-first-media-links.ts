import { DATA_URI_REGEX, URL_REGEX } from "./media-regex";
import { normalizeMediaText } from "./normalize-media-text";

export const getFirstMediaLinks = (text: string, limit = 5): string[] => {
  const normalized = normalizeMediaText(text);
  const results: string[] = [];

  const collectMatches = (regex: RegExp) => {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(normalized)) !== null) {
      results.push(match[0]);

      if (results.length >= limit) return;
    }
  };

  collectMatches(DATA_URI_REGEX);

  if (results.length < limit) {
    collectMatches(URL_REGEX);
  }

  return results.slice(0, limit);
};
