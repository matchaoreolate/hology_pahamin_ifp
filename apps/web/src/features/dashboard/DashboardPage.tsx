import { BookOpen, MonitorPlay, Plus, ScrollText } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OutputType } from "@/types/domain";

import { mockProjects } from "../projects/mock";

const filters = ["Semua", "Presentasi", "LKPD", "E-book"] as const;

const outputMeta: Record<OutputType, { label: string; icon: typeof MonitorPlay }> = {
  presentation: { label: "Presentasi", icon: MonitorPlay },
  lkpd: { label: "LKPD", icon: ScrollText },
  ebook: { label: "E-book", icon: BookOpen },
};

const stats = [
  { label: "TOTAL MODUL", value: mockProjects.length },
  {
    label: "PRESENTASI",
    value: mockProjects.filter((p) => p.selected_outputs.includes("presentation")).length,
  },
  {
    label: "LKPD AKTIF",
    value: mockProjects.filter((p) => p.selected_outputs.includes("lkpd")).length,
  },
  {
    label: "E-BOOK",
    value: mockProjects.filter((p) => p.selected_outputs.includes("ebook")).length,
  },
];

function outputRouteFor(output: OutputType) {
  return output === "presentation" ? "presentation" : output;
}

export function DashboardPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("Semua");

  const visibleProjects = mockProjects.filter((project) => {
    if (filter === "Semua") return true;
    if (filter === "Presentasi") return project.selected_outputs.includes("presentation");
    if (filter === "LKPD") return project.selected_outputs.includes("lkpd");
    return project.selected_outputs.includes("ebook");
  });

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
          <Link to="/projects/new">
            <Button variant="primary" size="sm">
              <Plus size={13} />
              Materi Baru
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap gap-6 pb-6">
          {visibleProjects.map((project) => (
            <Card key={project.id} className="w-[309px]">
              <CardHeader className="gap-2">
                <div className="flex gap-2">
                  <Badge>{project.mata_pelajaran}</Badge>
                  <Badge>{project.kelas}</Badge>
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
                  {project.updated_label}
                </span>
                <Link
                  to={`/projects/${project.id}/${outputRouteFor(project.selected_outputs[0])}`}
                >
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
