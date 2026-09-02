/**
 * Small explicit polling helper for async generation status — deliberately not
 * React Query. Stops on "done"/"error" project status, cleans up on unmount,
 * and never polls forever.
 */
import { useEffect, useRef, useState } from "react";

import type { ApiError, ProjectStatusResponse } from "@/types/api";

import { toApiError } from "./client";
import { getProjectStatus } from "./projects";

const DEFAULT_INTERVAL_MS = 3000;
const DEFAULT_MAX_ATTEMPTS = 100; // ~5 minutes at the default interval

export interface PollProjectGenerationOptions {
  intervalMs?: number;
  maxAttempts?: number;
  onUpdate?: (status: ProjectStatusResponse) => void;
}

/**
 * Polls GET /projects/{id}/status until `project_status` is "done" or "error".
 * Returns the final status. Call the returned `cancel()` (or let the AbortSignal-less
 * caller ignore it) to stop early — used internally by the `usePollProjectGeneration` hook.
 */
export function pollProjectGeneration(
  projectId: string,
  options: PollProjectGenerationOptions = {},
): { promise: Promise<ProjectStatusResponse>; cancel: () => void } {
  const { intervalMs = DEFAULT_INTERVAL_MS, maxAttempts = DEFAULT_MAX_ATTEMPTS, onUpdate } = options;

  let cancelled = false;
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  const promise = new Promise<ProjectStatusResponse>((resolve, reject) => {
    let attempts = 0;

    async function tick() {
      if (cancelled) return;
      attempts += 1;

      try {
        const status = await getProjectStatus(projectId);
        if (cancelled) return;
        onUpdate?.(status);

        if (status.project_status === "done" || status.project_status === "error") {
          resolve(status);
          return;
        }
        if (attempts >= maxAttempts) {
          reject({ status: null, detail: "Waktu tunggu generate habis", raw: status } as ApiError);
          return;
        }
        timeoutId = setTimeout(tick, intervalMs);
      } catch (error) {
        if (!cancelled) reject(toApiError(error));
      }
    }

    void tick();
  });

  return {
    promise,
    cancel: () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    },
  };
}

export interface UsePollProjectGenerationResult {
  status: ProjectStatusResponse | null;
  error: ApiError | null;
  isPolling: boolean;
}

/** React hook wrapper around `pollProjectGeneration`. Polls only while `enabled` is true. */
export function usePollProjectGeneration(
  projectId: string | null | undefined,
  enabled: boolean,
  options: Omit<PollProjectGenerationOptions, "onUpdate"> = {},
): UsePollProjectGenerationResult {
  const [status, setStatus] = useState<ProjectStatusResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    if (!enabled || !projectId) return;

    setIsPolling(true);
    setError(null);

    const { promise, cancel } = pollProjectGeneration(projectId, {
      ...optionsRef.current,
      onUpdate: setStatus,
    });

    promise
      .then(setStatus)
      .catch((err: ApiError) => setError(err))
      .finally(() => setIsPolling(false));

    return () => {
      cancel();
      setIsPolling(false);
    };
  }, [projectId, enabled]);

  return { status, error, isPolling };
}
