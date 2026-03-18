import React, { useEffect, useRef, useState, useCallback, memo } from 'react';

const OG = `${process.env.PUBLIC_URL || ''}/myspace/myspace-music-player-extended/OG-myspace-player/images`;
const BASE = `${process.env.PUBLIC_URL || ''}/myspace/myspace-music-player-extended`;

const enc = (p) => `${BASE}/audio/${encodeURIComponent(p)}`;

/* Manual overrides for filenames that don't parse cleanly */
const DISPLAY_OVERRIDES = {
  "drake-Bria's Interlude.mp3": { artist: 'Drake', name: "Bria's Interlude" },
  'my-chemical-romance_im-not-okay-i-promise.mp3': { artist: 'My Chemical Romance', name: "I'm Not Okay (I Promise)" },
};

/* Parse "Artist - Title.mp3", "Artist-Title.mp3", or "title.mp3" into { artist, name } */
function parseFilename(file) {
  if (DISPLAY_OVERRIDES[file]) return DISPLAY_OVERRIDES[file];
  const base = file.replace(/\.mp3$/i, '').trim();
  const sep = base.indexOf(' - ');
  if (sep > 0) {
    return { artist: base.slice(0, sep).trim(), name: base.slice(sep + 3).trim() };
  }
  const dash = base.indexOf('-');
  if (dash > 0 && dash < base.length - 1) {
    const a = base.slice(0, dash).trim();
    const n = base.slice(dash + 1).trim();
    return { artist: a.charAt(0).toUpperCase() + a.slice(1).toLowerCase(), name: n };
  }
  const name = base.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  return { artist: 'Unknown', name };
}

const AUDIO_FILES = [
  'Avril Lavigne - Sk8er Boi.mp3', 'B2K - Girlfriend.mp3', 'Big Bamboos  New Era.mp3',
  'Black Eyed Peas - Imma Be.mp3', 'Blink 182 - All the Small Things.mp3', 'Brand New.mp3',
  "Bria's Interlude.mp3", 'Busta Rhymes - Pass The Courvoisier Part II (Remix).mp3',
  'Cassie - Long Way 2 Go.mp3', 'Chris Brown - Kiss Kiss Feat. T-Pain.mp3',
  'Ciara - Get Up ft. Chamillionaire.mp3', 'Coldplay - Viva la Vida.mp3', 'Decode.mp3',
  "Drake - I'm Still Fly.mp3", 'Drake - Replacement Girl Feat. Trey Songz.mp3',
  'Drake-Shut It Down.mp3', 'E-40 - U And Dat (Feat. T. Pain & Kandi Girl).mp3',
  "Fall Out Boy - Sugar, We're Goin Down [Album Version].mp3",
  'Far East Movement - Like A G6 (Feat. The Cataracs, DEV).mp3',
  'Fat Joe - Lean Back (feat. Lil Jon, Eminem, Mase & Remy Martin) (Remix).mp3',
  'Federation - I Wear My Stunna Glasses At Night (Feat. E-40).mp3',
  'Foo Fighters- My Hero.mp3', 'Green Day - 21 Guns.mp3', 'Hit My Cat Daddy - Young Sam.mp3',
  'Incubus - Drive.mp3', 'Jamiroquai - Virtual Insanity.mp3',
  'Kanye West Us Placers Feat Lupe Fiasco And Pharell (Bonus Track).mp3',
  'Lil Jon & The East Side Boyz - Get Low (feat. Ying Yang Twins).mp3',
  'Lil Wayne - Lisa Marie.mp3', 'Lit - My Own Worst Enemy.mp3', 'MGMT - Electric Feel.mp3',
  'Miss Me, Kiss Me, Lick Me (Feat. DashxDigital, D Realz & Mic 3rd).mp3',
  'NSYNC - Girlfriend.mp3', 'Never Let You Go.mp3', 'New Era - 123.mp3',
  'Nirvana - Come As You Are.mp3', 'Nirvana - Smells Like Teen Spirit.mp3',
  'Omarion - Entourage.mp3', 'Omarion - O.mp3', "Plain White T's - Hey There Delilah.mp3",
  'Radiohead - Fake Plastic Trees.mp3', 'Saliva - Superstar.mp3', 'Semisonic - Closing Time.mp3',
  'Shortie Like Mine.mp3', "Stunnaman - Molly Whoppin'.mp3", 'Swagga Like Us.mp3',
  'System of a Down - Lonely Day.mp3', "T-Pain Ft. Lil Wayne Can't Believe It.mp3",
  'T.I. - What You Know.mp3', 'The Clipse- Mr. Me Too.mp3',
  'The Cool Kids Ft Lil Wayne- Gettin it.mp3', 'The Pack - Booty Bounce Boppers.mp3',
  'The Ranger$ - Go Hard.mp3', 'Two Door Cinema Club - What You Know.mp3',
  'YG - Aim Me.mp3', "YG - I'm Still Poppin.mp3", 'YG - She A Model.mp3',
  "drake-Bria's Interlude.mp3", 'my-chemical-romance_im-not-okay-i-promise.mp3',
];

