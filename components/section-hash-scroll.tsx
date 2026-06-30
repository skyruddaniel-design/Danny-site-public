"use client";

import { scrollToSection } from "@/components/scroll-page-button";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const SECTION_IDS = new Set(["services", "process", "contact"]);

export function SectionHashScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const sectionId = window.location.hash.slice(1);
    if (!SECTION_IDS.has(sectionId)) return;

    const frame = requestAnimationFrame(() => {
      scrollToSection(sectionId, { smooth: false });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
