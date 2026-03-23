import { useMemo } from "react";

import SelectableList, {
  SelectableListOption,
} from "@/components/SelectableList";
import { getConditionalOption } from "@/components/SelectableList";
import { SplitScreenPreview } from "@/components/previews";
import {
  useAudioPlayer,
  useMenuHideView,
  useScrollHandler,
} from "@/hooks";
import { MYSPACE_TRACKS } from "@/data/myspaceTracks";

const MusicView = () => {
  const { nowPlayingItem } = useAudioPlayer();
  useMenuHideView("music");

  const options: SelectableListOption[] = useMemo(
    () => [
      {
        type: "view",
        label: "MySpace Page Music",
        viewId: "songs",
        props: { songs: MYSPACE_TRACKS },
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

  return <SelectableList options={options} activeIndex={scrollIndex} onItemTap={handleItemTap} />;
};

export default MusicView;
