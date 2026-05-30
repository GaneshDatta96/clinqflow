const accent = "#0e7c7b";
const muted = "#61777d";

export function emailShell(args: {
  title: string;
  lines: string[];
  ctaLabel: string;
  ctaUrl: string;
  footer: string;
}) {
  const bodyHtml = args.lines.map((line) => `<p style="margin: 0 0 14px; line-height: 1.55;">${line}</p>`).join("");

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 520px; margin: 0 auto; color: #0b1020;">
      <p style="margin: 0 0 18px; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: ${muted};">CliniqFlow</p>
      <h1 style="margin: 0 0 16px; font-size: 22px; font-weight: 600; color: ${accent};">${args.title}</h1>
      ${bodyHtml}
      <p style="margin: 22px 0 18px;">
        <a href="${args.ctaUrl}" style="display: inline-block; background: ${accent}; color: #fff; padding: 11px 22px; border-radius: 999px; text-decoration: none; font-weight: 600; font-size: 14px;">
          ${args.ctaLabel}
        </a>
      </p>
      <p style="margin: 0; color: ${muted}; font-size: 13px; line-height: 1.5;">${args.footer}</p>
    </div>
  `;

  const text = [
    args.title,
    "",
    ...args.lines.map((line) => line.replace(/<[^>]+>/g, "")),
    "",
    `${args.ctaLabel}: ${args.ctaUrl}`,
    "",
    args.footer,
  ].join("\n");

  return { html, text };
}
