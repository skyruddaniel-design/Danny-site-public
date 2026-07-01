import { Footer } from "@/components/footer";
import { HeroIntroProvider } from "@/components/hero-intro-context";
import { SectionHashScroll } from "@/components/section-hash-scroll";
import { SiteHeader } from "@/components/site-header";
import { VercelAnalytics } from "@/components/vercel-analytics";
import { routing } from "@/i18n/routing";
import { getMetadataBase, buildSiteIcons } from "@/lib/seo";
import { SITE_NAME } from "@/lib/site";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { Geist_Mono, Montserrat, Outfit } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: getMetadataBase(),
    title: SITE_NAME,
    description: t("siteDescription"),
    icons: buildSiteIcons(),
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={cn(
        "h-full antialiased motion-reduce:scroll-auto",
        montserrat.variable,
        outfit.variable,
        geistMono.variable
      )}
      data-scroll-behavior="smooth"
    >
      <body className="flex min-h-screen flex-col font-sans">
        <NextIntlClientProvider messages={messages}>
          <HeroIntroProvider>
            <SectionHashScroll />
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <Footer />
          </HeroIntroProvider>
        </NextIntlClientProvider>
        <VercelAnalytics />
      </body>
    </html>
  );
}
