"use client";

import { useCallback, useEffect, useState, type RefObject } from "react";

const DEFAULT_SKIP_SECONDS = 10;

export function useVideoPlayer(
  videoRef: RefObject<HTMLVideoElement | null>,
  skipSeconds = DEFAULT_SKIP_SECONDS,
  activeKey?: string | null
) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(video.muted);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    setIsPlaying(!video.paused);
    setIsMuted(video.muted);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, [videoRef, activeKey]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      void video.play();
    } else {
      video.pause();
    }
  }, [videoRef]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  }, [videoRef]);

  const seekBy = useCallback(
    (seconds: number) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration)) return;

      video.currentTime = Math.min(
        Math.max(video.currentTime + seconds, 0),
        video.duration
      );
    },
    [videoRef]
  );

  const restart = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    if (video.paused) {
      void video.play();
    }
  }, [videoRef]);

  return {
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    seekBy,
    restart,
    skipSeconds,
  };
}
