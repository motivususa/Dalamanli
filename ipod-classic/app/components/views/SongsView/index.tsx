import { useMemo } from "react";

import SelectableList, {
  SelectableListOption,
} from "@/components/SelectableList";
import { useAudioPlayer, useMenuHideView, useScrollHandler } from "@/hooks";
import * as Utils from "@/utils";
import { MYSPACE_TRACKS } from "@/data/myspaceTracks";

interface Props {
  songs: MediaApi.Song[];
}

const SongsView = ({ songs: songsProp }: Props) => {
  // Fall back to all tracks when called from Music > Songs (empty array)
  const songs = songsProp.length > 0 ? songsProp : MYSPACE_TRACKS;
  useMenuHideView("songs");

  const { nowPlayingItem } = useAudioPlayer();

  const options: SelectableListOption[] = useMemo(
    () =>
      songs.map((song, index) => ({
        type: "song" as const,
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

  // Initialize scroll position at the currently playing song so the
  // user lands on it when returning to the list
  const selectedOption = useMemo(() => {
    if (!nowPlayingItem) return undefined;
    return options.find((opt) => {
      if (opt.type !== "song") return false;
      const songId = Utils.getSongIdFromQueueOptions(
        opt.queueOptions,
        opt.queueOptions.startPosition
      );
      return songId === nowPlayingItem.id;
    });
  }, [nowPlayingItem, options]);

  const [scrollIndex, handleItemTap] = useScrollHandler(
    "songs",
    options,
    selectedOption
  );

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
