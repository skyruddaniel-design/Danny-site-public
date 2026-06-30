"use client";

import {
  CameraIntro,
  type CameraIntroPhase,
} from "@/components/camera-intro";
import { useHeroIntro } from "@/components/hero-intro-context";
import { HeroHeadline } from "@/components/hero-headline";
import { ScrollPageButton } from "@/components/scroll-page-button";
import { VideoPlayerControls } from "@/components/video-player-controls";
import { useVideoPlayer } from "@/hooks/use-video-player";
import { motion, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Separator } from "@/components/ui/separator";

import { ArrowUpRight } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;
const zoomEase = [0.83, 0, 0.17, 1] as const;

export function Hero() {
  const t = useTranslations("hero");
  const prefersReducedMotion = useReducedMotion();
  const { setIntroComplete } = useHeroIntro();
  const [introPhase, setIntroPhase] = useState<CameraIntroPhase>("standby");
  const [introComplete, setIntroCompleteLocal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const {
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    seekBy,
    restart,
    skipSeconds,
  } = useVideoPlayer(videoRef);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIntroPhase("done");
      setIntroCompleteLocal(true);
      setIntroComplete(true);
    }
  }, [prefersReducedMotion, setIntroComplete]);

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
    <section
      id="hero"
      className="dark relative flex min-h-svh w-full items-end overflow-hidden bg-background"
    >

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
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className="pointer-events-none h-full w-full object-cover object-top"
        >
          <source src="/videos/dan-selger.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Camera intro */}
      <CameraIntro
        onPhaseChange={setIntroPhase}
        onComplete={() => {
          setIntroCompleteLocal(true);
          setIntroComplete(true);
        }}
      />

      {/* Camera overlay */}
      <motion.div
        className="absolute inset-0 bg-linear-to-t from-background/95 via-background/50 to-primary/10"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: introComplete ? 1 : 0 }}
        transition={{
          duration: 0.8,
          ease,
          delay: prefersReducedMotion ? 0 : 0.1,
        }}
      />

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-[1440px] px-6 py-10 md:py-24 md:px-20 lg:px-24">
        {/* Text content */}
        <div className="pointer-events-auto">

          <motion.div
            className="max-w-2xl"
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
              className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:mt-5 md:text-xl"
              variants={fadeUp}
            >
              {t("description")}
            </motion.p>

            {/* Hero buttons */}
            <motion.div
              className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center"
              variants={fadeUp}
            >
              <ScrollPageButton
                variant="default"
                size="lg"
                className="w-full sm:w-auto md:h-14 md:px-12"
                targetId="services"
              >
                {t("cta.viewServices")}
              </ScrollPageButton>
              <ScrollPageButton
                variant="outline"
                size="lg"
                className="w-full sm:w-auto md:h-14 md:px-12"
                targetId="contact"
                data-icon="inline-end"
              >
                {t("cta.bookCall")}
                <ArrowUpRight className="size-4 md:size-5" />
              </ScrollPageButton>

            </motion.div>
          </motion.div>
        </div>

        <Separator className="mt-4 mb-2 sm:my-8" />
        {/* Video controls */}
        <motion.div
          className="pointer-events-auto flex flex-wrap items-center gap-2"
          initial="hidden"
          animate={introComplete ? "visible" : "hidden"}
          variants={fadeUp}
        >
        <VideoPlayerControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          onTogglePlay={togglePlay}
          onToggleMute={toggleMute}
          onSeekBack={() => seekBy(-skipSeconds)}
          onSeekForward={() => seekBy(skipSeconds)}
          onRestart={restart}
          skipSeconds={skipSeconds}
        />
        </motion.div>
      </div>
    </section>
  );
}
