import styled from "styled-components";
import CoverFlow from "./CoverFlow";
import { MYSPACE_ALBUMS } from "@/data/myspaceTracks";

const Container = styled.div`
  height: 100%;
  flex: 1;
`;

const CoverFlowView = () => {
  return (
    <Container>
      <CoverFlow albums={MYSPACE_ALBUMS} />
    </Container>
  );
};

export default CoverFlowView;
