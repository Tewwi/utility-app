"use client";

import { Menu, Moon, PawPrint, Search, Sun, X } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { SidebarContent } from "@/components/common/sidebar-content";
import { getServerThemeSnapshot } from "@/lib/theme/get-server-theme-snapshot";
import { getThemeSnapshot } from "@/lib/theme/get-theme-snapshot";
import { subscribeToThemeChange } from "@/lib/theme/subscribe-to-theme-change";
import Oneko from "../oneko/Oneko";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isHasCat, setIsHasCat] = useState(true);

  const theme = useSyncExternalStore(
    subscribeToThemeChange,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";

    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.style.colorScheme = nextTheme;
    localStorage.setItem("theme", nextTheme);
    window.dispatchEvent(new Event("themechange"));
  }

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-sidebar-border lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative h-full w-80 max-w-[86vw] border-r border-sidebar-border shadow-2xl">
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen flex-col lg:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b border-border bg-background/90 px-4 backdrop-blur md:px-6 justify-between">
          <button
            type="button"
            aria-label="Open navigation"
            className="flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            {mobileOpen ? (
              <X className="size-4" aria-hidden="true" />
            ) : (
              <Menu className="size-4" aria-hidden="true" />
            )}
          </button>

          <div className="relative min-w-0 flex-1 md:max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              aria-label="Search utilities"
              placeholder="Search utilities"
              className="h-9 w-full rounded-md border border-input bg-card px-9 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              className={cn(
                "flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-destructive",
                isHasCat && "text-primary",
              )}
              onClick={() => setIsHasCat((current) => !current)}
            >
              <PawPrint className="size-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-label={
                theme === "dark"
                  ? "Switch to light theme"
                  : "Switch to dark theme"
              }
              className={
                "flex size-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
              }
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <Sun className="size-4" aria-hidden="true" />
              ) : (
                <Moon className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </header>

        <Oneko isHasCat={isHasCat} />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
