import { createContext, useCallback, useEffect, useRef } from "react";

import { IpodEvent } from "@/utils/events";
import { useSettings } from "@/hooks";

const SCROLL_SOUND_URL = "/ipod/sounds/scroll.mp3";
const CLICK_SOUND_URL = "/ipod/sounds/click.mp3";

export const SoundEffectsContext = createContext(null);

interface Props {
  children: React.ReactNode;
}

export const SoundEffectsProvider = ({ children }: Props) => {
  const { soundsMuted } = useSettings();
  const scrollAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const playSound = useCallback(
    (ref: React.MutableRefObject<HTMLAudioElement | null>, url: string, vol: number) => {
      if (soundsMuted) return;
      try {
        if (!ref.current) {
          ref.current = new Audio(url);
        }
        ref.current.volume = vol;
        ref.current.currentTime = 0;
        ref.current.play().catch(() => {});
      } catch {
        // never break navigation
      }
    },
    [soundsMuted]
  );

  const onScroll = useCallback(
    () => playSound(scrollAudioRef, SCROLL_SOUND_URL, 0.35),
    [playSound]
  );

  const onClick = useCallback(
    () => playSound(clickAudioRef, CLICK_SOUND_URL, 0.45),
    [playSound]
  );

  useEffect(() => {
    const scrollEvents: IpodEvent[] = ["forwardscroll", "backwardscroll"];
    const clickEvents: IpodEvent[] = [
      "centerclick",
      "menuclick",
      "forwardclick",
      "backwardclick",
      "playpauseclick",
    ];

    for (const evt of scrollEvents) window.addEventListener(evt, onScroll);
    for (const evt of clickEvents) window.addEventListener(evt, onClick);

    return () => {
      for (const evt of scrollEvents) window.removeEventListener(evt, onScroll);
      for (const evt of clickEvents) window.removeEventListener(evt, onClick);
    };
  }, [onScroll, onClick]);

  return (
    <SoundEffectsContext.Provider value={null}>
      {children}
    </SoundEffectsContext.Provider>
  );
};
