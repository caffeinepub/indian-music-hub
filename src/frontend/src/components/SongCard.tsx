import { Play } from "lucide-react";
import type { Song } from "../backend.d";
import { formatDuration } from "../data/songs";

interface SongCardProps {
  song: Song;
  index: number;
  isPlaying?: boolean;
  onPlay: (song: Song) => void;
}

export function SongCard({ song, index, isPlaying, onPlay }: SongCardProps) {
  const isTeal = index % 2 === 0;

  return (
    <button
      type="button"
      className={`relative flex-shrink-0 w-48 rounded-xl overflow-hidden border-2 cursor-pointer group transition-transform duration-200 hover:-translate-y-1 text-left ${
        isTeal ? "border-teal" : "border-orange"
      }`}
      style={{
        boxShadow: isPlaying
          ? isTeal
            ? "0 0 20px oklch(0.68 0.12 185 / 0.4)"
            : "0 0 20px oklch(0.65 0.14 55 / 0.4)"
          : undefined,
      }}
      onClick={() => onPlay(song)}
    >
      <div className="relative w-full aspect-square">
        <img
          src={
            song.coverImageUrl ||
            `https://picsum.photos/seed/${song.id}/300/300`
          }
          alt={song.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isPlaying && (
          <div className="absolute inset-0 bg-teal/10 flex items-center justify-center">
            <div className="flex gap-0.5 items-end h-6">
              {[1, 2, 3, 4].map((b) => (
                <div
                  key={b}
                  className="w-1 bg-teal rounded-sm animate-pulse-teal"
                  style={{
                    height: `${40 + b * 12}%`,
                    animationDelay: `${b * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 pt-8">
        <p className="text-foreground text-sm font-semibold truncate leading-tight">
          {song.title}
        </p>
        <p className="text-muted-foreground text-xs truncate mt-0.5">
          {song.artist}
        </p>
        <div className="flex items-center justify-between mt-2">
          <span className="text-muted-foreground text-xs">
            {formatDuration(song.duration)}
          </span>
          <span className="w-7 h-7 rounded-full bg-teal flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Play className="w-3.5 h-3.5 text-background fill-background" />
          </span>
        </div>
      </div>
    </button>
  );
}
