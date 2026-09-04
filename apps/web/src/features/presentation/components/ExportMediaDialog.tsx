import { CheckCircle2, Loader2, MonitorPlay, RotateCcw, TriangleAlert } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { exportPresentationAsHtml } from "@/lib/export/html-exporter";
import { exportPresentationAsPdf } from "@/lib/export/pdf-exporter";
import { cn } from "@/lib/utils";

import type { PresentationArtifact } from "../types";

type ExportOption = "offline" | "pdf";
type Status = "idle" | "exporting" | "success" | "error";

const OPTIONS: {
  id: ExportOption;
  title: string;
  description: string;
  supportingCopy: string;
}[] = [
  {
    id: "offline",
    title: "Media Interaktif Offline",
    description: "Buka langsung di browser, bahkan tanpa koneksi internet.",
    supportingCopy:
      "Materi dan aktivitas interaktif akan disimpan dalam satu file dan dapat dibuka tanpa koneksi internet.",
  },
  {
    id: "pdf",
    title: "PDF",
    description: "Cocok untuk dicetak atau dibagikan.",
    supportingCopy: "",
  },
];

export function ExportMediaDialog({
  artifact,
  open,
  onOpenChange,
}: {
  artifact: PresentationArtifact;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selected, setSelected] = useState<ExportOption>("offline");
  const [status, setStatus] = useState<Status>("idle");
  const [warnings, setWarnings] = useState<string[]>([]);

  function reset() {
    setStatus("idle");
    setWarnings([]);
  }

  function close() {
    reset();
    onOpenChange(false);
  }

  async function handleExport() {
    setStatus("exporting");
    setWarnings([]);
    try {
      if (selected === "offline") {
        const result = await exportPresentationAsHtml(artifact);
        setWarnings(result.warnings);
      } else {
        await exportPresentationAsPdf(artifact);
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (status === "exporting") return;
        if (!next) close();
        else onOpenChange(next);
      }}
    >
      <DialogContent>
        {status === "exporting" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <Loader2 size={28} className="animate-spin text-primary" />
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium text-foreground">Sedang menyiapkan media...</p>
              <p className="text-sm text-muted-foreground">
                Menyiapkan materi, aktivitas, dan aset untuk digunakan secara offline.
              </p>
            </div>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 size={28} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium text-foreground">Media berhasil diunduh.</p>
              {selected === "offline" && (
                <p className="text-sm text-muted-foreground">
                  Media interaktif siap digunakan tanpa koneksi internet.
                </p>
              )}
            </div>
            {warnings.length > 0 && (
              <div className="w-full rounded-md border border-destructive/30 bg-destructive/10 p-3 text-left text-xs text-destructive">
                <p className="mb-1 font-medium">Beberapa aset gagal disematkan:</p>
                <ul className="list-inside list-disc space-y-0.5">
                  {warnings.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
            )}
            <Button variant="secondary" size="sm" onClick={() => close()}>
              Tutup
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <TriangleAlert size={28} />
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-base font-medium text-foreground">Gagal menyiapkan media</p>
              <p className="text-sm text-muted-foreground">
                Terjadi kendala saat menyiapkan file. Silakan coba lagi.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => void handleExport()}>
              <RotateCcw size={14} />
              Coba Lagi
            </Button>
          </div>
        )}

        {status === "idle" && (
          <>
            <DialogTitle>Unduh Media</DialogTitle>
            <DialogDescription>Pilih format yang paling sesuai untuk Anda.</DialogDescription>

            <div className="mt-4 flex flex-col gap-3">
              {OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelected(option.id)}
                  className={cn(
                    "flex flex-col gap-1 rounded-lg border p-4 text-left transition-colors",
                    selected === option.id
                      ? "border-2 border-primary bg-secondary/60"
                      : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <MonitorPlay size={15} className="text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{option.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                  {option.supportingCopy && (
                    <p className="text-xs text-muted-foreground">{option.supportingCopy}</p>
                  )}
                </button>
              ))}
            </div>

            <DialogFooter>
              <Button variant="secondary" size="sm" onClick={() => close()}>
                Batal
              </Button>
              <Button variant="primary" size="sm" onClick={() => void handleExport()}>
                Unduh
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
