import { VIDEO_EXTENSIONS } from "./media-extensions";

export const isVideoLink = (value: string): boolean => {
  const normalized = value.split(/[?#]/)[0]?.toLowerCase() ?? "";

  return (
    value.toLowerCase().startsWith("data:video/") ||
    VIDEO_EXTENSIONS.some((extension) => normalized.endsWith(`.${extension}`))
  );
};
