"use client";
import { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { Screen } from "@/utils/constants";

const STORAGE_KEY = "ipod-help-seen";
const DISPLAY_MS = 5500;

export const WheelHelpTooltip = () => {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      return;
    }

    setIsMobile(window.matchMedia("(max-width: 576px)").matches);
    setVisible(true);

    const exitTimer = setTimeout(() => setExiting(true), DISPLAY_MS - 400);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    }, DISPLAY_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <Overlay $exiting={exiting}>
      <Card>
        {/* Animated mini wheel demo */}
        <WheelDemo>
          <WheelRing>
            <WheelDot />
          </WheelRing>
          <WheelCenter />
          <ArrowHint>↻</ArrowHint>
        </WheelDemo>

        <Instructions>
          <InstructionRow>
            <Kbd>Spin</Kbd>
            <span>Drag the wheel to scroll up &amp; down</span>
          </InstructionRow>
          <InstructionRow>
            <Kbd>●</Kbd>
            <span>Press the center button to select</span>
          </InstructionRow>
          <InstructionRow>
            <Kbd>MENU</Kbd>
            <span>Go back to the previous screen</span>
          </InstructionRow>
          {isMobile && (
            <InstructionRow>
              <Kbd>Tap</Kbd>
              <span>Tap any menu item to open it</span>
            </InstructionRow>
          )}
        </Instructions>

        <DismissHint>Tap anywhere to dismiss</DismissHint>
      </Card>
    </Overlay>
  );
};

/* ── Animations ── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1); }
`;

const fadeOut = keyframes`
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.97); }
`;

const spinDot = keyframes`
  0%   { transform: rotate(0deg)   translateX(28px); }
  100% { transform: rotate(360deg) translateX(28px); }
`;

const spinArrow = keyframes`
  0%, 60%  { transform: translate(-50%, -50%) rotate(0deg); opacity: 0.7; }
  100%     { transform: translate(-50%, -50%) rotate(360deg); opacity: 0.3; }
`;

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
  50%      { box-shadow: 0 0 0 6px rgba(255,255,255,0); }
`;

/* ── Styled components ── */
const Overlay = styled.div<{ $exiting: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  border-radius: inherit;
  animation: ${({ $exiting }) => ($exiting ? fadeOut : fadeIn)} 0.35s ease forwards;
  cursor: pointer;
`;

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  max-width: 260px;
  pointer-events: none;
`;

/* Mini animated click wheel */
const WheelDemo = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
`;

const WheelRing = styled.div`
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.35);
`;

const WheelDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  transform-origin: center;
  transform: rotate(0deg) translateX(28px);
  margin-top: -5px;
  margin-left: -5px;
  animation: ${spinDot} 1.4s linear infinite;
`;

const WheelCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.4);
  transform: translate(-50%, -50%);
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ArrowHint = styled.span`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
  animation: ${spinArrow} 1.4s linear infinite;
  user-select: none;
`;

const Instructions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const InstructionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  ${Screen.XS.MediaQuery} {
    font-size: 11px;
  }
`;

const Kbd = styled.span`
  flex-shrink: 0;
  min-width: 44px;
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  padding: 3px 6px;
  letter-spacing: 0.5px;
`;

const DismissHint = styled.p`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  margin: 0;
  text-align: center;
`;
