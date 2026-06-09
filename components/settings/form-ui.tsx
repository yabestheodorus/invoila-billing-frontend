/** Shared primitives for the plain (non-TanStack) Settings forms. */

export const inputClass =
  'w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-foreground/40';
export const labelClass = 'block text-sm font-medium';
export const buttonClass =
  'rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover disabled:opacity-60';

/** A titled, bordered settings section. */
export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border p-6">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mb-5 mt-1 text-sm text-muted">{description}</p>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/** A labelled text input with an optional hint line. */
export function Field({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}
