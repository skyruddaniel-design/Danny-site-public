import { routing, type Locale } from "@/i18n/routing";
import {
  getLocalizedPath,
  getSitemapBaseUrl,
  SITE_PATHS,
  type SitePath,
} from "@/lib/seo";
import type { MetadataRoute } from "next";

function getChangeFrequency(pathname: SitePath) {
  if (pathname === "/") return "weekly";
  if (pathname === "/portfolio") return "weekly";
  return "yearly";
}

function getPriority(pathname: SitePath) {
  if (pathname === "/") return 1;
  if (pathname === "/portfolio") return 0.8;
  return 0.3;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSitemapBaseUrl();

  return SITE_PATHS.flatMap((pathname) =>
    routing.locales.map((locale) => ({
      url: `${baseUrl}${getLocalizedPath(locale as Locale, pathname)}`,
      lastModified: new Date(),
      changeFrequency: getChangeFrequency(pathname),
      priority: getPriority(pathname),
    }))
  );
}
