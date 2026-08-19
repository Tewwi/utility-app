export function createPdfDocumentLoadOptions(data: ArrayBuffer) {
  return {
    data,
    wasmUrl: "/pdfjs/wasm/",
  };
}
