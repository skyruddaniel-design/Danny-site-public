"use client";

import { interpolate } from "flubber";
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

const PLAY_PATH = "M8 5v14l11-7z";
const PAUSE_PATH = "M6 4h4v16H6V4zm8 0h4v16h-4V4z";

const morphEase = [0.22, 1, 0.36, 1] as const;

type PlayPauseIconProps = {
  playing: boolean;
  className?: string;
};

export function PlayPauseIcon({ playing, className }: PlayPauseIconProps) {
  const prefersReducedMotion = useReducedMotion();
  const progress = useMotionValue(playing ? 1 : 0);

  const path = useTransform(progress, [0, 1], [PLAY_PATH, PAUSE_PATH], {
    mixer: (from, to) => interpolate(from, to, { maxSegmentLength: 0.75 }),
  });

  useEffect(() => {
    if (prefersReducedMotion) {
      progress.set(playing ? 1 : 0);
      return;
    }

    const controls = animate(progress, playing ? 1 : 0, {
      duration: 0.28,
      ease: morphEase,
    });

    return () => controls.stop();
  }, [playing, prefersReducedMotion, progress]);

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-5", className)}
      aria-hidden
    >
      <motion.path fill="currentColor" d={path} />
    </svg>
  );
}
