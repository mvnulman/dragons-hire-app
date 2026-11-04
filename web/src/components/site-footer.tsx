import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function SiteFooter() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const brand = useTranslations('brand');

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {brand('name')}. {t('rights')}
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/credits"
            className="underline-offset-4 transition-colors hover:text-foreground hover:underline"
          >
            {nav('credits')}
          </Link>
          <p className="text-xs">{t('note')}</p>
        </div>
      </div>
    </footer>
  );
}
