/**
 * Isolated JWT storage so page components never touch localStorage directly.
 * No refresh-token endpoint exists on the backend yet — the refresh token is
 * persisted for a future rotation flow but nothing currently exchanges it.
 */
const ACCESS_TOKEN_KEY = "pahamin_access_token";
const REFRESH_TOKEN_KEY = "pahamin_refresh_token";

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },
  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
