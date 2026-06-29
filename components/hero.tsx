"use client";

import {
  CameraIntro,
  type CameraIntroPhase,
} from "@/components/camera-intro";
import { HeroHeadline } from "@/components/hero-headline";
import { PlayPauseIcon } from "@/components/icons/play-pause-icon";
import { VolumeIcon } from "@/components/icons/volume-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Separator } from "@/components/ui/separator";

import { ArrowUpRight, RotateCcw, SkipBack, SkipForward } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;
const zoomEase = [0.83, 0, 0.17, 1] as const;
const SKIP_SECONDS = 10;

export function Hero() {
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [introPhase, setIntroPhase] = useState<CameraIntroPhase>("standby");
  const [introComplete, setIntroComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIntroPhase("done");
      setIntroComplete(true);
    }
  }, [prefersReducedMotion]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(video.muted);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  };

  const seekBy = (seconds: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;

    video.currentTime = Math.min(
      Math.max(video.currentTime + seconds, 0),
      video.duration
    );
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    if (video.paused) {
      void video.play();
    }
  };

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
    <section className="dark relative flex min-h-svh w-full items-end overflow-hidden bg-background">

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
        onComplete={() => setIntroComplete(true)}
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

      <div className="relative z-30 mx-auto w-full max-w-[1440px] px-10 py-10 md:py-24 md:px-20 lg:px-24">
        {/* Text content */}
        <div>

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
              className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
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
              <Link href="#services" className={buttonVariants({ variant: "default", size: "xl" })}>View services</Link>
              <Link href="#contact" className={buttonVariants({ variant: "outline", size: "xl" })}>Book a call <ArrowUpRight className="size-5 " /></Link>

            </motion.div>
          </motion.div>
        </div>

        <Separator className="my-8" />
        {/* Video controls */}
        <motion.div
          className="flex flex-wrap items-center gap-2"
          initial="hidden"
          animate={introComplete ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <Button
            variant="outline"
            size="icon"
            onClick={restartVideo}
            aria-label="Restart video"
          >
            <RotateCcw className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => seekBy(-SKIP_SECONDS)}
            aria-label={`Skip back ${SKIP_SECONDS} seconds`}
          >
            <SkipBack className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            <PlayPauseIcon playing={isPlaying} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => seekBy(SKIP_SECONDS)}
            aria-label={`Skip forward ${SKIP_SECONDS} seconds`}
          >
            <SkipForward className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            <VolumeIcon muted={isMuted} />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
