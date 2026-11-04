import { Link } from '@/i18n/navigation';

export function BrandMark() {
  return (
    <Link href="/" className="group flex items-center gap-2.5">
      <span className="relative grid size-9 place-items-center rounded-full border border-primary/40 bg-primary/10">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="size-5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5"
        >
          <path
            d="M12 2c1.2 2.4.6 4.2-1 5.6C9.4 8.9 8 10.4 8 12.6c0 1.7.9 3.1 2.3 3.9-.4-1.6.2-3 1.7-4.1 1.8-1.3 2.3-3.2 1.6-5.2 2.6 1.5 4.4 4.2 4.4 7.3 0 4.7-3.8 8.5-8.5 8.5S1 19.2 1 14.5C1 10.4 3.8 6.9 7.7 5.6 6.4 8 6.9 9.9 8.7 11c-.6-2.9 1-5.9 3.3-9Z"
            fill="currentColor"
            fillOpacity="0.9"
          />
        </svg>
      </span>
      <span className="font-display text-xl tracking-tight">
        Dragons<span className="text-primary">.</span>Hire
      </span>
    </Link>
  );
}
