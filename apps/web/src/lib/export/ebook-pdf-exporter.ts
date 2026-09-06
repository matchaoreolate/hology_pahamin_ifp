import { jsPDF } from "jspdf";

import { buildEbookBlocks } from "@/features/ebook/blocks";
import type { EbookContent } from "@/types/api";

/**
 * Text-based A4 PDF export for e-books — no screenshot/canvas rasterization, so the
 * result has real selectable text, sharp print output, and a small file size.
 * Reuses the same title/meta/heading/paragraph block model as the on-screen
 * EbookReader (see features/ebook/blocks.ts); only the packing math differs since
 * jsPDF gives exact text metrics directly instead of needing DOM measurement.
 */

const PAGE_WIDTH = 210; // A4 portrait, mm
const PAGE_HEIGHT = 297;
const MARGIN = 20;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const CONTENT_BOTTOM = PAGE_HEIGHT - MARGIN;

const TITLE_SIZE = 20;
const TITLE_LINE_HEIGHT = 9;
const META_SIZE = 10;
const META_LINE_HEIGHT = 5;
const HEADING_SIZE = 14;
const HEADING_LINE_HEIGHT = 7;
const HEADING_SPACE_BEFORE = 8;
const HEADING_SPACE_AFTER = 4;
const BODY_SIZE = 11;
const BODY_LINE_HEIGHT = 5.5;
const PARAGRAPH_SPACE_AFTER = 4;

export function sanitizeEbookFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "ebook"}.pdf`;
}

export async function exportEbookAsPdf(ebook: EbookContent): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = MARGIN;

  function addPage() {
    doc.addPage();
    y = MARGIN;
  }

  /** Draws pre-wrapped lines at the given style, paging mid-block if it runs out of room. */
  function drawLines(lines: string[], size: number, lineHeight: number, bold: boolean) {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    for (const line of lines) {
      if (y + lineHeight > CONTENT_BOTTOM) addPage();
      doc.text(line, MARGIN, y);
      y += lineHeight;
    }
  }

  const blocks = buildEbookBlocks(ebook);

  for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
    const block = blocks[blockIndex];
    if (block.kind === "title") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(TITLE_SIZE);
      const lines = doc.splitTextToSize(block.text, CONTENT_WIDTH) as string[];
      drawLines(lines, TITLE_SIZE, TITLE_LINE_HEIGHT, true);
      y += 2;
      continue;
    }

    if (block.kind === "meta") {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(META_SIZE);
      const lines = doc.splitTextToSize(block.text, CONTENT_WIDTH) as string[];
      drawLines(lines, META_SIZE, META_LINE_HEIGHT, false);
      y += 3;
      if (y + 4 > CONTENT_BOTTOM) addPage();
      doc.setDrawColor(200);
      doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
      y += 8;
      continue;
    }

    if (block.kind === "heading") {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(HEADING_SIZE);
      const headingLines = doc.splitTextToSize(block.text, CONTENT_WIDTH) as string[];
      const headingHeight = headingLines.length * HEADING_LINE_HEIGHT;

      // Peek at the section's first content line so a heading never gets stranded
      // alone at the bottom of a page with its content starting on the next one.
      const next = blocks[blockIndex + 1];
      let firstLineHeight = 0;
      if (next && next.kind === "paragraph") {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(BODY_SIZE);
        const firstLines = doc.splitTextToSize(next.text, CONTENT_WIDTH) as string[];
        if (firstLines.length > 0) firstLineHeight = BODY_LINE_HEIGHT;
      }

      const neededForHeadingAndFirstLine =
        HEADING_SPACE_BEFORE + headingHeight + HEADING_SPACE_AFTER + firstLineHeight;

      if (y > MARGIN && y + neededForHeadingAndFirstLine > CONTENT_BOTTOM) {
        addPage();
      } else {
        y += HEADING_SPACE_BEFORE;
      }

      drawLines(headingLines, HEADING_SIZE, HEADING_LINE_HEIGHT, true);
      y += HEADING_SPACE_AFTER;
      continue;
    }

    // paragraph
    doc.setFont("helvetica", "normal");
    doc.setFontSize(BODY_SIZE);
    const lines = doc.splitTextToSize(block.text, CONTENT_WIDTH) as string[];
    drawLines(lines, BODY_SIZE, BODY_LINE_HEIGHT, false);
    y += PARAGRAPH_SPACE_AFTER;
  }

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(String(i), PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: "center" });
    doc.setTextColor(0);
  }

  doc.save(sanitizeEbookFilename(ebook.meta.title));
}
