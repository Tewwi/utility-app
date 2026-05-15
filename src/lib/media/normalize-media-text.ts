import { decodeBasicEntities } from "./decode-basic-entities";

export const normalizeMediaText = (value: string): string =>
  decodeBasicEntities(value).replace(/\\\//g, "/");
