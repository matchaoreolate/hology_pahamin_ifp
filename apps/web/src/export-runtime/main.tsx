import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { PresentationRuntime } from "@/features/presentation/components/PresentationRuntime";
import type { PresentationArtifact } from "@/features/presentation/types";

import "@/index.css";

function readEmbeddedArtifact(): PresentationArtifact | null {
  const node = document.getElementById("kelasin-artifact-data");
  if (!node?.textContent) return null;
  try {
    const parsed = JSON.parse(node.textContent) as PresentationArtifact | null;
    return parsed;
  } catch {
    return null;
  }
}

function ExportedPresentation() {
  const artifact = readEmbeddedArtifact();

  if (!artifact) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Data media tidak ditemukan di dalam file ini.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      <PresentationRuntime artifact={artifact} onExit={() => {}} />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ExportedPresentation />
  </StrictMode>,
);
