import { useCallback, useRef } from "react";
import { useEventListener, useMenuHideView } from "@/hooks";
import { IpodEvent } from "@/utils/events";
import styled from "styled-components";
import { Unit } from "@/utils/constants";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: linear-gradient(180deg, #b1b5c0 0%, #686e7a 100%);
  color: white;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${Unit.MD} ${Unit.MD} ${Unit.XS};
`;

const Title = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 900;
  color: white;
`;

const Body = styled.p`
  margin: 0 ${Unit.MD} ${Unit.SM};
  font-size: 11px;
  font-weight: normal;
  line-height: 1.5;
  text-align: center;
  color: white;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  margin: 0 ${Unit.MD} ${Unit.SM};
`;

const Note = styled.p`
  margin: 0 ${Unit.MD} ${Unit.MD};
  font-size: 10px;
  font-weight: normal;
  line-height: 1.4;
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
`;

const AboutView = () => {
  useMenuHideView("about");
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScrollDown = useCallback(() => {
    containerRef.current?.scrollBy({ top: 40, behavior: "smooth" });
  }, []);

  const handleScrollUp = useCallback(() => {
    containerRef.current?.scrollBy({ top: -40, behavior: "smooth" });
  }, []);

  useEventListener<IpodEvent>("forwardscroll", handleScrollDown);
  useEventListener<IpodEvent>("backwardscroll", handleScrollUp);

  return (
    <Container ref={containerRef}>
      <TitleContainer>
        <Title>Kaya&apos;s iPod Classic</Title>
      </TitleContainer>

      <Body>
        Welcome. This is my corner of the internet — or at least what it sort
        of looked like back then. Browse my links, listen to the music that
        used to play on my MySpace page, play a game, and just vibe out like
        the good ol&apos; days.
      </Body>

      <Divider />

      <Body>
        Or, if you&apos;re feeling nostalgic, step inside{" "}
        <strong>Kaya&apos;s Computer</strong> — a full Windows XP desktop
        experience right in your browser. Explore apps, music, and more,
        exactly like it was in the early 2000s.
      </Body>

      <Note>
        ⚠️ Kaya&apos;s Computer is best experienced on a laptop or desktop.
        The user experience on a phone or tablet won&apos;t be as good —
        precise mouse control and a larger screen are recommended.
      </Note>
    </Container>
  );
};

export default AboutView;
