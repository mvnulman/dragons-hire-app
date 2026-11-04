import { useTranslations } from 'next-intl';

export function SiteFooter() {
  const t = useTranslations('footer');
  const brand = useTranslations('brand');

  return (
    <footer className="mt-auto border-t border-border/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {brand('name')}. {t('rights')}
        </p>
        <p className="text-xs">{t('note')}</p>
      </div>
    </footer>
  );
}
