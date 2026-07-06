import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";
import {
  CONTACT_EMAIL,
  DATA_CONTROLLER,
  PRIVACY_LAST_UPDATED,
  SITE_NAME,
} from "@/lib/site";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const runtime = "edge";

type PageProps = {
  params: { locale: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy.metadata" });

  return buildPageMetadata({
    locale: locale as Locale,
    title: t("title", { siteName: SITE_NAME }),
    description: t("description", { siteName: SITE_NAME }),
    pathname: "/privacy",
  });
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <main className="mx-auto max-w-3xl px-6 py-24 md:px-12 md:py-28 lg:px-16">
      <p className="font-mono text-[10px] tracking-[0.22em] text-primary uppercase md:text-xs">
        {t("eyebrow")}
      </p>

      <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
        {t("heading")}
      </h1>

      <p className="mt-3 text-sm text-muted-foreground">
        {t("lastUpdated", { date: PRIVACY_LAST_UPDATED })}
      </p>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("sections.whoWeAre.title")}
          </h2>

          <p className="mt-3">
            {t("sections.whoWeAre.intro", {
              dataController: DATA_CONTROLLER,
              siteName: SITE_NAME,
            })}
          </p>

          <p className="mt-3">
            {t("sections.whoWeAre.contactIntro")}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            {t("sections.whoWeAre.contactOutro")}
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("sections.whatWeCollect.title")}
          </h2>

          <p className="mt-3">{t("sections.whatWeCollect.intro")}</p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>{t("sections.whatWeCollect.items.name")}</li>
            <li>{t("sections.whatWeCollect.items.email")}</li>
            <li>{t("sections.whatWeCollect.items.company")}</li>
            <li>{t("sections.whatWeCollect.items.service")}</li>
            <li>{t("sections.whatWeCollect.items.details")}</li>
          </ul>

          <p className="mt-3">{t("sections.whatWeCollect.noTracking")}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("sections.cookies.title")}
          </h2>

          <p className="mt-3">{t("sections.cookies.intro")}</p>

          <dl className="mt-4 space-y-3 border border-border bg-card/50 p-4 text-sm">
            <div className="grid gap-1 sm:grid-cols-[7rem_1fr]">
              <dt className="font-medium text-muted-foreground">
                {t("sections.cookies.fields.name")}
              </dt>
              <dd>
                <code className="font-mono text-xs">
                  {t("sections.cookies.localeName")}
                </code>
              </dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[7rem_1fr]">
              <dt className="font-medium text-muted-foreground">
                {t("sections.cookies.fields.purpose")}
              </dt>
              <dd>{t("sections.cookies.localePurpose")}</dd>
            </div>
            <div className="grid gap-1 sm:grid-cols-[7rem_1fr]">
              <dt className="font-medium text-muted-foreground">
                {t("sections.cookies.fields.duration")}
              </dt>
              <dd>{t("sections.cookies.localeDuration")}</dd>
            </div>
          </dl>

          <p className="mt-3">{t("sections.cookies.control")}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("sections.howWeCollect.title")}
          </h2>

          <p className="mt-3">{t("sections.howWeCollect.form")}</p>

          <p className="mt-3">{t("sections.howWeCollect.hosting")}</p>

          <p className="mt-3">{t("sections.howWeCollect.analytics")}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("sections.whyWeUse.title")}
          </h2>

          <p className="mt-3">{t("sections.whyWeUse.intro")}</p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>{t("sections.whyWeUse.purposes.respond")}</li>
            <li>{t("sections.whyWeUse.purposes.followUp")}</li>
            <li>{t("sections.whyWeUse.purposes.records")}</li>
          </ul>

          <p className="mt-3">{t("sections.whyWeUse.gdprIntro")}</p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>{t("sections.whyWeUse.article6b")}</li>
            <li>{t("sections.whyWeUse.article6f")}</li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("sections.retention.title")}
          </h2>

          <p className="mt-3">{t("sections.retention.main")}</p>

          <p className="mt-3">{t("sections.retention.deletion")}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("sections.sharing.title")}
          </h2>

          <p className="mt-3">{t("sections.sharing.intro")}</p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>{t("sections.sharing.providers")}</li>
            <li>{t("sections.sharing.authorities")}</li>
          </ul>

          <p className="mt-3">{t("sections.sharing.transfers")}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("sections.rights.title")}
          </h2>

          <p className="mt-3">{t("sections.rights.intro")}</p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>{t("sections.rights.items.access")}</li>
            <li>{t("sections.rights.items.correction")}</li>
            <li>{t("sections.rights.items.deletion")}</li>
            <li>{t("sections.rights.items.restrict")}</li>
            <li>{t("sections.rights.items.portability")}</li>
          </ul>

          <p className="mt-3">
            {t("sections.rights.exerciseIntro")}{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            {t("sections.rights.exerciseOutro")}
          </p>

          <p className="mt-3">
            {t("sections.rights.complaintIntro")}{" "}
            <a
              href="https://www.datatilsynet.no/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Datatilsynet
            </a>
            {t("sections.rights.complaintOutro")}
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("sections.security.title")}
          </h2>

          <p className="mt-3">{t("sections.security.body")}</p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            {t("sections.changes.title")}
          </h2>

          <p className="mt-3">{t("sections.changes.body")}</p>
        </section>
      </div>

      <p className="mt-12">
        <Link
          href="/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          &larr; {t("backToHome")}
        </Link>
      </p>
    </main>
  );
}
