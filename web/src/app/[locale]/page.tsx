import { ArrowRight, Gauge, ShieldCheck, Timer } from 'lucide-react';
import Image from 'next/image';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { FeaturedDragons } from '@/components/featured-dragons';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { Link } from '@/i18n/navigation';

const STEP_KEYS = ['describe', 'match', 'book'] as const;
const SIGNAL_KEYS = ['price', 'hold', 'score'] as const;
const SIGNAL_ICONS = {
  price: Gauge,
  hold: Timer,
  score: ShieldCheck,
} as const;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const hero = await getTranslations('hero');
  const steps = await getTranslations('howItWorks');
  const signals = await getTranslations('signals');

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="ember-glow relative overflow-hidden border-b border-border/60">
          <Image
            src="/art/hero-dragons.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="pointer-events-none object-cover object-[62%_38%] opacity-30 saturate-[0.8]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/92 to-background/45" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

          <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-4 pb-20 pt-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-28 lg:pt-24">
            <div className="space-y-6">
              <p className="text-xs uppercase tracking-[0.22em] text-primary/90">
                {hero('eyebrow')}
              </p>
              <h1 className="max-w-xl font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
                {hero('title')}
              </h1>
              <p className="max-w-lg text-balance-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                {hero('subtitle')}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/dragons"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  {hero('primaryCta')}
                  <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center rounded-md border border-border px-5 py-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {hero('secondaryCta')}
                </a>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-transparent blur-2xl" />
              <div className="relative rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {steps('subtitle')}
                </p>
                <ol className="mt-5 space-y-5">
                  {STEP_KEYS.map((key, index) => (
                    <li key={key} className="flex gap-4">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-primary/40 font-display text-sm text-primary">
                        {index + 1}
                      </span>
                      <div className="space-y-1">
                        <p className="font-medium leading-tight">{steps(`steps.${key}.title`)}</p>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {steps(`steps.${key}.description`)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-4 py-16 sm:px-6"
        >
          <div className="grid gap-6 md:grid-cols-3">
            {SIGNAL_KEYS.map((key) => {
              const Icon = SIGNAL_ICONS[key];
              return (
                <div
                  key={key}
                  className="rounded-xl border border-border/60 bg-card/40 p-6"
                >
                  <Icon className="size-5 text-primary" />
                  <h3 className="mt-4 font-display text-xl">{signals(`${key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {signals(`${key}.description`)}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <FeaturedDragons />
      </main>

      <SiteFooter />
    </div>
  );
}
