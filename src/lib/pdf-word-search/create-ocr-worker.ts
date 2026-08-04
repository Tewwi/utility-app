export async function createOcrWorker(ocrLanguages: string[]) {
  const Tesseract = await import("tesseract.js");
  const languages = ocrLanguages.length > 0 ? ocrLanguages : ["eng"];

  return Tesseract.createWorker(languages, undefined, {
    logger: () => {},
  });
}
