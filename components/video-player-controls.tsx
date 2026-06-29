"use client";

import { PlayPauseIcon } from "@/components/icons/play-pause-icon";
import { VolumeIcon } from "@/components/icons/volume-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RotateCcw, SkipBack, SkipForward } from "lucide-react";

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
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <Button
        variant="outline"
        size="icon"
        onClick={onRestart}
        aria-label="Restart video"
      >
        <RotateCcw className="size-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onSeekBack}
        aria-label={`Skip back ${skipSeconds} seconds`}
      >
        <SkipBack className="size-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onTogglePlay}
        aria-label={isPlaying ? "Pause video" : "Play video"}
      >
        <PlayPauseIcon playing={isPlaying} />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onSeekForward}
        aria-label={`Skip forward ${skipSeconds} seconds`}
      >
        <SkipForward className="size-5" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
      >
        <VolumeIcon muted={isMuted} />
      </Button>
    </div>
  );
}
