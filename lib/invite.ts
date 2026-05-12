export function shareUrl(code: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/invite/${code}`;
}

export function shareText(code: string): string {
  return `join my scrapbook space 🌸 ${shareUrl(code)}`;
}
