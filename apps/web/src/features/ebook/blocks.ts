import type { EbookContent } from "@/types/api";

/**
 * Shared content model for anything that needs to lay an e-book out into pages —
 * the on-screen A4 reader (EbookReader) and the PDF exporter both flatten the
 * same `title/meta/heading/paragraph` blocks; only the packing math differs
 * (DOM measurement in px vs. jsPDF text metrics in mm).
 */
export type EbookBlock =
  | { kind: "title"; text: string }
  | { kind: "meta"; text: string }
  | { kind: "heading"; text: string; sectionIndex: number }
  | { kind: "paragraph"; text: string; sectionIndex: number };

export function buildEbookBlocks(ebook: EbookContent): EbookBlock[] {
  const blocks: EbookBlock[] = [
    { kind: "title", text: ebook.meta.title },
    { kind: "meta", text: `${ebook.meta.mata_pelajaran} • ${ebook.meta.topik} • Fase ${ebook.meta.fase}` },
  ];

  ebook.sections.forEach((section, sectionIndex) => {
    blocks.push({ kind: "heading", text: section.title, sectionIndex });
    section.content
      .split(/\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((paragraph) => {
        blocks.push({ kind: "paragraph", text: paragraph, sectionIndex });
      });
  });

  return blocks;
}
