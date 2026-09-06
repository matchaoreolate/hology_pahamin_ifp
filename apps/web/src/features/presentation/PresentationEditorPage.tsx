import { Download, Play, Plus, Sparkles } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EditorHeader } from "@/components/layout/EditorHeader";
import { OutputSwitcher } from "@/components/layout/OutputSwitcher";
import { Button } from "@/components/ui/button";
import { getPresentation, useOutputContent } from "@/lib/api/outputs";
import { cn } from "@/lib/utils";

import { ExportMediaDialog } from "./components/ExportMediaDialog";
import { PresentationNavigation } from "./components/PresentationNavigation";
import { SlideViewport } from "./components/SlideViewport";

export function PresentationEditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const { content: artifact, waitingForGeneration, error } = useOutputContent(
    projectId,
    "presentation",
    getPresentation,
  );

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
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-secondary/40 pt-16">
        <ThreeDot variant="brick-stack" color="#001456" size="medium" text="" textColor="" />
        <p className="text-sm text-muted-foreground">Memuat presentasi...</p>
      </div>
    );
  }

  const safeCurrent = Math.min(current, artifact.slides.length - 1);
  const slide = artifact.slides[safeCurrent];

  return (
    <div className="min-h-screen bg-secondary/40 pt-16">
      <EditorHeader
        backTo="/dashboard"
        title={artifact.meta.title}
        subtitle={`Proyek: ${projectId}`}
        centerContent={projectId ? <OutputSwitcher projectId={projectId} /> : undefined}
        actions={
          <>
            <span className="font-mono text-xs text-muted-foreground">Tersimpan otomatis</span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/presentation/${projectId}`)}
            >
              <Play size={12} />
              Mulai Presentasi
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setExportOpen(true)}>
              <Download size={13} />
              Unduh
            </Button>
          </>
        }
      />

      <ExportMediaDialog artifact={artifact} open={exportOpen} onOpenChange={setExportOpen} />

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
                  index === safeCurrent
                    ? "border-2 border-primary bg-secondary/60"
                    : "border-border hover:border-primary/40",
                )}
              >
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded font-mono text-xs",
                    index === safeCurrent
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
            <button
              disabled
              title="Fitur ini akan segera hadir"
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md border border-dashed border-muted-foreground/50 py-2 font-mono text-xs text-muted-foreground opacity-60"
            >
              <Plus size={13} />
              Tambah Scene (Segera Hadir)
            </button>
          </div>
        </aside>

        <main className="ml-64 flex flex-1 flex-col items-center justify-center gap-6 p-8 pb-40">
          <div className="w-full max-w-[1024px] overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex h-10 items-center justify-between border-b border-border bg-secondary/40 px-4">
              <span className="font-mono text-xs text-muted-foreground">
                Scene {safeCurrent + 1}: {slide.title}
              </span>
            </div>
            <SlideViewport slide={slide} className="min-h-[500px] p-6" />
          </div>

          <PresentationNavigation
            current={safeCurrent}
            total={artifact.slides.length}
            onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
            onNext={() => setCurrent((c) => Math.min(artifact.slides.length - 1, c + 1))}
          />
        </main>
      </div>

      <div className="fixed right-0 bottom-0 left-64 flex justify-center border-t border-border bg-card px-16 py-4">
        <div className="flex w-full max-w-3xl items-center gap-4">
          <Sparkles size={24} className="shrink-0 text-muted-foreground" />
          <input
            disabled
            placeholder="Segera hadir: minta perubahan materi langsung dengan AI"
            title="Fitur ini akan segera hadir"
            className="flex-1 cursor-not-allowed rounded-md border border-input bg-secondary/40 px-4 py-3 text-sm text-muted-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-70"
          />
          <span className="shrink-0 rounded-full border border-border bg-secondary px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Segera Hadir
          </span>
        </div>
      </div>
    </div>
  );
}
