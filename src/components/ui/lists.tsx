import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ActivityItem = {
  time: string;
  title: ReactNode;
  body?: ReactNode;
  by?: string;
};

/* Time-stamped activity list. Time sits in its own column so entries scan vertically. */
export function ActivityList({
  items,
  className,
}: {
  items: ActivityItem[];
  className?: string;
}) {
  return (
    <ol className={cx("@container divide-y divide-line", className)}>
      {items.map((item, i) => (
        <li
          key={i}
          className="flex flex-col gap-0.5 py-3.5 first:pt-0 last:pb-0 @md:grid @md:grid-cols-[104px_1fr] @md:gap-4"
        >
          <time className="tnum text-[13px] leading-5 text-fg-3">
            {item.time}
          </time>
          <div className="min-w-0">
            <p className="text-[15px] font-medium leading-5 text-fg">
              {item.title}
            </p>
            {item.body && (
              <p className="mt-0.5 text-[14px] leading-5 text-fg-2">
                {item.body}
              </p>
            )}
            {item.by && <p className="mt-1 text-xs text-fg-3">{item.by}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export type KV = { k: ReactNode; v: ReactNode };

/* Definition list for specs and properties. */
export function KeyValueList({
  items,
  className,
  columns = 1,
}: {
  items: KV[];
  className?: string;
  columns?: 1 | 2;
}) {
  return (
    <dl
      className={cx(
        "grid gap-x-8 gap-y-2.5 text-sm",
        columns === 2 ? "sm:grid-cols-2" : "",
        className,
      )}
    >
      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[minmax(140px,40%)_1fr] gap-4 border-b border-line pb-2 last:border-b-0">
          <dt className="text-fg-2">{item.k}</dt>
          <dd className="min-w-0 font-medium text-fg">{item.v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Progress({
  value,
  label,
  className,
}: {
  value: number;
  label: string;
  className?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={v}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cx(
        "h-1 w-full overflow-hidden rounded-full bg-surface-3",
        className,
      )}
    >
      <div
        className="h-full rounded-full bg-accent"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export function Photo({
  src,
  alt,
  caption,
  meta,
  ratio = "aspect-[4/3]",
  className,
}: {
  src: string;
  alt: string;
  caption?: ReactNode;
  meta?: ReactNode;
  ratio?: string;
  className?: string;
}) {
  return (
    <figure className={cx("min-w-0", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={cx("w-full rounded-lg bg-surface-2 object-cover", ratio)}
      />
      {(caption || meta) && (
        <figcaption className="mt-2 text-[14px] leading-5">
          {caption && (
            <span className="block font-medium text-fg">{caption}</span>
          )}
          {meta && <span className="block text-xs text-fg-3">{meta}</span>}
        </figcaption>
      )}
    </figure>
  );
}

/* Inline notice: a coloured rule in the margin, no box. */
export function Notice({
  tone = 'neutral',
  title,
  children,
  className,
}: {
  tone?: 'neutral' | 'warn' | 'danger' | 'ok'
  title?: ReactNode
  children: ReactNode
  className?: string
}) {
  const tones = {
    neutral: 'border-line-2',
    warn: 'border-warn',
    danger: 'border-danger',
    ok: 'border-ok',
  }
  return (
    <div className={cx('border-l-2 py-0.5 pl-4 text-[15px] leading-6', tones[tone], className)}>
      {title && <p className="font-semibold text-fg">{title}</p>}
      <div className={cx('text-fg-2', title ? 'mt-0.5' : undefined)}>{children}</div>
    </div>
  )
}
