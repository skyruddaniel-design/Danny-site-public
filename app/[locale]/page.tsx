import { Contact } from "@/components/contact";
import { Hero } from "@/components/hero";
import { Process } from "@/components/process";
import { Services } from "@/components/services";
import { setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <Hero />
      <Services />
      <Process />
      <Contact />
    </main>
  );
}
