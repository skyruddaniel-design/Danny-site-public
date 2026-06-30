"use client";

import { PortfolioWatchLink } from "@/components/portfolio-watch-link";
import { VideoPlayerControls } from "@/components/video-player-controls";
import { useVideoPlayer } from "@/hooks/use-video-player";
import {
  getPortfolioFullMovieLabel,
  getPortfolioPreviewSrc,
  hasPortfolioWatchLink,
  type LocalizedPortfolioItem,
} from "@/lib/portfolio";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const ease = [0.22, 1, 0.36, 1] as const;

type PortfolioPreviewLightboxProps = {
  item: LocalizedPortfolioItem | null;
  onClose: () => void;
};

export function PortfolioPreviewLightbox({
  item,
  onClose,
}: PortfolioPreviewLightboxProps) {
  const t = useTranslations("portfolio");
  const prefersReducedMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previewSrc = item ? getPortfolioPreviewSrc(item) : undefined;

  const {
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    seekBy,
    restart,
    skipSeconds,
  } = useVideoPlayer(videoRef, 10, item?.id ?? null);

  const isOpen = Boolean(item && previewSrc);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const video = videoRef.current;
    if (!isOpen || !video || !previewSrc) return;

    video.currentTime = 0;
    video.muted = true;
    void video.play().catch(() => {});
  }, [isOpen, previewSrc, item?.id]);

  if (typeof document === "undefined") {
    return null;
  }

  const isVertical = item?.type === "tiktok";
  const showWatchLink = item ? hasPortfolioWatchLink(item) : false;

  return createPortal(
    <AnimatePresence>
      {isOpen && item && previewSrc ? (
        <motion.div
          key={item.id}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={t("lightbox.ariaPreview", { title: item.title })}
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReducedMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 0.25, ease }}
        >
          <button
            type="button"
            aria-label={t("lightbox.closePreview")}
            className="absolute inset-0 bg-black/88 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            className="relative z-10 flex w-full max-w-6xl flex-col gap-4"
            initial={
              prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.98 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion ? undefined : { opacity: 0, y: 12, scale: 0.98 }
            }
            transition={{ duration: 0.35, ease }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 text-white">
                <p className="font-mono text-[10px] tracking-[0.22em] text-white/65 uppercase md:text-[11px]">
                  {t("lightbox.previewLabel", { category: item.category })}
                </p>
                <h2 className="mt-1 font-heading text-xl font-semibold tracking-tight md:text-2xl">
                  {item.title}
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label={t("lightbox.close")}
                className="flex size-10 shrink-0 items-center justify-center border border-white/20 bg-black/40 text-white backdrop-blur-sm transition-colors hover:bg-black/60"
              >
                <X className="size-5" />
              </button>
            </div>

            <div
              className={cn(
                "dark relative mx-auto w-full overflow-hidden border border-white/15 bg-black shadow-2xl",
                isVertical
                  ? "max-h-[min(72vh,720px)] max-w-[min(100%,18rem)] md:max-w-[20rem]"
                  : "max-w-5xl"
              )}
              style={{ aspectRatio: item.ratio }}
            >
              <video
                ref={videoRef}
                src={previewSrc}
                playsInline
                loop
                className="size-full object-contain bg-black"
                onClick={togglePlay}
              />
            </div>

            <div className="dark flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
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

              {showWatchLink ? (
                <PortfolioWatchLink
                  item={item}
                  label={getPortfolioFullMovieLabel(item, t)}
                  className="w-full sm:w-auto"
                />
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
