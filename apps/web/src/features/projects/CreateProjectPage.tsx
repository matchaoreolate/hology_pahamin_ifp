import { BookOpen, Check, Info, MonitorPlay, ScrollText, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createLearningContext } from "@/lib/api/contexts";
import { createProject, generateProject } from "@/lib/api/projects";
import { usePollProjectGeneration } from "@/lib/api/polling";
import { cn } from "@/lib/utils";
import type { ApiError, Fase, Kelas, MataPelajaran } from "@/types/api";
import type { OutputType } from "@/types/domain";

import { GenerationLoadingState } from "./GenerationLoadingState";

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

// Must match the backend's MataPelajaranEnum exactly (app/schemas/learning_context.py).
const mataPelajaranOptions: MataPelajaran[] = [
  "IPAS",
  "Matematika",
  "Bahasa Indonesia",
  "Pendidikan Pancasila",
  "PJOK",
  "Seni",
  "Bahasa Inggris",
  "Agama",
];

// Must match the backend's Fase/Kelas enums + the fase<->kelas consistency validator.
const faseKelasOptions: { label: string; fase: Fase; kelas: Kelas }[] = [
  { label: "Fase A (Kelas 1&2)", fase: "A", kelas: "1&2" },
  { label: "Fase B (Kelas 3&4)", fase: "B", kelas: "3&4" },
  { label: "Fase C (Kelas 5&6)", fase: "C", kelas: "5&6" },
];

// The backend still requires alokasi_waktu_jp (1-2), not minutes — the duration input
// below is cosmetic until that contract changes, and is not sent to the API.
const HARDCODED_ALOKASI_WAKTU_JP = 2;

