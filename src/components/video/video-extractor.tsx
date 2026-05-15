"use client";

import { Copy, Link2, RotateCcw, Video } from "lucide-react";
import { useMemo, useState } from "react";
import { getVideoLinks } from "@/lib/media";

type VideoExtractorProps = {
  utility: {
    title: string;
    description: string;
    category: string;
    accent: string;
  };
  details: readonly string[];
};

export function VideoExtractor({ utility, details }: VideoExtractorProps) {
  const [sourceText, setSourceText] = useState("");
  const videoLinks = useMemo(() => getVideoLinks(sourceText), [sourceText]);
  const outputText = videoLinks.join("\n");

  async function copyLinks() {
    if (!outputText) return;

    await navigator.clipboard.writeText(outputText);
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div
            className={`flex size-11 items-center justify-center rounded-md ${utility.accent}`}
          >
            <Video className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {utility.category}
            </p>
            <h1 className="font-heading text-2xl font-semibold leading-9 md:text-3xl">
              {utility.title}
            </h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              {utility.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent"
            onClick={() => setSourceText("")}
          >
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!outputText}
            onClick={copyLinks}
          >
            <Copy className="size-4" aria-hidden="true" />
            Copy links
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.9fr)]">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-base font-semibold">
              Source input
            </h2>
            <span className="text-xs text-muted-foreground">
              {sourceText.length.toLocaleString()} chars
            </span>
          </div>
          <textarea
            value={sourceText}
            onChange={(event) => setSourceText(event.target.value)}
            placeholder={`Paste HTML, JSON, or a src value here.
              <video src="https://cdn.example.com/movie.mp4"></video>
              <source src="https:\\/\\/cdn.example.com\\/clip.webm">`}
            className="mt-4 min-h-96 w-full resize-y rounded-md border border-input bg-background p-4 font-mono text-sm leading-6 outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3 ">
            <h2 className="font-heading text-base font-semibold">
              Preview videos
            </h2>
            <span className="text-xs text-muted-foreground">
              {videoLinks.length} found
            </span>
          </div>

          <div className="mt-4 min-h-96 space-y-4 rounded-md border border-dashed border-border bg-muted/40 p-3 max-h-75 overflow-auto">
            {videoLinks.length > 0 ? (
              videoLinks.map((link, index) => (
                <div
                  key={link}
                  className="overflow-hidden rounded-md border border-border bg-background"
                >
                  <div className="aspect-video bg-black">
                    <video
                      src={link}
                      controls
                      preload="metadata"
                      className="h-full w-full"
                    />
                  </div>
                  <div className="flex items-start gap-2 p-3">
                    <Video
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        Video {index + 1}
                      </p>
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 block truncate font-mono text-xs text-primary hover:underline"
                      >
                        {link}
                      </a>
                    </div>
                    <Link2
                      className="mt-0.5 size-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex min-h-80 items-center justify-center rounded-md border border-border bg-background px-4 text-center text-sm leading-6 text-muted-foreground">
                Paste source text to extract and preview video links.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {details.map((detail) => (
          <div
            key={detail}
            className="rounded-lg border border-border bg-card p-4 text-sm leading-6 text-muted-foreground shadow-sm"
          >
            {detail}
          </div>
        ))}
      </section>
    </div>
  );
}
