import { useQuery } from "@tanstack/react-query";
import type { Genre } from "../backend.d";
import type { Song } from "../backend.d";
import { FALLBACK_SONGS } from "../data/songs";
import { useActor } from "./useActor";

export function useGetAllSongs() {
  const { actor, isFetching } = useActor();
  return useQuery<Song[]>({
    queryKey: ["songs"],
    queryFn: async () => {
      if (!actor) return FALLBACK_SONGS as unknown as Song[];
      const songs = await actor.getAllSongs();
      return songs.length > 0 ? songs : (FALLBACK_SONGS as unknown as Song[]);
    },
    enabled: !isFetching,
    placeholderData: FALLBACK_SONGS as unknown as Song[],
  });
}

export function useGetSongsByGenre(genre: Genre | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Song[]>({
    queryKey: ["songs", "genre", genre],
    queryFn: async () => {
      if (!genre) return FALLBACK_SONGS as unknown as Song[];
      if (!actor)
        return (FALLBACK_SONGS as unknown as Song[]).filter(
          (s) => s.genre === genre,
        );
      const songs = await actor.getSongsByGenre(genre);
      return songs.length > 0
        ? songs
        : (FALLBACK_SONGS as unknown as Song[]).filter(
            (s) => s.genre === genre,
          );
    },
    enabled: !isFetching && genre !== null,
  });
}

export function useSearchSongs(query: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Song[]>({
    queryKey: ["songs", "search", query],
    queryFn: async () => {
      if (!query.trim()) return [];
      const fallback = FALLBACK_SONGS as unknown as Song[];
      if (!actor) {
        const q = query.toLowerCase();
        return fallback.filter(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.artist.toLowerCase().includes(q),
        );
      }
      const [byTitle, byArtist] = await Promise.all([
        actor.searchByTitle(query),
        actor.searchByArtist(query),
      ]);
      const combined = [...byTitle, ...byArtist];
      const unique = combined.filter(
        (song, idx, self) => self.findIndex((s) => s.id === song.id) === idx,
      );
      if (unique.length > 0) return unique;
      const q = query.toLowerCase();
      return fallback.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q),
      );
    },
    enabled: !isFetching && query.trim().length > 0,
  });
}
