import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const SHUTDOWN_VIDEO = `${process.env.PUBLIC_URL || ''}/shutdown.mp4`;

function ShutdownOverlay({ phase, onVideoEnd, onWake }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (phase === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {
        // If autoplay fails (e.g. no video file), go straight to black
        onVideoEnd();
      });
    }
  }, [phase, onVideoEnd]);

  if (phase === 'video') {
    return (
      <Overlay>
        <video
          ref={videoRef}
          src={SHUTDOWN_VIDEO}
          playsInline
          onEnded={onVideoEnd}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Overlay>
    );
  }

  if (phase === 'black') {
    return (
      <BlackScreen onMouseMove={onWake} onClick={onWake}>
        <p>It's now safe to turn off your computer.</p>
        <p className="hint">Move mouse to turn on</p>
      </BlackScreen>
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

export default ShutdownOverlay;
