import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Utility } from "@/lib/utilities";
import { cn } from "@/lib/utils";

export function UtilityCard({ utility }: { utility: Utility }) {
  const Icon = utility.icon;

  return (
    <Link
      href={utility.href}
      className="group flex min-h-52 flex-col justify-between rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/50 hover:bg-accent/40"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-md",
              utility.accent,
            )}
          >
            <Icon className="size-5" aria-hidden="true" />
          </div>
          <ArrowUpRight
            className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden="true"
          />
        </div>

        <div className="mt-5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-heading text-lg font-semibold leading-7">
              {utility.title}
            </h2>
            <span className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground">
              {utility.status}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {utility.description}
          </p>
        </div>
      </div>

      <div className="mt-5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {utility.category}
      </div>
    </Link>
  );
}
