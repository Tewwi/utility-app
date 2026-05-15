import { Copy, Play, RotateCcw, Save } from "lucide-react";
import type { Utility } from "@/lib/utilities";

type ToolPageShellProps = {
  utility: Utility;
  inputTitle: string;
  inputPlaceholder: string;
  outputTitle: string;
  outputPreview: string;
  details: readonly string[];
};

export function ToolPageShell({
  utility,
  inputTitle,
  inputPlaceholder,
  outputTitle,
  outputPreview,
  details,
}: ToolPageShellProps) {
  const Icon = utility.icon;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="flex flex-col justify-between gap-4 rounded-lg border border-border bg-card p-5 shadow-sm md:flex-row md:items-center">
        <div className="flex items-start gap-4">
          <div className={`flex size-11 items-center justify-center rounded-md ${utility.accent}`}>
            <Icon className="size-5" aria-hidden="true" />
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
          <button className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent">
            <RotateCcw className="size-4" aria-hidden="true" />
            Reset
          </button>
          <button className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Play className="size-4" aria-hidden="true" />
            Run
          </button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.8fr)]">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-base font-semibold">
              {inputTitle}
            </h2>
            <span className="text-xs text-muted-foreground">Input</span>
          </div>
          <textarea
            placeholder={inputPlaceholder}
            className="mt-4 min-h-80 w-full resize-y rounded-md border border-input bg-background p-4 font-mono text-sm leading-6 outline-none placeholder:text-muted-foreground focus:border-ring"
          />
        </div>

        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-heading text-base font-semibold">
              {outputTitle}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Copy output"
                className="flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
              >
                <Copy className="size-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Save output"
                className="flex size-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
              >
                <Save className="size-4" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="mt-4 min-h-80 rounded-md border border-dashed border-border bg-muted/50 p-4">
            <pre className="whitespace-pre-wrap font-mono text-sm leading-6 text-muted-foreground">
              {outputPreview}
            </pre>
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
