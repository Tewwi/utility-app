import {
  DATA_VIDEO_URI_REGEX,
  SRC_ATTRIBUTE_REGEX,
  VIDEO_URL_REGEX,
} from "./media-regex";
import { isVideoLink } from "./is-video-link";
import { normalizeMediaText } from "./normalize-media-text";
import { stripWrappingPunctuation } from "./strip-wrapping-punctuation";

export const getVideoLinks = (text: string, limit = 50): string[] => {
  const normalized = normalizeMediaText(text);
  const results: string[] = [];
  const seen = new Set<string>();

  const addResult = (value?: string) => {
    if (!value) return;

    const link = stripWrappingPunctuation(value);

    if (!isVideoLink(link) || seen.has(link)) return;

    seen.add(link);
    results.push(link);
  };

  const collectMatches = (
    regex: RegExp,
    getValue: (match: RegExpExecArray) => string | undefined,
  ) => {
    regex.lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(normalized)) !== null) {
      addResult(getValue(match));

      if (results.length >= limit) return;
    }
  };

  collectMatches(
    SRC_ATTRIBUTE_REGEX,
    (match) => match[1] ?? match[2] ?? match[3],
  );

  if (results.length < limit) {
    collectMatches(DATA_VIDEO_URI_REGEX, (match) => match[0]);
  }

  if (results.length < limit) {
    collectMatches(VIDEO_URL_REGEX, (match) => match[0]);
  }

  return results.slice(0, limit);
};
