"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const HIGHLIGHT_WORDS = [
  "noticed.",
  "remembered.",
  "seen.",
  "shared.",
];

const TYPING_MS = 42;
const BACKSPACE_MS = 28;
const PAUSE_MS = 2200;

function wait(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => {
      clearTimeout(timeout);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

type TypewriterHighlightProps = {
  words?: string[];
  active?: boolean;
  className?: string;
};

export function TypewriterHighlight({
  words = HIGHLIGHT_WORDS,
  active = true,
  className,
}: TypewriterHighlightProps) {
  const prefersReducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(words[0]);
  const wordIndexRef = useRef(0);

  useEffect(() => {
    if (!active || prefersReducedMotion) {
      setDisplay(words[0]);
      return;
    }

    const controller = new AbortController();
    let cancelled = false;

    const run = async () => {
      while (!cancelled) {
        const word = words[wordIndexRef.current];

        for (let index = 0; index <= word.length; index++) {
          if (cancelled) return;
          setDisplay(word.slice(0, index));
          const variance = Math.random() * 30;
          await wait(TYPING_MS + variance, controller.signal);
        }

        await wait(PAUSE_MS, controller.signal);

        for (let index = word.length; index >= 0; index--) {
          if (cancelled) return;
          setDisplay(word.slice(0, index));
          await wait(BACKSPACE_MS, controller.signal);
        }

        wordIndexRef.current = (wordIndexRef.current + 1) % words.length;
      }
    };

    run().catch((error) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      throw error;
    });

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [active, prefersReducedMotion, words]);

  return (
    <span className={className}>
      <span aria-live="polite">{display}</span>
      {active && !prefersReducedMotion && (
        <motion.span
          aria-hidden
          className="ml-1 inline-block h-[0.85em] w-[3px] translate-y-px bg-primary align-middle"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </span>
  );
}

type HeroHeadlineProps = {
  active?: boolean;
};

export function HeroHeadline({ active = true }: HeroHeadlineProps) {
  return (
    <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-7xl font-heading">
      Content that gets brands{" "}
      <TypewriterHighlight
        active={active}
        className="text-primary"
      />
    </h1>
  );
}
