import { Link2, MessageSquareQuote, Save } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EditorHeader } from "../../components/layout/EditorHeader";
import { Button } from "../../components/ui/Button";

const chapters = ["Pengenalan", "Proses Evaporasi", "Kondensasi", "Presipitasi", "Kesimpulan"];

const discussionPrompts = [
  "Bagaimana aktivitas manusia, seperti deforestasi, memengaruhi keseimbangan alamiah siklus air di suatu wilayah?",
  "Jelaskan hubungan antara siklus air dan pembentukan cuaca ekstrem seperti badai atau kekeringan panjang.",
];

export function EbookEditorPage() {
  const { projectId } = useParams();
  const [activeChapter, setActiveChapter] = useState(chapters[0]);

  return (
    <div className="min-h-screen bg-[#f9f9fa] pt-16">
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
        <aside className="fixed left-0 top-16 bottom-0 w-64 overflow-auto border-r border-[#c4c7c7] bg-white">
          <div className="flex flex-col gap-4 border-b border-[#c4c7c7] px-4 py-4">
            <h3 className="font-mono text-xs uppercase tracking-wide text-[#444748]">
              Daftar Isi
            </h3>
            <nav className="flex flex-col">
              {chapters.map((chapter) => (
                <button
                  key={chapter}
                  onClick={() => setActiveChapter(chapter)}
                  className={`border-l-2 px-3 py-2 text-left text-sm ${
                    activeChapter === chapter
                      ? "border-black bg-[#eeeeef] text-black"
                      : "border-transparent text-[#444748]"
                  }`}
                >
                  {chapter}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        <main className="ml-64 flex flex-1 flex-col items-center bg-[#f3f3f4] px-24 py-12 pb-32">
          <article className="w-full border border-[#c4c7c7] bg-white p-12 shadow-sm">
            <header className="flex flex-col gap-2 border-b border-[#c4c7c7] pb-6">
              <h1 className="text-3xl font-semibold tracking-tight text-black">
                Siklus Air: Perjalanan Tiada Henti
              </h1>
              <div className="flex items-center gap-4 font-mono text-xs text-[#444748]">
                <span>Bab 1: {activeChapter}</span>
                <span>•</span>
                <span>Membaca 5 Menit</span>
              </div>
            </header>

            <div className="mt-6 flex flex-col gap-6 text-base leading-relaxed text-[#1a1c1d]">
              <p>
                Air adalah sumber kehidupan di Bumi. Ia tidak pernah diam, melainkan terus
                bergerak dalam sebuah tarian raksasa yang kita sebut sebagai siklus air. Siklus
                ini adalah sistem hidrologi global yang mengatur distribusi, pergerakan, dan fase
                air di seluruh planet.
              </p>

              <figure className="flex flex-col gap-2 border border-[#c4c7c7] bg-[#eeeeef] p-3">
                <img
                  src="https://placehold.co/700x256/ffffff/6b7280?text=Ilustrasi+Siklus+Air"
                  alt="Ilustrasi siklus air"
                  className="h-64 w-full border border-[#c4c7c7] object-cover"
                />
                <figcaption className="text-center font-mono text-[11px] italic text-[#444748]">
                  Ilustrasi Siklus Air Secara Sederhana
                </figcaption>
              </figure>

              <h2 className="text-2xl font-semibold tracking-tight text-black">
                Mengapa Siklus Air Penting?
              </h2>
              <p>
                Tanpa siklus air, daratan akan menjadi gurun tandus. Siklus ini mendistribusikan
                air tawar ke seluruh penjuru dunia, memelihara ekosistem, dan memungkinkan
                pertanian serta peradaban manusia berkembang.
              </p>

              <div className="relative border border-[#c4c7c7] bg-[#f9f9fa] px-6 py-8">
                <span className="absolute -top-3 left-6 flex items-center gap-1 bg-[#f9f9fa] px-2 font-mono text-xs font-bold text-black">
                  <MessageSquareQuote size={13} />
                  Bahan Diskusi
                </span>
                <ul className="flex flex-col gap-2 text-sm text-[#444748]">
                  {discussionPrompts.map((prompt) => (
                    <li key={prompt}>{prompt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        </main>
      </div>

      <div className="fixed bottom-0 left-64 right-0 flex justify-center border-t border-[#c4c7c7] bg-[#f9f9fa] px-4 py-4">
        <div className="flex w-full max-w-3xl gap-2">
          <input
            placeholder="Minta perubahan pada E-book... (misal: Persingkat bab ini)"
            className="flex-1 border border-[#c4c7c7] bg-white px-4 py-4 text-sm text-[#444748] placeholder:text-[#444748] focus:outline-none"
          />
          <Button variant="primary">Kirim</Button>
        </div>
      </div>
    </div>
  );
}
