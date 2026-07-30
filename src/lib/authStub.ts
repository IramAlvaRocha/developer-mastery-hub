/** Auth UI stub — estado local para demos hasta integrar auth real. */

export const AUTH_STORAGE_KEY = "dmh-auth-stub";

export interface AuthProfile {
  name: string;
  email: string;
  avatarDataUrl?: string;
}

export function readAuthProfile(): AuthProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthProfile;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveAuthProfile(profile: AuthProfile): void {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
}

export function clearAuthProfile(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}
