"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import { useEffect, useRef, useState } from "react";

export type CameraIntroPhase = "standby" | "recording" | "exiting" | "done";

type CameraIntroProps = {
  onPhaseChange?: (phase: CameraIntroPhase) => void;
  onComplete?: () => void;
};

const BLADES = 7;
const BLADE_SPREAD = (Math.PI * 2) / BLADES;
const EASE = [0.83, 0, 0.17, 1] as const;
const APERTURE_DURATION = 0.85;

const timings = {
  standby: 250,
  recording: 900,
  exit: 300,
} as const;

const VIEWFINDER_INSET =
  "inset-10 sm:inset-14 md:inset-[4.5rem] lg:inset-20";

function wedge(inner: number, outer: number, spread: number) {
  const half = spread * 0.46;
  const point = (angle: number, radius: number) =>
    `${radius * Math.sin(angle)},${-radius * Math.cos(angle)}`;

  return `M ${point(-half, inner)} L ${point(-half, outer)} L ${point(half, outer)} L ${point(half, inner)} Z`;
}

function CornerBracket({ className }: { className: string }) {
  return (
    <div
      className={cn(
        "absolute h-12 w-12 border-white sm:h-14 sm:w-14",
        className
      )}
    />
  );
}

function Crosshair() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2">
      <div className="absolute left-1/2 top-1/2 h-px w-16 -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0_0_6px_rgba(0,0,0,0.8)] sm:w-24" />
      <div className="absolute left-1/2 top-1/2 h-16 w-px -translate-x-1/2 -translate-y-1/2 bg-white shadow-[0_0_6px_rgba(0,0,0,0.8)] sm:h-24" />
      <div className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white/20 shadow-[0_0_8px_rgba(0,0,0,0.9)]" />
    </div>
  );
}

function useTimecode(active: boolean) {
  const [timecode, setTimecode] = useState("00:00:00:00");

  useEffect(() => {
    if (!active) return;

    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const frames = Math.floor((elapsed / 1000) * 25);
      const pad = (value: number) => value.toString().padStart(2, "0");

      setTimecode(
        `${pad(Math.floor(frames / (25 * 60 * 60)))}:${pad(Math.floor((frames / (25 * 60)) % 60))}:${pad(Math.floor((frames / 25) % 60))}:${pad(frames % 25)}`
      );
    }, 40);

    return () => clearInterval(interval);
  }, [active]);

  return timecode;
}

