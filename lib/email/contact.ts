import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { Resend } from "resend";

export type ContactEmailPayload = {
  name: string;
  email: string;
  company?: string;
  service: string;
  message: string;
};

function getContactRecipient() {
  return process.env.CONTACT_TO_EMAIL?.trim() || CONTACT_EMAIL;
}

function getContactSender() {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    `${SITE_NAME} <onboarding@resend.dev>`
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildContactEmailHtml(payload: ContactEmailPayload) {
  const companyRow = payload.company
    ? `<tr>
        <td style="padding:8px 0;color:#6b7280;font-size:13px;vertical-align:top;">Bedrift</td>
        <td style="padding:8px 0;font-size:14px;">${escapeHtml(payload.company)}</td>
      </tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="no">
  <body style="margin:0;padding:24px;background:#f8fafc;font-family:Arial,sans-serif;color:#111827;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;">
      <tr>
        <td style="padding:24px 24px 8px;">
          <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#6b7280;">${escapeHtml(SITE_NAME)}</p>
          <h1 style="margin:0;font-size:22px;line-height:1.3;">Ny henvendelse fra nettsiden</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 24px 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:13px;vertical-align:top;width:120px;">Navn</td>
              <td style="padding:8px 0;font-size:14px;">${escapeHtml(payload.name)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:13px;vertical-align:top;">E-post</td>
              <td style="padding:8px 0;font-size:14px;"><a href="mailto:${escapeHtml(payload.email)}">${escapeHtml(payload.email)}</a></td>
            </tr>
            ${companyRow}
            <tr>
              <td style="padding:8px 0;color:#6b7280;font-size:13px;vertical-align:top;">Tjeneste</td>
              <td style="padding:8px 0;font-size:14px;">${escapeHtml(payload.service)}</td>
            </tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f9fafb;border:1px solid #e5e7eb;">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#6b7280;">Melding</p>
            <p style="margin:0;white-space:pre-wrap;font-size:14px;line-height:1.6;">${escapeHtml(payload.message)}</p>
          </div>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildContactEmailText(payload: ContactEmailPayload) {
  const lines = [
    `Ny henvendelse fra ${SITE_NAME}`,
    "",
    `Navn: ${payload.name}`,
    `E-post: ${payload.email}`,
  ];

  if (payload.company) {
    lines.push(`Bedrift: ${payload.company}`);
  }

  lines.push(
    `Tjeneste: ${payload.service}`,
    "",
    "Melding:",
    payload.message
  );

  return lines.join("\n");
}

export function isResendConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey) {
    console.info("[contact] Resend is not configured yet. Submission:", payload);
    return { mode: "logged" as const };
  }

  const resend = new Resend(apiKey);
  const { data, error } = await resend.emails.send({
    from: getContactSender(),
    to: [getContactRecipient()],
    replyTo: payload.email,
    subject: `Ny henvendelse: ${payload.name} — ${payload.service}`,
    html: buildContactEmailHtml(payload),
    text: buildContactEmailText(payload),
  });

  if (error) {
    console.error("[contact] Resend error:", error);
    throw new Error("Failed to send contact email.");
  }

  return { mode: "sent" as const, id: data?.id };
}
