import { Slider } from "@/components/ui/slider";
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Song } from "../backend.d";
import { formatDuration } from "../data/songs";

interface PlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function PlayerBar({
  currentSong,
  isPlaying,
  onPlayPause,
  onNext,
  onPrev,
}: PlayerBarProps) {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const songId = currentSong?.id?.toString();

  // biome-ignore lint/correctness/useExhaustiveDependencies: reset progress on song change
  useEffect(() => {
    setProgress(0);
  }, [songId]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying && currentSong) {
      const duration = Number(currentSong.duration);
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(intervalRef.current!);
            return 100;
          }
          return prev + 100 / (duration * 2);
        });
      }, 500);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentSong]);

  if (!currentSong) return null;

  const elapsed = Math.floor((progress / 100) * Number(currentSong.duration));

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border"
      style={{ background: "oklch(0.17 0.016 195)" }}
      data-ocid="player.panel"
    >
      <div className="w-full h-1 bg-muted">
        <div
          className="h-full bg-teal transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center px-4 py-3 gap-4">
        <div className="flex items-center gap-3 w-64 flex-shrink-0">
          <img
            src={
              currentSong.coverImageUrl ||
              `https://picsum.photos/seed/${currentSong.id}/300/300`
            }
            alt={currentSong.title}
            className="w-12 h-12 rounded-lg object-cover border border-border"
          />
          <div className="min-w-0">
            <p className="text-foreground text-sm font-semibold truncate">
              {currentSong.title}
            </p>
            <p className="text-muted-foreground text-xs truncate">
              {currentSong.artist}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsShuffle((s) => !s)}
              className={`p-1.5 rounded-full transition-colors ${isShuffle ? "text-teal" : "text-muted-foreground hover:text-foreground"}`}
              data-ocid="player.toggle"
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onPrev}
              className="p-1.5 text-foreground hover:text-teal transition-colors"
              data-ocid="player.pagination_prev"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <button
              type="button"
              onClick={onPlayPause}
              className="w-10 h-10 rounded-full bg-teal hover:bg-teal-light flex items-center justify-center transition-colors"
              data-ocid="player.primary_button"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-background fill-background" />
              ) : (
                <Play className="w-5 h-5 text-background fill-background" />
              )}
            </button>
            <button
              type="button"
              onClick={onNext}
              className="p-1.5 text-foreground hover:text-teal transition-colors"
              data-ocid="player.pagination_next"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <button
              type="button"
              onClick={() => setIsRepeat((r) => !r)}
              className={`p-1.5 rounded-full transition-colors ${isRepeat ? "text-teal" : "text-muted-foreground hover:text-foreground"}`}
              data-ocid="player.toggle"
            >
              <Repeat className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{formatDuration(BigInt(elapsed))}</span>
            <span>/</span>
            <span>{formatDuration(currentSong.duration)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-40 flex-shrink-0 justify-end">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="player.toggle"
          >
            {muted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <Slider
            value={[muted ? 0 : volume]}
            onValueChange={([v]) => {
              setVolume(v);
              setMuted(false);
            }}
            max={100}
            step={1}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
}
