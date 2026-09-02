import { Minimize2, X } from "lucide-react";

import type { PresentationMeta } from "../types";

interface PresentationHeaderProps {
  meta: PresentationMeta;
  current: number;
  onExit: () => void;
  onHide: () => void;
}

export function PresentationHeader({ meta, current, onExit, onHide }: PresentationHeaderProps) {
  return (
    <header className="flex h-12 w-full items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-medium text-foreground">{meta.title} - Presentasi</h1>
        <span className="rounded-md border border-border px-2.5 py-1 font-mono text-xs text-muted-foreground">
          Slide {current + 1} of {meta.total_slides}
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={onHide}
          aria-label="Sembunyikan header"
          title="Sembunyikan header"
          className="flex items-center justify-center rounded-md p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Minimize2 size={14} />
        </button>
        <button
          onClick={onExit}
          className="flex items-center gap-2 rounded-md px-3 py-2 font-mono text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          Keluar
          <X size={14} />
        </button>
      </div>
    </header>
  );
}
