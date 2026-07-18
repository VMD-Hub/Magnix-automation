/** Shared client fetch for header / auth gate (dedupe in-flight). */

export type ClientAuthUser = {
  id: string;
  name: string;
  phoneMasked: string;
  email?: string | null;
  emailVerified?: boolean;
  role?: string;
};

let authUserRequest: Promise<ClientAuthUser | null> | null = null;

export function fetchAuthUser(): Promise<ClientAuthUser | null> {
  if (!authUserRequest) {
    authUserRequest = fetch("/api/auth/me", { credentials: "same-origin" })
      .then((response) => response.json())
      .then((json) => (json.data?.user as ClientAuthUser | undefined) ?? null)
      .catch(() => null)
      .finally(() => {
        authUserRequest = null;
      });
  }
  return authUserRequest;
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}
