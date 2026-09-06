/**
 * Print-ready document exports (PDF, etc). Binary responses, downloaded client-side.
 */
import { apiClient } from "./client";

/** GET /exports/projects/{id}/lkpd-pdf — downloads the LKPD as a print-ready A4 PDF. */
export async function downloadLkpdPdf(projectId: string): Promise<void> {
  const { data, headers } = await apiClient.get(`/exports/projects/${projectId}/lkpd-pdf`, {
    responseType: "blob",
  });

  const filenameMatch = /filename="?([^"]+)"?/.exec(headers["content-disposition"] ?? "");
  const filename = filenameMatch?.[1] ?? `LKPD-${projectId}.pdf`;

  const url = URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
