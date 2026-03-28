import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bell, ChevronRight, Music2, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Song } from "./backend.d";
import { Genre } from "./backend.d";
import { PlayerBar } from "./components/PlayerBar";
import { SongCard } from "./components/SongCard";
import { FALLBACK_SONGS } from "./data/songs";
import {
  useGetAllSongs,
  useGetSongsByGenre,
  useSearchSongs,
} from "./hooks/useQueries";

const NAV_TABS = ["Home", "Browse", "Radio", "Library"] as const;
type NavTab = (typeof NAV_TABS)[number];

const GENRE_TABS: Array<{ label: string; value: Genre | null }> = [
  { label: "All", value: null },
  { label: "Bollywood", value: Genre.bollywood },
  { label: "Classical", value: Genre.classical },
  { label: "Folk", value: Genre.folk },
  { label: "Devotional", value: Genre.devotional },
  { label: "Retro", value: Genre.retro },
  { label: "Ghazal", value: Genre.ghazal },
  { label: "Pop", value: Genre.pop },
];

const GENRE_CHIPS = [
  { label: "Bollywood", emoji: "🎬", value: Genre.bollywood },
  { label: "Classical", emoji: "🎵", value: Genre.classical },
  { label: "Hindustani", emoji: "🪗", value: Genre.classical },
  { label: "Ghazal", emoji: "🌙", value: Genre.ghazal },
  { label: "Folk", emoji: "🪘", value: Genre.folk },
  { label: "Devotional", emoji: "🕉️", value: Genre.devotional },
  { label: "Retro", emoji: "📼", value: Genre.retro },
  { label: "Pop", emoji: "✨", value: Genre.pop },
];

