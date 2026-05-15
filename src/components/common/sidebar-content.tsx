"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { utilities } from "@/lib/utilities";
import { cn } from "@/lib/utils";

type SidebarContentProps = {
  onNavigate?: () => void;
};

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
        <div className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <Sparkles className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-heading text-base font-semibold leading-5">
            Utility App
          </p>
          <p className="text-xs text-muted-foreground">Everyday toolkit</p>
        </div>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
        <div>
          <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Workspace
          </p>
          <Link
            href="/"
            onClick={onNavigate}
            className={cn(
              "flex h-10 items-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              pathname === "/" &&
                "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            Dashboard
          </Link>
        </div>

        <div>
          <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Utilities
          </p>
          <div className="space-y-1">
            {utilities.map((utility) => {
              const Icon = utility.icon;
              const isActive = pathname === utility.href;

              return (
                <Link
                  key={utility.href}
                  href={utility.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-md px-3 text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive &&
                      "bg-sidebar-accent text-sidebar-accent-foreground",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  <span className="truncate">{utility.title}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
