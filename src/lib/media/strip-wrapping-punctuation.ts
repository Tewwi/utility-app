export const stripWrappingPunctuation = (value: string): string =>
  value.trim().replace(/[),.;\]}]+$/g, "");
