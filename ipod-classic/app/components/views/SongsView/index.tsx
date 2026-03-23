import { useMemo } from "react";

import SelectableList, {
  SelectableListOption,
} from "@/components/SelectableList";
import { useMenuHideView, useScrollHandler } from "@/hooks";
import * as Utils from "@/utils";

interface Props {
  songs: MediaApi.Song[];
}

const SongsView = ({ songs }: Props) => {
  useMenuHideView("songs");

  const options: SelectableListOption[] = useMemo(
    () =>
      songs.map((song, index) => ({
        type: "song",
        label: song.name,
        sublabel: `${song.artistName} • ${song.albumName}`,
        queueOptions: {
          songs,
          startPosition: index,
        },
        imageUrl: Utils.getArtwork(50, song.artwork?.url),
        showNowPlayingView: true,
        longPressOptions: Utils.getMediaOptions("song", song.id),
      })) ?? [],
    [songs]
  );

  const [scrollIndex, handleItemTap] = useScrollHandler("songs", options);

  return (
    <SelectableList
      options={options}
      activeIndex={scrollIndex}
      emptyMessage="No songs to show"
      onItemTap={handleItemTap}
    />
  );
};

export default SongsView;
