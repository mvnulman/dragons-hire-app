'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { cn } from '@/lib/utils';

export function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div
      role="group"
      aria-label="Language"
      className="flex items-center rounded-full border border-border/70 p-0.5"
    >
      {routing.locales.map((candidate) => (
        <button
          key={candidate}
          type="button"
          onClick={() => router.replace(pathname, { locale: candidate })}
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wider transition-colors',
            candidate === locale
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {candidate}
        </button>
      ))}
    </div>
  );
}
