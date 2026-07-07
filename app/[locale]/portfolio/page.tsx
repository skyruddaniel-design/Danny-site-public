import { PortfolioPage } from "@/components/portfolio-page";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";


type PageProps = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return buildPageMetadata({
    locale: locale as Locale,
    title: t("portfolioTitle"),
    description: t("portfolioDescription"),
    pathname: "/portfolio",
  });
}

export default async function Portfolio({ params }: PageProps) {
  const { locale } = params;
  setRequestLocale(locale);

  return (
    <main>
      <PortfolioPage />
    </main>
  );
}