const COVERS = [`${BASE}/img/static-skies-demo.jpg`, `${BASE}/img/hcw-album.jpg`];

const PLAYLIST = AUDIO_FILES.map((file, i) => {
  const { artist, name } = parseFilename(file);
  return { name, artist, album: '', url: enc(file), cover: COVERS[i % COVERS.length] };
});

/* Format seconds to MM:SS */
function fmt(sec) {
  if (!sec || !isFinite(sec)) return '00:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

/* ── OG-style control button with normal / hover / active sprite states ── */
function OgBtn({ normalSrc, hoverSrc, activeSrc, onClick, title, isActive }) {
  return (
    <button className={`og-btn ${isActive ? 'og-btn-pressed' : ''}`} onClick={onClick} title={title} type="button">
      <img src={normalSrc} alt={title} className="og-btn-normal" draggable={false} />
      <img src={hoverSrc} alt="" className="og-btn-hover" draggable={false} />
      <img src={activeSrc} alt="" className="og-btn-active" draggable={false} />
    </button>
  );
}

/* ── Volume slider: imperative DOM updates during drag (like scroll track), no React re-renders ── */
const VolumeSlider = memo(({ volume, audioRef, onVolumeChange }) => {
  const barRef = useRef(null);
  const sliderRowRef = useRef(null);

  useEffect(() => {
    const bar = barRef.current;
    const sliderRow = sliderRowRef.current;
    if (!bar || !sliderRow) return;

    const getRectForTarget = (el) => {
      const indicator = el?.closest('.og-vol-indicator');
      return (indicator || bar).getBoundingClientRect();
    };

    const applyFromClientX = (clientX, trackEl) => {
      const rect = getRectForTarget(trackEl || bar);
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const w = `${pct * 100}%`;
      const fill = bar.querySelector('.og-vol-bar-fill');
      const thumb = bar.querySelector('.og-vol-bar-thumb');
      const indicatorFill = sliderRow.nextElementSibling?.querySelector('.og-vol-fill');
      if (fill) fill.style.width = w;
      if (thumb) thumb.style.left = w;
      if (indicatorFill) indicatorFill.style.width = w;
      if (audioRef?.current) audioRef.current.volume = pct;
      return pct;
    };

    let lastPct = volume;

    const onPointerDown = (e) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      lastPct = applyFromClientX(e.clientX, e.currentTarget);
      const onMove = (ev) => { lastPct = applyFromClientX(ev.clientX, e.currentTarget); };
      const onUp = () => {
        document.removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerup', onUp);
        e.currentTarget.releasePointerCapture(e.pointerId);
        onVolumeChange(lastPct);
      };
      document.addEventListener('pointermove', onMove);
      document.addEventListener('pointerup', onUp);
    };

    bar.addEventListener('pointerdown', onPointerDown);
    const indicator = sliderRow.nextElementSibling?.querySelector('.og-vol-indicator');
    if (indicator) indicator.addEventListener('pointerdown', onPointerDown);
    return () => {
      bar.removeEventListener('pointerdown', onPointerDown);
      if (indicator) indicator.removeEventListener('pointerdown', onPointerDown);
    };
  }, [audioRef, onVolumeChange]);

  const volPct = volume * 100;
  return (
    <>
      <div className="og-volume-slider-row" ref={sliderRowRef}>
        <img src={`${OG}/68.png`} alt="Volume" className="og-speaker-icon" />
        <div className="og-vol-bar" ref={barRef}>
          <div className="og-vol-bar-fill" style={{ width: `${volPct}%` }} />
          <img src={`${OG}/64.png`} alt="" className="og-vol-bar-thumb" style={{ left: `${volPct}%` }} draggable={false} />
        </div>
      </div>
      <div className="og-volume-bar-row">
        <div className="og-vol-indicator">
          <div className="og-vol-fill" style={{ width: `${volPct}%` }} />
          <img src={`${OG}/72.png`} alt="" className="og-vol-mask" />
        </div>
      </div>
    </>
  );
});

