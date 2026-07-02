import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MarketingPageShell } from "@/components/seo/marketing-page-shell";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { NICHE_PAGES, getNichePage } from "@/lib/seo/niche-pages";

type PageParams = { niche: string };

export function generateStaticParams(): PageParams[] {
  return NICHE_PAGES.map((page) => ({ niche: page.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>;
}): Promise<Metadata> {
  const { niche } = await params;
  const page = getNichePage(niche);

  if (!page) {
    return buildPageMetadata({
      title: "Clinic intake and documentation workflows",
      path: "/for",
    });
  }

  return buildPageMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/for/${page.slug}`,
    ogTitle: page.h1,
    ogSubtitle: page.metaDescription,
  });
}

export default async function NichePage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { niche } = await params;
  const page = getNichePage(niche);

  if (!page) {
    notFound();
  }

  return (
    <MarketingPageShell
      label={`For ${page.label.toLowerCase()}`}
      title={page.h1}
      description={page.intro}
      breadcrumbLabel={page.label}
      breadcrumbPath={`/for/${page.slug}`}
      relatedLinks={page.relatedLinks}
      sections={page.sections.map((section) => ({
        title: section.title,
        content: (
          <>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </>
        ),
      }))}
    />
  );
}
