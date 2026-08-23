export interface PublicRsvpRuntimeConfig {
  apiBase: string;
  turnstileSiteKey: string;
}

export function publicRsvpRuntimeConfig(
  enabled: boolean,
): PublicRsvpRuntimeConfig | null {
  if (!enabled) return null;

  const apiBase = import.meta.env.PUBLIC_API_BASE?.replace(/\/$/, "");
  const turnstileSiteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY;

  if (!apiBase || !turnstileSiteKey) {
    throw new Error(
      "RSVP is enabled, but PUBLIC_API_BASE or PUBLIC_TURNSTILE_SITE_KEY is missing.",
    );
  }

  return { apiBase, turnstileSiteKey };
}

