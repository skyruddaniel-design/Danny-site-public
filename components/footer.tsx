"use client";

import { Link } from "@/i18n/navigation";
import { SITE_NAME } from "@/lib/site";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-12 lg:px-16">
        <p>{t("copyright", { year, siteName: SITE_NAME })}</p>
        <nav aria-label={t("nav.label")}>
          <Link
            href="/privacy"
            className="font-medium text-foreground/80 transition-colors hover:text-primary"
          >
            {t("privacyLink")}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
