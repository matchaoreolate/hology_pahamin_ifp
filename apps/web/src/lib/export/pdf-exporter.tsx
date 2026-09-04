import { jsPDF } from "jspdf";
import { html2canvas } from "html2canvas-pro";
import { createRoot } from "react-dom/client";

import { SlideRenderer } from "@/features/presentation/components/SlideRenderer";
import type { PresentationArtifact } from "@/features/presentation/types";

const SLIDE_WIDTH_PX = 1280;
const SLIDE_HEIGHT_PX = 720;

function waitForImages(container: HTMLElement, timeoutMs = 5000): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
  if (images.length === 0) return Promise.resolve();

  const pending = images
    .filter((img) => !img.complete)
    .map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        }),
    );

  if (pending.length === 0) return Promise.resolve();
  return Promise.race([
    Promise.all(pending).then(() => undefined),
    new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
  ]);
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

/**
 * Renders every slide off-screen with the existing SlideRenderer, rasterizes
 * each one, and lays them out one-per-page in a PDF. Interactions are not
 * interactive in the PDF, but their content still renders (feedback text,
 * options, etc.) since SlideRenderer is reused as-is.
 */
export async function exportPresentationAsPdf(artifact: PresentationArtifact): Promise<void> {
  const stage = document.createElement("div");
  stage.style.position = "fixed";
  stage.style.top = "0";
  stage.style.left = "-99999px";
  stage.style.width = `${SLIDE_WIDTH_PX}px`;
  stage.style.height = `${SLIDE_HEIGHT_PX}px`;
  stage.style.overflow = "hidden";
  stage.className = "bg-card";
  document.body.appendChild(stage);

  const root = createRoot(stage);
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "px",
    format: [SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX],
  });

  try {
    for (let i = 0; i < artifact.slides.length; i++) {
      const slide = artifact.slides[i];

      await new Promise<void>((resolve) => {
        root.render(<SlideRenderer slide={slide} />);
        // Let React commit + layout settle before we start polling images.
        requestAnimationFrame(() => resolve());
      });
      await nextFrame();
      await waitForImages(stage);

      const canvas = await html2canvas(stage, {
        width: SLIDE_WIDTH_PX,
        height: SLIDE_HEIGHT_PX,
        backgroundColor: "#ffffff",
        useCORS: true,
      });
      const imageData = canvas.toDataURL("image/jpeg", 0.92);

      if (i > 0) doc.addPage([SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX], "landscape");
      doc.addImage(imageData, "JPEG", 0, 0, SLIDE_WIDTH_PX, SLIDE_HEIGHT_PX);
    }
  } finally {
    root.unmount();
    stage.remove();
  }

  doc.save(`pahamin-${artifact.meta.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
}
