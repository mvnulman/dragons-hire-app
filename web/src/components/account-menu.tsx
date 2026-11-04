'use client';

import { ChevronDown, Compass, Palette } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DragonAvatar } from '@/components/dragon-avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@/i18n/navigation';

export function AccountMenu() {
  const t = useTranslations('account');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t('open')}
        className="group flex items-center gap-2 rounded-full border border-border/70 py-1 pl-1 pr-2 transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 data-[popup-open]:border-primary/40"
      >
        <DragonAvatar src="/dragons/ignis.jpg" name={t('guest')} />
        <span className="hidden text-sm text-muted-foreground transition-colors group-hover:text-foreground sm:block">
          {t('signIn')}
        </span>
        <ChevronDown className="size-3.5 text-muted-foreground" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="space-y-0.5 px-2 py-2">
          <p className="text-sm font-medium">{t('guest')}</p>
          <p className="text-xs leading-snug text-muted-foreground">{t('hint')}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href="/dragons" />}>
          <Compass />
          {t('explore')}
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/credits" />}>
          <Palette />
          {t('credits')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
