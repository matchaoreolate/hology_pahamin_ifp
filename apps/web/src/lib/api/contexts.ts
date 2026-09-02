import type {
  LearningContextApiResponse,
  LearningContextCreate,
  LearningContextUpdate,
} from "@/types/api";

import { apiClient } from "./client";

export async function createLearningContext(
  payload: LearningContextCreate,
): Promise<LearningContextApiResponse> {
  const { data } = await apiClient.post<LearningContextApiResponse>("/contexts/", payload);
  return data;
}

export async function getLearningContexts(params?: {
  skip?: number;
  limit?: number;
}): Promise<LearningContextApiResponse[]> {
  const { data } = await apiClient.get<LearningContextApiResponse[]>("/contexts/", { params });
  return data;
}

export async function getLearningContext(contextId: string): Promise<LearningContextApiResponse> {
  const { data } = await apiClient.get<LearningContextApiResponse>(`/contexts/${contextId}`);
  return data;
}

export async function updateLearningContext(
  contextId: string,
  payload: LearningContextUpdate,
): Promise<LearningContextApiResponse> {
  const { data } = await apiClient.put<LearningContextApiResponse>(`/contexts/${contextId}`, payload);
  return data;
}

export async function deleteLearningContext(contextId: string): Promise<void> {
  await apiClient.delete(`/contexts/${contextId}`);
}
