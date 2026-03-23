import { createContext, useCallback, useEffect, useRef } from "react";
import { IpodEvent } from "@/utils/events";
import { useSettings } from "@/hooks";

export const SoundEffectsContext = createContext(null);

const PUBLIC = process.env.NEXT_PUBLIC_BASE_PATH ?? "/ipod";

const SOUND_FORWARD = `${PUBLIC}/sounds/right.wav`;  // scrolling forward (down)
const SOUND_BACKWARD = `${PUBLIC}/sounds/left.wav`;  // scrolling backward (up)
const SOUND_CLICK = `${PUBLIC}/sounds/click.mp3`;    // any button press

interface Props {
  children: React.ReactNode;
}

/** Haptic feedback — short pulse for scroll, double-tap for click */
function vibrate(pattern: number | number[]) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {}
}

/** Play a short audio file. Resets and replays if already playing. */
function makePlayer(url: string, volume = 0.5) {
  let audio: HTMLAudioElement | null = null;

  return function play(muted: boolean) {
    if (muted) return;
    try {
      if (!audio) {
        audio = new Audio(url);
        audio.volume = volume;
      }
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {}
  };
}

export const SoundEffectsProvider = ({ children }: Props) => {
  const { soundsMuted } = useSettings();
  const soundsMutedRef = useRef(soundsMuted);

  // Throttle scroll sounds — min 80ms between ticks
  const lastScrollRef = useRef(0);

  // Pre-build players once so Audio objects are reused (no reload lag)
  const playForward  = useRef(makePlayer(SOUND_FORWARD,  0.6));
  const playBackward = useRef(makePlayer(SOUND_BACKWARD, 0.6));
  const playClick    = useRef(makePlayer(SOUND_CLICK,    0.55));

  useEffect(() => {
    soundsMutedRef.current = soundsMuted;
  }, [soundsMuted]);

  const onForwardScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollRef.current < 80) return;
    lastScrollRef.current = now;
    playForward.current(soundsMutedRef.current);
    vibrate(8);
  }, []);

  const onBackwardScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollRef.current < 80) return;
    lastScrollRef.current = now;
    playBackward.current(soundsMutedRef.current);
    vibrate(8);
  }, []);

  const onButtonClick = useCallback(() => {
    playClick.current(soundsMutedRef.current);
    vibrate([12, 0, 12]);
  }, []);

  useEffect(() => {
    const clickEvents: IpodEvent[] = [
      "centerclick",
      "menuclick",
      "forwardclick",
      "backwardclick",
      "playpauseclick",
    ];

    window.addEventListener("forwardscroll",  onForwardScroll);
    window.addEventListener("backwardscroll", onBackwardScroll);
    for (const evt of clickEvents) window.addEventListener(evt, onButtonClick);

    return () => {
      window.removeEventListener("forwardscroll",  onForwardScroll);
      window.removeEventListener("backwardscroll", onBackwardScroll);
      for (const evt of clickEvents) window.removeEventListener(evt, onButtonClick);
    };
  }, [onForwardScroll, onBackwardScroll, onButtonClick]);

  return (
    <SoundEffectsContext.Provider value={null}>
      {children}
    </SoundEffectsContext.Provider>
  );
};
