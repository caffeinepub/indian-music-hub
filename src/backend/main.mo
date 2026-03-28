import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";

actor {
  type Song = {
    id : Nat;
    title : Text;
    artist : Text;
    album : Text;
    genre : Genre;
    duration : Nat;
    coverImageUrl : Text;
  };

  module Song {
    public func compareByTitle(song1 : Song, song2 : Song) : Order.Order {
      Text.compare(song1.title, song2.title);
    };
  };

  type Genre = {
    #bollywood;
    #classical;
    #folk;
    #devotional;
    #retro;
    #ghazal;
    #pop;
  };

  module Genre {
    public func compare(genre1 : Genre, genre2 : Genre) : Order.Order {
      switch (genre1, genre2) {
        case (#bollywood, #bollywood) { #equal };
        case (#bollywood, _) { #less };
        case (#classical, #bollywood) { #greater };
        case (#classical, #classical) { #equal };
        case (#classical, _) { #less };
        case (#folk, #bollywood) { #greater };
        case (#folk, #classical) { #greater };
        case (#folk, #folk) { #equal };
        case (#folk, _) { #less };
        case (#devotional, #retro) { #less };
        case (#devotional, #ghazal) { #less };
        case (#devotional, #pop) { #less };
        case (#devotional, #devotional) { #equal };
        case (#retro, #pop) { #less };
        case (#retro, #retro) { #equal };
        case (#ghazal, #pop) { #less };
        case (#ghazal, #ghazal) { #equal };
        case (#pop, #pop) { #equal };
        case (_) { #greater };
      };
    };
  };

  type SongInput = {
    title : Text;
    artist : Text;
    album : Text;
    genre : Genre;
    duration : Nat;
    coverImageUrl : Text;
  };

  var nextSongId = 21; // Start after pre-populated songs
  let songs = Map.empty<Nat, Song>();

  // Pre-populated songs
  let prePopulatedSongs : [Song] = [
    // Bollywood
    {
      id = 1;
      title = "Tum Hi Ho";
      artist = "Arijit Singh";
      album = "Aashiqui 2";
      genre = #bollywood;
      duration = 240;
      coverImageUrl = "https://example.com/images/tum_hi_ho.jpg";
    },
    {
      id = 2;
      title = "Chaiyya Chaiyya";
      artist = "Sukhwinder Singh, Sapna Awasthi";
      album = "Dil Se";
      genre = #bollywood;
      duration = 300;
      coverImageUrl = "https://example.com/images/chaiyya_chaiyya.jpg";
    },
    {
      id = 3;
      title = "Kal Ho Naa Ho";
      artist = "Sonu Nigam";
      album = "Kal Ho Naa Ho";
      genre = #bollywood;
      duration = 340;
      coverImageUrl = "https://example.com/images/kal_ho_naa_ho.jpg";
    },
    // Classical
    {
      id = 4;
      title = "Raga Yaman";
      artist = "Ravi Shankar";
      album = "Indian Classical Music";
      genre = #classical;
      duration = 600;
      coverImageUrl = "https://example.com/images/raga_yaman.jpg";
    },
    {
      id = 5;
      title = "Bhairavi Thumri";
      artist = "Pandit Bhimsen Joshi";
      album = "Classical Gems";
      genre = #classical;
      duration = 480;
      coverImageUrl = "https://example.com/images/bhairavi_thumri.jpg";
    },
    // Folk
    {
      id = 6;
      title = "Dama Dam Mast Qalandar";
      artist = "Abida Parveen";
      album = "Folk Classics";
      genre = #folk;
      duration = 420;
      coverImageUrl = "https://example.com/images/dama_dam_mast_qalandar.jpg";
    },
    {
      id = 7;
      title = "Nimbooda";
      artist = "Rajasthani Folk";
      album = "Folk Hits";
      genre = #folk;
      duration = 260;
      coverImageUrl = "https://example.com/images/nimbooda.jpg";
    },
    // Devotional
    {
      id = 8;
      title = "Om Jai Jagdish Hare";
      artist = "Anup Jalota";
      album = "Aarti Sangrah";
      genre = #devotional;
      duration = 360;
      coverImageUrl = "https://example.com/images/om_jai_jagdish_hare.jpg";
    },
    {
      id = 9;
      title = "Hanuman Chalisa";
      artist = "Hari Om Sharan";
      album = "Bhakti Sangeet";
      genre = #devotional;
      duration = 420;
      coverImageUrl = "https://example.com/images/hanuman_chalisa.jpg";
    },
    // Retro
    {
      id = 10;
      title = "Mere Sapno Ki Rani";
      artist = "Kishore Kumar";
      album = "Aradhana";
      genre = #retro;
      duration = 210;
      coverImageUrl = "https://example.com/images/mere_sapno_ki_rani.jpg";
    },
    {
      id = 11;
      title = "Lag Ja Gale";
      artist = "Lata Mangeshkar";
      album = "Woh Kaun Thi";
      genre = #retro;
      duration = 260;
      coverImageUrl = "https://example.com/images/lag_ja_gale.jpg";
    },
    // Ghazal
    {
      id = 12;
      title = "Chupke Chupke";
      artist = "Ghulam Ali";
      album = "Ghazal Collection";
      genre = #ghazal;
      duration = 300;
      coverImageUrl = "https://example.com/images/chupke_chupke.jpg";
    },
    {
      id = 13;
      title = "Hothon Se Chhoo Lo Tum";
      artist = "Jagjit Singh";
      album = "Ghazal Hits";
      genre = #ghazal;
      duration = 320;
      coverImageUrl = "https://example.com/images/hothon_se_chhoo_lo_tum.jpg";
    },
    // Pop
    {
      id = 14;
      title = "Made In India";
      artist = "Alisha Chinai";
      album = "Made In India";
      genre = #pop;
      duration = 280;
      coverImageUrl = "https://example.com/images/made_in_india.jpg";
    },
    {
      id = 15;
      title = "Tanha Dil";
      artist = "Shaan";
      album = "Tanha Dil";
      genre = #pop;
      duration = 290;
      coverImageUrl = "https://example.com/images/tanha_dil.jpg";
    },
    // Additional Bollywood
    {
      id = 16;
      title = "Tujh Mein Rab Dikhta Hai";
      artist = "Roop Kumar Rathod";
      album = "Rab Ne Bana Di Jodi";
      genre = #bollywood;
      duration = 250;
      coverImageUrl = "https://example.com/images/tujh_mein_rab_dikhta_hai.jpg";
    },
    {
      id = 17;
      title = "Pee Loon";
      artist = "Mohit Chauhan";
      album = "Once Upon a Time in Mumbaai";
      genre = #bollywood;
      duration = 270;
      coverImageUrl = "https://example.com/images/pee_loon.jpg";
    },
    {
      id = 18;
      title = "Suno Na Sangemarmar";
      artist = "Arijit Singh";
      album = "Youngistaan";
      genre = #bollywood;
      duration = 230;
      coverImageUrl = "https://example.com/images/suno_na_sangemarmar.jpg";
    },
    // Additional Classical
    {
      id = 19;
      title = "Raag Bhupali";
      artist = "Hariprasad Chaurasia";
      album = "Classical Melodies";
      genre = #classical;
      duration = 540;
      coverImageUrl = "https://example.com/images/raag_bhupali.jpg";
    },
    {
      id = 20;
      title = "Raga Todi";
      artist = "Ustad Vilayat Khan";
      album = "Classical Legends";
      genre = #classical;
      duration = 630;
      coverImageUrl = "https://example.com/images/raga_todi.jpg";
    },
  ];

  // Initialize map with pre-populated songs
  for (song in prePopulatedSongs.values()) {
    songs.add(song.id, song);
  };

  public shared ({ caller }) func addSong(songInput : SongInput) : async Nat {
    let song : Song = {
      id = nextSongId;
      title = songInput.title;
      artist = songInput.artist;
      album = songInput.album;
      genre = songInput.genre;
      duration = songInput.duration;
      coverImageUrl = songInput.coverImageUrl;
    };
    songs.add(nextSongId, song);
    nextSongId += 1;
    song.id;
  };

  public query ({ caller }) func getSong(id : Nat) : async Song {
    switch (songs.get(id)) {
      case (null) { Runtime.trap("Song not found") };
      case (?song) { song };
    };
  };

  public query ({ caller }) func getAllSongs() : async [Song] {
    songs.values().toArray().sort(Song.compareByTitle);
  };

  public query ({ caller }) func getSongsByGenre(genre : Genre) : async [Song] {
    songs.values().filter(func(song) { genre == song.genre }).toArray().sort(Song.compareByTitle);
  };

  public query ({ caller }) func searchByTitle(searchText : Text) : async [Song] {
    let lowerSearch = searchText.toLower();
    songs.values().filter(
      func(song) {
        song.title.toLower().contains(#text (lowerSearch));
      }
    ).toArray().sort(Song.compareByTitle);
  };

  public query ({ caller }) func searchByArtist(searchText : Text) : async [Song] {
    let lowerSearch = searchText.toLower();
    songs.values().filter(
      func(song) {
        song.artist.toLower().contains(#text (lowerSearch));
      }
    ).toArray().sort(Song.compareByTitle);
  };
};
