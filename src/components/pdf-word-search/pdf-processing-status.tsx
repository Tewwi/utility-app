"use client";

import { Loader2 } from "lucide-react";

type PdfProcessingStatusProps = {
  isProcessing: boolean;
  files: {
    fileId: string;
    fileName: string;
    currentPage: number;
    totalPages: number;
    stage: "reading" | "ocr" | "complete" | "error";
  }[];
};

export function PdfProcessingStatus({
  isProcessing,
  files,
}: PdfProcessingStatusProps) {
  if (!isProcessing || files.length === 0) return null;

  return (
    <div className="space-y-3 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <Loader2
          className="size-4 animate-spin text-primary"
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-foreground">
          Processing files...
        </p>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <div key={file.fileId} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="truncate font-medium text-foreground">
                {file.fileName}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {file.stage === "reading" && "Reading PDF..."}
                {file.stage === "ocr" &&
                  `OCR page ${file.currentPage}/${file.totalPages}...`}
                {file.stage === "complete" && "Done"}
                {file.stage === "error" && "Error"}
              </span>
            </div>

            {file.stage !== "complete" && file.stage !== "error" && (
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width:
                      file.stage === "reading" && file.totalPages > 0
                        ? `${Math.round(
                            (file.currentPage / file.totalPages) * 100,
                          )}%`
                        : file.stage === "ocr" && file.totalPages > 0
                          ? `${Math.round(
                              (file.currentPage / file.totalPages) * 100,
                            )}%`
                          : "50%",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
