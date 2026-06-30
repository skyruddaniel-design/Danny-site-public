"use client";

import {
  ViewfinderContent,
  ViewfinderDecor,
} from "@/components/ui/button-viewfinder";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";

const LABELS: Record<Locale, string> = {
  no: "NO",
  en: "EN",
};

type LanguageSwitcherProps = {
  className?: string;
  inverted?: boolean;
};

export function LanguageSwitcher({
  className,
  inverted = false,
}: LanguageSwitcherProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "group/button relative isolate inline-flex h-9 shrink-0 items-stretch overflow-visible rounded-none bg-transparent bg-clip-padding text-xs font-semibold tracking-widest uppercase [--btn-corner:var(--primary)] select-none",
        inverted ? "text-white" : "text-foreground",
        className
      )}
      role="group"
      aria-label="Language"
    >
      <ViewfinderDecor mode="full" staticCorners />

      <ViewfinderContent className="h-full">
        <span className="inline-flex h-full items-stretch">
          {routing.locales.map((value) => {
            const active = locale === value;

            return (
              <button
                key={value}
                type="button"
                onClick={() => router.replace(pathname, { locale: value })}
                className={cn(
                  "relative inline-flex h-full min-w-10 items-center justify-center px-3 transition-[color,background-color] outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-inset",
                  active
                    ? "bg-primary text-primary-foreground"
                    : inverted
                      ? "text-white/70 hover:bg-primary/10 hover:text-white"
                      : "text-foreground/70 hover:bg-primary/8 hover:text-primary"
                )}
                aria-pressed={active}
              >
                {LABELS[value]}
              </button>
            );
          })}
        </span>
      </ViewfinderContent>
    </div>
  );
}
