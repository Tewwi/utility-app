import { MEDIA_EXTENSIONS, VIDEO_EXTENSIONS } from "./media-extensions";

const MEDIA_EXT_PATTERN = MEDIA_EXTENSIONS.join("|");
const VIDEO_EXT_PATTERN = VIDEO_EXTENSIONS.join("|");

export const DATA_URI_REGEX =
  /data:(?:image|video|audio)\/[a-z0-9.+-]+[^\s"')>]*/gi;

export const DATA_VIDEO_URI_REGEX =
  /data:video\/[a-z0-9.+-]+[^\s"')>]*/gi;

export const URL_REGEX = new RegExp(
  String.raw`https?:\/\/[^\s"')>]+\.(?:${MEDIA_EXT_PATTERN})(?:\?[^\s"')>]*)?`,
  "gi",
);

export const VIDEO_URL_REGEX = new RegExp(
  String.raw`https?:\/\/[^\s"')>]+\.(?:${VIDEO_EXT_PATTERN})(?:\?[^\s"')>]*)?`,
  "gi",
);

export const SRC_ATTRIBUTE_REGEX =
  /\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/gi;
