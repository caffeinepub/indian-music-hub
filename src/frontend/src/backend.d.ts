import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SongInput {
    coverImageUrl: string;
    title: string;
    duration: bigint;
    album: string;
    genre: Genre;
    artist: string;
}
export interface Song {
    id: bigint;
    coverImageUrl: string;
    title: string;
    duration: bigint;
    album: string;
    genre: Genre;
    artist: string;
}
export enum Genre {
    pop = "pop",
    bollywood = "bollywood",
    folk = "folk",
    ghazal = "ghazal",
    devotional = "devotional",
    retro = "retro",
    classical = "classical"
}
export interface backendInterface {
    addSong(songInput: SongInput): Promise<bigint>;
    getAllSongs(): Promise<Array<Song>>;
    getSong(id: bigint): Promise<Song>;
    getSongsByGenre(genre: Genre): Promise<Array<Song>>;
    searchByArtist(searchText: string): Promise<Array<Song>>;
    searchByTitle(searchText: string): Promise<Array<Song>>;
}
