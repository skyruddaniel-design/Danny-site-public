"use client";

import { PortfolioVideoActions } from "@/components/portfolio-video-actions";
import { cn } from "@/lib/utils";
import {
  getPortfolioPreviewSrc,
  hasPortfolioWatchLink,
  isPortfolioVideo,
  type PortfolioItem,
} from "@/lib/portfolio";
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const slideEase = [0.22, 1, 0.36, 1] as const;

type PortfolioCarouselProps = {
  items: PortfolioItem[];
  className?: string;
  autoplayMs?: number;
  onOpenPreview?: (item: PortfolioItem) => void;
};

export function PortfolioCarousel({
  items,
  className,
  autoplayMs = 5500,
  onOpenPreview,
}: PortfolioCarouselProps) {
  const prefersReducedMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const didDragRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progress = useMotionValue(0);
  const progressWidth = useTransform(progress, (value) => `${value * 100}%`);

  const total = items.length;
  const autoplayEnabled =
    !prefersReducedMotion && total > 1 && !isAutoplayPaused;

  const goTo = useCallback(
    (index: number) => {
      if (total === 0) return;
      setActiveIndex((index + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => {
    setActiveIndex((current) => (current + 1) % total);
  }, [total]);

  const goPrev = useCallback(() => {
    setActiveIndex((current) => (current - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    progress.set(0);

    if (!autoplayEnabled) {
      return;
    }

    const controls = animate(progress, 1, {
      duration: autoplayMs / 1000,
      ease: "linear",
      onComplete: () => {
        setActiveIndex((current) => (current + 1) % total);
      },
    });

    return () => controls.stop();
  }, [activeIndex, autoplayEnabled, autoplayMs, progress, total]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 72 || Math.abs(info.velocity.x) > 420) {
      didDragRef.current = true;
      if (info.offset.x < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  if (total === 0) {
    return null;
  }

  const activeItem = items[activeIndex];
  const activeIsVideo = isPortfolioVideo(activeItem);
  const activePreviewSrc = getPortfolioPreviewSrc(activeItem);
  const hasActivePreview = Boolean(activePreviewSrc);
  const hasActiveWatchLink = hasPortfolioWatchLink(activeItem);
  const showVideoActions =
    activeIsVideo &&
    onOpenPreview &&
    (hasActivePreview || hasActiveWatchLink);

  useEffect(() => {
    setIsPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, [activeIndex]);

  useEffect(() => {
    if (!activeIsVideo || !hasActivePreview || prefersReducedMotion) {
      videoRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    void video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
  }, [activeIndex, activeIsVideo, hasActivePreview, prefersReducedMotion]);

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div
        className="flex min-h-0 flex-1 flex-col overflow-hidden border border-border bg-card"
        onMouseEnter={() => setIsAutoplayPaused(true)}
        onMouseLeave={() => setIsAutoplayPaused(false)}
        onFocusCapture={() => setIsAutoplayPaused(true)}
        onBlurCapture={() => setIsAutoplayPaused(false)}
      >
        <div className="relative min-h-0 flex-1 overflow-hidden">
        <motion.div
          key={activeItem.id}
          className="absolute inset-0 touch-pan-y"
          initial={
            prefersReducedMotion ? false : { opacity: 0, scale: 1.03 }
          }
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, ease: slideEase }}
          drag={total > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragStart={() => {
            didDragRef.current = false;
          }}
          onDragEnd={handleDragEnd}
        >
          <Image
            src={activeItem.src}
            alt={activeItem.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 38vw, 45vw"
            className={cn(
              "object-cover transition-opacity duration-300",
              activeIsVideo && isPlaying && "opacity-0"
            )}
            priority
          />
          {activeIsVideo && hasActivePreview ? (
            <video
              ref={videoRef}
              key={activePreviewSrc}
              src={activePreviewSrc}
              muted
              loop
              playsInline
              preload="auto"
              className={cn(
                "absolute inset-0 size-full object-cover transition-opacity duration-300",
                isPlaying ? "opacity-100" : "opacity-0"
              )}
            />
          ) : null}
          {activeIsVideo && hasActivePreview && !isPlaying && !prefersReducedMotion ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-10 items-center justify-center border border-white/25 bg-black/35 text-white backdrop-blur-sm">
                <Play className="ml-0.5 size-4 fill-current" />
              </span>
            </div>
          ) : null}
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
            <p className="font-mono text-[10px] tracking-[0.22em] text-white/75 uppercase md:text-[11px]">
              {activeItem.category}
            </p>
            <p className="mt-2 font-heading text-lg font-semibold tracking-tight text-white md:text-xl">
              {activeItem.title}
            </p>
          </div>
        </motion.div>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous project"
              onClick={goPrev}
              className="absolute top-1/2 left-3 z-10 flex size-9 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 md:left-4 md:size-10"
            >
              <ChevronLeft className="size-4" strokeWidth={1.75} />
            </button>
            <button
              type="button"
              aria-label="Next project"
              onClick={goNext}
              className="absolute top-1/2 right-3 z-10 flex size-9 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 md:right-4 md:size-10"
            >
              <ChevronRight className="size-4" strokeWidth={1.75} />
            </button>
          </>
        )}
        </div>

        {showVideoActions ? (
          <div className="border-t border-border bg-card/95 p-4">
            <PortfolioVideoActions
              item={activeItem}
              onOpenPreview={onOpenPreview}
            />
          </div>
        ) : null}
      </div>

      {total > 1 && (
        <div
          className="mt-4 flex gap-2"
          role="tablist"
          aria-label="Portfolio slides"
        >
          {items.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Show ${item.title}`}
                onClick={() => goTo(index)}
                className="relative h-1 flex-1 overflow-hidden bg-border"
              >
                <span
                  className={cn(
                    "absolute inset-0 bg-primary/25 transition-opacity",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                />
                {isActive && autoplayEnabled ? (
                  <motion.span
                    aria-hidden
                    className="absolute inset-y-0 left-0 bg-primary"
                    style={{ width: progressWidth }}
                  />
                ) : (
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-y-0 left-0 bg-primary transition-[width] duration-300",
                      index < activeIndex ? "w-full" : "w-0"
                    )}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
