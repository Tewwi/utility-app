"use client";

import { useRef, type ChangeEvent, type DragEvent } from "react";
import { FileText, Trash2, Upload } from "lucide-react";
import type { PdfFileRecord } from "@/lib/pdf-word-search/types";
import { formatFileSize } from "@/lib/pdf-word-search/format-file-size";

type PdfUploadPanelProps = {
  files: PdfFileRecord[];
  onAddFiles: (files: FileList | File[]) => void;
  onRemoveFile: (id: string) => void;
  disabled: boolean;
};

export function PdfUploadPanel({
  files,
  onAddFiles,
  onRemoveFile,
  disabled,
}: PdfUploadPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      e.target.value = "";
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    dropRef.current?.classList.add("border-primary");
  }

  function handleDragLeave(e: DragEvent) {
    e.preventDefault();
    dropRef.current?.classList.remove("border-primary");
  }

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dropRef.current?.classList.remove("border-primary");
    if (e.dataTransfer.files.length > 0) {
      onAddFiles(e.dataTransfer.files);
    }
  }

  return (
    <div className="space-y-3">
      <div
        ref={dropRef}
        onClick={() => inputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed border-border bg-card p-6 text-center transition-colors hover:border-primary"
      >
        <Upload className="size-6 text-muted-foreground" aria-hidden="true" />
        <p className="text-sm font-medium text-foreground">
          Drop PDF files here or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Up to 5 files, max 100 MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleFileChange}
          className="sr-only"
          aria-label="Upload PDF files"
          disabled={disabled}
        />
      </div>

      {files.length > 0 && (
        <ul className="space-y-2" role="list">
          {files.map((file) => (
            <li
              key={file.id}
              className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-2"
            >
              <FileText
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.size)}
                </p>
              </div>
              {file.status === "error" && file.error && (
                <span className="text-xs text-destructive">{file.error}</span>
              )}
              <button
                type="button"
                onClick={() => onRemoveFile(file.id)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label={`Remove ${file.name}`}
                disabled={disabled}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
