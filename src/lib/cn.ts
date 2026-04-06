/** Concatène des classes CSS (équivalent minimal de shadcn `cn`). */
export function cn(
  ...parts: (string | undefined | null | false)[]
): string {
  return parts.filter(Boolean).join(' ')
}
