import NowPlaying from "@/components/NowPlaying";
import { useViewContext } from "@/hooks";

const NowPlayingView = () => {
  const { hideView } = useViewContext();

  return <NowPlaying onHide={hideView} />;
};

export default NowPlayingView;
