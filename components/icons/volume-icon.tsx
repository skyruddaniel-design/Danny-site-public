"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const SPEAKER = "M11 5 6 9H2v6h4l5 4V5z";
const WAVE_SMALL = "M15.54 8.46a5 5 0 0 1 0 7.07";
const WAVE_LARGE = "M19.07 4.93a10 10 0 0 1 0 14.14";
const MUTE_LINE_1 = "m22 9-6 6";
const MUTE_LINE_2 = "m16 9 6 6";

const morphEase = [0.22, 1, 0.36, 1] as const;
const instant = { duration: 0 };

type VolumeIconProps = {
  muted: boolean;
  className?: string;
};

export function VolumeIcon({ muted, className }: VolumeIconProps) {
  const prefersReducedMotion = useReducedMotion();
  const transition = prefersReducedMotion ? instant : { duration: 0.25, ease: morphEase };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("size-5", className)}
      aria-hidden
    >
      <path d={SPEAKER} />
      <motion.path
        d={WAVE_SMALL}
        initial={false}
        animate={{
          opacity: muted ? 0 : 1,
          pathLength: muted ? 0 : 1,
        }}
        transition={transition}
      />
      <motion.path
        d={WAVE_LARGE}
        initial={false}
        animate={{
          opacity: muted ? 0 : 1,
          pathLength: muted ? 0 : 1,
        }}
        transition={
          prefersReducedMotion
            ? instant
            : { duration: 0.3, ease: morphEase, delay: muted ? 0 : 0.04 }
        }
      />
      <motion.path
        d={MUTE_LINE_1}
        initial={false}
        animate={{
          opacity: muted ? 1 : 0,
          pathLength: muted ? 1 : 0,
        }}
        transition={transition}
      />
      <motion.path
        d={MUTE_LINE_2}
        initial={false}
        animate={{
          opacity: muted ? 1 : 0,
          pathLength: muted ? 1 : 0,
        }}
        transition={
          prefersReducedMotion
            ? instant
            : { duration: 0.22, ease: morphEase, delay: muted ? 0.05 : 0 }
        }
      />
    </svg>
  );
}
