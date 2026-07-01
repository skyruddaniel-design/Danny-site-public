import { routing, type Locale } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/site";
import type { Metadata } from "next";

export const OG_IMAGE_PATH = "/images/mann-pa-bussen-thumbnail.png";

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
  const siteUrl = getSiteUrl();
  return siteUrl ? new URL(siteUrl) : undefined;
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
  const siteUrl = getSiteUrl();
  const canonical = getLocalizedUrl(locale, pathname);
  const ogImage = siteUrl ? `${siteUrl}${OG_IMAGE_PATH}` : OG_IMAGE_PATH;

  return {
    metadataBase: getMetadataBase(),
    title,
    description,
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
          url: ogImage,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
