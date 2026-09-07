import {
  AlertCircle,
  CheckCircle2,
  Download,
  Loader2,
  Pencil,
  Play,
  Plus,
  Send,
  Sparkles,
  Trash2,
} from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { EditorHeader } from "@/components/layout/EditorHeader";
import { OutputSwitcher } from "@/components/layout/OutputSwitcher";
import { Button } from "@/components/ui/button";
import {
  getPresentation,
  transformPresentationAI,
  updateOutputContent,
  useOutputContent,
} from "@/lib/api/outputs";
import { cn } from "@/lib/utils";

import { AddSlideDialog } from "./components/AddSlideDialog";
import { EditSlideDialog } from "./components/EditSlideDialog";
import { ExportMediaDialog } from "./components/ExportMediaDialog";
import { PresentationNavigation } from "./components/PresentationNavigation";
import { SlideViewport } from "./components/SlideViewport";
import type { PresentationArtifact, PresentationSlide, SlideType } from "./types";

const QUICK_PROMPTS = [
  { label: "Sederhanakan Bahasa", prompt: "Sederhanakan penjelasan materi di slide ini agar lebih mudah dipahami siswa kelas SD" },
  { label: "Ubah Jadi Kuis", prompt: "Ubah slide ini menjadi kuis pilihan ganda interaktif dengan 3 pilihan dan emoji seru" },
  { label: "Tambah Analogi Seru", prompt: "Tambahkan analogi konkret dan menarik yang dekat dengan keseharian anak untuk materi ini" },
  { label: "Rangkum Inti Materi", prompt: "Ringkas materi slide ini menjadi 3 poin singkat yang jelas dan padat" },
];

