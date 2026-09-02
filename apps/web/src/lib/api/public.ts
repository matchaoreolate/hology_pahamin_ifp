/**
 * Public, unauthenticated endpoints for the IFP classroom viewer.
 * Deliberately uses a bare axios call (not `apiClient`) so an Authorization header is
 * never attached and an expired/absent teacher token can never break public viewing.
 */
import axios from "axios";

import type { PublicPresentationResponse } from "@/types/api";
import type { PresentationArtifact } from "@/features/presentation/types";

import { toApiError } from "./client";

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000/api/v1";

/** GET /public/presentations/{project_id} — no auth required. Unwraps to the artifact. */
export async function getPublicPresentation(projectId: string): Promise<PresentationArtifact> {
  try {
    const { data } = await axios.get<PublicPresentationResponse>(
      `${API_BASE_URL}/public/presentations/${projectId}`,
    );
    return data.artifact;
  } catch (error) {
    throw toApiError(error);
  }
}
