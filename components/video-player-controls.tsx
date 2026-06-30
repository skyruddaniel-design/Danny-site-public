"use client";

import { PlayPauseIcon } from "@/components/icons/play-pause-icon";
import { VolumeIcon } from "@/components/icons/volume-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, SkipBack, SkipForward } from "lucide-react";
import { useTranslations } from "next-intl";

type VideoPlayerControlsProps = {
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onSeekBack: () => void;
  onSeekForward: () => void;
  onRestart: () => void;
  skipSeconds?: number;
  className?: string;
};

export function VideoPlayerControls({
  isPlaying,
  isMuted,
  onTogglePlay,
  onToggleMute,
  onSeekBack,
  onSeekForward,
  onRestart,
  skipSeconds = 10,
  className,
}: VideoPlayerControlsProps) {
  const t = useTranslations("a11y.video");

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={onRestart}
        aria-label={t("restart")}
      >
        <RotateCcw className="size-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onSeekBack}
        aria-label={t("skipBack", { seconds: skipSeconds })}
      >
        <SkipBack className="size-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onTogglePlay}
        aria-label={isPlaying ? t("pause") : t("play")}
      >
        <PlayPauseIcon playing={isPlaying} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onSeekForward}
        aria-label={t("skipForward", { seconds: skipSeconds })}
      >
        <SkipForward className="size-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleMute}
        aria-label={isMuted ? t("unmute") : t("mute")}
      >
        <VolumeIcon muted={isMuted} />
      </Button>
    </div>
  );
}
