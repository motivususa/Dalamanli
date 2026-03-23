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

/** Haptic feedback */
function vibrate(pattern: number | number[]) {
  try { if (navigator.vibrate) navigator.vibrate(pattern); } catch {}
}

/**
 * Pre-decode an audio file into an AudioBuffer so it can be played
 * with zero latency via Web Audio API.
 */
async function loadBuffer(
  ctx: AudioContext,
  url: string
): Promise<AudioBuffer | null> {
  try {
    const res = await fetch(url);
    const raw = await res.arrayBuffer();
    return await ctx.decodeAudioData(raw);
  } catch {
    return null;
  }
}

/**
 * Play a pre-decoded AudioBuffer immediately.
 * Creates a new BufferSource each time (required by Web Audio spec).
 */
function playBuffer(
  ctx: AudioContext,
  buf: AudioBuffer | null,
  volume = 1.0
) {
  if (!buf) return;
  try {
    const gain = ctx.createGain();
    gain.gain.value = volume;
    gain.connect(ctx.destination);

    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(gain);
    src.start(0);
  } catch {}
}

export const SoundEffectsProvider = ({ children }: Props) => {
  const { soundsMuted } = useSettings();
  const soundsMutedRef  = useRef(soundsMuted);
  const lastScrollRef   = useRef(0);

  // Single shared AudioContext — created lazily on first gesture
  const audioCtxRef     = useRef<AudioContext | null>(null);
  const bufForwardRef   = useRef<AudioBuffer | null>(null);
  const bufBackwardRef  = useRef<AudioBuffer | null>(null);
  const bufClickRef     = useRef<AudioBuffer | null>(null);
  const loadedRef       = useRef(false);

  useEffect(() => {
    soundsMutedRef.current = soundsMuted;
  }, [soundsMuted]);

  /**
   * Create the AudioContext and decode all files on the first user gesture.
   * Safari requires AudioContext to be created inside a user-gesture handler.
   */
  const ensureLoaded = useCallback(async () => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    try {
      const AudioCtx =
        window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Resume if suspended (Safari sometimes starts suspended)
      if (ctx.state === "suspended") await ctx.resume();

      // Decode all three files in parallel
      const [fwd, bwd, clk] = await Promise.all([
        loadBuffer(ctx, SOUND_FORWARD),
        loadBuffer(ctx, SOUND_BACKWARD),
        loadBuffer(ctx, SOUND_CLICK),
      ]);

      bufForwardRef.current  = fwd;
      bufBackwardRef.current = bwd;
      bufClickRef.current    = clk;
    } catch {}
  }, []);

  const onForwardScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollRef.current < 80) return;
    lastScrollRef.current = now;
    ensureLoaded();
    if (!soundsMutedRef.current && audioCtxRef.current) {
      playBuffer(audioCtxRef.current, bufForwardRef.current, 0.6);
    }
    vibrate(8);
  }, [ensureLoaded]);

  const onBackwardScroll = useCallback(() => {
    const now = Date.now();
    if (now - lastScrollRef.current < 80) return;
    lastScrollRef.current = now;
    ensureLoaded();
    if (!soundsMutedRef.current && audioCtxRef.current) {
      playBuffer(audioCtxRef.current, bufBackwardRef.current, 0.6);
    }
    vibrate(8);
  }, [ensureLoaded]);

  const onButtonClick = useCallback(() => {
    ensureLoaded();
    if (!soundsMutedRef.current && audioCtxRef.current) {
      playBuffer(audioCtxRef.current, bufClickRef.current, 0.75);
    }
    vibrate([12, 0, 12]);
  }, [ensureLoaded]);

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
