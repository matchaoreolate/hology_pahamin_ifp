import { Download, Play, Plus, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EditorHeader } from "@/components/layout/EditorHeader";
import { OutputSwitcher } from "@/components/layout/OutputSwitcher";
import { Button } from "@/components/ui/button";
import { getPresentation } from "@/lib/api/outputs";
import { pollProjectGeneration } from "@/lib/api/polling";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/types/api";

import { PresentationNavigation } from "./components/PresentationNavigation";
import { SlideViewport } from "./components/SlideViewport";
import type { PresentationArtifact } from "./types";

export function PresentationEditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [artifact, setArtifact] = useState<PresentationArtifact | null>(null);
  const [waitingForGeneration, setWaitingForGeneration] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    let cancelPoll: (() => void) | null = null;
    setArtifact(null);
    setWaitingForGeneration(false);
    setError(null);
    setCurrent(0);

    function loadPresentation() {
      getPresentation(projectId!)
        .then((data) => {
          if (!cancelled) setArtifact(data);
        })
        .catch((err: ApiError) => {
          if (cancelled) return;

          if (err.status === 425) {
            // Output exists but generation is still running — wait for it instead
            // of guessing; poll project status and re-fetch once it resolves.
            setWaitingForGeneration(true);
            const { promise, cancel } = pollProjectGeneration(projectId!);
            cancelPoll = cancel;
            promise
              .then((status) => {
                if (cancelled) return;
                if (status.project_status === "done") {
                  loadPresentation();
                } else {
                  setWaitingForGeneration(false);
                  setError({
                    status: null,
                    detail: status.error_message ?? "Generate AI gagal untuk project ini",
                    raw: status,
                  });
                }
              })
              .catch((pollErr: ApiError) => {
                if (cancelled) return;
                setWaitingForGeneration(false);
                setError(pollErr);
              });
            return;
          }

          setError(err);
        });
    }

    loadPresentation();

    return () => {
      cancelled = true;
      cancelPoll?.();
    };
  }, [projectId]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary/40 pt-16">
        <p className="text-sm text-destructive">Gagal memuat presentasi: {error.detail}</p>
        <Button variant="secondary" size="sm" onClick={() => navigate("/dashboard")}>
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  if (waitingForGeneration) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-secondary/40 pt-16">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">AI sedang membuat presentasi...</p>
        <p className="text-xs text-muted-foreground">Halaman ini akan otomatis diperbarui setelah selesai.</p>
      </div>
    );
  }

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
