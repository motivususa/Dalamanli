import React, { useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

/* Production (Netlify / GitHub): may be gitignored if over GitHub’s size limit.
   For deploys, point VIDEO at a CDN URL (Cloudinary, R2, etc.) or use Git LFS. */
const VIDEO = `${process.env.PUBLIC_URL || ''}/aquarium-screensaver.mp4`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2147483000;
  background: #000;
  cursor: none;
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    pointer-events: none;
  }
`;

function AquariumScreensaver({ visible, onWake }) {
  const videoRef = useRef(null);

  const handleEnded = useCallback((e) => {
    const el = e.currentTarget;
    el.currentTime = 0;
    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    if (visible) {
      v.loop = true;
      v.src = VIDEO;
      v.currentTime = 0;
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    } else {
      v.pause();
      v.removeAttribute('src');
      v.load();
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.removeAttribute('src');
        v.load();
      }
    };
  }, []);

  if (!visible || typeof document === 'undefined') return null;

  return createPortal(
    <Overlay
      role="presentation"
      aria-hidden={!visible}
      onMouseMove={onWake}
      onMouseDown={onWake}
      onWheel={onWake}
      onTouchStart={onWake}
      onKeyDown={onWake}
      tabIndex={-1}
    >
      <video
        ref={videoRef}
        muted
        playsInline
        loop
        preload="none"
        onEnded={handleEnded}
      />
    </Overlay>,
    document.body,
  );
}

export default AquariumScreensaver;
