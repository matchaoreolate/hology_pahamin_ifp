import { Download, Play, Plus, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { EditorHeader } from "../../components/layout/EditorHeader";
import { Button } from "../../components/ui/Button";
import { SlideViewport } from "./components/SlideViewport";
import { PresentationNavigation } from "./components/PresentationNavigation";
import { mockPresentation } from "./mock";

export function PresentationEditorPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const slide = mockPresentation.slides[current];

  return (
    <div className="min-h-screen bg-[#f3f3f4] pt-16">
      <EditorHeader
        backTo="/dashboard"
        title="Proyek Tanpa Judul"
        subtitle={`Proyek: ${projectId}`}
        actions={
          <>
            <Button variant="secondary" size="sm">
              Simpan
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/presentation/${projectId}`)}
            >
              <Play size={12} />
              Mulai Presentasi
            </Button>
            <button className="text-[#444748]">
              <Download size={15} />
            </button>
          </>
        }
      />

      <div className="flex">
        <aside className="fixed left-0 top-16 bottom-0 flex w-64 flex-col border-r border-[#c4c7c7] bg-white">
          <div className="border-b border-[#c4c7c7] px-4 py-4">
            <h3 className="font-mono text-xs uppercase tracking-wide text-[#444748]">
              Daftar Scene
            </h3>
          </div>
          <div className="flex flex-1 flex-col gap-2 overflow-auto p-4">
            {mockPresentation.slides.map((s, index) => (
              <button
                key={s.id}
                onClick={() => setCurrent(index)}
                className={`flex items-center gap-3 border p-3 text-left ${
                  index === current ? "border-2 border-black bg-[#f9f9fa]" : "border-[#c4c7c7]"
                }`}
              >
                <span
                  className={`flex size-6 shrink-0 items-center justify-center font-mono text-xs ${
                    index === current
                      ? "bg-black text-white"
                      : "border border-[#c4c7c7] text-[#444748]"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="truncate text-sm text-black">{s.title ?? s.type}</span>
              </button>
            ))}
          </div>
          <div className="border-t border-[#c4c7c7] p-4">
            <button className="flex w-full items-center justify-center gap-2 border border-dashed border-[#747878] py-2 font-mono text-xs text-[#444748]">
              <Plus size={13} />
              Tambah Scene
            </button>
          </div>
        </aside>

        <main className="ml-64 flex flex-1 flex-col items-center justify-center gap-6 p-8 pb-40">
          <div className="w-full max-w-[1024px] border border-[#c4c7c7] bg-white shadow-sm">
            <div className="flex h-10 items-center justify-between border-b border-[#c4c7c7] bg-[#f9f9fa] px-4">
              <span className="font-mono text-xs text-[#444748]">
                Scene {current + 1}: {slide.title}
              </span>
            </div>
            <SlideViewport slide={slide} className="min-h-[500px] p-6" />
          </div>

          <PresentationNavigation
            current={current}
            total={mockPresentation.slides.length}
            onPrev={() => setCurrent((c) => Math.max(0, c - 1))}
            onNext={() => setCurrent((c) => Math.min(mockPresentation.slides.length - 1, c + 1))}
          />
        </main>
      </div>

      <div className="fixed bottom-0 left-64 right-0 flex justify-center border-t border-[#c4c7c7] bg-white px-16 py-4">
        <div className="flex w-full max-w-3xl items-center gap-4">
          <Sparkles size={24} className="shrink-0 text-[#444748]" />
          <input
            placeholder="Minta perubahan pada materi... (Cth: Tambahkan kuis pilihan ganda di akhir)"
            className="flex-1 border border-[#c4c7c7] bg-[#f3f3f4] px-4 py-4 text-sm text-[#6b7280] placeholder:text-[#6b7280] focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