export default function App() {
  const [activeNav, setActiveNav] = useState<NavTab>("Browse");
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [songQueue, setSongQueue] = useState<Song[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: allSongs = FALLBACK_SONGS as unknown as Song[] } =
    useGetAllSongs();
  const { data: genreSongs } = useGetSongsByGenre(activeGenre);
  const { data: searchResults } = useSearchSongs(debouncedSearch);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => setDebouncedSearch(searchQuery),
      400,
    );
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery]);

  useEffect(() => {
    setSongQueue(allSongs);
  }, [allSongs]);

  const displaySongs: Song[] = debouncedSearch
    ? (searchResults ?? [])
    : activeGenre
      ? (genreSongs ?? allSongs.filter((s) => s.genre === activeGenre))
      : allSongs;

  const bollywoodSongs = allSongs
    .filter((s) => s.genre === Genre.bollywood)
    .slice(0, 8);
  const classicalSongs = allSongs
    .filter((s) => s.genre === Genre.classical)
    .slice(0, 8);

  const handlePlay = useCallback(
    (song: Song) => {
      if (currentSong?.id === song.id) {
        setIsPlaying((p) => !p);
      } else {
        setCurrentSong(song);
        setIsPlaying(true);
      }
    },
    [currentSong],
  );

  const handleNext = useCallback(() => {
    if (!currentSong || songQueue.length === 0) return;
    const idx = songQueue.findIndex((s) => s.id === currentSong.id);
    setCurrentSong(songQueue[(idx + 1) % songQueue.length]);
    setIsPlaying(true);
  }, [currentSong, songQueue]);

  const handlePrev = useCallback(() => {
    if (!currentSong || songQueue.length === 0) return;
    const idx = songQueue.findIndex((s) => s.id === currentSong.id);
    setCurrentSong(songQueue[(idx - 1 + songQueue.length) % songQueue.length]);
    setIsPlaying(true);
  }, [currentSong, songQueue]);

  return (
    <div
      className="min-h-screen bg-background font-body"
      style={{ paddingBottom: currentSong ? "88px" : "0" }}
    >
      {/* Top App Bar */}
      <header
        className="sticky top-0 z-40 border-b border-border"
        style={{ background: "oklch(0.19 0.015 195)" }}
      >
        <div className="flex items-center gap-4 px-6 py-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-teal flex items-center justify-center">
              <Music2 className="w-4 h-4 text-background" />
            </div>
            <div>
              <h1 className="text-foreground font-display font-bold text-lg leading-none">
                Dhwani
              </h1>
              <p className="text-teal text-xs leading-none">ध्वनि</p>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-auto" data-ocid="search.input">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Bollywood, Classical, Artists…"
                className="pl-9 rounded-full bg-muted border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-teal"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
              data-ocid="nav.button"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-teal text-background text-xs font-bold">
                  RS
                </AvatarFallback>
              </Avatar>
              <span className="text-foreground text-sm font-medium hidden sm:block">
                Rahul S.
              </span>
            </div>
          </div>
        </div>

        <nav className="flex px-6 gap-6">
          {NAV_TABS.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => setActiveNav(tab)}
              className={`pb-3 text-sm font-medium transition-colors relative ${
                activeNav === tab
                  ? "text-teal"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid="nav.tab"
            >
              {tab}
              {activeNav === tab && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal rounded-full" />
              )}
            </button>
          ))}
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="relative h-96 lg:h-[480px] overflow-hidden">
          <img
            src="/assets/generated/hero-dhwani.dim_1400x600.jpg"
            alt="Experience the Rhythm of India"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <motion.div
            className="absolute inset-0 flex flex-col justify-center px-8 lg:px-16 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <Badge className="w-fit mb-4 bg-teal/20 text-teal border-teal/30 text-xs">
              🎵 India's #1 Music Platform
            </Badge>
            <h2 className="font-display font-extrabold text-4xl lg:text-6xl text-foreground leading-tight mb-4">
              Experience the
              <br />
              <span className="text-teal">Rhythm of India</span>
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg mb-8 max-w-md">
              From Bollywood blockbusters to classical ragas — discover the soul
              of Indian music.
            </p>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => allSongs.length > 0 && handlePlay(allSongs[0])}
                className="px-6 py-3 rounded-full bg-teal text-background font-semibold text-sm hover:bg-teal-light transition-colors"
                data-ocid="hero.primary_button"
              >
                Start Listening
              </button>
              <button
                type="button"
                onClick={() => setActiveGenre(null)}
                className="px-6 py-3 rounded-full border-2 border-teal text-teal font-semibold text-sm hover:bg-teal/10 transition-colors"
                data-ocid="hero.secondary_button"
              >
                Explore Genres
              </button>
            </div>
          </motion.div>
        </section>

        {/* Genre Filter Tabs */}
        <section
          className="border-b border-border"
          style={{ background: "oklch(0.17 0.016 195)" }}
        >
          <div className="flex items-center gap-1 px-6 overflow-x-auto no-scrollbar">
            {GENRE_TABS.map(({ label, value }) => (
              <button
                type="button"
                key={label}
                onClick={() => setActiveGenre(value)}
                className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors relative ${
                  activeGenre === value
                    ? "text-teal"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                data-ocid="genre.tab"
              >
                {label}
                {activeGenre === value && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal rounded-full" />
                )}
              </button>
            ))}
          </div>
        </section>

        <div className="px-6 lg:px-10 py-8 space-y-12">
          {/* Search Results */}
          <AnimatePresence>
            {debouncedSearch && (
              <motion.section
                key="search"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                data-ocid="search.panel"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display font-bold text-xl text-foreground">
                    Results for &ldquo;{debouncedSearch}&rdquo;
                  </h3>
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-teal text-sm hover:underline"
                  >
                    Clear
                  </button>
                </div>
                {(searchResults ?? []).length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="search.empty_state"
                  >
                    <Music2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No songs found for &ldquo;{debouncedSearch}&rdquo;</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {(searchResults ?? []).map((song, i) => (
                      <SongCard
                        key={song.id.toString()}
                        song={song}
                        index={i}
                        isPlaying={currentSong?.id === song.id && isPlaying}
                        onPlay={handlePlay}
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>

          {!debouncedSearch && (
            <>
              {(activeGenre === null || activeGenre === Genre.bollywood) && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-xl text-foreground">
                      Trending Bollywood Hits
                    </h3>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-teal text-sm hover:underline"
                      onClick={() => setActiveGenre(Genre.bollywood)}
                    >
                      See all <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {bollywoodSongs.map((song, i) => (
                      <SongCard
                        key={song.id.toString()}
                        song={song}
                        index={i}
                        isPlaying={currentSong?.id === song.id && isPlaying}
                        onPlay={handlePlay}
                      />
                    ))}
                  </div>
                </motion.section>
              )}

              {(activeGenre === null || activeGenre === Genre.classical) && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-display font-bold text-xl text-foreground">
                      Eternal Classical Melodies
                    </h3>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-teal text-sm hover:underline"
                      onClick={() => setActiveGenre(Genre.classical)}
                    >
                      See all <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                    {classicalSongs.map((song, i) => (
                      <SongCard
                        key={song.id.toString()}
                        song={song}
                        index={i % 2 === 0 ? 1 : 0}
                        isPlaying={currentSong?.id === song.id && isPlaying}
                        onPlay={handlePlay}
                      />
                    ))}
                  </div>
                </motion.section>
              )}

              {activeGenre === null && (
                <motion.section
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h3 className="font-display font-bold text-xl text-foreground mb-5">
                    Discover by Genres
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {GENRE_CHIPS.map(({ label, emoji, value }) => (
                      <button
                        type="button"
                        key={label}
                        onClick={() => setActiveGenre(value)}
                        className="px-5 py-2.5 rounded-full border border-border bg-card hover:border-teal hover:text-teal text-muted-foreground text-sm font-medium transition-all"
                        data-ocid="genre.tab"
                      >
                        {emoji} {label}
                      </button>
                    ))}
                  </div>
                </motion.section>
              )}

              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-bold text-xl text-foreground">
                    {activeGenre
                      ? `${GENRE_TABS.find((t) => t.value === activeGenre)?.label ?? ""} Songs`
                      : "All Songs"}
                  </h3>
                  <span className="text-muted-foreground text-sm">
                    {displaySongs.length} tracks
                  </span>
                </div>
                {displaySongs.length === 0 ? (
                  <div
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="songs.empty_state"
                  >
                    <Music2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No songs in this category yet</p>
                  </div>
                ) : (
                  <div
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
                    data-ocid="songs.list"
                  >
                    {displaySongs.map((song, i) => (
                      <SongCard
                        key={song.id.toString()}
                        song={song}
                        index={i}
                        isPlaying={currentSong?.id === song.id && isPlaying}
                        onPlay={handlePlay}
                      />
                    ))}
                  </div>
                )}
              </motion.section>
            </>
          )}
        </div>
      </main>

      <footer
        className="border-t border-border mt-16"
        style={{ background: "oklch(0.17 0.016 195)" }}
      >
        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-teal flex items-center justify-center">
                <Music2 className="w-3.5 h-3.5 text-background" />
              </div>
              <span className="font-display font-bold text-foreground">
                Dhwani
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your gateway to the soul of Indian music. Millions of songs. One
              platform.
            </p>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-3 text-sm">
              Discover
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {["Bollywood", "Classical", "Folk", "Devotional"].map((g) => (
                <li key={g}>
                  <button
                    type="button"
                    className="hover:text-teal transition-colors"
                  >
                    {g}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-3 text-sm">
              Features
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {["Radio", "Playlists", "Artists", "Charts"].map((f) => (
                <li key={f}>
                  <button
                    type="button"
                    className="hover:text-teal transition-colors"
                  >
                    {f}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-foreground font-semibold mb-3 text-sm">
              Company
            </h4>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {["About", "Careers", "Privacy", "Terms"].map((c) => (
                <li key={c}>
                  <button
                    type="button"
                    className="hover:text-teal transition-colors"
                  >
                    {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-4 text-center text-muted-foreground text-xs">
          &copy; {new Date().getFullYear()}. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      <PlayerBar
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={() => setIsPlaying((p) => !p)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
