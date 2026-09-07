import { useState } from "react";
import { Check, Loader2 } from "lucide-react";

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
import type { PresentationSlide } from "../types";

interface EditSlideDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide: PresentationSlide;
  onSave: (updated: PresentationSlide) => Promise<void> | void;
  isSaving?: boolean;
}

function EditSlideForm({
  slide,
  onSave,
  onCancel,
  isSaving,
}: {
  slide: PresentationSlide;
  onSave: (updated: PresentationSlide) => Promise<void> | void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [title, setTitle] = useState(slide.title ?? "");
  const [content, setContent] = useState(slide.content ?? "");
  const [speakerScript, setSpeakerScript] = useState(slide.speaker_script ?? "");
  const [teacherNote, setTeacherNote] = useState(slide.teacher_note ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      ...slide,
      title: title.trim() || undefined,
      content: content.trim() || undefined,
      speaker_script: speakerScript.trim() || undefined,
      teacher_note: teacherNote.trim() || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <DialogTitle>Sunting Konten Slide {slide.order}</DialogTitle>
        <DialogDescription>
          Ubah teks judul, materi penjelasan, atau panduan guru secara langsung.
        </DialogDescription>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slide-title">Judul Slide</Label>
          <Input
            id="slide-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Mengenal Bagian Tumbuhan 🌿"
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slide-content">Konten / Penjelasan Materi</Label>
          <Textarea
            id="slide-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Penjelasan ringkas materi untuk siswa..."
            rows={4}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slide-speaker">Teks Narasi Suara (TTS / Script Guru)</Label>
          <Textarea
            id="slide-speaker"
            value={speakerScript}
            onChange={(e) => setSpeakerScript(e.target.value)}
            placeholder="Kalimat yang akan diucapkan saat slide ini ditampilkan..."
            rows={2}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="slide-note">Catatan Pedagogis Guru (Opsional)</Label>
          <Input
            id="slide-note"
            value={teacherNote}
            onChange={(e) => setTeacherNote(e.target.value)}
            placeholder="Tips fasilitasi kelas / apersepsi..."
          />
        </div>
      </div>

      <DialogFooter className="mt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Batal
        </Button>
        <Button type="submit" variant="primary" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-1.5 size-4 animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Check className="mr-1.5 size-4" />
              Simpan Perubahan
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function EditSlideDialog({
  open,
  onOpenChange,
  slide,
  onSave,
  isSaving = false,
}: EditSlideDialogProps) {
  const handleSave = async (updated: PresentationSlide) => {
    await onSave(updated);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        {open && (
          <EditSlideForm
            key={`${slide.id}-${slide.order}`}
            slide={slide}
            onSave={handleSave}
            onCancel={() => onOpenChange(false)}
            isSaving={isSaving}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

