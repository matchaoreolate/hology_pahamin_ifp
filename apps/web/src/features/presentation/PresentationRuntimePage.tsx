import { ThreeDot } from "react-loading-indicators";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { ApiError } from "@/types/api";
import { getPublicPresentation } from "@/lib/api/public";

import { PresentationRuntime } from "./components/PresentationRuntime";
import { mockPresentation } from "./mock";
import type { PresentationArtifact } from "./types";

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

    let cancelled = false;
    getPublicPresentation(projectId)
      .then((data) => {
        if (!cancelled) setArtifact(data);
      })
      .catch((err: ApiError) => {
        if (cancelled) return;
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
      <div className="flex h-screen w-screen items-center justify-center bg-background">
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
