import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { OrganizationJsonLd } from "@/components/organization-json-ld";
import { Process } from "@/components/process";
import { Services } from "@/components/services";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata, getSiteUrl } from "@/lib/seo";
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
    title: t("homeTitle"),
    description: t("homeDescription"),
    pathname: "/",
  });
}

export default async function Home({ params }: PageProps) {
  const { locale } = params;

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "meta" });
  const siteUrl = getSiteUrl();

  return (
    <main>
      {siteUrl ? (
        <OrganizationJsonLd
          url={siteUrl}
          description={t("homeDescription")}
          locale={locale as Locale}
        />
      ) : null}

      <Hero />
      <Services />
      <Process />
      <Contact />
    </main>
  );
}