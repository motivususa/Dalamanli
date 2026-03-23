import { useMemo } from "react";
import SelectableList, { SelectableListOption } from "@/components/SelectableList";
import { useMenuHideView, useScrollHandler } from "@/hooks";
import * as Utils from "@/utils";
import { MYSPACE_ALBUMS, MYSPACE_ARTISTS } from "@/data/myspaceTracks";

interface Props {
  artists?: MediaApi.Artist[];
  inLibrary?: boolean;
  showImages?: boolean;
}

const ArtistsView = ({ artists, showImages = false }: Props) => {
  useMenuHideView("artists");

  // Use passed artists or fall back to local MySpace artists
  const data = artists ?? MYSPACE_ARTISTS;

  const options: SelectableListOption[] = useMemo(
    () =>
      data.map((artist): SelectableListOption => {
        // Find albums by this artist from local data
        const artistAlbums = MYSPACE_ALBUMS.filter(
          (a) => a.artistName === artist.name
        );
        return {
          type: "view",
          headerTitle: artist.name,
          label: artist.name,
          sublabel: `${artistAlbums.reduce((sum, a) => sum + (a.songs?.length ?? 0), 0)} songs`,
          imageUrl: showImages
            ? (Utils.getArtwork(50, artist.artwork?.url) ?? "")
            : "",
          viewId: "albums",
          props: { albums: artistAlbums, inLibrary: false },
        };
      }),
    [data, showImages]
  );

  const [scrollIndex, handleItemTap] = useScrollHandler("artists", options);

  return (
    <SelectableList
      options={options}
      activeIndex={scrollIndex}
      emptyMessage="No artists"
      onItemTap={handleItemTap}
    />
  );
};

export default ArtistsView;
