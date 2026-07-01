import { BRAND_ASSETS } from "@/lib/brand/site";
import { SITE_URL } from "@/lib/seo/site";

const accent = "#0e7c7b";
const foreground = "#0b1020";
const muted = "#61777d";
const background = "#fafaf7";
const line = "#e8ece9";

const emailLogoUrl = new URL(BRAND_ASSETS.logo, SITE_URL).toString();

export function emailShell(args: {
  title: string;
  preheader?: string;
  lines: string[];
  ctaLabel: string;
  ctaUrl: string;
  footer: string;
  logoUrl?: string;
}) {
  const bodyHtml = args.lines
    .map(
      (line) =>
        `<p style="margin: 0 0 16px; font-size: 15px; line-height: 1.65; color: ${foreground};">${line}</p>`,
    )
    .join("");

  const preheaderHtml = args.preheader
    ? `<div style="display: none; max-height: 0; overflow: hidden; opacity: 0; color: transparent; mso-hide: all;">${args.preheader}</div>`
    : "";

  const logoUrl = args.logoUrl ?? emailLogoUrl;
  const logoHtml = `<img src="${logoUrl}" alt="CliniqFlow" width="200" height="100" style="display: block; margin: 0 0 20px; height: auto; max-width: 200px;" />`;

  const html = `
    ${preheaderHtml}
    <div style="margin: 0; padding: 32px 16px; background: ${background}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
      <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border: 1px solid ${line}; border-radius: 20px; overflow: hidden; box-shadow: 0 18px 48px rgba(11, 16, 32, 0.06);">
        <div style="height: 4px; background: linear-gradient(90deg, ${accent}, #14a39f);"></div>
        <div style="padding: 32px 28px 28px;">
          ${logoHtml}
          <h1 style="margin: 0 0 18px; font-size: 26px; line-height: 1.25; font-weight: 600; color: ${foreground}; letter-spacing: -0.02em;">${args.title}</h1>
          ${bodyHtml}
          <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 28px 0 8px;">
            <tr>
              <td style="border-radius: 999px; background: ${accent}; box-shadow: 0 10px 24px rgba(14, 124, 123, 0.22);">
                <a href="${args.ctaUrl}" style="display: inline-block; padding: 13px 26px; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; letter-spacing: 0.01em;">
                  ${args.ctaLabel}
                </a>
              </td>
            </tr>
          </table>
          <p style="margin: 18px 0 0; font-size: 13px; line-height: 1.55; color: ${muted};">
            Or copy this link into your browser:<br />
            <a href="${args.ctaUrl}" style="color: ${accent}; word-break: break-all;">${args.ctaUrl}</a>
          </p>
        </div>
        <div style="padding: 18px 28px 24px; border-top: 1px solid ${line}; background: #fcfcfb;">
          <p style="margin: 0; font-size: 12px; line-height: 1.6; color: ${muted};">${args.footer}</p>
        </div>
      </div>
      <p style="max-width: 520px; margin: 16px auto 0; text-align: center; font-size: 11px; line-height: 1.5; color: ${muted};">
        CliniqFlow · Calm intake and documentation workflows for clinics
      </p>
    </div>
  `;

  const text = [
    args.preheader,
    args.preheader ? "" : undefined,
    args.title,
    "",
    ...args.lines.map((line) => line.replace(/<[^>]+>/g, "")),
    "",
    `${args.ctaLabel}: ${args.ctaUrl}`,
    "",
    args.footer,
    "",
    "CliniqFlow · Calm intake and documentation workflows for clinics",
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  return { html, text };
}