function MySpaceMusicPlayer() {
  /* ── State ── */
  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [totalPlays, setTotalPlays] = useState(0);
  const [playsToday, setPlaysToday] = useState(0);
  const [playsByTrack, setPlaysByTrack] = useState(() => Array(PLAYLIST.length).fill(0));

  /* ── Refs ── */
  const hasCountedPlayRef = useRef(false); // avoid double-counting on play event spam

  /* ── Refs ── */
  const audioRef = useRef(null);
  const ctxRef = useRef(null);        // AudioContext
  const analyserRef = useRef(null);   // AnalyserNode
  const sourceRef = useRef(null);     // MediaElementSource
  const canvasRef = useRef(null);     // EQ canvas
  const rafRef = useRef(null);        // requestAnimationFrame id
  const progBarRef = useRef(null);    // progress bar element
  const volBarRef = useRef(null);     // volume bar (dark scrubber)
  const volIndicatorRef = useRef(null); // green volume indicator
  const tracklistRef = useRef(null);  // tracklist scroll container
  const scrollThumbRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const connectedRef = useRef(false); // web audio connected?

  const track = PLAYLIST[trackIdx];

  /* ── Initialize audio element ── */
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.crossOrigin = 'anonymous';
      audioRef.current.preload = 'metadata';
      audioRef.current.volume = volume;
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Pause on WinXP shutdown (Turn Off) ── */
  useEffect(() => {
    const onShutdown = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setPlaying(false);
      }
    };
    window.addEventListener('winxp-shutdown', onShutdown);
    return () => window.removeEventListener('winxp-shutdown', onShutdown);
  }, []);

  /* ── Connect Web Audio API for visualizer ── */
  const connectWebAudio = useCallback(() => {
    if (connectedRef.current) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.7;
      const source = ctx.createMediaElementSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      sourceRef.current = source;
      connectedRef.current = true;
    } catch (e) {
      console.warn('Web Audio API not available:', e);
    }
  }, []);

  /* ── EQ Visualizer: 4 cols × 7 rows (OG MySpace Flash player style) ── */
  const eqStateRef = useRef(null);

  const initEQState = useCallback(() => {
    if (eqStateRef.current) return;
    eqStateRef.current = {
      lvl: [4, 3, 5, 4].map(v => v * 1.0),
      tgt: [4, 3, 5, 4].map(v => v * 1.0),
      pk:  [4, 3, 5, 4].map(v => v * 1.0),
      hold: [25, 25, 25, 25],
    };
  }, []);

  const drawEQ = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    initEQState();

    const ctx = canvas.getContext('2d');
    const COLS = 4;
    const ROWS = 7;
    const SW = 8, SH = 3, GX = 3, GY = 1, OX = 2, OY = 1;
    const { lvl, tgt, pk, hold } = eqStateRef.current;
    const analyser = analyserRef.current;

    // If Web Audio is connected, drive levels from frequency data
    if (analyser && playing) {
      const bufLen = analyser.frequencyBinCount;
      const data = new Uint8Array(bufLen);
      analyser.getByteFrequencyData(data);
      for (let c = 0; c < COLS; c++) {
        const idx = Math.floor((c / COLS) * bufLen * 0.6);
        tgt[c] = (data[idx] / 255) * ROWS;
      }
    } else {
      // Randomized cosmetic animation (like original Flash player)
      for (let c = 0; c < COLS; c++) {
        if (Math.random() < 0.07) tgt[c] = Math.random() * ROWS * 0.92 + 0.3;
      }
    }

    // Smooth levels + peak hold
    for (let c = 0; c < COLS; c++) {
      lvl[c] += (tgt[c] - lvl[c]) * 0.14 + (Math.random() - 0.5) * 0.25;
      lvl[c] = Math.max(0.1, Math.min(ROWS, lvl[c]));
      if (lvl[c] >= pk[c]) { pk[c] = lvl[c]; hold[c] = 24; }
      else if (hold[c] > 0) hold[c]--;
      else pk[c] = Math.max(lvl[c], pk[c] - 0.07);
    }

    function segColor(row) {
      if (row >= ROWS - 1) return '#FF2200';
      if (row >= ROWS - 2) return '#FF6600';
      if (row >= ROWS - 3) return '#FFCC00';
      if (row >= ROWS - 4) return '#AADD00';
      return '#22AA00';
    }

    function dimColor(row) {
      if (row >= ROWS - 1) return 'rgba(80,0,0,0.4)';
      if (row >= ROWS - 2) return 'rgba(60,20,0,0.4)';
      if (row >= ROWS - 3) return 'rgba(50,40,0,0.4)';
      return 'rgba(0,30,0,0.4)';
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let c = 0; c < COLS; c++) {
      const lit = Math.round(lvl[c]);
      for (let r = 0; r < ROWS; r++) {
        const x = OX + c * (SW + GX);
        const y = OY + (ROWS - 1 - r) * (SH + GY);
        ctx.fillStyle = r < lit ? segColor(r) : dimColor(r);
        ctx.fillRect(x, y, SW, SH);
      }
      // Peak indicator
      const pr = Math.min(Math.round(pk[c]) - 1, ROWS - 1);
      if (pr >= 0) {
        const px2 = OX + c * (SW + GX);
        const py2 = OY + (ROWS - 1 - pr) * (SH + GY);
        ctx.fillStyle = segColor(pr);
        ctx.fillRect(px2, py2, SW, SH);
      }
    }

    rafRef.current = requestAnimationFrame(drawEQ);
  }, [initEQState, playing]);

  /* ── Start/stop EQ animation based on playing state ── */
  useEffect(() => {
    if (playing && connectedRef.current) {
      drawEQ();
    } else {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      // When paused, keep drawing dim idle bars
      const canvas = canvasRef.current;
      if (canvas && !playing) {
        const ctx = canvas.getContext('2d');
        const COLS = 4, ROWS = 7, SW = 8, SH = 3, GX = 3, GY = 1, OX = 2, OY = 1;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let c = 0; c < COLS; c++) {
          for (let r = 0; r < ROWS; r++) {
            const x = OX + c * (SW + GX);
            const y = OY + (ROWS - 1 - r) * (SH + GY);
            if (r >= ROWS - 1) ctx.fillStyle = 'rgba(80,0,0,0.4)';
            else if (r >= ROWS - 2) ctx.fillStyle = 'rgba(60,20,0,0.4)';
            else if (r >= ROWS - 3) ctx.fillStyle = 'rgba(50,40,0,0.4)';
            else ctx.fillStyle = 'rgba(0,30,0,0.4)';
            ctx.fillRect(x, y, SW, SH);
          }
        }
      }
    }
  }, [playing, drawEQ]);

  /* ── Load track when index changes ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    hasCountedPlayRef.current = false; /* reset so new track can be counted */
    const wasPlaying = playing;
    audio.pause();
    audio.src = PLAYLIST[trackIdx].url;
    audio.load();

    const onLoaded = () => {
      setDuration(audio.duration);
      if (wasPlaying) {
        audio.play().catch(() => {});
      }
    };
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => {
      setTrackIdx(prev => (prev + 1) % PLAYLIST.length);
      setPlaying(true);
    };
    const onPlay = () => {
      /* Count play only when track starts from beginning (not on resume from pause) */
      if (audio.currentTime < 1 && !hasCountedPlayRef.current) {
        hasCountedPlayRef.current = true;
        setTotalPlays(prev => prev + 1);
        setPlaysToday(prev => prev + 1);
        setPlaysByTrack(prev => {
          const next = [...prev];
          next[trackIdx] = (next[trackIdx] || 0) + 1;
          return next;
        });
      }
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx]);

  /* ── Volume sync ── */
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  /* ── Transport controls ── */
  const doPlay = () => {
    connectWebAudio();
    if (ctxRef.current && ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    audioRef.current.play().catch(() => {});
    setPlaying(true);
  };

  const doPause = () => {
    audioRef.current.pause();
    setPlaying(false);
  };

  const doStop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlaying(false);
    setCurrentTime(0);
    hasCountedPlayRef.current = false; /* allow next play-from-start to count */
  };

  const doPrev = () => {
    setTrackIdx(prev => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const doNext = () => {
    setTrackIdx(prev => (prev + 1) % PLAYLIST.length);
  };

  const selectTrack = (idx) => {
    setTrackIdx(idx);
    setTimeout(() => {
      connectWebAudio();
      if (ctxRef.current && ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
      }
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }, 100);
  };

  /* ── Progress bar: click + drag (same pattern as scroll track), rAF-throttled ── */
  const applyProgFromClientX = useCallback((clientX) => {
    const bar = progBarRef.current;
    const dur = audioRef.current?.duration;
    if (!bar || !dur || !isFinite(dur)) return;
    const rect = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    audioRef.current.currentTime = pct * dur;
    setCurrentTime(pct * dur);
  }, []);

  const onProgMouseDown = useCallback((e) => {
    e.preventDefault();
    applyProgFromClientX(e.clientX);
    const onMove = (ev) => applyProgFromClientX(ev.clientX);
    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }, [applyProgFromClientX]);

  /* ── Custom scrollbar logic ── */
  const scrollUp = () => {
    const list = tracklistRef.current;
    if (!list) return;
    list.scrollTop = Math.max(0, list.scrollTop - 29);
  };
  const scrollDown = () => {
    const list = tracklistRef.current;
    if (!list) return;
    const maxScroll = list.scrollHeight - list.clientHeight;
    list.scrollTop = Math.min(maxScroll, list.scrollTop + 29);
  };

  /* Click on scroll track (above/below thumb) to jump to position */
  const onScrollTrackClick = (e) => {
    if (scrollThumbRef.current && scrollThumbRef.current.contains(e.target)) return;
    const list = tracklistRef.current;
    const sTrack = scrollTrackRef.current;
    if (!list || !sTrack) return;
    const rect = sTrack.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const trackH = rect.height;
    const pct = Math.max(0, Math.min(1, clickY / trackH));
    const maxScroll = list.scrollHeight - list.clientHeight;
    if (maxScroll > 0) list.scrollTop = pct * maxScroll;
  };

  useEffect(() => {
    const list = tracklistRef.current;
    const thumb = scrollThumbRef.current;
    const sTrack = scrollTrackRef.current;
    if (!list || !thumb || !sTrack) return;

    /* Use the thumb image's rendered height as a fixed thumb size
       (matches OG Flash player: fixed-size sprite sliding along the track).
       Read dynamically since the image may not be loaded at effect setup. */
    const thumbImg = thumb.querySelector('img');

    const getThumbH = () => {
      if (thumbImg && thumbImg.complete && thumbImg.naturalHeight > 0) {
        return thumbImg.getBoundingClientRect().height || 20;
      }
      return 20; /* fallback until image loads */
    };

    const update = () => {
      const scrollTop = list.scrollTop;
      const scrollHeight = list.scrollHeight;
      const clientHeight = list.clientHeight;
      const trackH = sTrack.clientHeight;

      if (scrollHeight <= clientHeight) {
        thumb.style.display = 'none';
        return;
      }
      thumb.style.display = 'flex';

      const thumbH = getThumbH();
      const maxScroll = scrollHeight - clientHeight;
      const pct = maxScroll > 0 ? Math.max(0, Math.min(1, scrollTop / maxScroll)) : 0;
      const maxTop = Math.max(0, trackH - thumbH);
      const thumbTop = Math.round(pct * maxTop);

      thumb.style.height = 'auto'; /* let image determine height */
      thumb.style.top = `${thumbTop}px`;
    };

    /* Re-run update when thumb image loads (in case it wasn't ready) */
    if (thumbImg) {
      thumbImg.addEventListener('load', update);
    }

    /* Thumb drag to scroll */
    let dragStartY = 0;
    let dragStartScrollTop = 0;

    const onThumbMouseDown = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragStartY = e.clientY;
      dragStartScrollTop = list.scrollTop;
      document.addEventListener('mousemove', onThumbMouseMove);
      document.addEventListener('mouseup', onThumbMouseUp);
    };

    const onThumbMouseMove = (e) => {
      const trackH = sTrack.clientHeight;
      const maxTop = Math.max(0, trackH - getThumbH());
      const maxScroll = list.scrollHeight - list.clientHeight;
      if (maxTop <= 0 || maxScroll <= 0) return;
      const deltaY = e.clientY - dragStartY;
      const scrollDelta = (deltaY / maxTop) * maxScroll;
      list.scrollTop = Math.max(0, Math.min(maxScroll, dragStartScrollTop + scrollDelta));
    };

    const onThumbMouseUp = () => {
      document.removeEventListener('mousemove', onThumbMouseMove);
      document.removeEventListener('mouseup', onThumbMouseUp);
    };

    thumb.addEventListener('mousedown', onThumbMouseDown);
    list.addEventListener('scroll', update);
    list.addEventListener('wheel', update, { passive: true });

    /* Re-run update when layout changes (e.g. resize, initial paint) */
    const ro = new ResizeObserver(() => {
      update();
    });
    ro.observe(list);
    ro.observe(sTrack);

    /* Initial update - run after layout is ready */
    const raf = requestAnimationFrame(() => {
      update();
    });

    return () => {
      list.removeEventListener('scroll', update);
      list.removeEventListener('wheel', update);
      thumb.removeEventListener('mousedown', onThumbMouseDown);
      document.removeEventListener('mousemove', onThumbMouseMove);
      document.removeEventListener('mouseup', onThumbMouseUp);
      if (thumbImg) thumbImg.removeEventListener('load', update);
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [trackIdx]);

  const progPct = duration ? (currentTime / duration) * 100 : 0;
  const volPct = volume * 100;

  return (
    <div className="userMusic myspace-music-player-row">
      <div className="og-myspace-player">

        {/* ═══ TOP SECTION: controls + info ═══ */}
        <div className="og-player-top">

          {/* ── LEFT PANEL: transport buttons + volume ── */}
          <div className="og-left-panel">
            <div className="og-player-controls">
              {/* Order: Stop, Prev, Play, Pause, Next — all always visible */}
              <OgBtn
                normalSrc={`${OG}/42.png`} hoverSrc={`${OG}/44.png`} activeSrc={`${OG}/46.png`}
                onClick={doStop} title="Stop"
              />
              <OgBtn
                normalSrc={`${OG}/49.png`} hoverSrc={`${OG}/51.png`} activeSrc={`${OG}/53.png`}
                onClick={doPrev} title="Previous"
              />
              <OgBtn
                normalSrc={`${OG}/28.png`} hoverSrc={`${OG}/30.png`} activeSrc={`${OG}/32.png`}
                onClick={doPlay} title="Play" isActive={playing}
              />
              <OgBtn
                normalSrc={`${OG}/35.png`} hoverSrc={`${OG}/37.png`} activeSrc={`${OG}/39.png`}
                onClick={doPause} title="Pause" isActive={!playing && currentTime > 0}
              />
              <OgBtn
                normalSrc={`${OG}/56.png`} hoverSrc={`${OG}/58.png`} activeSrc={`${OG}/60.png`}
                onClick={doNext} title="Next"
              />
            </div>

            <VolumeSlider
              volume={volume}
              audioRef={audioRef}
              onVolumeChange={setVolume}
            />
          </div>

          {/* ── RIGHT PANEL: black box (song info + EQ) + progress row BELOW on light background ── */}
          <div className="og-right-panel">
            <div className="og-player-info">
              <div className="og-info-text">
                <span className="og-song-name">{track.name}</span>
                <span className="og-song-artist">{track.artist}</span>
                <span className="og-song-status">
                  {playing ? 'playing' : 'paused'}
                </span>
              </div>
              {/* EQ Visualizer */}
              <div className="og-eq-area">
                <canvas
                  ref={canvasRef}
                  className="og-eq-visualizer"
                  width={45}
                  height={29}
                />
              </div>
            </div>
            {/* Progress bar + time BELOW the black box, on light background */}
            <div className="og-progress-row-inner">
              <span className="og-time-inner">{fmt(currentTime)}</span>
              <div className="og-prog-bar" ref={progBarRef} onMouseDown={onProgMouseDown}>
                <div className="og-prog-bar-fill" style={{ width: `${progPct}%` }} />
                <img
                  src={`${OG}/125.png`}
                  alt=""
                  className="og-prog-bar-thumb"
                  style={{ left: `${progPct}%` }}
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ═══ DARK DIVIDER BAR ═══ */}
        <div className="og-dark-divider">
          <span><b>Total Plays: {totalPlays}</b></span>
          <span>Downloads Today: 0</span>
          <span><b>Plays Today: {playsToday}</b></span>
        </div>

        {/* ═══ BOTTOM SECTION: album art + tracklist ═══ */}
        <div className="og-player-bottom">
          {/* Album art panel */}
          <div className="og-album-panel">
            <img
              src={track.cover}
              alt={track.album}
              className="og-album-cover"
            />
            <div className="og-album-meta">
              <span className="og-album-name">{track.album}</span>
              <span className="og-album-detail">{track.artist}</span>
            </div>
          </div>

          {/* Tracklist + custom scrollbar */}
          <div className="og-tracklist-wrapper">
            <div className="og-tracklist-panel" ref={tracklistRef}>
              {PLAYLIST.map((t, i) => (
                <div
                  key={i}
                  className={`og-track ${i === trackIdx ? 'og-track-active' : ''}`}
                  onClick={() => selectTrack(i)}
                >
                  <div className="og-track-top">
                    <span className="og-track-name">
                      <span className="og-track-title">{t.name}</span>
                      <span className="og-track-plays">Plays: {playsByTrack[i] ?? 0}</span>
                    </span>
                  </div>
                  <div className="og-track-links">
                    <a href="#dl" onClick={e => e.preventDefault()}>Download</a>
                    {' | '}
                    <a href="#rate" onClick={e => e.preventDefault()}>Rate</a>
                    {' | '}
                    <a href="#comments" onClick={e => e.preventDefault()}>Comments</a>
                    {' | '}
                    <a href="#lyrics" onClick={e => e.preventDefault()}>Lyrics</a>
                    {' | '}
                    <a href="#add" onClick={e => e.preventDefault()}>Add</a>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom scrollbar */}
            <div className="og-custom-scrollbar">
              <button className="og-scroll-btn" onClick={scrollUp} type="button">
                <img src={`${OG}/79.png`} alt="▲" />
              </button>
              <div className="og-scroll-track" ref={scrollTrackRef} onClick={onScrollTrackClick}>
                <img src={`${OG}/76.png`} alt="" className="og-scroll-track-img" />
                <div className="og-scroll-thumb" ref={scrollThumbRef}>
                  <img src={`${OG}/94.png`} alt="" />
                </div>
              </div>
              <button className="og-scroll-btn" onClick={scrollDown} type="button">
                <img src={`${OG}/87.png`} alt="▼" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MySpaceMusicPlayer;
