/**
 * Generated Outputs — presentation/LKPD/e-book retrieval, edits, IFP runtime, feedback.
 * Unwraps API transport envelopes here so downstream components (in particular the
 * presentation renderer) only ever see the shapes they were built for.
 */
import type {
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
