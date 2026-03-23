import { useMemo, useState } from "react";
import SelectableList, { SelectableListOption } from "@/components/SelectableList";
import { useMenuHideView, useScrollHandler } from "@/hooks";
import { MYSPACE_TRACKS, MYSPACE_ALBUMS, MYSPACE_ARTISTS } from "@/data/myspaceTracks";
import { APP_URL } from "@/utils/constants/api";

const SearchView = () => {
  useMenuHideView("search");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { songs: [], albums: [], artists: [] };

    const songs = MYSPACE_TRACKS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.artistName ?? "").toLowerCase().includes(q)
    );

    const albums = MYSPACE_ALBUMS.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        (a.artistName ?? "").toLowerCase().includes(q)
    );

    const artists = MYSPACE_ARTISTS.filter((a) =>
      a.name.toLowerCase().includes(q)
    );

    return { songs, albums, artists };
  }, [query]);

  const options: SelectableListOption[] = useMemo(() => {
    const arr: SelectableListOption[] = [
      {
        type: "action",
        label: "Search",
        sublabel: query ? `Results for: "${query}"` : "Type to search songs, artists, albums",
        imageUrl: `${APP_URL}/search_icon.svg`,
        onSelect: () => {
          const term = window.prompt("Search MySpace music:");
          if (term !== null) setQuery(term);
        },
      },
    ];

    if (results.artists.length > 0) {
      arr.push({
        type: "view",
        label: "Artists",
        viewId: "artists",
        sublabel: `${results.artists.length} found`,
        props: { artists: results.artists },
      });
    }

    if (results.albums.length > 0) {
      arr.push({
        type: "view",
        label: "Albums",
        viewId: "albums",
        sublabel: `${results.albums.length} found`,
        props: { albums: results.albums },
      });
    }

    if (results.songs.length > 0) {
      arr.push({
        type: "view",
        label: "Songs",
        viewId: "songs",
        sublabel: `${results.songs.length} found`,
        props: { songs: results.songs },
      });
    }

    return arr;
  }, [query, results]);

  const [scrollIndex, handleItemTap] = useScrollHandler("search", options);

  return (
    <SelectableList
      options={options}
      activeIndex={scrollIndex}
      onItemTap={handleItemTap}
      emptyMessage="No results"
    />
  );
};

export default SearchView;
