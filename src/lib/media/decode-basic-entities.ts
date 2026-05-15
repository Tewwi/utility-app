const BASIC_ENTITY_MAP: Record<string, string> = {
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
  "&lt;": "<",
  "&gt;": ">",
};

const BASIC_ENTITY_REGEX = /&(amp|quot|#39|lt|gt);/gi;

export const decodeBasicEntities = (value: string): string =>
  value.replace(
    BASIC_ENTITY_REGEX,
    (entity) => BASIC_ENTITY_MAP[entity] ?? entity,
  );
