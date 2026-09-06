import { ThreeDot } from "react-loading-indicators";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { ApiError } from "@/types/api";
import { getPublicPresentation } from "@/lib/api/public";

import { PresentationRuntime } from "./components/PresentationRuntime";
import { mockPresentation } from "./mock";
import type { PresentationArtifact } from "./types";

// Session-lifetime cache so re-entering the runtime (e.g. exiting fullscreen and
// clicking "Mulai Presentasi" again) doesn't re-hit the public endpoint for a
// project that's already been loaded once. Kept separate from the editor pages'
// cache in lib/api/outputs.ts since this hits a different (public, unauthenticated)
// endpoint and has its own mock-fallback behavior.
const runtimeCache = new Map<string, PresentationArtifact>();

export function PresentationRuntimePage() {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [artifact, setArtifact] = useState<PresentationArtifact | null>(null);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!projectId) {
      setArtifact(mockPresentation);
      return;
    }

    const cached = runtimeCache.get(projectId);
    if (cached) {
      setArtifact(cached);
      setError(null);
    } else {
      setArtifact(null);
      setError(null);
    }

    let cancelled = false;
    getPublicPresentation(projectId)
      .then((data) => {
        if (cancelled) return;
        runtimeCache.set(projectId, data);
        setArtifact(data);
        setError(null);
      })
      .catch((err: ApiError) => {
        if (cancelled) return;
        // Already showing a cached artifact — a failed background refresh shouldn't
        // replace working content with the mock fallback.
        if (cached) return;
        // Fall back to the mock so the runtime stays usable for local/dev routes
        // that don't correspond to a real generated project.
        console.warn("Gagal memuat presentasi publik, menampilkan data contoh:", err.detail);
        setError(err);
        setArtifact(mockPresentation);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (!artifact) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-background">
        <ThreeDot variant="brick-stack" color="#001456" size="medium" text="" textColor="" />
        <p className="text-sm text-muted-foreground">Memuat presentasi...</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      <PresentationRuntime artifact={artifact} onExit={() => navigate(-1)} />
      {error && (
        <p className="pointer-events-none fixed bottom-2 left-2 z-50 rounded bg-black/60 px-2 py-1 text-[10px] text-white">
          Mode contoh (gagal memuat data project {projectId})
        </p>
      )}
    </div>
  );
}
