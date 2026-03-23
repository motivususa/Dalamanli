const AUDIO_BASE = "/myspace/myspace-music-player-extended/audio";
const DEFAULT_ARTWORK =
  "/myspace/myspace-music-player-extended/img/static-skies-demo.jpg";
const ALT_ARTWORK =
  "/myspace/myspace-music-player-extended/img/hcw-album.jpg";

const DISPLAY_OVERRIDES: Record<string, { artist: string; name: string }> = {
  "drake-Bria's Interlude.mp3": {
    artist: "Drake",
    name: "Bria's Interlude",
  },
  "my-chemical-romance_im-not-okay-i-promise.mp3": {
    artist: "My Chemical Romance",
    name: "I'm Not Okay (I Promise)",
  },
};

function parseFilename(file: string): { artist: string; name: string } {
  if (DISPLAY_OVERRIDES[file]) return DISPLAY_OVERRIDES[file];
  const base = file.replace(/\.mp3$/i, "").trim();
  const sep = base.indexOf(" - ");
  if (sep > 0) {
    return {
      artist: base.slice(0, sep).trim(),
      name: base.slice(sep + 3).trim(),
    };
  }
  const dash = base.indexOf("-");
  if (dash > 0 && dash < base.length - 1) {
    const a = base.slice(0, dash).trim();
    const n = base.slice(dash + 1).trim();
    return {
      artist: a.charAt(0).toUpperCase() + a.slice(1).toLowerCase(),
      name: n,
    };
  }
  const name = base
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { artist: "Unknown", name };
}

const AUDIO_FILES = [
  "Avril Lavigne - Sk8er Boi.mp3",
  "B2K - Girlfriend.mp3",
  "Big Bamboos  New Era.mp3",
  "Black Eyed Peas - Imma Be.mp3",
  "Blink 182 - All the Small Things.mp3",
  "Brand New.mp3",
  "Bria's Interlude.mp3",
  "Busta Rhymes - Pass The Courvoisier Part II (Remix).mp3",
  "Cassie - Long Way 2 Go.mp3",
  "Chris Brown - Kiss Kiss Feat. T-Pain.mp3",
  "Ciara - Get Up ft. Chamillionaire.mp3",
  "Coldplay - Viva la Vida.mp3",
  "Decode.mp3",
  "Drake - I'm Still Fly.mp3",
  "Drake - Replacement Girl Feat. Trey Songz.mp3",
  "Drake-Shut It Down.mp3",
  "E-40 - U And Dat (Feat. T. Pain & Kandi Girl).mp3",
  "Fall Out Boy - Sugar, We're Goin Down [Album Version].mp3",
  "Far East Movement - Like A G6 (Feat. The Cataracs, DEV).mp3",
  "Fat Joe - Lean Back (feat. Lil Jon, Eminem, Mase & Remy Martin) (Remix).mp3",
  "Federation - I Wear My Stunna Glasses At Night (Feat. E-40).mp3",
  "Foo Fighters- My Hero.mp3",
  "Green Day - 21 Guns.mp3",
  "Hit My Cat Daddy - Young Sam.mp3",
  "Incubus - Drive.mp3",
  "Jamiroquai - Virtual Insanity.mp3",
  "Kanye West Us Placers Feat Lupe Fiasco And Pharell (Bonus Track).mp3",
  "Lil Jon & The East Side Boyz - Get Low (feat. Ying Yang Twins).mp3",
  "Lil Wayne - Lisa Marie.mp3",
  "Lit - My Own Worst Enemy.mp3",
  "MGMT - Electric Feel.mp3",
  "Miss Me, Kiss Me, Lick Me (Feat. DashxDigital, D Realz & Mic 3rd).mp3",
  "NSYNC - Girlfriend.mp3",
  "Never Let You Go.mp3",
  "New Era - 123.mp3",
  "Nirvana - Come As You Are.mp3",
  "Nirvana - Smells Like Teen Spirit.mp3",
  "Omarion - Entourage.mp3",
  "Omarion - O.mp3",
  "Plain White T's - Hey There Delilah.mp3",
  "Radiohead - Fake Plastic Trees.mp3",
  "Saliva - Superstar.mp3",
  "Semisonic - Closing Time.mp3",
  "Shortie Like Mine.mp3",
  "Stunnaman - Molly Whoppin'.mp3",
  "Swagga Like Us.mp3",
  "System of a Down - Lonely Day.mp3",
  "T-Pain Ft. Lil Wayne Can't Believe It.mp3",
  "T.I. - What You Know.mp3",
  "The Clipse- Mr. Me Too.mp3",
  "The Cool Kids Ft Lil Wayne- Gettin it.mp3",
  "The Pack - Booty Bounce Boppers.mp3",
  "The Ranger$ - Go Hard.mp3",
  "Two Door Cinema Club - What You Know.mp3",
  "YG - Aim Me.mp3",
  "YG - I'm Still Poppin.mp3",
  "YG - She A Model.mp3",
  "drake-Bria's Interlude.mp3",
  "my-chemical-romance_im-not-okay-i-promise.mp3",
];

const enc = (file: string) =>
  `${AUDIO_BASE}/${encodeURIComponent(file)}`;

export const MYSPACE_TRACKS: MediaApi.Song[] = AUDIO_FILES.map(
  (file, i) => {
    const { artist, name } = parseFilename(file);
    return {
      id: `myspace-${i}`,
      name,
      artistName: artist,
      albumName: "MySpace Page Music",
      duration: 0,
      trackNumber: i + 1,
      url: enc(file),
      artwork: { url: i % 2 === 0 ? DEFAULT_ARTWORK : ALT_ARTWORK },
    };
  }
);

export const MYSPACE_PLAYLIST: MediaApi.Playlist = {
  id: "myspace-page-music",
  name: "MySpace Page Music",
  curatorName: "Kaya Dalamanli",
  songs: MYSPACE_TRACKS,
  url: "",
};

/** Group tracks by artist for CoverFlow display */
function buildAlbumsFromTracks(): MediaApi.Album[] {
  const byArtist = new Map<string, MediaApi.Song[]>();
  for (const song of MYSPACE_TRACKS) {
    const key = song.artistName ?? "Unknown";
    const existing = byArtist.get(key) ?? [];
    existing.push(song);
    byArtist.set(key, existing);
  }

  const albums: MediaApi.Album[] = [];
  let idx = 0;
  for (const [artist, songs] of byArtist) {
    albums.push({
      id: `myspace-album-${idx}`,
      name: songs.length === 1 ? songs[0].name : artist,
      artistName: artist,
      url: "",
      artwork: { url: DEFAULT_ARTWORK },
      songs,
    });
    idx++;
  }
  return albums;
}

export const MYSPACE_ALBUMS = buildAlbumsFromTracks();
