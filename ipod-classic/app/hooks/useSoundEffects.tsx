import { createContext, useCallback, useEffect, useRef } from "react";
import { IpodEvent } from "@/utils/events";
import { useSettings } from "@/hooks";

export const SoundEffectsContext = createContext(null);

interface Props {
  children: React.ReactNode;
}

/** Synthesized click-wheel tick — no file needed, zero latency */
function playClickWheelTick(volume = 0.3) {
  try {
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.03);

    // Auto-close context after sound finishes to avoid memory leaks
    setTimeout(() => ctx.close().catch(() => {}), 200);
  } catch {
    // Never break navigation
  }
}

/** Synthesized button click — slightly lower pitch than scroll tick */
function playButtonClick(volume = 0.35) {
  try {
    const ctx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.04);

    setTimeout(() => ctx.close().catch(() => {}), 200);
  } catch {}
}

/** Haptic feedback — light for scroll, medium for click */
function vibrate(pattern: number | number[]) {
  try {
    if (navigator.vibrate) navigator.vibrate(pattern);
  } catch {}
}

export const SoundEffectsProvider = ({ children }: Props) => {
  const { soundsMuted } = useSettings();
  const soundsMutedRef = useRef(soundsMuted);

  // Keep ref in sync so event listeners don't stale-close over old value
  useEffect(() => {
    soundsMutedRef.current = soundsMuted;
  }, [soundsMuted]);

  const onScroll = useCallback(() => {
    if (!soundsMutedRef.current) playClickWheelTick(0.3);
    vibrate(8); // very short, light pulse
  }, []);

  const onClick = useCallback(() => {
    if (!soundsMutedRef.current) playButtonClick(0.38);
    vibrate([12, 0, 12]); // double-tap feel
  }, []);

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
      for (const evt of scrollEvents)
        window.removeEventListener(evt, onScroll);
      for (const evt of clickEvents) window.removeEventListener(evt, onClick);
    };
  }, [onScroll, onClick]);

  return (
    <SoundEffectsContext.Provider value={null}>
      {children}
    </SoundEffectsContext.Provider>
  );
};
