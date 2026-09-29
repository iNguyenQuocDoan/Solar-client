type ClassValue = string | false | null | undefined

/** Ghép class, bỏ giá trị falsy. Đủ dùng khi chưa cần clsx/tailwind-merge. */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ')
}
