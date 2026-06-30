import { PortfolioPage } from "@/components/portfolio-page";
import { setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Portfolio({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <PortfolioPage />
    </main>
  );
}
