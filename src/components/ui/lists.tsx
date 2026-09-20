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
          className="flex flex-col gap-1 py-4 first:pt-0 last:pb-0 @md:grid @md:grid-cols-[104px_1fr] @md:gap-4"
        >
          <time className="tnum text-meta text-fg-3">
            {item.time}
          </time>
          <div className="min-w-0">
            <p className="text-body font-medium text-fg">
              {item.title}
            </p>
            {item.body && (
              <p className="mt-1 text-body text-fg-2">
                {item.body}
              </p>
            )}
            {item.by && <p className="mt-1 text-meta text-fg-3">{item.by}</p>}
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
        "grid gap-x-8 text-body",
        columns === 2 ? "sm:grid-cols-2" : "",
        className,
      )}
    >
      {/* Rules sit above rows, never below, so the last row is clean whatever the count. */}
      {items.map((item, i) => (
        <div
          key={i}
          className={cx(
            "grid grid-cols-[minmax(140px,40%)_1fr] gap-4 border-t border-line py-2 first:border-t-0 first:pt-0",
            columns === 2 && "sm:nth-2:border-t-0 sm:nth-2:pt-0",
          )}
        >
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
        "h-1 w-full overflow-hidden rounded-control bg-surface-3",
        className,
      )}
    >
      <div
        className="h-full rounded-control bg-accent"
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
        className={cx("w-full rounded-container bg-surface-2 object-cover", ratio)}
      />
      {(caption || meta) && (
        <figcaption className="mt-2 text-body">
          {caption && (
            <span className="block font-medium text-fg">{caption}</span>
          )}
          {meta && <span className="block text-meta text-fg-3">{meta}</span>}
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
    <div className={cx('border-l-2 py-1 pl-4 text-body', tones[tone], className)}>
      {title && <p className="font-semibold text-fg">{title}</p>}
      <div className={cx('text-fg-2', title ? 'mt-1' : undefined)}>{children}</div>
    </div>
  )
}