export function CreateProjectPage() {
  const navigate = useNavigate();
  const [selectedOutputs, setSelectedOutputs] = useState<OutputType[]>(["presentation"]);
  const [durasiMenit, setDurasiMenit] = useState("");

  const [mataPelajaran, setMataPelajaran] = useState<MataPelajaran | "">("");
  const [faseKelasLabel, setFaseKelasLabel] = useState("");
  const [topik, setTopik] = useState("");
  const [tujuanPembelajaran, setTujuanPembelajaran] = useState("");
  const [konteksLokal, setKonteksLokal] = useState("");

  const [submitError, setSubmitError] = useState<string | null>(null);

  // "form": editing. "starting": creating context/project. "generating": generation
  // triggered, polling status. "error": creation or generation failed.
  const [phase, setPhase] = useState<"form" | "starting" | "generating" | "error">("form");
  const [phaseError, setPhaseError] = useState<string | null>(null);
  const [pendingProjectId, setPendingProjectId] = useState<string | null>(null);
  const [pendingRoute, setPendingRoute] = useState<string>("presentation");

  const { status: pollStatus, error: pollError } = usePollProjectGeneration(
    pendingProjectId,
    phase === "generating",
  );

  useEffect(() => {
    if (phase !== "generating") return;
    if (pollError) {
      setPhaseError(pollError.detail);
      setPhase("error");
      return;
    }
    if (pollStatus?.project_status === "done") {
      navigate(`/projects/${pendingProjectId}/${pendingRoute}`);
    } else if (pollStatus?.project_status === "error") {
      setPhaseError(pollStatus.error_message ?? "Terjadi kesalahan saat membuat materi.");
      setPhase("error");
    }
  }, [phase, pollStatus, pollError, pendingProjectId, pendingRoute, navigate]);

  const durasiValue = Number(durasiMenit);
  const isDurasiInvalid =
    durasiMenit.length > 0 &&
    (!Number.isInteger(durasiValue) || durasiValue <= 0 || durasiValue > 180);

  function toggleOutput(output: OutputType) {
    setSelectedOutputs((prev) =>
      prev.includes(output) ? prev.filter((o) => o !== output) : [...prev, output],
    );
  }

  /** Kicks off (or retries) generation for an already-created project. */
  async function triggerGenerate(projectId: string) {
    setPhaseError(null);
    setPhase("generating");
    try {
      await generateProject(projectId);
    } catch (err) {
      setPhaseError((err as ApiError).detail);
      setPhase("error");
    }
  }

  async function handleGenerate() {
    if (phase !== "form" && phase !== "error") return; // guard against duplicate submission

    const faseKelas = faseKelasOptions.find((o) => o.label === faseKelasLabel);
    if (!mataPelajaran || !faseKelas || topik.trim().length < 3 || tujuanPembelajaran.trim().length < 10) {
      setSubmitError(
        "Lengkapi Mata Pelajaran, Fase/Kelas, Materi/Topik (min. 3 karakter), dan Tujuan Pembelajaran (min. 10 karakter).",
      );
      return;
    }

    // Retrying after a generation failure — the project already exists, just re-trigger it.
    if (pendingProjectId) {
      void triggerGenerate(pendingProjectId);
      return;
    }

    setSubmitError(null);
    setPhaseError(null);
    setPhase("starting");
    try {
      const context = await createLearningContext({
        fase: faseKelas.fase,
        kelas: faseKelas.kelas,
        mata_pelajaran: mataPelajaran,
        topik: topik.trim(),
        tujuan_pembelajaran: tujuanPembelajaran.trim(),
        alokasi_waktu_jp: HARDCODED_ALOKASI_WAKTU_JP,
        apersepsi: konteksLokal.trim() || undefined,
      });

      const project = await createProject({
        learning_context_id: context.id,
        title: topik.trim(),
        selected_outputs: selectedOutputs,
      });

      setPendingProjectId(project.id);
      setPendingRoute(selectedOutputs[0] ?? "presentation");
      await triggerGenerate(project.id);
    } catch (err) {
      setPhaseError((err as ApiError).detail);
      setPhase("error");
    }
  }

  return (
    <div className="min-h-screen bg-background pt-16 pl-64">
      <AppHeader />
      <Sidebar />

      <main className="mx-auto flex max-w-[896px] flex-col gap-8 px-6 py-8">
        <div className="flex flex-col gap-2">
          {/* <p className="font-mono text-[11px] text-muted-foreground">
            PahamIn AI / <span className="text-foreground">Buat Materi Baru</span>
          </p> */}
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Buat Materi Baru
          </h1>
          <p className="text-sm text-muted-foreground">
            Isi form di bawah ini untuk menghasilkan materi pembelajaran terstruktur menggunakan
            AI.
          </p>
        </div>

        {phase !== "form" ? (
          <GenerationLoadingState
            phase={phase === "starting" ? "starting" : "generating"}
            errorMessage={phase === "error" ? phaseError : null}
            onRetry={() => void handleGenerate()}
          />
        ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleGenerate();
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
                <Select value={mataPelajaran} onValueChange={(v) => setMataPelajaran(v as MataPelajaran)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Mata Pelajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {mataPelajaranOptions.map((mp) => (
                      <SelectItem key={mp} value={mp}>
                        {mp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-2">
                <Label>Fase/Kelas</Label>
                <Select value={faseKelasLabel} onValueChange={(v) => setFaseKelasLabel(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Fase/Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    {faseKelasOptions.map(({ label }) => (
                      <SelectItem key={label} value={label}>
                        {label}
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
                <Input
                  placeholder="Cth: Sistem Tata Surya"
                  value={topik}
                  onChange={(e) => setTopik(e.target.value)}
                />
              </div>
              <div className="col-span-2 flex flex-col gap-2">
                <Label>Tujuan Pembelajaran</Label>
                <Textarea
                  rows={3}
                  placeholder="Siswa dapat memahami..."
                  value={tujuanPembelajaran}
                  onChange={(e) => setTujuanPembelajaran(e.target.value)}
                />
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
                  value={konteksLokal}
                  onChange={(e) => setKonteksLokal(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Instruksi Tambahan untuk AI</Label>
                <Textarea
                  rows={3}
                  placeholder="Cth: Gunakan bahasa yang santai, perbanyak analogi... (belum terhubung ke API)"
                  disabled
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
        )}

        {phase === "form" && submitError && (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {submitError}
          </p>
        )}

        {phase === "form" && (
          <div className="flex justify-end pb-12">
            <Button type="button" variant="primary" onClick={() => void handleGenerate()}>
              <Sparkles size={16} />
              Generate dengan AI
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
