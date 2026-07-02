/** Chỉ public site key — dùng từ client components. */
export function turnstileSiteKey(): string | undefined {
  const key = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  return key || undefined;
}

export function turnstileRequired(): boolean {
  return Boolean(turnstileSiteKey());
}
