import type {
  MediaProjectApiResponse,
  MediaProjectCreate,
  MediaProjectUpdateConfig,
  ProjectStatusResponse,
  ProjectSummaryResponse,
  ProjectWorkspaceResponse,
} from "@/types/api";

import { apiClient } from "./client";

export async function createProject(payload: MediaProjectCreate): Promise<MediaProjectApiResponse> {
  const { data } = await apiClient.post<MediaProjectApiResponse>("/projects/", payload);
  return data;
}

export async function getProjects(params?: {
  skip?: number;
  limit?: number;
}): Promise<MediaProjectApiResponse[]> {
  const { data } = await apiClient.get<MediaProjectApiResponse[]>("/projects/", { params });
  return data;
}

export async function getProject(projectId: string): Promise<MediaProjectApiResponse> {
  const { data } = await apiClient.get<MediaProjectApiResponse>(`/projects/${projectId}`);
  return data;
}

export async function updateProjectConfig(
  projectId: string,
  payload: MediaProjectUpdateConfig,
): Promise<MediaProjectApiResponse> {
  const { data } = await apiClient.put<MediaProjectApiResponse>(
    `/projects/${projectId}/config`,
    payload,
  );
  return data;
}

export async function deleteProject(projectId: string): Promise<void> {
  await apiClient.delete(`/projects/${projectId}`);
}

/** Triggers async generation for all of the project's selected outputs. */
export async function generateProject(projectId: string): Promise<MediaProjectApiResponse> {
  const { data } = await apiClient.post<MediaProjectApiResponse>(`/projects/${projectId}/generate`);
  return data;
}

/** Point-in-time generation status — pair with `pollProjectGeneration` for polling. */
export async function getProjectStatus(projectId: string): Promise<ProjectStatusResponse> {
  const { data } = await apiClient.get<ProjectStatusResponse>(`/projects/${projectId}/status`);
  return data;
}

export async function getProjectWorkspace(projectId: string): Promise<ProjectWorkspaceResponse> {
  const { data } = await apiClient.get<ProjectWorkspaceResponse>(`/projects/${projectId}/workspace`);
  return data;
}

export async function getProjectSummary(projectId: string): Promise<ProjectSummaryResponse> {
  const { data } = await apiClient.get<ProjectSummaryResponse>(`/projects/${projectId}/summary`);
  return data;
}
