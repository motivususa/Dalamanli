import { KenBurns } from "@/components";
import { motion } from "framer-motion";
import styled from "styled-components";
import { previewSlideRight } from "@/animation";

const ARTWORK_URLS = [
  "/myspace/myspace-music-player-extended/img/static-skies-demo.jpg",
  "/myspace/myspace-music-player-extended/img/hcw-album.jpg",
];

const Container = styled(motion.div)`
  z-index: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

const MusicPreview = () => {
  return (
    <Container {...previewSlideRight}>
      <KenBurns urls={ARTWORK_URLS} />
    </Container>
  );
};

export default MusicPreview;
