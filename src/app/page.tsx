import { Activity, Clock3, Star, WandSparkles } from "lucide-react";
import { UtilityCard } from "@/components/common/utility-card";
import { utilities } from "@/lib/utilities";

const stats = [
  {
    label: "Utilities",
    value: utilities.length.toString(),
    icon: WandSparkles,
  },
  { label: "Categories", value: "1", icon: Activity },
  { label: "Recent", value: "1", icon: Clock3 },
  { label: "Favorites", value: "0", icon: Star },
];

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <section className="rounded-lg border border-border bg-card p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">
              Utility workspace
            </p>
            <h1 className="mt-2 font-heading text-3xl font-semibold leading-10 md:text-4xl">
              A focused toolkit for everyday tasks
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
              Start with a single QR Generator page in a clean app shell that
              can grow into more utilities later.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[420px]">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.label}
                  className="rounded-md border border-border bg-background p-3"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                    <span className="text-xs">{stat.label}</span>
                  </div>
                  <p className="mt-3 font-heading text-2xl font-semibold">
                    {stat.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-heading text-lg font-semibold">
                Available utility
              </h2>
              <p className="text-sm text-muted-foreground">
                Open the card to work with the dedicated tool page.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {["All", "Content"].map((item) => (
                <span
                  key={item}
                  className="rounded-md border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {utilities.map((utility) => (
              <UtilityCard key={utility.href} utility={utility} />
            ))}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="font-heading text-base font-semibold">Recent</h2>
            <div className="mt-4 space-y-3">
              {utilities.map((utility) => {
                const Icon = utility.icon;

                return (
                  <div
                    key={utility.href}
                    className="flex items-center gap-3 rounded-md border border-border bg-background p-3"
                  >
                    <div
                      className={`flex size-9 items-center justify-center rounded-md ${utility.accent}`}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {utility.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {utility.category}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-4 shadow-sm">
            <h2 className="font-heading text-base font-semibold">Favorites</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Favorite tools can appear here once interactive pinning is added.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
