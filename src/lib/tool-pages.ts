export const toolPages = {
  qr: {
    href: "/tools/qr",
    inputTitle: "QR content",
    inputPlaceholder:
      "Paste a URL, text, email, phone number, or contact payload.",
    outputTitle: "QR preview",
    outputPreview:
      "QR preview will render here.\n\nPayload type: Auto detect\nError correction: Medium\nExport: PNG / SVG",
    details: [
      "Input supports plain text and common URL formats.",
      "Preview panel is reserved for the generated QR image.",
      "History will keep recently generated payloads.",
    ],
  },
  video: {
    href: "/tools/video",
    details: [
      "Supports src attributes, direct video URLs, and escaped JSON-style URLs.",
      "Recognizes mp4, webm, mov, m4v, m3u8, and data:video sources.",
      "Duplicate links are collapsed before rendering the previews.",
    ],
  },
  pdfWordSearch: {
    href: "/tools/pdf-word-search",
    details: [
      "Supports up to 5 PDF files with text layer or OCR (tesseract.js).",
      "Search multiple words or phrases at once; results are aggregated across all files.",
      "All processing happens client-side; no files are uploaded to a server.",
    ],
  },
} as const;

export type ToolSlug = keyof typeof toolPages;
