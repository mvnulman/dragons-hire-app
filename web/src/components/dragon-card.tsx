import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import type { Dragon } from '@/lib/api/types';
import { formatMoney, formatNumber } from '@/lib/format';
import { cn } from '@/lib/utils';

const RISK_ACCENT: Record<Dragon['maxRiskLevel'], string> = {
  LOW: 'text-emerald-400/90',
  MEDIUM: 'text-amber-400/90',
  HIGH: 'text-orange-400/90',
  EXTREME: 'text-red-400/90',
};

export function DragonCard({ dragon, locale }: { dragon: Dragon; locale: string }) {
  const t = useTranslations('dragon');
  const temperament = useTranslations('temperament');
  const risk = useTranslations('risk');
  const status = useTranslations('status');
  const currency = useTranslations('currency');

  const available = dragon.status === 'AVAILABLE';

  return (
    <Card className="group overflow-hidden border-border/70 bg-card/60 transition-colors hover:border-primary/40">
      <div className="relative flex h-44 items-end overflow-hidden bg-gradient-to-br from-primary/25 via-card to-card p-4">
        {dragon.imageUrl ? (
          <>
            <Image
              src={dragon.imageUrl}
              alt={dragon.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
              className="object-cover opacity-90 saturate-[0.85] transition-transform duration-700 group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-card/10" />
          </>
        ) : (
          <span
            aria-hidden="true"
            className="absolute -right-2 -top-6 font-display text-[7rem] leading-none text-primary/15 transition-transform duration-500 group-hover:scale-105"
          >
            {dragon.name.charAt(0)}
          </span>
        )}
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {dragon.species.name}
          </p>
          <h3 className="font-display text-2xl leading-tight">{dragon.name}</h3>
        </div>
        <Badge
          variant="outline"
          className={cn(
            'absolute right-3 top-3 border-border/60 bg-background/70 backdrop-blur',
            available ? 'text-emerald-400' : 'text-muted-foreground',
          )}
        >
          {status(dragon.status)}
        </Badge>
      </div>

      <CardContent className="space-y-4 pt-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-normal">
            {temperament(dragon.temperament)}
          </Badge>
          <Badge variant="outline" className="font-normal">
            <span className={RISK_ACCENT[dragon.maxRiskLevel]}>
              {risk(dragon.maxRiskLevel)}
            </span>
          </Badge>
          <span className="ml-auto text-xs text-muted-foreground">{dragon.baseCity}</span>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">{t('load')}</dt>
            <dd className="tabular-nums">
              {formatNumber(dragon.maxLoadKg, locale)} kg
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">{t('range')}</dt>
            <dd className="tabular-nums">
              {formatNumber(dragon.flightRangeKm, locale)} km
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">{t('speed')}</dt>
            <dd className="tabular-nums">
              {formatNumber(dragon.flightSpeedKmH, locale)} km/h
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <dt className="text-muted-foreground">{t('rest')}</dt>
            <dd className="tabular-nums">
              {dragon.restHours} {t('hours')}
            </dd>
          </div>
        </dl>
      </CardContent>

      <CardFooter className="flex items-end justify-between border-t border-border/60 pt-4">
        <div>
          <p className="font-display text-xl leading-none" title={currency('name')}>
            {formatMoney(dragon.hourlyRate, locale)}
          </p>
          <p className="text-xs text-muted-foreground">{t('rate')}</p>
        </div>
        <span className="text-sm text-muted-foreground transition-colors group-hover:text-primary">
          {available ? '→' : '—'}
        </span>
      </CardFooter>
    </Card>
  );
}
