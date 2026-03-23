import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Screen } from "@/utils/constants";

const STORAGE_KEY = "ipod-help-seen";
const DISPLAY_MS = 4000;

export const WheelHelpTooltip = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      return;
    }

    setIsMobile(window.matchMedia("(max-width: 576px)").matches);
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }, DISPLAY_MS);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Tooltip>
      {isMobile
        ? "Swipe the wheel to scroll · Tap SELECT to choose · MENU to go back"
        : "Drag the wheel to scroll · Press SELECT to choose · MENU to go back"}
    </Tooltip>
  );
};

const fadeInOut = keyframes`
  0% { opacity: 0; transform: translateY(6px); }
  12% { opacity: 1; transform: translateY(0); }
  80% { opacity: 1; transform: translateY(0); }
  100% { opacity: 0; transform: translateY(-4px); }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: -2.4rem;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 11px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 6px 14px;
  border-radius: 6px;
  pointer-events: none;
  animation: ${fadeInOut} ${DISPLAY_MS}ms ease forwards;
  z-index: 10;

  ${Screen.XS.MediaQuery} {
    font-size: 10px;
    white-space: normal;
    text-align: center;
    max-width: 80vw;
  }
`;
