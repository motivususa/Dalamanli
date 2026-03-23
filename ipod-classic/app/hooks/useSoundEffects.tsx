import { createContext, useCallback, useEffect, useRef } from "react";
import { IpodEvent } from "@/utils/events";
import { useSettings } from "@/hooks";

export const SoundEffectsContext = createContext(null);

const PUBLIC = process.env.NEXT_PUBLIC_BASE_PATH ?? "/ipod";

const SOUND_FORWARD  = `${PUBLIC}/sounds/right.wav`;
const SOUND_BACKWARD = `${PUBLIC}/sounds/left.wav`;
const SOUND_CLICK    = `${PUBLIC}/sounds/click.mp3`;

interface Props {
  children: React.ReactNode;
}

/** Haptic feedback — kept for Android Chrome support */
function vibrate(pattern: number | number[]) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch {}
}

export const SoundEffectsProvider = ({ children }: Props) => {
  const { soundsMuted } = useSettings();
  const soundsMutedRef = useRef(soundsMuted);
  const lastScrollRef  = useRef(0);

  // Pre-create Audio elements once — reuse by resetting currentTime
  const audioForward  = useRef<HTMLAudioElement | null>(null);
  const audioBackward = useRef<HTMLAudioElement | null>(null);
  const audioClick    = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    soundsMutedRef.current = soundsMuted;
  }, [soundsMuted]);

  // Initialise audio elements on mount (not inside gesture handlers)
  useEffect(() => {
    audioForward.current  = new Audio(SOUND_FORWARD);
    audioBackward.current = new Audio(SOUND_BACKWARD);
    audioClick.current    = new Audio(SOUND_CLICK);

    audioForward.current.volume  = 0.6;
    audioBackward.current.volume = 0.6;
    audioClick.current.volume    = 0.75;

    // Pre-load so Safari doesn't lazy-fetch on first play
    audioForward.current.load();
    audioBackward.current.load();
    audioClick.current.load();
  }, []);

  const playAudio = useCallback((audio: HTMLAudioElement | null) => {
    if (!audio || soundsMutedRef.current) return;
    try {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {}
  }, []);

  const onForwardScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollRef.current < 80) return;
    lastScrollRef.current = now;
    playAudio(audioForward.current);
    vibrate(8);
  }, [playAudio]);

  const onBackwardScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollRef.current < 80) return;
    lastScrollRef.current = now;
    playAudio(audioBackward.current);
    vibrate(8);
  }, [playAudio]);

  const onButtonClick = useCallback(() => {
    playAudio(audioClick.current);
    vibrate([12, 0, 12]);
  }, [playAudio]);

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
      for (const evt of clickEvents)
        window.removeEventListener(evt, onButtonClick);
    };
  }, [onForwardScroll, onBackwardScroll, onButtonClick]);

  return (
    <SoundEffectsContext.Provider value={null}>
      {children}
    </SoundEffectsContext.Provider>
  );
};
