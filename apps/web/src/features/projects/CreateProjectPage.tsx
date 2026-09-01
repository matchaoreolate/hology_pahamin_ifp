import { BookOpen, Check, Info, MonitorPlay, ScrollText, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { OutputType } from "@/types/domain";

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

const faseOptions = ["Fase A (Kelas 1-2)", "Fase B (Kelas 3-4)", "Fase C (Kelas 5-6)"];

export function CreateProjectPage() {
  const navigate = useNavigate();
  const [selectedOutputs, setSelectedOutputs] = useState<OutputType[]>(["presentation"]);
  const [durasiMenit, setDurasiMenit] = useState("");

  const durasiValue = Number(durasiMenit);
  const isDurasiInvalid =
    durasiMenit.length > 0 &&
    (!Number.isInteger(durasiValue) || durasiValue <= 0 || durasiValue > 180);

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
    <div className="min-h-screen bg-background pt-16 pl-64">
      <AppHeader />
      <Sidebar />

      <main className="mx-auto flex max-w-[896px] flex-col gap-8 px-6 py-8">
        <div className="flex flex-col gap-2">
          <p className="font-mono text-[11px] text-muted-foreground">
            PahamIn AI / <span className="text-foreground">Buat Materi Baru</span>
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Buat Materi Baru
          </h1>
          <p className="text-sm text-muted-foreground">
            Isi form di bawah ini untuk menghasilkan materi pembelajaran terstruktur menggunakan
            AI.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="flex flex-col gap-10 rounded-xl border border-border bg-card p-8 shadow-xs"
        >
          <section className="flex flex-col gap-6">
            <h2 className="border-b border-border pb-2 text-xl font-medium text-foreground">
              1. Konteks Utama
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <Label>Mata Pelajaran</Label>
                <Input placeholder="Cth: Ilmu Pengetahuan Alam" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Fase/Kelas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Fase/Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {faseOptions.map((fase) => (
                      <SelectItem key={fase} value={fase}>
                        {fase}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Jam Pelajaran (menit)</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={1}
                    max={180}
                    step={1}
                    inputMode="numeric"
                    placeholder="30 menit"
                    value={durasiMenit}
                    onChange={(e) => setDurasiMenit(e.target.value)}
                    aria-invalid={isDurasiInvalid}
                    className={cn("pr-14", isDurasiInvalid && "border-destructive focus-visible:ring-destructive")}
                  />
                  {durasiMenit.length > 0 && (
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sm text-muted-foreground">
                      menit
                    </span>
                  )}
                </div>
                {isDurasiInvalid && (
                  <p className="text-xs text-destructive">
                    Durasi harus berupa bilangan bulat antara 1 dan 180 menit.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label>Materi/Topik Utama</Label>
                <Input placeholder="Cth: Sistem Tata Surya" />
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                <Label>Tujuan Pembelajaran</Label>
                <Textarea rows={3} placeholder="Siswa dapat memahami..." />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <h2 className="border-b border-border pb-2 text-xl font-medium text-foreground">
              2. Parameter Tambahan (Opsional)
            </h2>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <Label>Kondisi Kelas &amp; Konteks Lokal</Label>
                <Textarea
                  rows={3}
                  placeholder="Jelaskan kondisi unik kelas atau kearifan lokal yang ingin dimasukkan..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Instruksi Tambahan untuk AI</Label>
                <Textarea
                  rows={3}
                  placeholder="Cth: Gunakan bahasa yang santai, perbanyak analogi..."
                />
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-6">
            <div className="flex items-baseline justify-between border-b border-border pb-2">
              <h2 className="text-xl font-medium text-foreground">3. Pilih Format Output</h2>
              <span className="font-mono text-[11px] text-muted-foreground">
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
                    className={cn(
                      "relative flex-1 rounded-xl border-2 px-5 py-5 text-left transition-colors",
                      checked ? "border-primary bg-secondary/40" : "border-border hover:border-primary/50",
                    )}
                  >
                    <Icon size={20} className="mb-4 text-accent" />
                    <h3 className="mb-1 text-base font-medium text-foreground">{title}</h3>
                    <p className="text-[13px] text-muted-foreground">{description}</p>
                    <span
                      className={cn(
                        "absolute top-4 right-4 flex size-5 items-center justify-center rounded-md border",
                        checked
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card",
                      )}
                    >
                      {checked && <Check size={12} />}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-secondary/40 p-4">
              <Info size={15} className="shrink-0 text-muted-foreground" />
              <p className="text-[13px] text-muted-foreground">
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
