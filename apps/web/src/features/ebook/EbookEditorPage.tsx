import { ThreeDot } from "react-loading-indicators";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { EditorHeader } from "@/components/layout/EditorHeader";
import { OutputSwitcher } from "@/components/layout/OutputSwitcher";
import { getEbook, useOutputContent } from "@/lib/api/outputs";
import { cn } from "@/lib/utils";

export function EbookEditorPage() {
  const { projectId } = useParams();
  const { content: ebook, waitingForGeneration, error } = useOutputContent(projectId, getEbook);
  const [activeSection, setActiveSection] = useState(0);

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
  const section = ebook.sections[safeActiveSection];

  return (
    <div className="min-h-screen bg-background pt-16">
      <EditorHeader
        backTo="/dashboard"
        title={ebook.meta.title}
        subtitle="E-book"
        centerContent={projectId ? <OutputSwitcher projectId={projectId} /> : undefined}
        actions={<span className="font-mono text-xs text-muted-foreground">Tersimpan otomatis</span>}
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
                  onClick={() => setActiveSection(index)}
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

        <main className="ml-64 flex flex-1 flex-col items-center bg-secondary/40 px-24 py-12 pb-32">
          <article className="w-full rounded-xl border border-border bg-card p-12 shadow-xs">
            <header className="flex flex-col gap-2 border-b border-border pb-6">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {ebook.meta.title}
              </h1>
              <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                <span>
                  Bab {safeActiveSection + 1}: {section.title}
                </span>
                <span>•</span>
                <span>{ebook.meta.mata_pelajaran}</span>
              </div>
            </header>

            <div className="mt-6 flex flex-col gap-6 text-base leading-relaxed whitespace-pre-line text-foreground">
              {section.content}
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
