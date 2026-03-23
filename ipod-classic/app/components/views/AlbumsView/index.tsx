import { useMemo } from "react";
import SelectableList, { SelectableListOption } from "@/components/SelectableList";
import { useMenuHideView, useScrollHandler } from "@/hooks";
import * as Utils from "@/utils";
import { MYSPACE_ALBUMS } from "@/data/myspaceTracks";

interface Props {
  albums?: MediaApi.Album[];
  inLibrary?: boolean;
}

const AlbumsView = ({ albums }: Props) => {
  useMenuHideView("albums");

  const data = albums ?? MYSPACE_ALBUMS;

  const options: SelectableListOption[] = useMemo(
    () =>
      data.map((album): SelectableListOption => ({
        type: "view",
        label: album.name,
        sublabel: album.artistName,
        imageUrl: Utils.getArtwork(100, album.artwork?.url),
        viewId: "songs",
        headerTitle: album.name,
        props: { songs: album.songs ?? [] },
      })),
    [data]
  );

  const [scrollIndex, handleItemTap] = useScrollHandler("albums", options);

  return (
    <SelectableList
      options={options}
      activeIndex={scrollIndex}
      emptyMessage="No albums"
      onItemTap={handleItemTap}
    />
  );
};

export default AlbumsView;
