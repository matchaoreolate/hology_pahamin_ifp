/**
 * Central Axios instance for the PahamIn FastAPI backend.
 * Base URL, auth header attachment, and error normalisation live here —
 * domain modules (auth.ts, contexts.ts, ...) just call `apiClient`.
 */
import axios, { type AxiosError } from "axios";

import type { ApiError } from "@/types/api";

import { tokenStorage } from "./token";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenStorage.clear();
    }
    return Promise.reject(toApiError(error));
  },
);

/** Normalises Axios/FastAPI errors into a single predictable shape. */
export function toApiError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { detail?: unknown } | undefined;
    const detail = extractDetail(data?.detail) ?? error.message ?? "Terjadi kesalahan pada permintaan";
    return {
      status: error.response?.status ?? null,
      detail,
      raw: error.response?.data ?? error,
    };
  }
  return {
    status: null,
    detail: error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui",
    raw: error,
  };
}

/** FastAPI validation errors (422) send `detail` as a list of {loc, msg} objects, not a string. */
function extractDetail(detail: unknown): string | null {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => (item && typeof item === "object" && "msg" in item ? String(item.msg) : null))
      .filter((msg): msg is string => msg !== null);
    if (messages.length > 0) return messages.join(", ");
  }
  return null;
}
