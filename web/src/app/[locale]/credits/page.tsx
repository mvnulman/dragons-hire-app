import type { Metadata } from 'next';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Badge } from '@/components/ui/badge';
import works from '@/content/art-credits.json';

type Artwork = {
  slug: string;
  name: string;
  image: string;
  title: string;
  artist: string;
  license: string;
  sourceUrl: string;
};

const artworks = works as Artwork[];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'credits' });

  return { title: t('title'), description: t('subtitle') };
}

export default async function CreditsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('credits');

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.22em] text-primary/90">
          {t('eyebrow')}
        </p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl">{t('title')}</h1>
        <p className="mt-4 max-w-2xl text-balance-pretty leading-relaxed text-muted-foreground">
          {t('subtitle')}
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          {artworks.map((artwork) => (
            <article
              key={artwork.slug}
              className="overflow-hidden rounded-xl border border-border/60 bg-card/40"
            >
              <div className="relative aspect-4/3">
                <Image
                  src={artwork.image}
                  alt={artwork.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 480px"
                  className="object-cover"
                />
              </div>

              <div className="space-y-1.5 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {artwork.name}
                </p>
                <h2 className="font-display text-lg leading-tight">{artwork.title}</h2>
                <p className="text-sm text-muted-foreground">{artwork.artist}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
                  <Badge variant="outline" className="font-normal">
                    {artwork.license}
                  </Badge>
                  <a
                    href={artwork.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-sm text-primary underline-offset-4 hover:underline"
                  >
                    {t('viewSource')} ↗
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-12 text-sm text-muted-foreground">{t('note')}</p>
      </main>

      <SiteFooter />
    </div>
  );
}
