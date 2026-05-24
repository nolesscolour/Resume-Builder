"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import type { PaperSize } from "@/lib/pdf/themes";

const PAGE_DIMENSIONS: Record<PaperSize, { width: number; height: number }> = {
  letter: { width: 816, height: 1056 },
  a4: { width: 794, height: 1123 },
};

const PAGE_PADDING_PX = 75;

type PaginatedPreviewProps = {
  children: ReactNode;
  paperSize: PaperSize;
};

export function PaginatedPreview({ children, paperSize }: PaginatedPreviewProps) {
  const dims = PAGE_DIMENSIONS[paperSize];
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [pageCount, setPageCount] = useState(1);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateScale = () => {
      const containerWidth = container.clientWidth;
      const next = Math.min(1, containerWidth / dims.width);
      setScale(next);
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(container);
    return () => ro.disconnect();
  }, [dims.width]);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const contentHeight = el.scrollHeight;
    const usableHeight = dims.height - PAGE_PADDING_PX * 2;
    const pages = Math.max(1, Math.ceil(contentHeight / usableHeight));
    setPageCount(pages);
  }, [children, dims.height]);

  // Track most-visible page card while scrolling
  useEffect(() => {
    const scrollContainer = containerRef.current?.parentElement;
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best = { index: 0, ratio: 0 };
        entries.forEach((entry) => {
          const idx = pageRefs.current.indexOf(entry.target as HTMLDivElement);
          if (idx === -1) return;
          if (entry.intersectionRatio > best.ratio) {
            best = { index: idx, ratio: entry.intersectionRatio };
          }
        });
        if (best.ratio > 0) setCurrentPage(best.index + 1);
      },
      {
        root: scrollContainer,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    pageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pageCount]);

  const innerWidth = dims.width - PAGE_PADDING_PX * 2;

  return (
    <div ref={containerRef} className="relative w-full flex flex-col items-center gap-6">
      <div
        ref={measureRef}
        aria-hidden
        className="absolute -left-[9999px] top-0 invisible pointer-events-none"
        style={{ width: innerWidth }}
      >
        {children}
      </div>

      {Array.from({ length: pageCount }, (_, i) => {
        const offset = i * (dims.height - PAGE_PADDING_PX * 2);
        return (
          <div
            key={i}
            ref={(el) => {
              pageRefs.current[i] = el;
            }}
            style={{
              width: dims.width * scale,
              height: dims.height * scale,
              position: "relative",
            }}
          >
            <div
              className="bg-paper border border-hairline rounded-sm shadow-[0_12px_32px_-16px_rgba(58,52,30,0.18)] overflow-hidden"
              style={{
                width: dims.width,
                height: dims.height,
                padding: PAGE_PADDING_PX,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                position: "absolute",
                top: 0,
                left: 0,
              }}
            >
              <div
                style={{
                  marginTop: -offset,
                  width: innerWidth,
                }}
              >
                {children}
              </div>
            </div>
          </div>
        );
      })}

      <div className="sticky bottom-4 z-10 self-center pointer-events-none">
        <span className="font-mono text-[10px] text-ink uppercase tracking-wider bg-panel/90 backdrop-blur-sm border border-hairline rounded-full px-3 py-1.5 shadow-[0_4px_12px_-4px_rgba(58,52,30,0.15)]">
          Page {currentPage} of {pageCount}
        </span>
      </div>
    </div>
  );
}