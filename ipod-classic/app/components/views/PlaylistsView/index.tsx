import { useMemo } from "react";
import SelectableList, { SelectableListOption } from "@/components/SelectableList";
import { useMenuHideView, useScrollHandler } from "@/hooks";
import * as Utils from "@/utils";
import { MYSPACE_PLAYLIST } from "@/data/myspaceTracks";

interface Props {
  playlists?: MediaApi.Playlist[];
  inLibrary?: boolean;
}

const PlaylistsView = ({ playlists }: Props) => {
  useMenuHideView("playlists");

  const options: SelectableListOption[] = useMemo(
    () => {
      const data = playlists ?? [MYSPACE_PLAYLIST];
      return data.map((playlist): SelectableListOption => ({
        type: "view",
        label: playlist.name === "MySpace Page Music" ? "MySpace Page" : playlist.name,
        sublabel: `${playlist.songs?.length ?? 0} songs`,
        imageUrl: Utils.getArtwork(100, playlist.artwork?.url),
        viewId: "songs",
        headerTitle: playlist.name === "MySpace Page Music" ? "MySpace Page" : playlist.name,
        props: { songs: playlist.songs ?? [] },
      }));
    },
    [playlists]
  );

  const [scrollIndex, handleItemTap] = useScrollHandler("playlists", options);

  return (
    <SelectableList
      options={options}
      activeIndex={scrollIndex}
      emptyMessage="No playlists"
      onItemTap={handleItemTap}
    />
  );
};

export default PlaylistsView;
