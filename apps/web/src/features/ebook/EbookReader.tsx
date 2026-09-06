import { ChevronLeft, ChevronRight } from "lucide-react";
import { ThreeDot } from "react-loading-indicators";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { EbookContent } from "@/types/api";

import { buildEbookBlocks, type EbookBlock as Block } from "./blocks";

// A4-ish proportions (matches the LKPD print document), fixed rather than responsive —
// pagination is computed against these exact pixel dimensions, so the page can't reflow.
const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAGE_PADDING = 64;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_PADDING * 2;
const CONTENT_HEIGHT = PAGE_HEIGHT - PAGE_PADDING * 2;
const BLOCK_GAP = 24;

/** Greedily packs measured blocks into fixed-height pages, keeping a heading with its next block. */
function paginate(blocks: Block[], heights: number[]): Block[][] {
  const pages: Block[][] = [];
  let page: Block[] = [];
  let used = 0;

  for (let i = 0; i < blocks.length; i++) {
    const h = heights[i] ?? 0;
    const gap = page.length > 0 ? BLOCK_GAP : 0;
    let breakBefore = page.length > 0 && used + gap + h > CONTENT_HEIGHT;

    // Don't strand a heading alone at the bottom of a page — if the block right
    // after it wouldn't also fit, push the heading itself to the next page.
    if (!breakBefore && blocks[i].kind === "heading" && page.length > 0 && i + 1 < blocks.length) {
      const spaceLeftAfterHeading = CONTENT_HEIGHT - (used + gap + h);
      const nextH = heights[i + 1] ?? 0;
      if (spaceLeftAfterHeading < nextH + BLOCK_GAP) {
        breakBefore = true;
      }
    }

    if (breakBefore) {
      pages.push(page);
      page = [];
      used = 0;
    }

    const gapNow = page.length > 0 ? BLOCK_GAP : 0;
    page.push(blocks[i]);
    used += gapNow + h;
  }

  if (page.length > 0) pages.push(page);
  return pages;
}

function renderBlock(block: Block, index: number) {
  switch (block.kind) {
    case "title":
      return (
        <h1 key={index} className="text-center text-3xl font-bold tracking-tight text-black">
          {block.text}
        </h1>
      );
    case "meta":
      return (
        <p key={index} className="border-b border-neutral-200 pb-6 text-center font-mono text-xs text-neutral-500 uppercase">
          {block.text}
        </p>
      );
    case "heading":
      return (
        <h2 key={index} className="text-xl font-semibold text-black">
          {block.text}
        </h2>
      );
    case "paragraph":
      return (
        <p key={index} className="text-base leading-relaxed whitespace-pre-line text-neutral-800">
          {block.text}
        </p>
      );
  }
}

export interface EbookReaderHandle {
  goToSection: (sectionIndex: number) => void;
}

interface EbookReaderProps {
  ebook: EbookContent;
  onActiveSectionChange?: (sectionIndex: number) => void;
}

export const EbookReader = forwardRef<EbookReaderHandle, EbookReaderProps>(function EbookReader(
  { ebook, onActiveSectionChange },
  ref,
) {
  const blocks = useMemo(() => buildEbookBlocks(ebook), [ebook]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [pages, setPages] = useState<Block[][] | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Measure every block off-screen at the real page's content width, then pack them
  // into pages. Runs whenever the ebook (and therefore its blocks) changes.
  useLayoutEffect(() => {
    setPages(null);
    setCurrentPage(0);
    const heights = blockRefs.current.map((el) => el?.offsetHeight ?? 0);
    setPages(paginate(blocks, heights));
  }, [blocks]);

  const sectionPageIndex = useMemo(() => {
    if (!pages) return [];
    const map: number[] = [];
    pages.forEach((page, pageIndex) => {
      page.forEach((block) => {
        if (block.kind === "heading" && map[block.sectionIndex] === undefined) {
          map[block.sectionIndex] = pageIndex;
        }
      });
    });
    return map;
  }, [pages]);

  useImperativeHandle(
    ref,
    () => ({
      goToSection(sectionIndex: number) {
        const page = sectionPageIndex[sectionIndex];
        if (page !== undefined) setCurrentPage(page);
      },
    }),
    [sectionPageIndex],
  );

  useEffect(() => {
    if (!pages || !onActiveSectionChange) return;
    const firstSectionBlock = pages[currentPage]?.find(
      (b): b is Extract<Block, { kind: "heading" | "paragraph" }> =>
        b.kind === "heading" || b.kind === "paragraph",
    );
    if (firstSectionBlock) onActiveSectionChange(firstSectionBlock.sectionIndex);
  }, [pages, currentPage, onActiveSectionChange]);

  const totalPages = pages?.length ?? 0;
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages - 1, 0));

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Off-screen measuring pass: identical typography/width to the real page,
          rendered invisibly so block heights can be read before pages are built. */}
      <div
        aria-hidden="true"
        style={{ position: "fixed", top: 0, left: -99999, width: CONTENT_WIDTH, visibility: "hidden" }}
      >
        <div className="flex flex-col gap-6">
          {blocks.map((block, index) => (
            <div key={index} ref={(el) => { blockRefs.current[index] = el; }}>
              {renderBlock(block, index)}
            </div>
          ))}
        </div>
      </div>

      {!pages ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-3">
          <ThreeDot variant="brick-stack" color="#001456" size="medium" text="" textColor="" />
          <p className="text-sm text-muted-foreground">Menyusun halaman...</p>
        </div>
      ) : (
        <>
          {/* A4-ish document surface — intentionally paper-white/black regardless of app theme */}
          <div
            style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT, padding: PAGE_PADDING }}
            className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-md"
          >
            <div className="flex h-full flex-col gap-6 overflow-hidden">
              {pages[safeCurrentPage]?.map((block, index) => renderBlock(block, index))}
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={safeCurrentPage === 0}
              className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              aria-label="Halaman sebelumnya"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="font-mono text-xs text-muted-foreground">
              Halaman {safeCurrentPage + 1} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={safeCurrentPage === totalPages - 1}
              className="text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
              aria-label="Halaman berikutnya"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
});
