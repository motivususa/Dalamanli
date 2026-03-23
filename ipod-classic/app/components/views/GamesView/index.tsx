import SelectableList, {
  SelectableListOption,
} from "@/components/SelectableList";
import { SplitScreenPreview } from "@/components/previews";
import { useMenuHideView, useScrollHandler } from "@/hooks";

const GamesView = () => {
  useMenuHideView("games");
  const options: SelectableListOption[] = [
    {
      type: "view",
      label: "Brick",
      viewId: "brickGame",
      preview: SplitScreenPreview.Games,
    },
  ];

  const [scrollIndex, handleItemTap] = useScrollHandler("games", options);

  return <SelectableList options={options} activeIndex={scrollIndex} onItemTap={handleItemTap} />;
};

export default GamesView;
