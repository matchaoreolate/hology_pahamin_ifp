import { BookOpen, MonitorPlay, Plus, ScrollText } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "../../components/layout/AppHeader";
import { Sidebar } from "../../components/layout/Sidebar";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { mockProjects } from "../projects/mock";
import type { OutputType } from "../../types/domain";

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
    <div className="min-h-screen bg-white pt-16 pl-64">
      <AppHeader />
      <Sidebar />

      <main className="flex flex-col gap-6 px-6 pt-6 pb-24">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black">Pusat Materi</h1>
          <p className="text-sm text-[#5d5e66]">Kelola semua materi pembelajaran Anda</p>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex overflow-hidden border border-[#c4c7c7]">
            {filters.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`border-r border-[#c4c7c7] px-4 py-1.5 font-mono text-xs last:border-r-0 ${
                  filter === f ? "bg-black text-white" : "bg-white text-[#1a1c1d]"
                }`}
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
            <div key={project.id} className="flex w-[309px] flex-col border border-[#c4c7c7]">
              <div className="flex items-start justify-between border-b border-[#c4c7c7] px-4 py-4">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Badge>{project.mata_pelajaran}</Badge>
                    <Badge>{project.kelas}</Badge>
                  </div>
                  <h3 className="text-xl font-medium text-[#1a1c1d]">{project.title}</h3>
                </div>
              </div>
              <div className="flex flex-col gap-3 px-4 py-4">
                <span className="font-mono text-[11px] tracking-wide text-[#5d5e66] uppercase">
                  Tersedia:
                </span>
                <div className="flex gap-2">
                  {project.selected_outputs.map((output) => {
                    const meta = outputMeta[output];
                    const Icon = meta.icon;
                    return (
                      <span
                        key={output}
                        className="flex items-center gap-1 border border-[#c4c7c7] px-2 py-1 font-mono text-[11px] text-black"
                      >
                        <Icon size={11} />
                        {meta.label}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#c4c7c7] bg-[#f9f9fa] px-4 py-4">
                <span className="font-mono text-[11px] text-[#5d5e66]">
                  {project.updated_label}
                </span>
                <Link
                  to={`/projects/${project.id}/${outputRouteFor(project.selected_outputs[0])}`}
                >
                  <Button variant="secondary" size="sm">
                    Buka →
                  </Button>
                </Link>
              </div>
            </div>
          ))}

          <Link
            to="/projects/new"
            className="flex min-h-[250px] w-[309px] flex-col items-center justify-center gap-2 border border-dashed border-[#c4c7c7] bg-[#f3f3f4] px-6 text-center"
          >
            <Plus size={32} className="text-[#c4c7c7]" />
            <h3 className="text-xl font-medium text-[#1a1c1d]">Buat Materi Baru</h3>
            <p className="text-sm text-[#5d5e66]">
              Belum ada materi lain? Mulai buat modul pembelajaran interaktif sekarang.
            </p>
          </Link>
        </div>

        <div className="border-t border-[#c4c7c7] pt-6">
          <h2 className="mb-4 text-xl font-medium text-black">Statistik Materi</h2>
          <div className="flex gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex-1 border border-[#c4c7c7] p-4">
                <p className="mb-1 font-mono text-xs text-[#5d5e66] uppercase">{stat.label}</p>
                <p className="text-3xl font-semibold tracking-tight text-[#1a1c1d]">
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
