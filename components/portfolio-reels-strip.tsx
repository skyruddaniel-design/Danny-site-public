"use client";

import { PortfolioMediaCard } from "@/components/portfolio-media-card";
import type { LocalizedPortfolioItem } from "@/lib/portfolio";
import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

type PortfolioReelsStripProps = {
  items: LocalizedPortfolioItem[];
  onOpenPreview?: (item: LocalizedPortfolioItem) => void;
};

export function PortfolioReelsStrip({
  items,
  onOpenPreview,
}: PortfolioReelsStripProps) {
  const prefersReducedMotion = useReducedMotion();

  const fadeUp = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease },
        },
      };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="relative -mx-6 md:-mx-12 lg:-mx-16">
      <motion.div
        className="flex gap-3 overflow-x-auto overscroll-x-contain px-6 pb-1 [scrollbar-width:none] md:gap-4 md:px-12 lg:px-16 [&::-webkit-scrollbar]:hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : 0.06,
            },
          },
        }}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={fadeUp}
            className="w-[min(72vw,15rem)] shrink-0 snap-start md:w-[15.5rem]"
          >
            <PortfolioMediaCard item={item} onOpenPreview={onOpenPreview} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
