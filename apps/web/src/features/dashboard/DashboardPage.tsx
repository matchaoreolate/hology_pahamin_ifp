import { BookOpen, MonitorPlay, Plus, ScrollText } from "lucide-react";
import introJs from "intro.js";
import "intro.js/introjs.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getLearningContext } from "@/lib/api/contexts";
import { getProjects } from "@/lib/api/projects";
import type { ApiError, LearningContextApiResponse, MediaProjectApiResponse } from "@/types/api";
import type { OutputType } from "@/types/domain";

const filters = ["Semua", "Presentasi", "LKPD", "E-book"] as const;

const outputMeta: Record<OutputType, { label: string; icon: typeof MonitorPlay }> = {
  presentation: { label: "Presentasi", icon: MonitorPlay },
  lkpd: { label: "LKPD", icon: ScrollText },
  ebook: { label: "E-book", icon: BookOpen },
};

function outputRouteFor(output: OutputType) {
  return output === "presentation" ? "presentation" : output;
}

function formatUpdatedLabel(isoDate: string): string {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "Terakhir diubah: baru saja";
  if (minutes < 60) return `Terakhir diubah: ${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Terakhir diubah: ${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `Terakhir diubah: ${days} hari lalu`;
}

interface ProjectRow {
  project: MediaProjectApiResponse;
  context: LearningContextApiResponse | null;
}

const ONBOARDING_SEEN_KEY = "pahamin_dashboard_onboarding_seen";

export function DashboardPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Semua");
  const [rows, setRows] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const projectListRef = useRef<HTMLDivElement>(null);
  const createButtonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const projects = await getProjects();
        const withContext = await Promise.all(
          projects.map(async (project) => {
            try {
              const context = await getLearningContext(project.learning_context_id);
              return { project, context };
            } catch {
              return { project, context: null };
            }
          }),
        );
        if (!cancelled) setRows(withContext);
      } catch (err) {
        if (!cancelled) setError(err as ApiError);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    if (localStorage.getItem(ONBOARDING_SEEN_KEY)) return;

    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          title: "Selamat Datang di PahamIn!",
          intro: "Ini adalah Pusat Materi Anda — tempat mengelola semua media pembelajaran yang sudah dibuat.",
        },
        {
          element: projectListRef.current ?? undefined,
          title: "Daftar Materi",
          intro: "Semua materi pembelajaran yang Anda buat akan muncul di sini.",
        },
        {
          element: createButtonRef.current ?? undefined,
          title: "Buat Materi Baru",
          intro: "Klik tombol ini untuk mulai membuat materi pembelajaran baru dengan bantuan AI.",
        },
      ],
      showBullets: true,
      exitOnOverlayClick: false,
      nextLabel: "Lanjut",
      prevLabel: "Kembali",
      doneLabel: "Selesai",
    });
    intro.onexit(() => localStorage.setItem(ONBOARDING_SEEN_KEY, "1"));
    intro.start();
  }, [loading]);

  const visibleRows = rows.filter(({ project }) => {
    if (filter === "Semua") return true;
    if (filter === "Presentasi") return project.selected_outputs.includes("presentation");
    if (filter === "LKPD") return project.selected_outputs.includes("lkpd");
    return project.selected_outputs.includes("ebook");
  });

  const stats = [
    { label: "TOTAL MODUL", value: rows.length },
    {
      label: "PRESENTASI",
      value: rows.filter(({ project }) => project.selected_outputs.includes("presentation")).length,
    },
    {
      label: "LKPD AKTIF",
      value: rows.filter(({ project }) => project.selected_outputs.includes("lkpd")).length,
    },
    {
      label: "E-BOOK",
      value: rows.filter(({ project }) => project.selected_outputs.includes("ebook")).length,
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-16 pl-64">
      <AppHeader />
      <Sidebar />

      <main className="flex flex-col gap-6 px-6 pt-6 pb-24">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">Pusat Materi</h1>
          <p className="text-sm text-muted-foreground">Kelola semua materi pembelajaran Anda</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex overflow-hidden rounded-md border border-border">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "border-r border-border px-4 py-1.5 font-mono text-xs transition-colors last:border-r-0",
                  filter === f
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-foreground hover:bg-secondary",
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <Link to="/projects/new" ref={createButtonRef}>
            <Button variant="primary" size="sm">
              <Plus size={13} />
              Materi Baru
            </Button>
          </Link>
        </div>

        <div ref={projectListRef}>
        {error && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            Gagal memuat daftar materi: {error.detail}
          </p>
        )}

        {loading ? (
          <p className="text-sm text-muted-foreground">Memuat materi...</p>
        ) : (
          <div className="flex flex-wrap gap-6 pb-6">
            {visibleRows.map(({ project, context }) => (
              <Card key={project.id} className="w-[309px]">
                <CardHeader className="gap-2">
                  <div className="flex gap-2">
                    <Badge>{context?.mata_pelajaran ?? "-"}</Badge>
                    <Badge>{context ? `Kelas ${context.kelas}` : "-"}</Badge>
                  </div>
                  <h3 className="text-xl font-medium text-foreground">{project.title}</h3>
                </CardHeader>
                <CardContent>
                  <span className="font-mono text-[11px] tracking-wide text-muted-foreground uppercase">
                    Tersedia:
                  </span>
                  <div className="flex gap-2">
                    {project.selected_outputs.map((output) => {
                      const meta = outputMeta[output];
                      const Icon = meta.icon;
                      return (
                        <span
                          key={output}
                          className="flex items-center gap-1 rounded-md border border-border px-2 py-1 font-mono text-[11px] text-foreground"
                        >
                          <Icon size={11} />
                          {meta.label}
                        </span>
                      );
                    })}
                  </div>
                </CardContent>
                <CardFooter>
                  <span className="font-mono text-[11px] text-muted-foreground">
                    {formatUpdatedLabel(project.updated_at)}
                  </span>
                  <Link to={`/projects/${project.id}/${outputRouteFor(project.selected_outputs[0])}`}>
                    <Button variant="secondary" size="sm">
                      Buka →
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}

            <Link
              to="/projects/new"
              className="flex min-h-[250px] w-[309px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-secondary/40 px-6 text-center transition-colors hover:border-primary hover:bg-secondary/70"
            >
              <Plus size={32} className="text-muted-foreground" />
              <h3 className="text-xl font-medium text-foreground">Buat Materi Baru</h3>
              <p className="text-sm text-muted-foreground">
                Belum ada materi lain? Mulai buat modul pembelajaran interaktif sekarang.
              </p>
            </Link>
          </div>
        )}
        </div>

        <div className="border-t border-border pt-6">
          <h2 className="mb-4 text-xl font-medium text-foreground">Statistik Materi</h2>
          <div className="flex gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex-1 rounded-lg border border-border bg-card p-4">
                <p className="mb-1 font-mono text-xs text-muted-foreground uppercase">
                  {stat.label}
                </p>
                <p className="text-3xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
