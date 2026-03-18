import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const BOOT_VIDEO = `${process.env.PUBLIC_URL || ''}/boot.mp4`;
const STARTUP_SOUND = `${process.env.PUBLIC_URL || ''}/startup.mp3`;

function BootOverlay({ phase, onBootStart, onVideoEnd, onSkip }) {
  const videoRef = useRef(null);
  const endedRef = useRef(false);

  useEffect(() => {
    if (phase === 'playing' && videoRef.current) {
      endedRef.current = false;
      videoRef.current.play().catch(() => onVideoEnd());
    }
  }, [phase, onVideoEnd]);

  function handleVideoEnd() {
    if (endedRef.current) return;
    endedRef.current = true;
    /* Transition straight to desktop; play startup sound in background */
    const audio = new Audio(STARTUP_SOUND);
    audio.play().catch(() => {});
    onVideoEnd();
  }

  if (phase === 'waiting') {
    return (
      <BlackScreen onMouseMove={onBootStart} onClick={onBootStart}>
        <p>Turn on computer</p>
        <p className="hint">Move mouse to turn on</p>
        <SkipBtn onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSkip(); }}>Skip</SkipBtn>
      </BlackScreen>
    );
  }

  if (phase === 'playing') {
    return (
      <Overlay>
        <video
          ref={videoRef}
          src={BOOT_VIDEO}
          playsInline
          loop={false}
          onEnded={handleVideoEnd}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
        <SkipBtn onClick={(e) => { e.preventDefault(); e.stopPropagation(); onSkip(); }}>Skip</SkipBtn>
      </Overlay>
    );
  }

  return null;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BlackScreen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: default;
  p {
    font-family: Tahoma, sans-serif;
    font-size: 14px;
    color: #808080;
    margin: 8px 0;
  }
  .hint {
    font-size: 11px;
    color: #404040;
    margin-top: 24px;
  }
`;

const SkipBtn = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 6px 14px;
  font-family: Tahoma, sans-serif;
  font-size: 11px;
  color: #808080;
  background: transparent;
  border: 1px solid #505050;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  &:hover {
    color: #b0b0b0;
    border-color: #707070;
  }
`;

export default BootOverlay;
