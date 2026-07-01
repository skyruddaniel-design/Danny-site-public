import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import type { Locale } from "@/i18n/routing";

type OrganizationJsonLdProps = {
  url: string;
  description: string;
  locale: Locale;
};

export function OrganizationJsonLd({
  url,
  description,
  locale,
}: OrganizationJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: SITE_NAME,
        url,
        email: CONTACT_EMAIL,
        description,
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: SITE_NAME,
        description,
        inLanguage: locale === "no" ? "nb-NO" : "en-US",
        publisher: {
          "@id": `${url}/#organization`,
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
