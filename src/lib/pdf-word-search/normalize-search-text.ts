export function normalizeSearchText(value: string): string {
  return value.normalize("NFC");
}
