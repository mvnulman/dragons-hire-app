'use client';

import { useTranslations } from 'next-intl';
import { AccountMenu } from '@/components/account-menu';
import { BrandMark } from '@/components/brand-mark';
import { LocaleSwitcher } from '@/components/locale-switcher';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dragons', key: 'dragons' },
  { href: '/#how-it-works', key: 'howItWorks' },
] as const;

export function SiteHeader() {
  const t = useTranslations('nav');
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <BrandMark />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                'rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground',
                pathname === item.href && 'text-foreground',
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LocaleSwitcher />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
