"use client";

import { PortfolioVideoActions } from "@/components/portfolio-video-actions";
import { cn } from "@/lib/utils";
import {
  getPortfolioPreviewSrc,
  hasPortfolioWatchLink,
  isPortfolioVideo,
  type LocalizedPortfolioItem,
} from "@/lib/portfolio";
import { useReducedMotion } from "motion/react";
import { Play } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

type PortfolioMediaCardProps = {
  item: LocalizedPortfolioItem;
  className?: string;
  priority?: boolean;
  onOpenPreview?: (item: LocalizedPortfolioItem) => void;
};

export function PortfolioMediaCard({
  item,
  className,
  priority = false,
  onOpenPreview,
}: PortfolioMediaCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isPlaying, setIsPlaying] = useState(false);
  const isVideo = isPortfolioVideo(item);
  const previewSrc = getPortfolioPreviewSrc(item);
  const hasPreview = Boolean(previewSrc);
  const hasWatchLink = hasPortfolioWatchLink(item);

  const playPreview = useCallback(() => {
    if (!hasPreview || prefersReducedMotion) return;

    const video = videoRef.current;
    if (!video) return;

    void video.play().then(() => setIsPlaying(true)).catch(() => {});
  }, [hasPreview, prefersReducedMotion]);

  const stopPreview = useCallback(() => {
    if (!hasPreview) return;

    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.currentTime = 0;
    setIsPlaying(false);
  }, [hasPreview]);

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden border border-border bg-card/90 backdrop-blur-sm",
        className
      )}
    >
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: item.ratio }}
        onMouseEnter={playPreview}
        onMouseLeave={stopPreview}
      >
        {isVideo ? (
          <>
            <Image
              src={item.src}
              alt={item.alt}
              fill
              priority={priority}
              sizes={
                item.type === "tiktok"
                  ? "(max-width: 768px) 72vw, 240px"
                  : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              }
              className={cn(
                "object-cover transition-opacity duration-300",
                isPlaying ? "opacity-0" : "opacity-100"
              )}
            />
            {hasPreview ? (
              <video
                ref={videoRef}
                src={previewSrc}
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden={!isPlaying}
                className={cn(
                  "absolute inset-0 size-full object-cover transition-opacity duration-300",
                  isPlaying ? "opacity-100" : "opacity-0"
                )}
              />
            ) : null}
          </>
        ) : (
          <Image
            src={item.src}
            alt={item.alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
          />
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

        {isVideo && hasPreview && !isPlaying && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="flex size-11 items-center justify-center border border-white/25 bg-black/35 text-white backdrop-blur-sm transition-transform duration-300 group-hover:scale-105 md:size-12">
              <Play className="ml-0.5 size-4 fill-current" />
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 md:p-5">
          <p className="font-mono text-[10px] tracking-[0.22em] text-white/75 uppercase md:text-[11px]">
            {item.category}
          </p>
          <h2 className="mt-1.5 font-heading text-lg font-semibold tracking-tight text-white md:text-xl">
            {item.title}
          </h2>
        </div>
      </div>

      {isVideo && (hasPreview || hasWatchLink) ? (
        <div className="border-t border-border bg-card/95 p-3 md:p-4">
          <PortfolioVideoActions item={item} onOpenPreview={onOpenPreview} />
        </div>
      ) : null}
    </article>
  );
}
