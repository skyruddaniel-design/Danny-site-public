"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

type ServicesBackgroundProps = {
  scrollYProgress: MotionValue<number>;
  enabled: boolean;
};

export function ServicesBackground({
  scrollYProgress,
  enabled,
}: ServicesBackgroundProps) {
  const textureY = useTransform(scrollYProgress, [0, 1], [20, -40]);
  const textureScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.06]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      <motion.div
        className="services-texture-image absolute -inset-x-0 -inset-y-12 origin-center"
        style={enabled ? { y: textureY, scale: textureScale } : undefined}
      />

      <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--services-bg)_55%,transparent)]" />

      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent" />
    </div>
  );
}
