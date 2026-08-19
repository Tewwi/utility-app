type PdfJsLibWithVerbosity = {
  setVerbosityLevel?: (level: number) => void;
  VerbosityLevel?: {
    ERRORS?: number;
  };
};

export function configurePdfJsLib(pdfjsLib: PdfJsLibWithVerbosity): void {
  const errorsOnly = pdfjsLib.VerbosityLevel?.ERRORS;

  if (
    typeof pdfjsLib.setVerbosityLevel === "function" &&
    typeof errorsOnly === "number"
  ) {
    pdfjsLib.setVerbosityLevel(errorsOnly);
  }
}
