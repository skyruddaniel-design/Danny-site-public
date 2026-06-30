import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["no", "en"],
  defaultLocale: "no",
  localePrefix: "always",
  localeDetection: true,
  localeCookie: {
    name: "NEXT_LOCALE",
    maxAge: 60 * 60 * 24 * 365,
  },
});

export type Locale = (typeof routing.locales)[number];