export function CameraIntro({ onPhaseChange, onComplete }: CameraIntroProps) {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<CameraIntroPhase>("standby");
  const completedRef = useRef(false);

  const isRecording = phase === "recording" || phase === "exiting";
  const timecode = useTimecode(isRecording);

  const setPhaseSafe = (next: CameraIntroPhase) => {
    setPhase(next);
    onPhaseChange?.(next);
  };

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setPhaseSafe("done");
    onComplete?.();
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      finish();
      return;
    }

    const recordingTimer = setTimeout(
      () => setPhaseSafe("recording"),
      timings.standby
    );
    const exitTimer = setTimeout(
      () => setPhaseSafe("exiting"),
      timings.standby + timings.recording
    );
    const doneTimer = setTimeout(
      finish,
      timings.standby + timings.recording + timings.exit
    );

    return () => {
      clearTimeout(recordingTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [prefersReducedMotion]);

  if (phase === "done") {
    return null;
  }

  const apertureOpen = phase !== "standby";
  const isExiting = phase === "exiting";
  const closeTilt = (360 / BLADES) * 0.58;
  const openTilt = -8;

  const overlayTransition: Transition = {
    duration: timings.exit / 1000,
    ease: EASE,
  };

  const hudVariants: Variants = {
    visible: { opacity: 1 },
    hidden: { opacity: 0, transition: overlayTransition },
  };

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-40"
      aria-hidden
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={overlayTransition}
    >
      <div className="absolute inset-0 bg-[#0a0a0a]" />

      <svg
        viewBox="-50 -50 100 100"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 z-30 h-full w-full"
      >
        <motion.circle
          cx="0"
          cy="0"
          fill="#0a0a0a"
          initial={{ r: 50 }}
          animate={{ r: apertureOpen ? 0 : 50 }}
          transition={{
            duration: prefersReducedMotion ? 0 : APERTURE_DURATION * 0.7,
            ease: EASE,
          }}
        />

        <g>
          {Array.from({ length: BLADES }, (_, index) => {
            const baseRotation = (360 / BLADES) * index;

            return (
              <motion.g
                key={index}
                style={{ transformOrigin: "0px 0px" }}
                initial={{ rotate: baseRotation }}
                animate={{ rotate: baseRotation }}
              >
                <motion.g
                  style={{ transformOrigin: "0px 0px" }}
                  initial={{ rotate: closeTilt }}
                  animate={{ rotate: apertureOpen ? openTilt : closeTilt }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : APERTURE_DURATION,
                    ease: EASE,
                    delay: index * 0.03,
                  }}
                >
                  <path d={wedge(0, 72, BLADE_SPREAD)} fill="#0a0a0a" />
                </motion.g>
              </motion.g>
            );
          })}
        </g>

        {apertureOpen && (
          <motion.circle
            cx="0"
            cy="0"
            r="1"
            fill="none"
            stroke="white"
            strokeOpacity={0.35}
            strokeWidth="0.2"
            initial={{ r: 2, opacity: 0.6 }}
            animate={{ r: 48, opacity: 0 }}
            transition={{ duration: APERTURE_DURATION, ease: EASE }}
          />
        )}
      </svg>

      <motion.div
        className={cn("absolute z-50", VIEWFINDER_INSET)}
        variants={hudVariants}
        initial="visible"
        animate={isExiting ? "hidden" : "visible"}
      >
        <CornerBracket className="left-0 top-0 border-l-[3px] border-t-[3px] sm:border-l-4 sm:border-t-4" />
        <CornerBracket className="right-0 top-0 border-r-[3px] border-t-[3px] sm:border-r-4 sm:border-t-4" />
        <CornerBracket className="bottom-0 left-0 border-b-[3px] border-l-[3px] sm:border-b-4 sm:border-l-4" />
        <CornerBracket className="bottom-0 right-0 border-b-[3px] border-r-[3px] sm:border-b-4 sm:border-r-4" />

        <div className="absolute inset-x-8 top-0 border-t border-white/50" />
        <div className="absolute inset-x-8 bottom-0 border-b border-white/50" />
        <div className="absolute inset-y-8 left-0 border-l border-white/50" />
        <div className="absolute inset-y-8 right-0 border-r border-white/50" />

        <Crosshair />

        <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-5 sm:top-5">
          {isRecording ? (
            <>
              <motion.span
                className="size-2.5 rounded-full bg-red-500"
                animate={
                  prefersReducedMotion
                    ? { opacity: 1 }
                    : { opacity: [1, 0.3, 1] }
                }
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <span className="font-mono text-xs font-semibold tracking-[0.2em] text-red-500">
                REC
              </span>
            </>
          ) : (
            <span className="font-mono text-xs font-medium tracking-[0.2em] text-white/80">
              STBY
            </span>
          )}
        </div>

        <div className="absolute right-4 top-4 flex items-center gap-3 font-mono text-[11px] tracking-widest text-white/80 sm:right-5 sm:top-5">
          <span>4K</span>
          <span className="text-white/40">|</span>
          <span>25fps</span>
        </div>

        <div className="absolute bottom-4 left-4 font-mono text-[11px] tracking-widest text-white/90 sm:bottom-5 sm:left-5">
          {isRecording ? timecode : "--:--:--:--"}
        </div>

        <div className="absolute bottom-4 right-4 font-mono text-[11px] tracking-widest text-white/75 sm:bottom-5 sm:right-5">
          <span>1/50</span>
          <span className="mx-2 text-white/35">·</span>
          <span>f/2.8</span>
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_35%,#0a0a0a_100%)]"
        variants={hudVariants}
        initial="visible"
        animate={isExiting ? "hidden" : "visible"}
      />
    </motion.div>
  );
}
