import { useMemo } from "react";
import SelectableList, { SelectableListOption } from "@/components/SelectableList";
import { useMenuHideView, useScrollHandler } from "@/hooks";
import { MYSPACE_GENRES } from "@/data/myspaceTracks";

const GenresView = () => {
  useMenuHideView("genres");

  const options: SelectableListOption[] = useMemo(
    () =>
      MYSPACE_GENRES.map((genre) => ({
        type: "view" as const,
        label: genre.name,
        sublabel: `${genre.songs.length} songs`,
        viewId: "songs" as const,
        headerTitle: genre.name,
        props: { songs: genre.songs },
      })),
    []
  );

  const [scrollIndex, handleItemTap] = useScrollHandler("genres", options);

  return (
    <SelectableList
      options={options}
      activeIndex={scrollIndex}
      onItemTap={handleItemTap}
      emptyMessage="No genres"
    />
  );
};

export default GenresView;
