import { useCallback, useMemo } from "react";

import SelectableList, {
  SelectableListOption,
} from "@/components/SelectableList";
import { useEventListener, useScrollHandler, useViewContext } from "@/hooks";
import styled from "styled-components";

import { IpodEvent } from "@/utils/events";

const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  inset: -28% -50% -38%;
  border: 1px solid #d3d3d3;
  background: white;
  transform: rotateY(180deg);
`;

const InfoContainer = styled.div`
  flex-shrink: 0;
  padding: 4px 8px;
  background: linear-gradient(to bottom, #6585ad, #789ab3);
  border-bottom: 1px solid #6d87a3;
  min-width: 0;
`;

const Text = styled.h3`
  margin: 0;
  font-size: 16px;
  color: white;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
`;

const Subtext = styled(Text)`
  font-size: 14px;
  -webkit-line-clamp: 1;
`;

const ListContainer = styled.div`
  flex: 1;
  overflow: auto;
`;

interface Props {
  album: MediaApi.Album;
  setPlayingAlbum: (val: boolean) => void;
}

const BacksideContent = ({ album, setPlayingAlbum }: Props) => {
  const { setHeaderTitle } = useViewContext();

  const options: SelectableListOption[] = useMemo(
    () =>
      album.songs.map((song, index) => ({
        type: "song",
        label: song.name,
        queueOptions: {
          album,
          startPosition: index,
        },
      })) ?? [],
    [album]
  );

  const [scrollIndex, handleItemTap] = useScrollHandler("coverFlow", options);

  const handleSelect = useCallback(() => {
    setPlayingAlbum(true);
    setHeaderTitle("Now Playing");
  }, [setHeaderTitle, setPlayingAlbum]);

  useEventListener<IpodEvent>("centerclick", handleSelect);

  return (
    <Container>
      <InfoContainer>
        <Text>{album.name}</Text>
        <Subtext>{album.artistName}</Subtext>
      </InfoContainer>
      <ListContainer>
        <SelectableList activeIndex={scrollIndex} options={options} onItemTap={handleItemTap} />
      </ListContainer>
    </Container>
  );
};

export default BacksideContent;
