import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import './webCamViewer.css';

function clamp(v) {
  return Math.max(0, Math.min(255, v));
}

function applyFilter(ctx, W, H, mode, live) {
  const id = ctx.getImageData(0, 0, W, H);
  const d = id.data;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i];
    let g = d[i + 1];
    let b = d[i + 2];

    if (mode === 'vhs') {
      const gray = r * 0.299 + g * 0.587 + b * 0.114;
      r = clamp(gray * 0.6 + r * 0.4);
      g = clamp(gray * 0.5 + g * 0.5 + 8);
      b = clamp(gray * 0.7 + b * 0.3 - 5);
      r = clamp(r * 0.85 + 20);
      g = clamp(g * 0.85 + 20);
      b = clamp(b * 0.85 + 15);
    } else if (mode === 'bw') {
      const gray = clamp(r * 0.299 + g * 0.587 + b * 0.114);
      const n = (Math.random() - 0.5) * 40;
      r = g = b = clamp(gray * 0.85 + 10 + n);
    } else if (mode === 'sepia') {
      const gray = r * 0.299 + g * 0.587 + b * 0.114;
      r = clamp(gray * 1.0 + 30);
      g = clamp(gray * 0.85 + 15);
      b = clamp(gray * 0.65);
    } else if (mode === 'green') {
      const gray = r * 0.299 + g * 0.587 + b * 0.114;
      const n = (Math.random() - 0.5) * 25;
      r = clamp(gray * 0.1);
      g = clamp(gray * 1.1 + 20 + n);
      b = clamp(gray * 0.1);
    } else if (mode === 'blown') {
      r = clamp(r * 1.4 + 30);
      g = clamp(g * 1.35 + 25);
      b = clamp(b * 1.3 + 20);
    } else if (mode === 'potato') {
      const n = (Math.random() - 0.5) * 60;
      r = clamp(Math.round(r / 16) * 16 + n);
      g = clamp(Math.round(g / 16) * 16 + n * 0.8);
      b = clamp(Math.round(b / 20) * 20 + n * 0.6);
      r = clamp(r * 0.75 + 30);
      g = clamp(g * 0.72 + 28);
      b = clamp(b * 0.65 + 20);
    }

    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
  }
  ctx.putImageData(id, 0, 0);

  const intensity =
    mode === 'potato' ? 0.18 : mode === 'bw' ? 0.12 : 0.07;
  const gd = ctx.createImageData(W, H);
  for (let i = 0; i < gd.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 255 * intensity;
    gd.data[i] = gd.data[i + 1] = gd.data[i + 2] = 128 + n;
    gd.data[i + 3] = Math.random() * 28 + 8;
  }
  ctx.putImageData(gd, 0, 0);

  if (live && mode === 'vhs' && Math.random() < 0.12) {
    const y = Math.floor(Math.random() * H);
    ctx.save();
    ctx.globalAlpha = 0.15 + Math.random() * 0.25;
    ctx.fillStyle = Math.random() > 0.5 ? '#fff' : '#00ff00';
    ctx.fillRect(0, y, W, Math.floor(Math.random() * 2) + 1);
    ctx.restore();
  }

  if (mode === 'potato') {
    const s = document.createElement('canvas');
    s.width = Math.floor(W / 3);
    s.height = Math.floor(H / 3);
    const sc = s.getContext('2d');
    sc.imageSmoothingEnabled = false;
    sc.drawImage(ctx.canvas, 0, 0, s.width, s.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(s, 0, 0, W, H);
  }
}

function parseRes(value) {
  const [w, h] = value.split('x').map(Number);
  return { width: w || 640, height: h || 480 };
}

