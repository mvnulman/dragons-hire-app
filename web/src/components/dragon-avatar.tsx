import Image from 'next/image';
import { cn } from '@/lib/utils';

const SIZES = {
  sm: 'size-7',
  md: 'size-9',
  lg: 'size-12',
} as const;

type DragonAvatarProps = {
  src?: string | null;
  name: string;
  size?: keyof typeof SIZES;
  className?: string;
};

/**
 * Circular placeholder identity. Until the account system lands, this is the
 * signed-out avatar; later it can render the user's chosen dragon.
 */
export function DragonAvatar({ src, name, size = 'md', className }: DragonAvatarProps) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full',
        'bg-gradient-to-br from-primary/30 via-card to-card ring-1 ring-border/70',
        SIZES[size],
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name} fill sizes="48px" className="object-cover" />
      ) : (
        <span className="font-display text-sm text-primary">
          {name.charAt(0).toUpperCase()}
        </span>
      )}
    </span>
  );
}
