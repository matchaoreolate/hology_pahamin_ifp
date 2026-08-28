import { BookOpen, Info, MonitorPlay, ScrollText, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../../components/layout/AppHeader";
import { Sidebar } from "../../components/layout/Sidebar";
import { Button } from "../../components/ui/Button";
import { Input, Textarea } from "../../components/ui/Input";
import type { OutputType } from "../../types/domain";

const outputOptions: { value: OutputType; title: string; description: string; icon: typeof MonitorPlay }[] = [
  {
    value: "presentation",
    title: "Presentasi Interaktif TV",
    description: "Slide materi dengan interaksi.",
    icon: MonitorPlay,
  },
  {
    value: "lkpd",
    title: "LKPD",
    description: "Lembar kerja peserta didik siap cetak.",
    icon: ScrollText,
  },
  {
    value: "ebook",
    title: "E-book",
    description: "Materi bacaan komprehensif.",
    icon: BookOpen,
  },
];

export function CreateProjectPage() {
  const navigate = useNavigate();
  const [selectedOutputs, setSelectedOutputs] = useState<OutputType[]>(["presentation"]);

  function toggleOutput(output: OutputType) {
    setSelectedOutputs((prev) =>
      prev.includes(output) ? prev.filter((o) => o !== output) : [...prev, output],
    );
  }

  function handleGenerate() {
    const first = selectedOutputs[0] ?? "presentation";
    const route = first === "presentation" ? "presentation" : first;
    navigate(`/projects/new-project/${route}`);
  }

  return (
    <div className="min-h-screen bg-[#f9f9fa] pt-16 pl-64">
      <AppHeader />
      <Sidebar />

      <main className="mx-auto flex max-w-[896px] flex-col gap-8 px-6 py-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[11px] text-[#5d5e66]">
            PahamIn AI / <span className="text-[#1a1c1d]">Buat Materi Baru</span>
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-[#1a1c1d]">
            Buat Materi Baru
          </h1>
          <p className="text-sm text-[#5d5e66]">
            Isi form di bawah ini untuk menghasilkan materi pembelajaran terstruktur menggunakan
            AI.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="flex flex-col gap-10 border border-[#c4c7c7] bg-white p-8"
        >
          <section className="flex flex-col gap-6">
            <h2 className="border-b border-[#c4c7c7] pb-2 text-xl font-medium text-[#1a1c1d]">
              1. Konteks Utama
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-xs font-medium text-[#1a1c1d]">
                  Mata Pelajaran
                </span>
                <Input placeholder="Cth: Ilmu Pengetahuan Alam" />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-xs font-medium text-[#1a1c1d]">Fase/Kelas</span>
                <select className="w-full border border-[#c4c7c7] px-[13px] py-[13px] text-sm text-[#1a1c1d] focus:outline-none focus:border-black">
                  <option>Pilih Fase/Kelas</option>
                  <option>Fase A (Kelas 1-2)</option>
                  <option>Fase B (Kelas 3-4)</option>
                  <option>Fase C (Kelas 5-6)</option>
                </select>
              </label>
              <label className="col-span-2 flex flex-col gap-2">
                <span className="font-mono text-xs font-medium text-[#1a1c1d]">
                  Materi/Topik Utama
                </span>
                <Input placeholder="Cth: Sistem Tata Surya" />
              </label>
              <label className="col-span-2 flex flex-col gap-2">
                <span className="font-mono text-xs font-medium text-[#1a1c1d]">
                  Tujuan Pembelajaran
                </span>
                <Textarea rows={3} placeholder="Siswa dapat memahami..." />
              </label>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="border-b border-[#c4c7c7] pb-2 text-xl font-medium text-[#1a1c1d]">
              2. Parameter Tambahan (Opsional)
            </h2>
            <div className="flex flex-col gap-6">
              <label className="flex flex-col gap-2">
                <span className="font-mono text-xs font-medium text-[#1a1c1d]">
                  Kondisi Kelas &amp; Konteks Lokal
                </span>
                <Textarea
                  rows={3}
                  placeholder="Jelaskan kondisi unik kelas atau kearifan lokal yang ingin dimasukkan..."
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-mono text-xs font-medium text-[#1a1c1d]">
                  Instruksi Tambahan untuk AI
                </span>
                <Textarea
                  rows={3}
                  placeholder="Cth: Gunakan bahasa yang santai, perbanyak analogi..."
                />
              </label>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex items-baseline justify-between border-b border-[#c4c7c7] pb-2">
              <h2 className="text-xl font-medium text-[#1a1c1d]">3. Pilih Format Output</h2>
              <span className="font-mono text-[11px] text-[#5d5e66]">
                Bisa pilih lebih dari satu
              </span>
            </div>
            <div className="flex gap-4">
              {outputOptions.map(({ value, title, description, icon: Icon }) => {
                const checked = selectedOutputs.includes(value);
                return (
                  <button
                    type="button"
                    key={value}
                    onClick={() => toggleOutput(value)}
                    className={`relative flex-1 border px-5 py-5 text-left ${
                      checked ? "border-black" : "border-[#c4c7c7]"
                    }`}
                  >
                    <Icon size={20} className="mb-4 text-[#1a1c1d]" />
                    <h3 className="mb-1 text-base font-medium text-[#1a1c1d]">{title}</h3>
                    <p className="text-[13px] text-[#5d5e66]">{description}</p>
                    <span
                      className={`absolute right-4 top-4 flex size-5 items-center justify-center border ${
                        checked ? "border-black bg-black text-white" : "border-[#c4c7c7] bg-white"
                      }`}
                    >
                      {checked && "✓"}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 border border-[#c4c7c7] bg-[#eeeeef] p-4">
              <Info size={15} className="shrink-0 text-[#5d5e66]" />
              <p className="text-[13px] text-[#5d5e66]">
                Semua media akan dihasilkan dari konteks yang sama agar saling berkesinambungan.
              </p>
            </div>
          </section>
        </form>

        <div className="flex justify-end pb-12">
          <Button type="button" variant="primary" onClick={handleGenerate}>
            <Sparkles size={16} />
            Generate dengan AI
          </Button>
        </div>
      </main>
    </div>
  );
}