function WebCamViewer() {
  const vidRef = useRef(null);
  const previewRef = useRef(null);
  const hiddenRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const effectRef = useRef('vhs');
  const stripRef = useRef(null);

  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [resolution, setResolution] = useState('640x480');
  const [connected, setConnected] = useState(false);
  const [splashText, setSplashText] = useState(
    'No camera connected.\nSelect a device and click Connect.',
  );
  const [showSplash, setShowSplash] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [statusMsg, setStatusMsg] = useState('Ready');
  const [statusRes, setStatusRes] = useState('---');
  const [dateStampText, setDateStampText] = useState('');
  const [effect, setEffect] = useState('vhs');
  const [flashOn, setFlashOn] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  const updateStamp = useCallback(() => {
    const d = new Date();
    const mo = [
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC',
    ];
    setDateStampText(
      `${String(d.getDate()).padStart(2, '0')} ${mo[d.getMonth()]} ${d.getFullYear()}  ` +
        `${String(d.getHours()).padStart(2, '0')}:${String(
          d.getMinutes(),
        ).padStart(2, '0')}`,
    );
  }, []);

  useEffect(() => {
    updateStamp();
    const t = setInterval(updateStamp, 1000);
    return () => clearInterval(t);
  }, [updateStamp]);

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;
    try {
      const all = await navigator.mediaDevices.enumerateDevices();
      const vids = all.filter(d => d.kind === 'videoinput');
      setDevices(vids);
      setSelectedDeviceId(prev => {
        if (vids.length === 0) return '';
        if (prev && vids.some(d => d.deviceId === prev)) return prev;
        return vids[0].deviceId || '';
      });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    refreshDevices();
    const md = navigator.mediaDevices;
    if (md?.addEventListener) {
      md.addEventListener('devicechange', refreshDevices);
      return () => md.removeEventListener('devicechange', refreshDevices);
    }
    return undefined;
  }, [refreshDevices]);

  const stopRenderLoop = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const renderLoop = useCallback(() => {
    const stream = streamRef.current;
    const vid = vidRef.current;
    const preview = previewRef.current;
    if (!stream || !vid || !preview) return;

    const pCtx = preview.getContext('2d');
    const W = preview.width;
    const H = preview.height;
    if (W && H && vid.readyState >= 2) {
      pCtx.drawImage(vid, 0, 0, W, H);
      applyFilter(pCtx, W, H, effectRef.current, true);
    }
    rafRef.current = requestAnimationFrame(renderLoop);
  }, []);

  useEffect(() => {
    if (connected) {
      rafRef.current = requestAnimationFrame(renderLoop);
    } else {
      stopRenderLoop();
    }
    return stopRenderLoop;
  }, [connected, renderLoop, stopRenderLoop]);

  const doDisconnect = useCallback(() => {
    stopRenderLoop();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (vidRef.current) vidRef.current.srcObject = null;
    const preview = previewRef.current;
    if (preview) {
      const pCtx = preview.getContext('2d');
      pCtx.clearRect(0, 0, preview.width, preview.height);
    }
    setShowSplash(true);
    setSplashText(
      'No camera connected.\nSelect a device and click Connect.',
    );
    setConnected(false);
    setStatusMsg('Disconnected');
    setStatusRes('---');
  }, [stopRenderLoop]);

  useEffect(() => () => doDisconnect(), [doDisconnect]);

  const doConnect = useCallback(async () => {
    const { width: idealW, height: idealH } = parseRes(resolution);
    try {
      setStatusMsg('Connecting to camera...');
      const videoConstraints = selectedDeviceId
        ? {
            deviceId: { exact: selectedDeviceId },
            width: { ideal: idealW },
            height: { ideal: idealH },
          }
        : {
            width: { ideal: idealW },
            height: { ideal: idealH },
            facingMode: 'user',
          };

      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoConstraints,
        audio: false,
      });
      streamRef.current = stream;
      const vid = vidRef.current;
      vid.srcObject = stream;

      await new Promise((resolve, reject) => {
        vid.onloadedmetadata = () => resolve();
        vid.onerror = reject;
        setTimeout(resolve, 8000);
      });

      const W = vid.videoWidth || idealW;
      const H = vid.videoHeight || idealH;
      const preview = previewRef.current;
      const hidden = hiddenRef.current;
      if (preview) {
        preview.width = W;
        preview.height = H;
      }
      if (hidden) {
        hidden.width = W;
        hidden.height = H;
      }

      setShowSplash(false);
      setConnected(true);
      setStatusMsg(`Camera connected — ${W}x${H}`);
      setStatusRes(`${W}x${H}`);
    } catch (e) {
      setSplashText(`Camera access denied.\n${e.message || String(e)}`);
      setShowSplash(true);
      setStatusMsg(`Error: ${e.message || String(e)}`);
      streamRef.current = null;
      setConnected(false);
    }
  }, [resolution, selectedDeviceId]);

  const toggleConnect = useCallback(() => {
    if (streamRef.current) doDisconnect();
    else doConnect();
  }, [doConnect, doDisconnect]);

  const capture = useCallback(() => {
    if (!streamRef.current) return;
    const vid = vidRef.current;
    const hidden = hiddenRef.current;
    if (!vid || !hidden) return;

    setFlashOn(true);
    setTimeout(() => setFlashOn(false), 100);

    const hCtx = hidden.getContext('2d');
    hCtx.drawImage(vid, 0, 0, hidden.width, hidden.height);
    applyFilter(hCtx, hidden.width, hidden.height, effectRef.current, false);

    const stamp = dateStampText;
    hCtx.font = `bold ${Math.round(hidden.height * 0.038)}px Courier New, monospace`;
    hCtx.fillStyle = '#ff6600';
    hCtx.textAlign = 'right';
    hCtx.fillText(stamp, hidden.width - 6, hidden.height - 6);

    const url = hidden.toDataURL('image/jpeg', 0.6);
    setPhotos(prev => {
      const n = prev.length + 1;
      setStatusMsg(`Photo ${n} captured`);
      requestAnimationFrame(() => {
        if (stripRef.current) {
          stripRef.current.scrollLeft = stripRef.current.scrollWidth;
        }
      });
      return [...prev, { url, num: n }];
    });
  }, [dateStampText]);

  const openHelp = useCallback(() => {
    window.alert(
      'WebCam Viewer\nVersion 1.2.4\n\n© 2003 DigiSoft Inc.\nAll rights reserved.',
    );
  }, []);

  const downloadLightbox = useCallback(() => {
    if (!lightbox) return;
    const a = document.createElement('a');
    a.href = lightbox.url;
    a.download = `webcam_${String(lightbox.num).padStart(3, '0')}.jpg`;
    a.click();
  }, [lightbox]);

  return (
    <div className="wcv-root">
      <div className="wcv-menu-bar">
        {['File', 'Edit', 'Capture', 'Effects', 'View', 'Help'].map(m => (
          <div key={m} className="wcv-menu-item">
            {m}
          </div>
        ))}
      </div>

      <div className="wcv-toolbar">
        <select
          className="wcv-xp-select wcv-cam-select"
          value={selectedDeviceId}
          onChange={e => setSelectedDeviceId(e.target.value)}
        >
          {devices.length === 0 && (
            <option value="">Default camera</option>
          )}
          {devices.map(d => (
            <option key={d.deviceId} value={d.deviceId}>
              {d.label || `Camera ${d.deviceId.slice(0, 8)}…`}
            </option>
          ))}
        </select>

        <select
          className="wcv-xp-select wcv-res-select"
          value={resolution}
          onChange={e => setResolution(e.target.value)}
        >
          <option value="640x480">640x480 30</option>
          <option value="320x240">320x240 15</option>
          <option value="160x120">160x120 10</option>
        </select>

        <button type="button" className="wcv-xp-btn primary" onClick={toggleConnect}>
          {connected ? 'Disconnect' : 'Connect'}
        </button>
        <button
          type="button"
          className="wcv-xp-btn"
          onClick={capture}
          disabled={!connected}
        >
          Capture
        </button>

        <div className="wcv-toolbar-sep" />

        <button type="button" className="wcv-xp-btn" onClick={openHelp}>
          About
        </button>
      </div>

      <div className="wcv-main-area">
        <div className="wcv-viewfinder-outer">
          <div className="wcv-viewfinder-inner">
            <video
              ref={vidRef}
              className="wcv-vid"
              autoPlay
              muted
              playsInline
            />
            <canvas ref={previewRef} className="wcv-preview" />
            <canvas ref={hiddenRef} className="wcv-hidden" />
            <div className={`wcv-flash${flashOn ? ' active' : ''}`} />
            <div
              className={`wcv-date-stamp${showSplash ? ' hidden' : ''}`}
            >
              {dateStampText}
            </div>

            {showSplash && (
              <div className="wcv-splash">
                <div className="wcv-splash-text">{splashText}</div>
                <button
                  type="button"
                  className="wcv-splash-connect-btn"
                  onClick={doConnect}
                >
                  Connect
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="wcv-controls-row">
          <span className="wcv-effect-label">Effect:</span>
          <select
            className="wcv-xp-select wcv-effect-select"
            value={effect}
            onChange={e => setEffect(e.target.value)}
          >
            <option value="vhs">VHS Tape (1987)</option>
            <option value="bw">Black &amp; White</option>
            <option value="sepia">Sepia Tone</option>
            <option value="green">Night Vision</option>
            <option value="blown">Overexposed</option>
            <option value="potato">Potato Cam</option>
          </select>
        </div>

        <div className="wcv-strip-section">
          <div className="wcv-strip-header">Captured Photos</div>
          <div className="wcv-photo-strip" ref={stripRef}>
            <div
              className={`wcv-no-photos${photos.length ? ' hidden' : ''}`}
            >
              No photos captured yet.
            </div>
            {photos.map(({ url, num }) => (
              <div
                key={num}
                className="wcv-photo-thumb"
                onClick={() => setLightbox({ url, num })}
                onKeyDown={e => {
                  if (e.key === 'Enter')
                    setLightbox({ url, num });
                }}
                role="button"
                tabIndex={0}
              >
                <img src={url} alt={`Photo ${num}`} />
                <div className="wcv-thumb-num">
                  {String(num).padStart(2, '0')}
                </div>
                <div className="wcv-dl-overlay">Click to view</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="wcv-status-bar">
        <div className="wcv-status-panel">{statusMsg}</div>
        <div className="wcv-status-panel">Photos: {photos.length}</div>
        <div className="wcv-status-panel">{statusRes}</div>
      </div>

      <div
        className={`wcv-lightbox${lightbox ? ' open' : ''}`}
        onClick={e => {
          if (e.target === e.currentTarget) setLightbox(null);
        }}
        onKeyDown={e => {
          if (e.key === 'Escape') setLightbox(null);
        }}
        role="presentation"
      >
        {lightbox && (
          <div className="wcv-lb-window">
            <div className="wcv-lb-titlebar">
              <span>Photo Preview</span>
              <button
                type="button"
                className="wcv-lb-close-btn"
                onClick={() => setLightbox(null)}
              >
                ✕
              </button>
            </div>
            <div className="wcv-lb-body">
              <img src={lightbox.url} alt="" />
              <div className="wcv-lb-actions">
                <button
                  type="button"
                  className="wcv-xp-btn"
                  onClick={downloadLightbox}
                >
                  Save As...
                </button>
                <button
                  type="button"
                  className="wcv-xp-btn"
                  onClick={() => setLightbox(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WebCamViewer;
