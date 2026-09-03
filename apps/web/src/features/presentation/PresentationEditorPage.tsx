import { Download, Play, Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EditorHeader } from "@/components/layout/EditorHeader";
import { OutputSwitcher } from "@/components/layout/OutputSwitcher";
import { Button } from "@/components/ui/button";
import { getPresentation } from "@/lib/api/outputs";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/types/api";

import { PresentationNavigation } from "./components/PresentationNavigation";
import { SlideViewport } from "./components/SlideViewport";
import { mockPresentation } from "./mock";
import type { PresentationArtifact } from "./types";

export function PresentationEditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [artifact, setArtifact] = useState<PresentationArtifact | null>(null);
  const [usingMockFallback, setUsingMockFallback] = useState(false);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    setArtifact(null);
    setUsingMockFallback(false);
    setCurrent(0);

    getPresentation(projectId)
      .then((data) => {
        if (!cancelled) setArtifact(data);
      })
      .catch((err: ApiError) => {
        if (cancelled) return;
        // projectId may be a stub route (e.g. CreateProjectPage's placeholder
        // "new-project" until it's wired to real project creation) rather than a
        // real backend 404 — degrade to the mock so the editor stays usable.
        console.warn("Gagal memuat presentasi, menampilkan data contoh:", err.detail);
        setUsingMockFallback(true);
        setArtifact(mockPresentation);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  if (!artifact) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-secondary/40 pt-16">
        <p className="text-sm text-muted-foreground">Memuat presentasi...</p>
      </div>
    );
  }

  const slide = artifact.slides[current];

  return (
    <div className="min-h-screen bg-secondary/40 pt-16">
      {usingMockFallback && (
        <p className="fixed top-16 right-0 left-0 z-20 bg-amber-500/90 py-1 text-center font-mono text-[11px] text-white">
          Mode contoh — project {projectId} belum tersedia di backend, menampilkan data contoh
        </p>
      )}
      <EditorHeader
        backTo="/dashboard"
        title={artifact.meta.title}
        subtitle={`Proyek: ${projectId}`}
        centerContent={projectId ? <OutputSwitcher projectId={projectId} /> : undefined}
        actions={
          <>
            <Button variant="secondary" size="sm">
              Simpan
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/presentation/${projectId}`)}
            >
              <Play size={12} />
              Mulai Presentasi
            </Button>
            <button className="text-muted-foreground transition-colors hover:text-foreground">
              <Download size={15} />
            </button>
          </>
        }
      />

      <div className="flex">
        <aside className="fixed top-16 bottom-0 left-0 flex w-64 flex-col border-r border-border bg-card">
          <div className="border-b border-border px-4 py-4">
            <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              Daftar Scene
            </h3>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-auto p-4">
            {artifact.slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => setCurrent(index)}
                className={cn(
                  "flex items-center gap-3 rounded-md border p-3 text-left transition-colors",
                  index === current
                    ? "border-2 border-primary bg-secondary/60"
                    : "border-border hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded font-mono text-xs",
                    index === current
                      ? "bg-primary text-primary-foreground"
                      : "border border-border text-muted-foreground",
                  )}
                >
                  {index + 1}
                </span>
                <span className="truncate text-sm text-foreground">{s.title ?? s.type}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-border p-4">
            <button className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-muted-foreground/50 py-2 font-mono text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
              <Plus size={13} />
              Tambah Scene
            </button>
          </div>
        </aside>

        <main className="ml-64 flex flex-1 flex-col items-center justify-center gap-6 p-8 pb-40">
          <div className="w-full max-w-[1024px] overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex h-10 items-center justify-between border-b border-border bg-secondary/40 px-4">
              <span className="font-mono text-xs text-muted-foreground">
                Scene {current + 1}: {slide.title}
              </span>
            </div>
            <SlideViewport slide={slide} className="min-h-[500px] p-6" />
          </div>

          <PresentationNavigation
            current={current}
            total={artifact.slides.length}
            onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
            onNext={() => setCurrent((c) => Math.min(artifact.slides.length - 1, c + 1))}
          />
        </main>
      </div>

      <div className="fixed right-0 bottom-0 left-64 flex justify-center border-t border-border bg-card px-16 py-4">
        <div className="flex w-full max-w-3xl items-center gap-4">
          <Sparkles size={24} className="shrink-0 text-accent" />
          <input
            placeholder="Minta perubahan pada materi... (Cth: Tambahkan kuis pilihan ganda di akhir)"
            className="flex-1 rounded-md border border-input bg-secondary/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>
      </div>
    </div>
  );
}