export function PresentationEditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [exportOpen, setExportOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  // AI & Manual state management
  const [localArtifact, setLocalArtifact] = useState<PresentationArtifact | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isSavingManual, setIsSavingManual] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [statusFeedback, setStatusFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const { content: fetchedArtifact, waitingForGeneration, error } = useOutputContent(
    projectId,
    "presentation",
    getPresentation,
  );

  // Clear temporary status feedback after 5 seconds
  useEffect(() => {
    if (statusFeedback) {
      const timer = setTimeout(() => setStatusFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [statusFeedback]);

  const artifact = localArtifact ?? fetchedArtifact;

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

  const safeCurrent = Math.max(0, Math.min(current, artifact.slides.length - 1));
  const slide = artifact.slides[safeCurrent];

  // AI Transform Handler (Full Snapshot Replace pattern ala Metabot Slide 32)
  const handleAITransform = async (promptText: string, mode: "auto" | "slide" | "add_slide" = "auto") => {
    if (!projectId || !artifact || !promptText.trim() || isTransforming) return;
    try {
      setIsTransforming(true);
      setStatusFeedback(null);

      const res = await transformPresentationAI(projectId, {
        prompt: promptText.trim(),
        slide_index: safeCurrent,
        mode,
      });

      // Full snapshot replace (no partial merge conflict)
      setLocalArtifact(res.content);
      if (typeof res.active_slide_index === "number") {
        setCurrent(res.active_slide_index);
      }
      setAiPrompt("");
      setStatusFeedback({ message: res.message, type: "success" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal mentransformasikan slide dengan AI";
      setStatusFeedback({ message: msg, type: "error" });
    } finally {
      setIsTransforming(false);
    }
  };

  // Manual Slide Edit Handler
  const handleSaveManualSlide = async (updatedSlide: PresentationSlide) => {
    if (!projectId || !artifact) return;
    try {
      setIsSavingManual(true);
      const updatedSlides = [...artifact.slides];
      updatedSlides[safeCurrent] = updatedSlide;
      const updatedArtifact: PresentationArtifact = {
        ...artifact,
        slides: updatedSlides,
      };

      setLocalArtifact(updatedArtifact);
      await updateOutputContent(projectId, "presentation", {
        slides: updatedSlides,
      });
      setStatusFeedback({
        message: `Slide ${safeCurrent + 1} berhasil diperbarui`,
        type: "success",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan perubahan slide";
      setStatusFeedback({ message: msg, type: "error" });
    } finally {
      setIsSavingManual(false);
    }
  };

  // Add Manual Slide Handler
  const handleAddManualSlide = async (slideData: { type: SlideType; title: string; content: string }) => {
    if (!projectId || !artifact) return;
    try {
      setIsSavingManual(true);
      const newSlide: PresentationSlide = {
        id: `slide-${Date.now()}`,
        order: safeCurrent + 2,
        type: slideData.type,
        title: slideData.title,
        content: slideData.content,
        assets: [],
        interaction: null,
        teacher_note: "",
        speaker_script: "",
      };

      const updatedSlides = [...artifact.slides];
      updatedSlides.splice(safeCurrent + 1, 0, newSlide);
      updatedSlides.forEach((s, idx) => {
        s.order = idx + 1;
      });

      const updatedArtifact: PresentationArtifact = {
        ...artifact,
        meta: {
          ...artifact.meta,
          total_slides: updatedSlides.length,
        },
        slides: updatedSlides,
      };

      setLocalArtifact(updatedArtifact);
      setCurrent(safeCurrent + 1);
      await updateOutputContent(projectId, "presentation", {
        slides: updatedSlides,
      });
      setStatusFeedback({
        message: `Slide baru ditambahkan pada urutan ${safeCurrent + 2}`,
        type: "success",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menambahkan slide";
      setStatusFeedback({ message: msg, type: "error" });
    } finally {
      setIsSavingManual(false);
    }
  };

  // Delete Slide Handler
  const handleDeleteSlide = async () => {
    if (!projectId || !artifact) return;
    if (artifact.slides.length <= 1) {
      alert("Presentasi harus memiliki minimal 1 slide.");
      return;
    }
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus Slide ${safeCurrent + 1} (${slide.title ?? slide.type})?`,
    );
    if (!confirmed) return;

    try {
      setIsSavingManual(true);
      const updatedSlides = artifact.slides.filter((_, idx) => idx !== safeCurrent);
      updatedSlides.forEach((s, idx) => {
        s.order = idx + 1;
      });

      const updatedArtifact: PresentationArtifact = {
        ...artifact,
        meta: {
          ...artifact.meta,
          total_slides: updatedSlides.length,
        },
        slides: updatedSlides,
      };

      const newIndex = Math.max(0, Math.min(safeCurrent, updatedSlides.length - 1));
      setLocalArtifact(updatedArtifact);
      setCurrent(newIndex);
      await updateOutputContent(projectId, "presentation", {
        slides: updatedSlides,
      });
      setStatusFeedback({
        message: `Slide ${safeCurrent + 1} berhasil dihapus`,
        type: "success",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus slide";
      setStatusFeedback({ message: msg, type: "error" });
    } finally {
      setIsSavingManual(false);
    }
  };

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

      {slide && (
        <EditSlideDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          slide={slide}
          onSave={handleSaveManualSlide}
          isSaving={isSavingManual}
        />
      )}

      <AddSlideDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onAddWithAI={(p) => handleAITransform(p, "add_slide")}
        onAddManual={handleAddManualSlide}
        isLoading={isTransforming || isSavingManual}
        currentSlideOrder={safeCurrent + 1}
      />

      <div className="flex">
        {/* Slide List Sidebar */}
        <aside className="fixed top-16 bottom-0 left-0 flex w-64 flex-col border-r border-border bg-card">
          <div className="border-b border-border px-4 py-3">
            <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              Daftar Slide ({artifact.slides.length})
            </h3>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-auto p-4">
            {artifact.slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => setCurrent(index)}
                disabled={isTransforming}
                className={cn(
                  "flex items-center gap-3 rounded-md border p-3 text-left transition-colors",
                  index === safeCurrent
                    ? "border-2 border-primary bg-secondary/60"
                    : "border-border hover:border-primary/40",
                  isTransforming && "opacity-60 cursor-not-allowed",
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
            <Button
              variant="dashed"
              size="sm"
              onClick={() => setAddDialogOpen(true)}
              disabled={isTransforming}
              className="flex w-full items-center justify-center gap-2 font-mono text-xs"
            >
              <Plus size={13} />
              Tambah Slide
            </Button>
          </div>
        </aside>

        {/* Main Viewport */}
        <main className="ml-64 flex flex-1 flex-col items-center justify-center gap-6 p-8 pb-48">
          {/* Status Feedback Toast */}
          {statusFeedback && (
            <div
              className={cn(
                "flex w-full max-w-[1024px] items-center gap-2 rounded-lg border px-4 py-2.5 text-sm shadow-xs transition-all",
                statusFeedback.type === "success"
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                  : "border-destructive/30 bg-destructive/10 text-destructive",
              )}
            >
              {statusFeedback.type === "success" ? (
                <CheckCircle2 size={16} className="shrink-0" />
              ) : (
                <AlertCircle size={16} className="shrink-0" />
              )}
              <span>{statusFeedback.message}</span>
            </div>
          )}

          <div className="relative w-full max-w-[1024px] overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            {/* Interaction Locking Overlay (Metabot Slide 25) */}
            {isTransforming && (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-card/80 backdrop-blur-xs">
                <div className="flex items-center gap-3 rounded-full border border-primary/20 bg-primary/10 px-5 py-2.5 shadow-md">
                  <Loader2 className="size-5 animate-spin text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    AI sedang memperbarui slide presentasi... Mohon tunggu sebentar.
                  </span>
                </div>
              </div>
            )}

            {/* Slide Header Toolbar */}
            <div className="flex h-12 items-center justify-between border-b border-border bg-secondary/40 px-4">
              <div className="flex items-center gap-2">
                <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
                  Slide {safeCurrent + 1} / {artifact.slides.length}
                </span>
                <span className="truncate font-mono text-xs text-muted-foreground">
                  {slide.title}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setEditDialogOpen(true)}
                  disabled={isTransforming}
                  className="h-8 gap-1.5 text-xs"
                >
                  <Pencil size={12} />
                  Edit Manual
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleDeleteSlide}
                  disabled={isTransforming || artifact.slides.length <= 1}
                  className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                  title="Hapus Slide Ini"
                >
                  <Trash2 size={12} />
                  Hapus
                </Button>
              </div>
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

      {/* AI Transform Bar (Metabot Slide 17 & Slide 32) */}
      <div className="fixed right-0 bottom-0 left-64 flex flex-col items-center border-t border-border bg-card/95 px-8 py-3 shadow-lg backdrop-blur-sm">
        {/* Quick Suggestion Chips */}
        <div className="mb-2 flex w-full max-w-3xl items-center gap-2 overflow-x-auto text-xs">
          <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
            Saran Cepat:
          </span>
          {QUICK_PROMPTS.map((qp, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isTransforming}
              onClick={() => handleAITransform(qp.prompt, "slide")}
              className="shrink-0 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-secondary hover:text-foreground disabled:opacity-50"
            >
              {qp.label}
            </button>
          ))}
        </div>

        {/* Input Bar with Scope Indicator */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAITransform(aiPrompt, "slide");
          }}
          className="flex w-full max-w-3xl items-center gap-3"
        >
          <div className="flex shrink-0 items-center gap-1 rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-[11px] font-medium text-primary">
            <Sparkles size={13} />
            <span>Slide {safeCurrent + 1}</span>
          </div>

          <input
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            disabled={isTransforming}
            placeholder={`Minta AI ubah materi slide ${safeCurrent + 1} (contoh: "buat penjelasan lebih sederhana", "tambah kuis")...`}
            className="flex-1 rounded-md border border-input bg-secondary/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:outline-none disabled:opacity-60"
          />

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isTransforming || !aiPrompt.trim()}
            className="h-9 gap-1.5 px-4"
          >
            {isTransforming ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            <span>Terapkan</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
