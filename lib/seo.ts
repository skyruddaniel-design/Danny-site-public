import { routing, type Locale } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const OG_IMAGE_PATH = "/images/og.jpg";

/** Add `public/images/favicon.png` — recommended 512×512 PNG (square). */
export const FAVICON_PATH = "/images/favicon.png";

export const SITE_PATHS = ["/", "/portfolio", "/privacy"] as const;

export type SitePath = (typeof SITE_PATHS)[number];

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configured) {
    return configured.replace(/\/$/, "");
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl.replace(/\/$/, "")}`;
  }

  return undefined;
}

export function getSitemapBaseUrl() {
  return getSiteUrl() ?? "http://localhost:3000";
}

export function getMetadataBase() {
  return new URL(getSitemapBaseUrl());
}

export function getLocalizedPath(locale: Locale, pathname: SitePath = "/") {
  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

export function getLocalizedUrl(locale: Locale, pathname: SitePath = "/") {
  const siteUrl = getSiteUrl();
  const path = getLocalizedPath(locale, pathname);
  return siteUrl ? `${siteUrl}${path}` : path;
}

export function buildLanguageAlternates(pathname: SitePath = "/") {
  const languages = Object.fromEntries(
    routing.locales.map((locale) => [locale, getLocalizedUrl(locale, pathname)])
  ) as Record<string, string>;

  languages["x-default"] = getLocalizedUrl(routing.defaultLocale, pathname);

  return languages;
}

export function buildSiteIcons(): NonNullable<Metadata["icons"]> {
  return {
    icon: [
      { url: FAVICON_PATH, sizes: "32x32", type: "image/png" },
      { url: FAVICON_PATH, sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: FAVICON_PATH, sizes: "180x180", type: "image/png" }],
    shortcut: FAVICON_PATH,
  };
}

export function buildPageMetadata({
  locale,
  title,
  description,
  pathname = "/",
}: {
  locale: Locale;
  title: string;
  description: string;
  pathname?: SitePath;
}): Metadata {
  const canonical = getLocalizedUrl(locale, pathname);

  return {
    metadataBase: getMetadataBase(),
    title,
    description,
    icons: buildSiteIcons(),
    alternates: {
      canonical,
      languages: buildLanguageAlternates(pathname),
    },
    openGraph: {
      type: "website",
      locale: locale === "no" ? "nb_NO" : "en_US",
      alternateLocale: locale === "no" ? ["en_US"] : ["nb_NO"],
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: OG_IMAGE_PATH,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
  };
}
