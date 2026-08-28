import { Download, Info, Play, Sparkles } from "lucide-react";
import { useParams } from "react-router-dom";
import { EditorHeader } from "../../components/layout/EditorHeader";
import { Button } from "../../components/ui/Button";

const questions = [
  "Berdasarkan gambar di atas, jelaskan apa yang dimaksud dengan proses evaporasi dan di mana proses tersebut terjadi!",
  "Sebutkan urutan proses terjadinya hujan mulai dari penguapan hingga air kembali ke bumi!",
];

export function LkpdEditorPage() {
  const { projectId } = useParams();

  return (
    <div className="min-h-screen bg-[#f3f3f4] pt-16">
      <EditorHeader
        backTo="/dashboard"
        title="Proyek Tanpa Judul"
        subtitle={`Proyek: ${projectId} • LKPD`}
        actions={
          <>
            <Button variant="secondary" size="sm">
              <Play size={11} />
              Pratinjau
            </Button>
            <Button variant="secondary" size="sm">
              Simpan
            </Button>
            <Button variant="primary" size="sm">
              <Download size={12} />
              Download
            </Button>
          </>
        }
      />

      <main className="flex justify-center p-6 pb-32">
        <div className="w-[794px] min-h-[1123px] border border-[#c4c7c7] bg-white p-12 shadow-sm">
          <header className="flex flex-col items-center gap-2 border-b-2 border-black pb-5">
            <h1 className="text-3xl font-bold uppercase tracking-tight text-[#1a1c1d]">
              Lembar Kerja Peserta Didik (LKPD)
            </h1>
            <p className="text-base text-[#5d5e66]">Materi: Siklus Air</p>
          </header>

          <div className="mt-8 grid grid-cols-2 gap-8 border border-[#c4c7c7] bg-[#f9f9fa] p-5">
            {["Nama", "Kelas", "No Absen", "Tanggal"].map((field) => (
              <div key={field} className="flex items-center gap-2 border-b border-[#c4c7c7] pb-2">
                <span className="w-20 font-mono text-xs text-[#5d5e66]">{field}:</span>
                <span className="flex-1 text-sm text-[#6b7280]">_________________________</span>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-2 border border-[#c4c7c7] bg-[#eeeeef] p-6">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-[#1a1c1d]">
              <Info size={20} />
              Instruksi Kegiatan
            </h3>
            <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-[#444748]">
              <li>Amati gambar ilustrasi siklus air di bawah ini dengan saksama.</li>
              <li>Jawablah pertanyaan-pertanyaan yang telah disediakan pada kolom yang tersedia.</li>
              <li>Diskusikan dengan teman kelompokmu jika menemui kesulitan.</li>
            </ol>
          </div>

          <div className="mt-6 flex flex-col items-center gap-4 border border-[#c4c7c7] bg-[#f9f9fa] p-4">
            <span className="font-mono text-xs uppercase tracking-wide text-[#5d5e66]">
              Bahan Pengamatan
            </span>
            <img
              src="https://placehold.co/620x256/ffffff/6b7280?text=Ilustrasi+Siklus+Air"
              alt="Ilustrasi siklus air"
              className="h-64 w-full border border-[#c4c7c7] object-cover"
            />
          </div>

          <div className="mt-8 flex flex-col gap-8">
            {questions.map((question, index) => (
              <div key={index} className="flex flex-col gap-4">
                <p className="text-base font-medium text-[#1a1c1d]">
                  {index + 1}. {question}
                </p>
                <div className="h-32 border border-[#c4c7c7] bg-white p-4 text-sm text-[#6b7280]">
                  Tuliskan jawabanmu di sini...
                </div>
              </div>
            ))}
          </div>

          <footer className="mt-12 flex items-center justify-between border-t border-[#c4c7c7] pt-4 font-mono text-[11px] text-[#5d5e66]">
            <span>Halaman 1 dari 1</span>
            <span>PahamIn AI - Blueprint Series</span>
          </footer>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 flex justify-center border-t border-[#c4c7c7] bg-[#f9f9fa] px-4 py-4">
        <div className="flex w-full max-w-3xl items-center gap-4 rounded-full border border-[#c4c7c7] bg-white px-4 py-2">
          <Sparkles size={18} className="text-[#444748]" />
          <input
            placeholder="Minta AI untuk mengubah LKPD... (Contoh: Ubah format soal menjadi isian singkat)"
            className="flex-1 text-sm text-[#1a1c1d] placeholder:text-[#6b7280] focus:outline-none"
          />
          <button className="flex size-8 items-center justify-center rounded-full bg-black text-white">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
