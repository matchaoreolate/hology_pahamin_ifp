import { Download } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { EditorHeader } from "@/components/layout/EditorHeader";
import { OutputSwitcher } from "@/components/layout/OutputSwitcher";
import { Button } from "@/components/ui/button";
import { getEbook, useOutputContent } from "@/lib/api/outputs";
import { exportEbookAsPdf } from "@/lib/export/ebook-pdf-exporter";
import { cn } from "@/lib/utils";
import type { ApiError } from "@/types/api";

import { EbookReader, type EbookReaderHandle } from "./EbookReader";

export function EbookEditorPage() {
  const { projectId } = useParams();
  const { content: ebook, waitingForGeneration, error } = useOutputContent(projectId, "ebook", getEbook);
  const [activeSection, setActiveSection] = useState(0);
  const readerRef = useRef<EbookReaderHandle>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  async function handleDownloadPdf() {
    if (!ebook) return;
    setDownloading(true);
    setDownloadError(null);
    try {
      await exportEbookAsPdf(ebook);
    } catch (err) {
      setDownloadError((err as ApiError)?.detail ?? "Gagal membuat PDF. Silakan coba lagi.");
    } finally {
      setDownloading(false);
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background pt-16">
        <p className="text-sm text-destructive">Gagal memuat e-book: {error.detail}</p>
      </div>
    );
  }

  if (waitingForGeneration) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background pt-16">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">AI sedang membuat e-book...</p>
        <p className="text-xs text-muted-foreground">Halaman ini akan otomatis diperbarui setelah selesai.</p>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background pt-16">
        <ThreeDot variant="brick-stack" color="#001456" size="medium" text="" textColor="" />
        <p className="text-sm text-muted-foreground">Memuat e-book...</p>
      </div>
    );
  }

  const safeActiveSection = Math.min(activeSection, ebook.sections.length - 1);

  return (
    <div className="min-h-screen bg-background pt-16">
      <EditorHeader
        backTo="/dashboard"
        title={ebook.meta.title}
        subtitle="E-book"
        centerContent={projectId ? <OutputSwitcher projectId={projectId} /> : undefined}
        actions={
          <>
            <span className="font-mono text-xs text-muted-foreground">Tersimpan otomatis</span>
            <Button variant="primary" size="sm" onClick={() => void handleDownloadPdf()} disabled={downloading}>
              <Download size={12} />
              {downloading ? "Membuat PDF..." : "Unduh PDF"}
            </Button>
          </>
        }
      />

      <div className="flex pl-0">
        <aside className="fixed top-16 bottom-0 left-0 w-64 overflow-auto border-r border-border bg-card">
          <div className="flex flex-col gap-4 border-b border-border px-4 py-4">
            <h3 className="font-mono text-xs tracking-wide text-muted-foreground uppercase">
              Daftar Isi
            </h3>
            <nav className="flex flex-col">
              {ebook.sections.map((s, index) => (
                <button
                  key={index}
                  onClick={() => readerRef.current?.goToSection(index)}
                  className={cn(
                    "rounded-r-md border-l-2 px-3 py-2 text-left text-sm transition-colors",
                    index === safeActiveSection
                      ? "border-primary bg-secondary text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-secondary/50",
                  )}
                >
                  {s.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="ml-64 flex flex-1 flex-col items-center gap-4 bg-secondary/40 px-24 py-12 pb-32">
          {downloadError && (
            <p className="w-full max-w-lg rounded-md border border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
              {downloadError}
            </p>
          )}
          <EbookReader ref={readerRef} ebook={ebook} onActiveSectionChange={setActiveSection} />
        </main>
      </div>
    </div>
  );
}
