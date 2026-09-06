import { Download, Info, Sparkles } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import { useParams } from "react-router-dom";

import { EditorHeader } from "@/components/layout/EditorHeader";
import { OutputSwitcher } from "@/components/layout/OutputSwitcher";
import { Button } from "@/components/ui/button";
import { downloadLkpdPdf } from "@/lib/api/exports";
import { getLkpd, useOutputContent } from "@/lib/api/outputs";

export function LkpdEditorPage() {
  const { projectId } = useParams();
  const { content: lkpd, waitingForGeneration, error } = useOutputContent(projectId, getLkpd);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-secondary/40 pt-16">
        <p className="text-sm text-destructive">Gagal memuat LKPD: {error.detail}</p>
      </div>
    );
  }

  if (waitingForGeneration) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-secondary/40 pt-16">
        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">AI sedang membuat LKPD...</p>
        <p className="text-xs text-muted-foreground">Halaman ini akan otomatis diperbarui setelah selesai.</p>
      </div>
    );
  }

  if (!lkpd) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-secondary/40 pt-16">
        <ThreeDot variant="brick-stack" color="#001456" size="medium" text="" textColor="" />
        <p className="text-sm text-muted-foreground">Memuat LKPD...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/40 pt-16">
      <EditorHeader
        backTo="/dashboard"
        title={lkpd.meta.title}
        subtitle={`Proyek: ${projectId} • LKPD`}
        centerContent={projectId ? <OutputSwitcher projectId={projectId} /> : undefined}
        actions={
          <>
            <span className="font-mono text-xs text-muted-foreground">Tersimpan otomatis</span>
            <Button
              variant="primary"
              size="sm"
              onClick={() => projectId && downloadLkpdPdf(projectId)}
            >
              <Download size={12} />
              Download PDF
            </Button>
          </>
        }
      />

      {/* A4 document: intentionally paper-white/black regardless of app theme */}
      <main className="flex justify-center p-6 pb-32">
        <div className="min-h-[1123px] w-[794px] rounded-sm border border-border bg-white p-12 shadow-md">
          <header className="flex flex-col items-center gap-2 border-b-2 border-black pb-5">
            <h1 className="text-3xl font-bold tracking-tight text-black uppercase">
              Lembar Kerja Peserta Didik (LKPD)
            </h1>
            <p className="text-base text-neutral-600">
              {lkpd.meta.mata_pelajaran} • {lkpd.meta.topik} • Fase {lkpd.meta.fase}
            </p>
          </header>

          <div className="mt-8 grid grid-cols-2 gap-8 rounded-md border border-neutral-200 bg-neutral-50 p-5">
            {["Nama", "Kelas", "No Absen", "Tanggal"].map((field) => (
              <div key={field} className="flex items-center gap-2 border-b border-neutral-300 pb-2">
                <span className="w-20 font-mono text-xs text-neutral-500">{field}:</span>
                <span className="flex-1 text-sm text-neutral-400">_________________________</span>
              </div>
            ))}
          </div>

          {lkpd.sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mt-8 flex flex-col gap-4">
              <h3 className="flex items-center gap-2 text-xl font-semibold text-black">
                <Info size={20} />
                {section.title}
              </h3>
              {section.instruction && (
                <p className="rounded-md border border-neutral-200 bg-neutral-100 p-4 text-sm text-neutral-700">
                  {section.instruction}
                </p>
              )}

              {section.activities.map((activity, activityIndex) => {
                if (activity.type === "instruction") {
                  return (
                    <p key={activityIndex} className="text-sm text-neutral-700">
                      {activity.content}
                    </p>
                  );
                }

                const answerSpaceHeight =
                  activity.answer_space === "short" ? "h-12" : activity.answer_space === "boxed" ? "h-32" : "h-24";

                return (
                  <div key={activityIndex} className="flex flex-col gap-3">
                    <p className="text-base font-medium text-black">{activity.question}</p>
                    <div
                      className={`${answerSpaceHeight} rounded-md border border-neutral-200 bg-white p-4 text-sm text-neutral-400`}
                    >
                      Tuliskan jawabanmu di sini...
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          <footer className="mt-12 flex items-center justify-between border-t border-neutral-200 pt-4 font-mono text-[11px] text-neutral-400">
            <span>KelasIn AI - Blueprint Series</span>
          </footer>
        </div>
      </main>

      <div className="fixed right-0 bottom-0 left-0 flex justify-center border-t border-border bg-background px-4 py-4">
        <div className="flex w-full max-w-3xl items-center gap-4 rounded-full border border-border bg-card px-4 py-2 shadow-xs opacity-70">
          <Sparkles size={18} className="text-muted-foreground" />
          <input
            disabled
            placeholder="Segera hadir: minta AI untuk mengubah LKPD"
            title="Fitur ini akan segera hadir"
            className="flex-1 cursor-not-allowed bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
