import type { LoginRequest, RegisterRequest, TokenResponse, UserResponse } from "@/types/api";

import { apiClient } from "./client";
import { tokenStorage } from "./token";

/** Registers a new teacher account. Does not log the user in. */
export async function register(payload: RegisterRequest): Promise<UserResponse> {
  const { data } = await apiClient.post<UserResponse>("/auth/register", payload);
  return data;
}

/** Logs in and persists the returned tokens for subsequent requests. */
export async function login(payload: LoginRequest): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>("/auth/login", payload);
  tokenStorage.setTokens(data.access_token, data.refresh_token);
  return data;
}

export function logout(): void {
  tokenStorage.clear();
}

export function isAuthenticated(): boolean {
  return tokenStorage.getAccessToken() !== null;
}

/** Fetches the currently authenticated teacher's profile. */
export async function getCurrentUser(): Promise<UserResponse> {
  const { data } = await apiClient.get<UserResponse>("/auth/me");
  return data;
}
