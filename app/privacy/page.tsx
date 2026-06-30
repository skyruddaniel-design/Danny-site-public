import {
  CONTACT_EMAIL,
  DATA_CONTROLLER,
  PRIVACY_LAST_UPDATED,
  SITE_NAME,
} from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: `Privacy policy | ${SITE_NAME}`,
  description: `How ${SITE_NAME} collects and uses personal data.`,
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24 md:px-12 md:py-28 lg:px-16">
      <p className="font-mono text-[10px] tracking-[0.22em] text-primary uppercase md:text-xs">
        Legal
      </p>

      <h1 className="mt-4 font-heading text-3xl font-bold tracking-tight md:text-4xl">
        Privacy policy
      </h1>

      <p className="mt-3 text-sm text-muted-foreground">
        Last updated: {PRIVACY_LAST_UPDATED}
      </p>

      <div className="mt-10 space-y-10 text-base leading-relaxed text-foreground/90">
        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            1. Who we are
          </h2>

          <p className="mt-3">
            {DATA_CONTROLLER} operates the {SITE_NAME} website and is the data
            controller for the personal data described in this policy.
          </p>

          <p className="mt-3">
            For privacy-related questions or requests, contact us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            2. What personal data we collect
          </h2>

          <p className="mt-3">
            We only collect personal data that you choose to provide through our
            contact form. This may include:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Name</li>
            <li>Email address</li>
            <li>Company name (optional)</li>
            <li>Service you are interested in</li>
            <li>Project details and any other information you choose to share</li>
          </ul>

          <p className="mt-3">
            We do not use analytics, advertising trackers, or non-essential
            cookies on this website.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            3. How we collect data
          </h2>

          <p className="mt-3">
            We collect personal data when you submit the contact form on our
            website. The information is processed so we can receive and respond
            to your inquiry.
          </p>

          <p className="mt-3">
            Like most websites, our hosting provider may automatically process
            limited technical information required to deliver the website
            securely, such as your IP address, browser type, and request logs.
            We do not use this information to identify visitors or for
            marketing.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            4. Why we use your data and legal basis
          </h2>

          <p className="mt-3">We use your personal data to:</p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Respond to your inquiry</li>
            <li>Follow up regarding a potential project or collaboration</li>
            <li>Maintain a record of our communication where appropriate</li>
          </ul>

          <p className="mt-3">
            Under the UK/EU General Data Protection Regulation (GDPR), we
            process your personal data on the following legal bases:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong className="font-medium text-foreground">
                Article 6(1)(b)
              </strong>{" "}
              — to take steps at your request before entering into a contract,
              such as responding to project enquiries.
            </li>

            <li>
              <strong className="font-medium text-foreground">
                Article 6(1)(f)
              </strong>{" "}
              — our legitimate interest in responding to enquiries and managing
              business communications.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            5. How long we keep your data
          </h2>

          <p className="mt-3">
            We keep contact form submissions only for as long as necessary to
            respond to your inquiry and manage any follow-up. If a business
            relationship develops, we may retain relevant correspondence for
            administrative, accounting, or legal purposes.
          </p>

          <p className="mt-3">
            When personal data is no longer needed, it is deleted or anonymised.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            6. Who we share data with
          </h2>

          <p className="mt-3">
            We do not sell your personal data. We may share it only with:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              Service providers that help us operate the website or deliver
              email (such as hosting or email services), under data processing
              agreements where required.
            </li>

            <li>
              Authorities or professional advisers where we are legally required
              to do so.
            </li>
          </ul>

          <p className="mt-3">
            If personal data is transferred outside the UK or EEA, we ensure
            appropriate safeguards are in place, such as Standard Contractual
            Clauses or an adequacy decision where applicable.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            7. Your rights
          </h2>

          <p className="mt-3">
            If you are in the UK or EEA, you have the right to:
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate personal data</li>
            <li>Request deletion of your personal data in certain circumstances</li>
            <li>Restrict or object to certain processing</li>
            <li>Receive your personal data in a portable format where applicable</li>
          </ul>

          <p className="mt-3">
            To exercise any of these rights, contact us at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            . We will respond within one month, as required by applicable law.
          </p>

          <p className="mt-3">
            You also have the right to lodge a complaint with your local data
            protection authority. In Norway, this is{" "}
            <a
              href="https://www.datatilsynet.no/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Datatilsynet
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            8. Security
          </h2>

          <p className="mt-3">
            We take appropriate technical and organisational measures to protect
            personal data against unauthorised access, loss, misuse, or
            disclosure. While no method of transmission over the internet is
            completely secure, we work to protect the information you provide.
          </p>
        </section>

        <section>
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            9. Changes to this policy
          </h2>

          <p className="mt-3">
            We may update this privacy policy from time to time. Any changes
            will be published on this page, and the &quot;Last updated&quot;
            date will be revised accordingly.
          </p>
        </section>
      </div>

      <p className="mt-12">
        <Link
          href="/"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          &larr; Back to home
        </Link>
      </p>
    </main>
  );
}