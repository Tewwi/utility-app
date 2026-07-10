export function formatPageRanges(pages: number[]): string {
  if (pages.length === 0) return "";

  const sorted = [...pages].sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    if (curr === end + 1) {
      end = curr;
    } else {
      ranges.push(start === end ? `${start}` : `${start}-${end}`);
      start = curr;
      end = curr;
    }
  }

  ranges.push(start === end ? `${start}` : `${start}-${end}`);
  return ranges.join(", ");
}
