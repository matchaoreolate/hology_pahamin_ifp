import type { PresentationMeta } from "../types";

interface PresentationHeaderProps {
  meta: PresentationMeta;
  current: number;
  onExit: () => void;
}

export function PresentationHeader({ meta, current, onExit }: PresentationHeaderProps) {
  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-[#c4c7c7] bg-white px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-medium text-black">{meta.title} - Presentasi</h1>
        <span className="border border-[#c4c7c7] px-[9px] py-[5px] font-mono text-xs text-[#5d5e66]">
          Slide {current + 1} of {meta.total_slides}
        </span>
      </div>
      <button
        onClick={onExit}
        className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wide text-[#444748]"
      >
        Keluar ✕
      </button>
    </header>
  );
}
