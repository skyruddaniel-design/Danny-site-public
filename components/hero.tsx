"use client";

import {
  CameraIntro,
  type CameraIntroPhase,
} from "@/components/camera-intro";
import { HeroHeadline } from "@/components/hero-headline";
import { Button } from "@/components/ui/button";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

import {ArrowUpRight} from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;
const zoomEase = [0.83, 0, 0.17, 1] as const;

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const [introPhase, setIntroPhase] = useState<CameraIntroPhase>("standby");
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIntroPhase("done");
      setIntroComplete(true);
    }
  }, [prefersReducedMotion]);

  const isZooming =
    introPhase === "recording" ||
    introPhase === "exiting" ||
    introPhase === "done";

  const fadeUp = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : {
        hidden: { opacity: 0, y: 28 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease },
        },
      };

  return (
    <section className="relative bg-background flex min-h-svh w-full items-end overflow-hidden sm:items-center">

      {/* Video */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1 }}
        animate={{
          scale: prefersReducedMotion
            ? 1
            : isZooming
              ? introPhase === "exiting" || introComplete
                ? 1
                : 1.06
              : 1,
        }}
        transition={{
          duration: introPhase === "exiting" ? 0.45 : 1,
          ease: zoomEase,
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="pointer-events-none h-full w-full object-cover"
          aria-hidden
        >
          <source src="/videos/dan-selger.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Camera intro */}
      <CameraIntro
        onPhaseChange={setIntroPhase}
        onComplete={() => setIntroComplete(true)}
      />

      {/* Camera overlay */}
      <motion.div
        className="absolute inset-0 bg-linear-to-t from-white/90 via-white/80 to-white/40"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{
          duration: 0.8,
          ease,
          delay: prefersReducedMotion ? 0 : 0.1,
        }}
      />

      {/* Text content */}
      <div className="relative z-30 mx-auto w-full max-w-7xl px-10 py-36 sm:px-16 sm:py-32 md:px-20 lg:px-24">
        <motion.div
          className="max-w-3xl"
          initial="hidden"
          animate={introComplete ? "visible" : "hidden"}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.12,
                delayChildren: prefersReducedMotion ? 0 : 0.15,
              },
            },
          }}
        >
          {/* Hero headline */}
          <motion.div variants={fadeUp}>
            <HeroHeadline active={introComplete} />
          </motion.div>

          {/* Hero description */}
          <motion.p
            className="mt-5 max-w-xl text-lg leading-relaxed text-foreground/80 sm:text-xl"
            variants={fadeUp}
          >
            Visual content for brands that want to communicate clearly,
            professionally, and with impact.
          </motion.p>

          {/* Hero buttons */}
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            variants={fadeUp}
          >
            <Button variant="default" size="xl">
              <Link href="#services">View services</Link>
            </Button>
            <Button variant="outline" size="xl" data-icon="inline-end">
              <Link href="#contact">Book a call </Link>
              <ArrowUpRight className="w-12!important h-12!important" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
