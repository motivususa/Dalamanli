import React, { useRef, useCallback, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const PUBLIC = process.env.PUBLIC_URL || '';
const BOOT_VIDEO = `${PUBLIC}/boot.mp4`;
const STARTUP_AUDIO = `${PUBLIC}/startup.mp3`;

const STORAGE_KEY = 'winxp-boot-complete';

export function hasBootCompleted() {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function markBootComplete() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1');
  } catch {
    /* ignore */
  }
}

function BootIntro({ onEnter }) {
  const videoRef = useRef(null);
  const startupAudioRef = useRef(null);
  const [started, setStarted] = useState(false);

  /** Unlock HTMLAudio for later play() from video `onEnded` (no user gesture in that stack). */
  const primeStartupAudio = useCallback(() => {
    let a = startupAudioRef.current;
    if (!a) {
      a = new Audio(STARTUP_AUDIO);
      startupAudioRef.current = a;
    }
    a.muted = true;
    a.play()
      .then(() => {
        a.pause();
        a.currentTime = 0;
        a.muted = false;
      })
      .catch(() => {
        a.muted = false;
      });
  }, []);

  const finishBoot = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.removeAttribute('src');
      v.load();
    }

    const a = startupAudioRef.current ?? new Audio(STARTUP_AUDIO);
    startupAudioRef.current = a;
    a.muted = false;
    a.volume = 1;
    a.currentTime = 0;
    void a.play().catch(() => {});

    markBootComplete();
    onEnter();
  }, [onEnter]);

  const handleStart = useCallback(() => {
    if (started) return;
    setStarted(true);
    primeStartupAudio();
    const v = videoRef.current;
    if (!v) return;
    v.src = BOOT_VIDEO;
    v.load();
    v.play().catch(() => {
      v.muted = true;
      v.play().catch(() => {});
    });
  }, [started, primeStartupAudio]);

  const handleSkip = useCallback(() => {
    finishBoot();
  }, [finishBoot]);

  return (
    <Shell>
      <VideoWrap onClick={handleStart}>
        <video
          ref={videoRef}
          playsInline
          preload="none"
          onEnded={finishBoot}
        />
        <Scanline />
        {!started && <StartPrompt>Click anywhere to boot</StartPrompt>}
      </VideoWrap>
      <SkipBtn type="button" onClick={handleSkip}>
        Skip Intro
      </SkipBtn>
    </Shell>
  );
}

const flicker = keyframes`
  0% { opacity: 0.03; }
  50% { opacity: 0.06; }
  100% { opacity: 0.03; }
`;

const Shell = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2147483646;
  background: #000;
  font-family: Tahoma, 'MS Sans Serif', sans-serif;
`;

const VideoWrap = styled.div`
  position: absolute;
  inset: 0;
  background: #0a0a0c;
  cursor: pointer;
  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
`;

const StartPrompt = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 14px;
  pointer-events: none;
`;

const Scanline = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.12) 2px,
    rgba(0, 0, 0, 0.12) 4px
  );
  animation: ${flicker} 4s ease-in-out infinite;
`;

const SkipBtn = styled.button`
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 2;
  font-family: inherit;
  font-size: 11px;
  padding: 6px 10px;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
  &:hover {
    color: #fff;
    background: rgba(0, 0, 0, 0.72);
  }
`;

export default BootIntro;
