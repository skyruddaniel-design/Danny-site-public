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
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1.08, 1]);
  const glowY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const textureY = useTransform(scrollYProgress, [0, 1], [20, -40]);
  const textureScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.04, 1, 1.06]);

  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      <motion.div
        className="services-texture-image absolute -inset-x-0 -inset-y-12 origin-center"
        style={enabled ? { y: textureY, scale: textureScale } : undefined}
      />

      <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--services-bg)_55%,transparent)]" />

      <motion.div
        className="absolute -top-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklch,var(--primary),transparent_55%)_0%,transparent_70%)] opacity-80 md:h-96 md:w-96"
        style={enabled ? { scale: glowScale, y: glowY } : undefined}
      />

      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-foreground/15 to-transparent" />
    </div>
  );
}
