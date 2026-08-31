import { BookOpen, Image, MonitorPlay } from "lucide-react";
import { Link } from "react-router-dom";

import { AppHeader } from "@/components/layout/AppHeader";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

const outputs = [
  {
    label: "01 / PRESENTASI",
    icon: MonitorPlay,
    title: "Presentasi Interaktif TV",
    description: "Materi tayang terstruktur untuk layar kelas.",
  },
  {
    label: "02 / LKPD",
    icon: Image,
    title: "Lembar Kerja (LKPD)",
    description: "Siap cetak untuk aktivitas siswa.",
  },
  {
    label: "03 / E-BOOK",
    icon: BookOpen,
    title: "E-book Interaktif",
    description: "Bahan bacaan digital yang menarik.",
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-background pt-16">
      <AppHeader variant="landing" />

      <main className="flex flex-col items-center">
        <section className="flex w-full max-w-[1280px] flex-col items-center border-b border-border px-8 pt-32 pb-32">
          <h1 className="max-w-3xl text-center text-4xl font-semibold tracking-tight text-foreground">
            PahamIn: Generator Media Pembelajaran AI untuk Guru SD
          </h1>
          <p className="mt-6 max-w-2xl text-center text-base text-muted-foreground">
            Ubah konteks pembelajaran menjadi presentasi interaktif, LKPD, dan e-book dalam
            hitungan detik.
          </p>
          <div className="mt-10 flex gap-4">
            <Link to="/projects/new">
              <Button variant="primary">Buat Materi Sekarang</Button>
            </Link>
            <Button variant="secondary">Lihat Demo</Button>
          </div>
        </section>

        <section className="flex w-full max-w-[1280px] flex-col items-center px-8 py-20">
          <h2 className="mb-12 text-2xl font-semibold tracking-tight text-foreground">
            Tiga Output Utama
          </h2>
          <div className="flex w-full gap-6">
            {outputs.map(({ label, icon: Icon, title, description }) => (
              <div
                key={title}
                className="flex w-1/3 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xs transition-shadow hover:shadow-md"
              >
                <div className="flex items-center justify-between border-b border-border px-6 py-6">
                  <span className="font-mono text-xs text-foreground">{label}</span>
                  <Icon size={18} className="text-muted-foreground" />
                </div>
                <div className="flex min-h-[200px] items-center justify-center bg-secondary/60 px-6 py-10">
                  <div className="flex h-32 w-full items-center justify-center rounded-lg border border-border bg-card">
                    <Icon size={24} className="text-accent" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 border-t border-border px-6 py-6">
                  <h3 className="text-xl font-medium text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
