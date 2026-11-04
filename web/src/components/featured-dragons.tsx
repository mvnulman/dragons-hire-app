'use client';

import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { DragonCard } from '@/components/dragon-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from '@/i18n/navigation';
import { apiFetch, toQueryString } from '@/lib/api/client';
import type { Dragon, Paginated } from '@/lib/api/types';

export function FeaturedDragons() {
  const locale = useLocale();
  const t = useTranslations('featured');

  const { data, isPending, isError } = useQuery({
    queryKey: ['dragons', 'featured', locale],
    queryFn: () =>
      apiFetch<Paginated<Dragon>>(
        `/api/dragons${toQueryString({
          locale,
          pageSize: 3,
          availability: 'available',
          sort: 'rate_asc',
        })}`,
      ),
  });

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-xl space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl">{t('title')}</h2>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Link
          href="/dragons"
          className="text-sm text-primary underline-offset-4 hover:underline"
        >
          {t('viewAll')} →
        </Link>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isPending &&
          Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-[26rem] w-full rounded-xl" />
          ))}

        {isError && (
          <p className="text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
            {t('empty')}
          </p>
        )}

        {data?.items.map((dragon) => (
          <DragonCard key={dragon.id} dragon={dragon} locale={locale} />
        ))}
      </div>
    </section>
  );
}
