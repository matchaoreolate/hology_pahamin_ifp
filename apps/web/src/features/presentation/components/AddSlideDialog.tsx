import { useState } from "react";
import { Loader2, Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { SlideType } from "../types";

interface AddSlideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWithAI: (prompt: string) => Promise<void> | void;
  onAddManual: (slideData: { type: SlideType; title: string; content: string }) => Promise<void> | void;
  isLoading?: boolean;
  currentSlideOrder: number;
}

export function AddSlideDialog({
  open,
  onOpenChange,
  onAddWithAI,
  onAddManual,
  isLoading = false,
  currentSlideOrder,
}: AddSlideDialogProps) {
  const [tab, setTab] = useState<"ai" | "manual">("ai");
  const [aiPrompt, setAiPrompt] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState<SlideType>("content");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "ai") {
      if (!aiPrompt.trim()) return;
      await onAddWithAI(aiPrompt.trim());
      setAiPrompt("");
      onOpenChange(false);
    } else {
      if (!title.trim()) return;
      await onAddManual({
        type,
        title: title.trim(),
        content: content.trim(),
      });
      setTitle("");
      setContent("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <DialogTitle>Tambah Slide Baru</DialogTitle>
            <DialogDescription>
              Slide akan disisipkan setelah Slide {currentSlideOrder}.
            </DialogDescription>
          </div>

          {/* Tab Selection */}
          <div className="flex rounded-lg border border-border bg-secondary/50 p-1">
            <button
              type="button"
              onClick={() => setTab("ai")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-xs font-medium transition-colors ${
                tab === "ai"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Sparkles size={14} className="text-amber-500" />
              Buat dengan AI
            </button>
            <button
              type="button"
              onClick={() => setTab("manual")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md py-1.5 text-xs font-medium transition-colors ${
                tab === "manual"
                  ? "bg-card text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Plus size={14} />
              Buat Manual
            </button>
          </div>

          {tab === "ai" ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="ai-slide-prompt">Instruksi untuk AI</Label>
                <Textarea
                  id="ai-slide-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Contoh: Buatkan slide kuis interaktif seru tentang bagian-bagian tumbuhan dan fungsinya..."
                  rows={4}
                  required
                />
              </div>
              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="font-mono text-muted-foreground">Saran Cepat:</span>
                <button
                  type="button"
                  onClick={() =>
                    setAiPrompt("Buatkan kuis pilihan ganda 3 opsi yang seru dan berikan emoji ceria")
                  }
                  className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-muted-foreground hover:bg-secondary"
                >
                  Kuis Pilihan Ganda
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAiPrompt("Buatkan aktivitas mencocokkan (matching) konsep materi ini")
                  }
                  className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-muted-foreground hover:bg-secondary"
                >
                  Aktivitas Mencocokkan
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setAiPrompt("Rangkuman visual poin-poin penting materi dengan analogi mudah")
                  }
                  className="rounded-md border border-border bg-secondary/40 px-2 py-0.5 text-muted-foreground hover:bg-secondary"
                >
                  Rangkuman Materi
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="manual-type">Tipe Slide</Label>
                <select
                  id="manual-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as SlideType)}
                  className="rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
                >
                  <option value="content">Penjelasan Materi (Content)</option>
                  <option value="visual">Visual & Adegan Ilustrasi (Visual)</option>
                  <option value="interactive">Aktivitas Interaktif (Interactive)</option>
                  <option value="closing">Penutup & Apresiasi (Closing)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="manual-title">Judul Slide</Label>
                <Input
                  id="manual-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Judul slide baru..."
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="manual-content">Konten / Isi Materi</Label>
                <Textarea
                  id="manual-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tuliskan materi penjelasan slide di sini..."
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-1.5 size-4 animate-spin" />
                  Membuat...
                </>
              ) : tab === "ai" ? (
                <>
                  <Sparkles className="mr-1.5 size-4" />
                  Generate dengan AI
                </>
              ) : (
                <>
                  <Plus className="mr-1.5 size-4" />
                  Tambah Slide
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
