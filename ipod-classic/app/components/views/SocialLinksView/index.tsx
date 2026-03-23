import { useCallback, useEffect, useRef, useState } from "react";

import { useEventListener, useMenuHideView, useViewContext } from "@/hooks";
import styled from "styled-components";
import { AnimatePresence, motion } from "framer-motion";
import { IpodEvent } from "@/utils/events";
import { fade } from "@/animation";
import { APP_URL } from "@/utils/constants/api";

type SocialLink = {
  label: string;
  url: string;
  icon: string;
};

const LOGOS = `${APP_URL}/social-logos`;

const SOCIAL_LINKS: SocialLink[] = [
  { label: "Contact Me", url: "mailto:hello@dalamanli.com", icon: `${LOGOS}/email-logo.png` },
  { label: "Instagram", url: "https://instagram.com/kayadalamanli/", icon: `${LOGOS}/instagram-logo.png` },
  { label: "TikTok", url: "https://tiktok.com/@kayadalamanli", icon: `${LOGOS}/tiktok-logo.svg` },
  { label: "Twitter / X", url: "https://twitter.com/kayadalamanli", icon: `${LOGOS}/twitter-logo.png` },
  { label: "YouTube", url: "https://youtube.com/@kayadalamanli", icon: `${LOGOS}/youtube-logo.svg` },
  { label: "Twitch", url: "https://www.twitch.tv/kayafoo", icon: `${LOGOS}/twitch-logo.svg` },
  { label: "Apple Music", url: "https://music.apple.com/profile/kayadalamanli", icon: `${LOGOS}/itunes-logo.jpg` },
  { label: "Discord", url: "https://discord.gg/UKBQRp73gK", icon: `${LOGOS}/discord-logo.svg` },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/kayawesley/", icon: `${LOGOS}/linked-in-logo.png` },
  { label: "Letterboxd", url: "https://boxd.it/5mNsX", icon: `${LOGOS}/letterboxd-logo.svg` },
  { label: "Opaius", url: "https://opaius.com", icon: `${LOGOS}/loop-logo.png` },
  { label: "Trendsetters", url: "https://trendsetters.me", icon: `${LOGOS}/trendsetters-logo.png` },
  { label: "Captain Cypher", url: "https://a.co/d/4UPegIl", icon: `${LOGOS}/cypher-cover.jpg` },
  { label: "Captain Cypher (B&N)", url: "https://www.barnesandnoble.com/w/captain-cypher-kaya-wesley/1143934342", icon: `${LOGOS}/cypher-cover.jpg` },
];

const getOffsetPx = (offset: number, midpoint: number) => {
  if (offset === 0) return 0;
  const val = midpoint - 55 + offset * 50;
  return val + (offset < 0 ? -50 : 26);
};

const displayUrl = (url: string) => {
  if (url.startsWith("mailto:")) {
    return url.slice("mailto:".length);
  }
  return url.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
};

const SocialLinksView = () => {
  useMenuHideView("socialLinks");
  const { setHeaderTitle } = useViewContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [midpointX, setMidpointX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeaderTitle("Social Links");
  }, [setHeaderTitle]);

  const updateMidpoint = useCallback(() => {
    if (containerRef.current) {
      setMidpointX(containerRef.current.getBoundingClientRect().width / 2);
    }
  }, []);

  useEffect(updateMidpoint, [updateMidpoint]);

  const handleForwardScroll = useCallback(() => {
    setActiveIndex((prev) =>
      prev < SOCIAL_LINKS.length - 1 ? prev + 1 : prev
    );
  }, []);

  const handleBackwardScroll = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleSelect = useCallback(() => {
    const link = SOCIAL_LINKS[activeIndex];
    if (!link) return;
    if (link.url.startsWith("mailto:")) {
      window.location.href = link.url;
      return;
    }
    window.open(link.url, "_top");
  }, [activeIndex]);

  useEventListener<IpodEvent>("forwardscroll", handleForwardScroll);
  useEventListener<IpodEvent>("backwardscroll", handleBackwardScroll);
  useEventListener<IpodEvent>("centerclick", handleSelect);

  return (
    <Root>
      <CardsContainer ref={containerRef}>
        {SOCIAL_LINKS.map((link, index) => {
          const offset = index - activeIndex;
          const isActive = index === activeIndex;
          const isVisible = Math.abs(offset) < 10;

          if (!isVisible) return null;

          return (
            <Card
              key={link.label}
              $isActive={isActive}
              $offset={getOffsetPx(offset, midpointX)}
              $index={index}
              $activeIndex={activeIndex}
              $midpointX={midpointX}
            >
              <CardIcon src={link.icon} alt={link.label} draggable={false} />
            </Card>
          );
        })}
      </CardsContainer>

      <AnimatePresence>
        {SOCIAL_LINKS.length > 0 && (
          <InfoBar {...fade}>
            <InfoLabel>{SOCIAL_LINKS[activeIndex]?.label}</InfoLabel>
            <InfoUrl>
              {SOCIAL_LINKS[activeIndex] &&
                displayUrl(SOCIAL_LINKS[activeIndex].url)}
            </InfoUrl>
          </InfoBar>
        )}
      </AnimatePresence>
    </Root>
  );
};

const Root = styled.div`
  height: 100%;
  position: relative;
  background: linear-gradient(180deg, #e8e8e8 0%, #d0d0d0 100%);
  overflow: hidden;
`;

const CardsContainer = styled.div`
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  height: calc(100% - 56px);
  perspective: 500px;
  overflow: hidden;
`;

interface CardProps {
  $isActive: boolean;
  $offset: number;
  $index: number;
  $activeIndex: number;
  $midpointX: number;
}

const Card = styled.div<CardProps>`
  z-index: ${(p) => 100 - Math.abs(p.$index - p.$activeIndex)};
  position: absolute;
  top: 50%;
  margin-top: -56px;
  height: 7em;
  width: 7em;
  transition: transform 0.25s ease, opacity 0.35s ease;
  transform-style: preserve-3d;
  -webkit-box-reflect: below 2px -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(transparent),
    color-stop(70%, transparent),
    to(rgba(240, 240, 240, 0.25))
  );

  ${(p) =>
    p.$isActive
      ? `
    transition: transform 0.3s ease, opacity 0.35s ease;
    transform: translate3d(${p.$midpointX - 56}px, 0, 20px);
  `
      : `
    transform: translateX(${p.$offset}px) scale(1.1) translateZ(-65px)
      rotateY(${p.$index < p.$activeIndex ? "70deg" : "-70deg"});
  `}
`;

const CardIcon = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.25));
  pointer-events: none;
`;

const InfoBar = styled(motion.div)`
  position: absolute;
  inset: auto 0 0;
  z-index: 200;
  padding: 8px 0 14px;
  text-align: center;
  background: linear-gradient(
    180deg,
    rgba(224, 224, 224, 0) 0%,
    rgba(208, 208, 208, 0.95) 30%
  );
`;

const InfoLabel = styled.h3`
  margin: 0;
  padding: 0 16px;
  font-size: 15px;
  font-weight: 600;
`;

const InfoUrl = styled.p`
  margin: 2px 0 0;
  padding: 0 16px;
  font-size: 11px;
  color: #666;
`;

export default SocialLinksView;
