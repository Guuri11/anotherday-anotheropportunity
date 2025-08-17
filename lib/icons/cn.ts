// Utility to join class names (like clsx/cn)
export function cn(...args: (string | undefined | null | false)[]): string {
  return args.filter(Boolean).join(' ');
}
