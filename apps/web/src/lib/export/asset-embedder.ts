import type { PresentationArtifact } from "@/features/presentation/types";

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error ?? new Error("Gagal membaca aset"));
    reader.readAsDataURL(blob);
  });
}

async function fetchAsDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const blob = await res.blob();
  return blobToDataUrl(blob);
}

export interface EmbedAssetsResult {
  artifact: PresentationArtifact;
  /** Human-readable warnings, e.g. an asset that couldn't be embedded and is not offline-safe. */
  warnings: string[];
}

/**
 * Returns a deep clone of the artifact with every remote image asset URL
 * replaced by an embedded base64 data URL, so the exported file needs no
 * network access to render its images.
 */
export async function embedArtifactAssets(
  artifact: PresentationArtifact,
): Promise<EmbedAssetsResult> {
  const clone = structuredClone(artifact);
  const urls = new Set<string>();

  for (const slide of clone.slides) {
    for (const asset of slide.assets ?? []) {
      if (!asset.url.startsWith("data:")) urls.add(asset.url);
    }
    if (slide.interaction?.type === "reveal") {
      for (const item of slide.interaction.items) {
        if (item.asset && !item.asset.url.startsWith("data:")) urls.add(item.asset.url);
      }
    }
  }

  const warnings: string[] = [];
  const dataUrlByOriginal = new Map<string, string>();

  await Promise.all(
    [...urls].map(async (url) => {
      try {
        dataUrlByOriginal.set(url, await fetchAsDataUrl(url));
      } catch (err) {
        warnings.push(
          `Gagal mengambil aset "${url}" (${(err as Error).message}). Gambar ini tidak akan tersedia secara offline.`,
        );
      }
    }),
  );

  for (const slide of clone.slides) {
    for (const asset of slide.assets ?? []) {
      const embedded = dataUrlByOriginal.get(asset.url);
      if (embedded) asset.url = embedded;
    }
    if (slide.interaction?.type === "reveal") {
      for (const item of slide.interaction.items) {
        const embedded = item.asset && dataUrlByOriginal.get(item.asset.url);
        if (item.asset && embedded) item.asset.url = embedded;
      }
    }
  }

  return { artifact: clone, warnings };
}
