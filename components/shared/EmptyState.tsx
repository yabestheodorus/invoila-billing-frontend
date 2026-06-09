import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import type { IconType } from 'react-icons';

/**
 * A polished blank slate: a haloed icon, a heading, supporting copy, and an
 * optional primary action. Used app-wide so every empty list/table looks the
 * same. `bordered` adds the dashed card (standalone use); turn it off when
 * nesting inside an existing card. `size="sm"` tightens padding for in-card use.
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  children,
  size = 'default',
  bordered = true,
  className = '',
}: {
  icon: IconType;
  title: string;
  description?: React.ReactNode;
  action?: { label: string; href: string };
  children?: React.ReactNode;
  size?: 'default' | 'sm';
  bordered?: boolean;
  className?: string;
}) {
  const classes = [
    'flex flex-col items-center text-center',
    bordered ? 'rounded-2xl border border-dashed border-border bg-surface/40' : '',
    size === 'sm' ? 'px-6 py-10' : 'px-6 py-16',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      {/* Concentric halo behind the icon for a premium, deliberate feel. */}
      <div className="relative mb-5 flex items-center justify-center">
        <span aria-hidden className="absolute size-24 rounded-full bg-primary/[0.06]" />
        <span aria-hidden className="absolute size-16 rounded-full bg-primary/10" />
        <span className="relative flex size-12 items-center justify-center rounded-2xl bg-surface text-primary shadow-sm ring-1 ring-border">
          <Icon className="size-5" />
        </span>
      </div>

      <h3 className="font-heading text-base font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      )}

      {action && (
        <Link
          href={action.href}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover"
        >
          {action.label}
          <FiArrowRight className="size-4" />
        </Link>
      )}

      {children}
    </div>
  );
}
