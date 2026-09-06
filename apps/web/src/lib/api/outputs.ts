/**
 * Generated Outputs — presentation/LKPD/e-book retrieval, edits, IFP runtime, feedback.
 * Unwraps API transport envelopes here so downstream components (in particular the
 * presentation renderer) only ever see the shapes they were built for.
 */
import { useEffect, useState } from "react";

import type {
  ApiError,
  EbookContent,
  FeedbackRequest,
  FeedbackResponse,
  LkpdContent,
  OutputContentResponse,
  OutputEditResponse,
  RuntimeResponse,
} from "@/types/api";
import type { PresentationArtifact } from "@/features/presentation/types";

import { apiClient } from "./client";
import { pollProjectGeneration } from "./polling";

/** GET /projects/{id}/presentation — returns the raw PresentationArtifact for the renderer. */
export async function getPresentation(projectId: string): Promise<PresentationArtifact> {
  const { data } = await apiClient.get<OutputContentResponse<PresentationArtifact>>(
    `/projects/${projectId}/presentation`,
  );
  return data.content;
}

export async function getLkpd(projectId: string): Promise<LkpdContent> {
  const { data } = await apiClient.get<OutputContentResponse<LkpdContent>>(
    `/projects/${projectId}/lkpd`,
  );
  return data.content;
}

export async function getEbook(projectId: string): Promise<EbookContent> {
  const { data } = await apiClient.get<OutputContentResponse<EbookContent>>(
    `/projects/${projectId}/ebook`,
  );
  return data.content;
}

/**
 * Review/edit an AI-generated output. `patch` is shallow-merged into `content` by the
 * backend when it contains a `content` key, otherwise it replaces `content` wholesale —
 * mirror that by always sending `{ content: partial }`.
 */
export async function updateOutputContent<TContent = Record<string, unknown>>(
  projectId: string,
  outputType: "presentation" | "lkpd" | "ebook",
  contentPatch: Partial<TContent>,
): Promise<TContent> {
  const { data } = await apiClient.patch<OutputEditResponse<TContent>>(
    `/projects/${projectId}/${outputType}`,
    { content: contentPatch },
  );
  return data.content;
}

/** Authenticated teacher runtime for IFP TV — unwraps straight to the artifact. */
export async function getRuntime(projectId: string): Promise<PresentationArtifact> {
  const { data } = await apiClient.get<RuntimeResponse>(`/projects/${projectId}/runtime`);
  return data.artifact;
}

export async function submitFeedback(
  projectId: string,
  payload: FeedbackRequest,
): Promise<FeedbackResponse> {
  const { data } = await apiClient.post<FeedbackResponse>(`/projects/${projectId}/feedback`, payload);
  return data;
}

export interface UseOutputContentResult<T> {
  content: T | null;
  /** True while the output exists but generation is still running (425 from the backend). */
  waitingForGeneration: boolean;
  error: ApiError | null;
}

/**
 * Fetches a generated output and, if it's still being generated (425 Too Early),
 * waits for it: polls the project's overall status and re-fetches once it resolves.
 * Shared by the presentation/LKPD/e-book editor pages so "still generating" never
 * has to be guessed at or covered up with mock data.
 */
export function useOutputContent<T>(
  projectId: string | undefined,
  fetcher: (projectId: string) => Promise<T>,
): UseOutputContentResult<T> {
  const [content, setContent] = useState<T | null>(null);
  const [waitingForGeneration, setWaitingForGeneration] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    let cancelPoll: (() => void) | null = null;
    setContent(null);
    setWaitingForGeneration(false);
    setError(null);

    function load() {
      fetcher(projectId!)
        .then((data) => {
          if (!cancelled) setContent(data);
        })
        .catch((err: ApiError) => {
          if (cancelled) return;

          if (err.status === 425) {
            setWaitingForGeneration(true);
            const { promise, cancel } = pollProjectGeneration(projectId!);
            cancelPoll = cancel;
            promise
              .then((status) => {
                if (cancelled) return;
                if (status.project_status === "done") {
                  load();
                } else {
                  setWaitingForGeneration(false);
                  setError({
                    status: null,
                    detail: status.error_message ?? "Generate AI gagal untuk project ini",
                    raw: status,
                  });
                }
              })
              .catch((pollErr: ApiError) => {
                if (cancelled) return;
                setWaitingForGeneration(false);
                setError(pollErr);
              });
            return;
          }

          setError(err);
        });
    }

    load();

    return () => {
      cancelled = true;
      cancelPoll?.();
    };
    // `fetcher` is expected to be a stable module-level function (getPresentation/getLkpd/getEbook).
  }, [projectId]);

  return { content, waitingForGeneration, error };
}
