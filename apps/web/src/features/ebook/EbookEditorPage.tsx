import { Link2, MessageSquareQuote, Save } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { EditorHeader } from "@/components/layout/EditorHeader";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const chapters = ["Pengenalan", "Proses Evaporasi", "Kondensasi", "Presipitasi", "Kesimpulan"];

const discussionPrompts = [
  "Bagaimana aktivitas manusia, seperti deforestasi, memengaruhi keseimbangan alamiah siklus air di suatu wilayah?",
  "Jelaskan hubungan antara siklus air dan pembentukan cuaca ekstrem seperti badai atau kekeringan panjang.",
];

export function EbookEditorPage() {
  const { projectId } = useParams();
  const [activeChapter, setActiveChapter] = useState(chapters[0]);

  return (
    <div className="min-h-screen bg-background pt-16">
      <EditorHeader
        backTo="/dashboard"
        title={`Proyek: ${projectId}`}
        subtitle="E-book"
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Link2 size={13} />
              Bagikan Link
            </Button>
            <Button variant="primary" size="sm">
              <Save size={12} />
              Simpan
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
              {chapters.map((chapter) => (
                <button
                  key={chapter}
                  onClick={() => setActiveChapter(chapter)}
                  className={cn(
                    "rounded-r-md border-l-2 px-3 py-2 text-left text-sm transition-colors",
                    activeChapter === chapter
                      ? "border-primary bg-secondary text-foreground"
                      : "border-transparent text-muted-foreground hover:bg-secondary/50",
                  )}
                >
                  {chapter}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="ml-64 flex flex-1 flex-col items-center bg-secondary/40 px-24 py-12 pb-32">
          <article className="w-full rounded-xl border border-border bg-card p-12 shadow-xs">
            <header className="flex flex-col gap-2 border-b border-border pb-6">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Siklus Air: Perjalanan Tiada Henti
              </h1>
              <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                <span>Bab 1: {activeChapter}</span>
                <span>•</span>
                <span>Membaca 5 Menit</span>
              </div>
            </header>

            <div className="mt-6 flex flex-col gap-6 text-base leading-relaxed text-foreground">
              <p>
                Air adalah sumber kehidupan di Bumi. Ia tidak pernah diam, melainkan terus
                bergerak dalam sebuah tarian raksasa yang kita sebut sebagai siklus air. Siklus
                ini adalah sistem hidrologi global yang mengatur distribusi, pergerakan, dan fase
                air di seluruh planet.
              </p>

              <figure className="flex flex-col gap-2 rounded-lg border border-border bg-secondary/50 p-3">
                <img
                  src="https://placehold.co/700x256/ffffff/6b7280?text=Ilustrasi+Siklus+Air"
                  alt="Ilustrasi siklus air"
                  className="h-64 w-full rounded-md border border-border object-cover"
                />
                <figcaption className="text-center font-mono text-[11px] text-muted-foreground italic">
                  Ilustrasi Siklus Air Secara Sederhana
                </figcaption>
              </figure>

              <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                Mengapa Siklus Air Penting?
              </h2>
              <p>
                Tanpa siklus air, daratan akan menjadi gurun tandus. Siklus ini mendistribusikan
                air tawar ke seluruh penjuru dunia, memelihara ekosistem, dan memungkinkan
                pertanian serta peradaban manusia berkembang.
              </p>

              <div className="relative rounded-lg border border-border bg-secondary/30 px-6 py-8">
                <span className="absolute -top-3 left-6 flex items-center gap-1 bg-card px-2 font-mono text-xs font-bold text-foreground">
                  <MessageSquareQuote size={13} />
                  Bahan Diskusi
                </span>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  {discussionPrompts.map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </main>
      </div>

      <div className="fixed right-0 bottom-0 left-64 flex justify-center border-t border-border bg-background px-4 py-4">
        <div className="flex w-full max-w-3xl gap-2">
          <input
            placeholder="Minta perubahan pada E-book... (misal: Persingkat bab ini)"
            className="flex-1 rounded-md border border-input bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <Button variant="primary">Kirim</Button>
        </div>
      </div>
    </div>
  );
}
