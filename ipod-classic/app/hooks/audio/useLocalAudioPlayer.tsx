import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { AudioPlayerContext } from "./useAudioPlayer";
import { useEventListener, useHapticFeedback } from "@/hooks";
import { useSettings, ShuffleMode, RepeatMode, VOLUME_KEY } from "../utils/useSettings";
import { IpodEvent } from "@/utils/events";
import { MYSPACE_TRACKS } from "@/data/myspaceTracks";

const defaultPlaybackInfo = {
  isPlaying: false,
  isPaused: false,
  isLoading: false,
  currentTime: 0,
  timeRemaining: 0,
  percent: 0,
  duration: 0,
};

interface Props {
  children: React.ReactNode;
}

export const LocalAudioProvider = ({ children }: Props) => {
  const {
    shuffleMode,
    repeatMode,
    setShuffleMode: updateShuffleSetting,
    setRepeatMode: updateRepeatSetting,
  } = useSettings();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const queueRef = useRef<MediaApi.Song[]>([]);
  const indexRef = useRef(0);

  const [volume, setVolumeState] = useState(0.5);
  const [nowPlayingItem, setNowPlayingItem] = useState<
    MediaApi.MediaItem | undefined
  >();
  const [playbackInfo, setPlaybackInfo] = useState(defaultPlaybackInfo);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = "metadata";
      const saved = parseFloat(localStorage.getItem(VOLUME_KEY) ?? "0.5");
      audioRef.current.volume = saved;
      setVolumeState(saved);
    }
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const syncNowPlaying = useCallback(() => {
    const song = queueRef.current[indexRef.current];
    if (song) {
      setNowPlayingItem({
        ...song,
        playlistName: "MySpace Page Music",
        playlistArtworkUrl: song.artwork?.url,
      });
    } else {
      setNowPlayingItem(undefined);
    }
  }, []);

  const loadAndPlay = useCallback(
    (idx: number) => {
      const audio = audioRef.current;
      const queue = queueRef.current;
      if (!audio || !queue.length) return;

      const clampedIdx = ((idx % queue.length) + queue.length) % queue.length;
      indexRef.current = clampedIdx;
      const song = queue[clampedIdx];

      audio.src = song.url;
      audio.load();

      setPlaybackInfo((prev) => ({ ...prev, isLoading: true }));

      const onCanPlay = () => {
        audio.removeEventListener("canplay", onCanPlay);
        audio
          .play()
          .then(() => {
            setPlaybackInfo((prev) => ({
              ...prev,
              isPlaying: true,
              isPaused: false,
              isLoading: false,
              duration: audio.duration || 0,
            }));
          })
          .catch(() => {
            setPlaybackInfo((prev) => ({
              ...prev,
              isLoading: false,
            }));
          });
      };

      audio.addEventListener("canplay", onCanPlay);
      syncNowPlaying();
    },
    [syncNowPlaying]
  );

  const play = useCallback(
    async (queueOptions: MediaApi.QueueOptions) => {
      const songs =
        queueOptions.songs ??
        queueOptions.playlist?.songs ??
        queueOptions.album?.songs ??
        (queueOptions.song ? [queueOptions.song] : MYSPACE_TRACKS);

      let queue = [...songs];
      if (shuffleMode === "songs") {
        for (let i = queue.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [queue[i], queue[j]] = [queue[j], queue[i]];
        }
      }
      queueRef.current = queue;

      const start = queueOptions.startPosition ?? 0;
      loadAndPlay(shuffleMode === "songs" ? 0 : start);
    },
    [loadAndPlay, shuffleMode]
  );

  const pause = useCallback(async () => {
    audioRef.current?.pause();
    setPlaybackInfo((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: true,
    }));
  }, []);

  const togglePlayPause = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !nowPlayingItem) return;

    if (audio.paused) {
      await audio.play().catch(() => {});
      setPlaybackInfo((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
      }));
    } else {
      audio.pause();
      setPlaybackInfo((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: true,
      }));
    }
  }, [nowPlayingItem]);

  const skipNext = useCallback(async () => {
    if (!queueRef.current.length) return;
    loadAndPlay(indexRef.current + 1);
  }, [loadAndPlay]);

  const skipPrevious = useCallback(async () => {
    const audio = audioRef.current;
    if (!queueRef.current.length) return;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    loadAndPlay(indexRef.current - 1);
  }, [loadAndPlay]);

  const seekToTime = useCallback(async (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  }, []);

  const handleChangeVolume = useCallback((newVolume: number) => {
    if (audioRef.current) audioRef.current.volume = newVolume;
    localStorage.setItem(VOLUME_KEY, `${newVolume}`);
    setVolumeState(newVolume);
  }, []);

  const handleSetShuffleMode = useCallback(
    async (mode: ShuffleMode) => {
      updateShuffleSetting(mode);
    },
    [updateShuffleSetting]
  );

  const handleSetRepeatMode = useCallback(
    async (mode: RepeatMode) => {
      updateRepeatSetting(mode);
    },
    [updateRepeatSetting]
  );

  const updateNowPlayingItem = useCallback(async () => {
    syncNowPlaying();
  }, [syncNowPlaying]);

  const updatePlaybackInfo = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    const ct = audio.currentTime || 0;
    const dur = audio.duration || 0;
    setPlaybackInfo((prev) => ({
      ...prev,
      currentTime: ct,
      timeRemaining: dur - ct,
      percent: dur > 0 ? Math.round((ct / dur) * 100) : 0,
      duration: dur,
    }));
  }, []);

  const reset = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    queueRef.current = [];
    indexRef.current = 0;
    setNowPlayingItem(undefined);
    setPlaybackInfo(defaultPlaybackInfo);
  }, []);

  // Audio element event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => {
      const ct = audio.currentTime || 0;
      const dur = audio.duration || 0;
      setPlaybackInfo((prev) => ({
        ...prev,
        currentTime: ct,
        timeRemaining: dur - ct,
        percent: dur > 0 ? Math.round((ct / dur) * 100) : 0,
        duration: dur,
        isPlaying: !audio.paused,
        isPaused: audio.paused,
      }));
    };

    const onEnded = () => {
      const queue = queueRef.current;
      if (!queue.length) return;

      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(() => {});
        return;
      }

      const nextIdx = indexRef.current + 1;
      if (nextIdx >= queue.length && repeatMode !== "all") {
        setPlaybackInfo(defaultPlaybackInfo);
        setNowPlayingItem(undefined);
        return;
      }
      loadAndPlay(nextIdx);
    };

    const onLoadedMetadata = () => {
      setPlaybackInfo((prev) => ({
        ...prev,
        duration: audio.duration || 0,
      }));
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, [repeatMode, loadAndPlay]);

  // Click wheel transport controls
  const { triggerHaptics } = useHapticFeedback();

  const handlePlayPauseClick = useCallback(() => {
    triggerHaptics();
    togglePlayPause();
  }, [togglePlayPause, triggerHaptics]);

  const handleSkipNext = useCallback(() => {
    triggerHaptics();
    skipNext();
  }, [skipNext, triggerHaptics]);

  const handleSkipPrevious = useCallback(() => {
    triggerHaptics();
    skipPrevious();
  }, [skipPrevious, triggerHaptics]);

  useEventListener<IpodEvent>("playpauseclick", handlePlayPauseClick);
  useEventListener<IpodEvent>("forwardclick", handleSkipNext);
  useEventListener<IpodEvent>("backwardclick", handleSkipPrevious);

  return (
    <AudioPlayerContext.Provider
      value={{
        playbackInfo,
        nowPlayingItem,
        volume,
        shuffleMode,
        repeatMode,
        play,
        pause,
        seekToTime,
        setVolume: handleChangeVolume,
        setShuffleMode: handleSetShuffleMode,
        setRepeatMode: handleSetRepeatMode,
        togglePlayPause,
        updateNowPlayingItem,
        updatePlaybackInfo,
        skipNext,
        skipPrevious,
        reset,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};
