import { useMemo } from "react";
import SelectableList, { SelectableListOption } from "@/components/SelectableList";
import { getConditionalOption } from "@/components/SelectableList";
import { SplitScreenPreview } from "@/components/previews";
import { useAudioPlayer, useMenuHideView, useScrollHandler } from "@/hooks";

const MusicView = () => {
  const { nowPlayingItem } = useAudioPlayer();
  useMenuHideView("music");

  const options: SelectableListOption[] = useMemo(
    () => [
      {
        type: "view",
        label: "Playlists",
        viewId: "playlists",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Artists",
        viewId: "artists",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Albums",
        viewId: "albums",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Songs",
        viewId: "songs",
        props: { songs: [] }, // SongsView will use all tracks when empty
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Genres",
        viewId: "genres",
        preview: SplitScreenPreview.Music,
      },
      {
        type: "view",
        label: "Search",
        viewId: "search",
        preview: SplitScreenPreview.Music,
      },
      ...getConditionalOption(!!nowPlayingItem, {
        type: "view",
        label: "Now Playing",
        viewId: "nowPlaying",
        preview: SplitScreenPreview.NowPlaying,
      }),
    ],
    [nowPlayingItem]
  );

  const [scrollIndex, handleItemTap] = useScrollHandler("music", options);

  return (
    <SelectableList
      options={options}
      activeIndex={scrollIndex}
      onItemTap={handleItemTap}
    />
  );
};

export default MusicView;
