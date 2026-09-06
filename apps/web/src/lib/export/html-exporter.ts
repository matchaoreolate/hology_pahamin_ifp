import type { PresentationArtifact } from "@/features/presentation/types";

import { embedArtifactAssets } from "./asset-embedder";

const TEMPLATE_URL = "/export/export-runtime.html";
const DATA_SCRIPT_TAG = /(<script id="kelasin-artifact-data" type="application\/json">)([\s\S]*?)(<\/script>)/;

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "media"
  );
}

function escapeForInlineJson(json: string): string {
  // Prevent the embedded JSON from breaking out of its <script> tag or being
  // treated as an HTML comment when the browser parses the exported file.
  return json.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--");
}

export interface ExportHtmlResult {
  warnings: string[];
}

/**
 * Builds a single self-contained .html file from the given presentation
 * artifact (runtime + styles + assets all inlined) and triggers a browser
 * download. The file can be opened directly from disk, with no network
 * access and no KelasIn backend required.
 */
export async function exportPresentationAsHtml(
  artifact: PresentationArtifact,
): Promise<ExportHtmlResult> {
  const [{ artifact: embedded, warnings }, templateRes] = await Promise.all([
    embedArtifactAssets(artifact),
    // `no-store` sidesteps a browser/CDN quirk where a conditional revalidation can
    // surface a raw 304 (no body) to fetch() instead of being transparently resolved
    // to the cached 200 — this static template is small, so always fetching it fresh
    // is cheap and avoids that ambiguity entirely.
    fetch(TEMPLATE_URL, { cache: "no-store" }),
  ]);

  if (!templateRes.ok) {
    throw new Error("Gagal memuat runtime media offline. Coba build ulang aplikasi.");
  }
  const template = await templateRes.text();
  if (!DATA_SCRIPT_TAG.test(template)) {
    throw new Error("Template runtime media offline tidak valid.");
  }

  const json = escapeForInlineJson(JSON.stringify(embedded));
  const html = template.replace(DATA_SCRIPT_TAG, `$1${json}$3`);

  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = `kelasin-${slugify(embedded.meta.title)}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  } finally {
    URL.revokeObjectURL(url);
  }

  return { warnings };
}
