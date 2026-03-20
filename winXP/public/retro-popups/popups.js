/**
 * retro-popups — Kaya Wesley / Motivus Holdings
 * Usage: <script src="retro-popups/popups.js"></script>
 *        RetroPopups.init();
 *
 * Swap the placeholder URLs below for your real links.
 */

(function () {

  /* ── CONFIG — update these URLs ── */
  const LINKS = {
    loop:      'https://loop.opaius.com',
    trendy:    'https://trendsetters.me',
    amazon:    'https://a.co/d/4UPegIl',
    bn:        'https://www.barnesandnoble.com/w/captain-cypher-kaya-wesley/1143934342?fbclid=PAQ0xDSwMA5FNleHRuA2FlbQIxMQABp6supClvYKDS-El8g1NCz2Uw6ZKnlZJtw9VmOfHqzCrGAwKWd3WM_g0fL-4W_aem_ssvQnPJjLbf7AGdofOQ3ng',
  };

  /* ── ASSET PATH (relative to wherever you put the folder) ── */
  const ASSETS = (function () {
    const scripts = document.querySelectorAll('script[src]');
    let base = '';
    scripts.forEach(s => {
      if (s.src.includes('popups.js')) {
        base = s.src.replace(/popups\.js.*$/, '');
      }
    });
    if (!base) {
      base = window.location.origin + '/retro-popups/';
    }
    return base + 'assets/';
  })();

  /* ── STATE ── */
  let zTop = 10010;
  const popupIds = ['rp-loop', 'rp-trends', 'rp-cypher'];
  const popupTitles = {
    'rp-loop': 'Loop™ by Opaius — Setup Wizard',
    'rp-trends': 'trendsetters.me — Advertisement',
    'rp-cypher': 'Special Captain Cypher Book Offer',
  };
  const minimized = new Set();
  let taskbarEl = null;

  /* ── HELPERS ── */
  function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

  function ensureTaskbar() {
    if (taskbarEl) return taskbarEl;
    let footerLeft = document.querySelector('.footer__items.left');
    if (footerLeft) {
      taskbarEl = document.createElement('div');
      taskbarEl.className = 'rp-taskbar';
      const startBtn = footerLeft.querySelector('.footer__start');
      if (startBtn && startBtn.nextSibling) {
        footerLeft.insertBefore(taskbarEl, startBtn.nextSibling);
      } else {
        footerLeft.appendChild(taskbarEl);
      }
    } else {
      taskbarEl = document.createElement('div');
      taskbarEl.className = 'rp-taskbar rp-taskbar--standalone';
      document.body.appendChild(taskbarEl);
      /* Retry embedding into footer when it appears (e.g. WinXP mounts after popups) */
      const retry = () => {
        if (taskbarEl && taskbarEl.classList.contains('rp-taskbar--standalone')) {
          const fl = document.querySelector('.footer__items.left');
          if (fl) {
            const startBtn = fl.querySelector('.footer__start');
            taskbarEl.classList.remove('rp-taskbar--standalone');
            taskbarEl.remove();
            taskbarEl = null;
            window.__rp._taskbarEl = null;
            if (document.querySelector('.rp-taskbar')) return;
            taskbarEl = document.createElement('div');
            taskbarEl.className = 'rp-taskbar';
            if (startBtn && startBtn.nextSibling) {
              fl.insertBefore(taskbarEl, startBtn.nextSibling);
            } else {
              fl.appendChild(taskbarEl);
            }
            minimized.forEach(id => {
              const btn = document.querySelector('[data-popup-id="' + id + '"]');
              if (btn) fl.querySelector('.rp-taskbar').appendChild(btn);
            });
          }
        }
      };
      setTimeout(retry, 500);
      requestAnimationFrame(() => setTimeout(retry, 100));
    }
    return taskbarEl;
  }

  function minimizePopup(id) {
    const el = document.getElementById(id);
    if (!el || minimized.has(id)) return;
    minimized.add(id);
    el.style.display = 'none';
    const title = popupTitles[id] || id;
    const tb = ensureTaskbar();
    const btn = document.createElement('button');
    btn.className = 'rp-taskbar-btn';
    btn.type = 'button';
    btn.dataset.popupId = id;
    btn.innerHTML = '<span class="rp-taskbar-btn__icon">◆</span><span class="rp-taskbar-btn__text">' + title + '</span>';
    btn.onclick = function () { restorePopup(id); };
    tb.appendChild(btn);
  }

  function restorePopup(id) {
    if (!minimized.has(id)) return;
    minimized.delete(id);
    const el = document.getElementById(id);
    if (el) {
      el.style.display = 'block';
      el.style.zIndex = ++zTop;
    }
    const btn = taskbarEl && taskbarEl.querySelector('[data-popup-id="' + id + '"]');
    if (btn) btn.remove();
  }

  function showPopup(id) {
    const el = document.getElementById(id);
    if (!el) {
      console.warn('[RetroPopups] Popup not found:', id);
      return;
    }
    const alreadyVisible = el.style.display === 'block';
    if (!alreadyVisible) {
      el.style.top  = rand(6, 26) + '%';
      el.style.left = rand(4, 42) + '%';
    }
    el.style.zIndex = ++zTop;
    el.style.display = 'block';
    if (!alreadyVisible) {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.12s';
      el.style.visibility = 'visible';
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.opacity = '1'; }));
      setTimeout(() => { if (el.style.opacity === '0') el.style.opacity = '1'; }, 150);
    } else {
      el.style.visibility = 'visible';
      el.style.opacity = '1';
    }
  }

  function closePopup(id) {
    const el = document.getElementById(id);
    if (!el) return;
    /* If minimized, remove from taskbar */
    if (minimized.has(id)) {
      minimized.delete(id);
      const btn = taskbarEl && taskbarEl.querySelector('[data-popup-id="' + id + '"]');
      if (btn) btn.remove();
    }
    el.style.transition = 'opacity 0.1s';
    el.style.opacity = '0';
    setTimeout(() => { el.style.display = 'none'; el.style.opacity = '1'; }, 120);
  }

  function handleEmail(inputId, redirect, popupId, msgId) {
    const email = document.getElementById(inputId).value.trim();
    const msg   = document.getElementById(msgId);
    if (!email || !email.includes('@')) {
      msg.style.color = '#cc0000';
      msg.textContent = '⚠ Please enter a valid e-mail address.';
      return;
    }
    msg.style.color = '#009900';
    msg.textContent = '✓ Got it! Loading...';
    // ↓ Replace with your real email endpoint (Beehiiv, Resend, etc.)
    console.log('[RetroPopups] email:', email, '→', redirect);
    setTimeout(() => { window.open(redirect, 'rp_external'); /* Named target = 1 tab only; popup stays open */ }, 1300);
  }

  const RP_WINDOW_NAME = 'rp_external';
  function goTo(url, popupId) {
    window.open(url, RP_WINDOW_NAME);
    /* Named target reuses same tab if multiple handlers fire; keeps popup open */
  }

  function makeDraggable(el) {
    const bar = el.querySelector('.rp-bar');
    if (!bar) return;
    let drag = false, ox = 0, oy = 0;
    bar.addEventListener('mousedown', e => {
      if (e.target.tagName === 'BUTTON') return;
      drag = true;
      ox = e.clientX - el.getBoundingClientRect().left;
      oy = e.clientY - el.getBoundingClientRect().top;
      el.style.zIndex = ++zTop;
      e.preventDefault();
    });
    document.addEventListener('mousemove', e => {
      if (!drag) return;
      el.style.left = (e.clientX - ox) + 'px';
      el.style.top  = (e.clientY - oy) + 'px';
    });
    document.addEventListener('mouseup', () => drag = false);
  }

  /* ── INJECT CSS ── */
  function injectStyles() {
    const css = `
      #rp-container {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147483647;
      }
      #rp-container .rp-popup { pointer-events: auto; }
      .rp-popup {
        position: fixed;
        display: none;
        user-select: none;
        font-family: Tahoma, Verdana, sans-serif;
        font-size: 12px;
        z-index: 10010;
      }

      /* ── Win98 title bar shared ── */
      .rp-bar {
        padding: 2px 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: move;
      }
      .rp-bar-title {
        color: #fff;
        font-size: 11px;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 4px;
        overflow: hidden;
        white-space: nowrap;
      }
      .rp-btns { display: flex; gap: 2px; }
      .rp-btn {
        width: 16px; height: 14px;
        background: #d4d0c8;
        border: 2px solid;
        border-color: #fff #808080 #808080 #fff;
        color: #000;
        font-size: 9px;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        font-family: Tahoma;
        line-height: 1;
      }
      .rp-btn:active { border-color: #808080 #fff #fff #808080; }
      .rp-btn.x { background: #c0392b; color: #fff; border-color: #8b0000; }

      /* Taskbar (minimized popups) — matches WinXP footer style */
      .rp-taskbar {
        display: flex;
        align-items: center;
        gap: 2px;
        height: 100%;
        margin-right: 4px;
      }
      .rp-taskbar--standalone {
        position: fixed;
        bottom: 0;
        left: 60px;
        height: 30px;
        z-index: 10005;
        align-items: center;
        margin: 0;
      }
      .rp-taskbar-btn {
        flex: 1;
        max-width: 150px;
        color: #fff;
        border-radius: 2px;
        margin-top: 2px;
        padding: 0 8px;
        height: 22px;
        font-size: 11px;
        font-family: Tahoma, sans-serif;
        background-color: #3c81f3;
        border: none;
        cursor: pointer;
        box-shadow: inset -1px 0px rgba(0, 0, 0, 0.3),
          inset 1px 1px 1px rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        gap: 4px;
        overflow: hidden;
      }
      .rp-taskbar-btn:hover {
        background-color: #53a3ff;
      }
      .rp-taskbar-btn__icon { font-size: 10px; flex-shrink: 0; }
      .rp-taskbar-btn__text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* outset/inset classic button */
      .rp-classic-btn {
        background: #d4d0c8;
        border: 2px solid;
        border-color: #fff #808080 #808080 #fff;
        padding: 3px 14px;
        font-size: 11px;
        cursor: pointer;
        font-family: Tahoma, sans-serif;
        color: #000;
        white-space: nowrap;
        min-width: 75px;
        text-align: center;
      }
      .rp-classic-btn:active { border-color: #808080 #fff #fff #808080; }

      /* email input */
      .rp-email-input {
        flex: 1;
        border: 2px inset #808080;
        padding: 3px 6px;
        font-size: 11px;
        font-family: Tahoma, sans-serif;
        background: #fff;
        outline: none;
      }

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         LOOP — CD-ROM installer
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
      #rp-loop {
        width: 440px;
        max-width: 96vw;
        background: #d4d0c8;
        border: 2px solid;
        border-color: #fff #808080 #808080 #fff;
        box-shadow: 3px 3px 6px rgba(0,0,0,0.5);
      }
      #rp-loop .rp-bar { background: linear-gradient(to right, #000080, #1084d0); }
      #rp-loop .lp-inner { padding: 8px; }
      #rp-loop .lp-top {
        background: #fff;
        border: 2px inset #808080;
        padding: 10px 12px;
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }
      #rp-loop .lp-cd {
        width: 72px; height: 72px;
        flex-shrink: 0;
        object-fit: contain;
        animation: rp-spin 4s linear infinite;
      }
      @keyframes rp-spin { to { transform: rotate(360deg); } }
      #rp-loop .lp-top-text h2 {
        font-size: 13px;
        font-weight: bold;
        color: #000080;
        margin-bottom: 3px;
      }
      #rp-loop .lp-logo-img {
        max-width: 118px;
        margin-bottom: 4px;
        display: block;
      }
      #rp-loop .lp-top-text p { font-size: 10px; color: #444; }
      #rp-loop .lp-progress-label {
        font-size: 10px; color: #000; margin-bottom: 2px;
      }
      #rp-loop .lp-track {
        height: 16px;
        background: #fff;
        border: 2px inset #808080;
        margin-bottom: 8px;
        overflow: hidden;
        position: relative;
      }
      #rp-loop .lp-fill {
        height: 100%;
        width: 0%;
        background: #000080;
        animation: lp-load 3s ease-out forwards;
      }
      @keyframes lp-load { to { width: 100%; } }
      #rp-loop .lp-specs {
        background: #fff;
        border: 2px inset #808080;
        padding: 6px 10px;
        margin-bottom: 8px;
      }
      #rp-loop .lp-spec {
        font-size: 10px; color: #000;
        padding: 2px 0;
        border-bottom: 1px dotted #ccc;
        display: flex; gap: 5px; align-items: flex-start;
      }
      #rp-loop .lp-spec:last-child { border-bottom: none; }
      #rp-loop .lp-check { color: #009900; font-weight: bold; flex-shrink: 0; }
      #rp-loop .lp-email-box {
        background: #fff;
        border: 2px inset #808080;
        padding: 8px;
        margin-bottom: 8px;
      }
      #rp-loop .lp-email-label { font-size: 10px; font-weight: bold; color: #000; margin-bottom: 5px; }
      #rp-loop .lp-row { display: flex; gap: 4px; }
      #rp-loop .lp-msg { font-size: 10px; color: #009900; min-height: 13px; margin-top: 3px; }
      #rp-loop .lp-footer {
        display: flex; justify-content: flex-end; gap: 4px;
        border-top: 1px solid #808080;
        padding-top: 6px;
      }
      #rp-loop .lp-site-link {
        font-size: 10px; color: #000080; text-decoration: underline;
        cursor: pointer; background: none; border: none; padding: 0;
        font-family: Tahoma; text-align: left;
      }

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         TRENDSETTERS — raw ad
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
      #rp-trends {
        position: relative;
        width: 390px;
        max-width: 96vw;
        background: #000;
        border: 3px solid #ffff00;
        box-shadow: 4px 4px 0 #000;
        font-family: 'Comic Sans MS', cursive, Tahoma, sans-serif;
      }
      #rp-trends .rp-bar {
        background: #ffff00;
        border-bottom: 2px solid #cc9900;
      }
      #rp-trends .rp-bar-title { color: #000; }
      #rp-trends .rp-btn { background: #d4d0c8; }
      #rp-trends .ts-ticker-wrap {
        background: #ffff00;
        overflow: hidden;
        padding: 2px 0;
        border-bottom: 2px solid #000;
      }
      #rp-trends .ts-ticker {
        display: inline-block;
        white-space: nowrap;
        animation: ts-scroll 7s linear infinite;
        font-size: 10px;
        font-weight: bold;
        color: #cc0000;
        font-family: Tahoma, sans-serif;
        letter-spacing: 1px;
      }
      @keyframes ts-scroll { from { transform: translateX(420px); } to { transform: translateX(-100%); } }
      #rp-trends .ts-hero {
        background: #000;
        padding: 14px 12px 8px;
        border-bottom: 3px solid #ffff00;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-start;
        gap: 10px 14px;
      }
      #rp-trends .ts-logo {
        max-width: 260px;
        max-height: 30px;
        width: auto;
        height: auto;
        margin: 0;
        flex-shrink: 0;
      }
      #rp-trends .ts-tag {
        font-size: 11px;
        color: #ffff00;
        font-weight: bold;
        font-family: Tahoma, sans-serif;
        margin: 0;
      }
      #rp-trends .ts-blink { width: 100%; }
      #rp-trends .ts-blink {
        font-size: 10px;
        color: #ff0000;
        font-weight: bold;
        font-family: Tahoma, sans-serif;
        animation: ts-blink 0.6s step-end infinite;
      }
      @keyframes ts-blink { 50% { opacity: 0; } }
      #rp-trends .ts-body { padding: 10px 12px; }
      #rp-trends .ts-list { list-style: none; margin-bottom: 10px; }
      #rp-trends .ts-list li {
        color: #ffff00;
        font-size: 10px;
        padding: 3px 0;
        border-bottom: 1px solid #222;
        font-family: Tahoma, sans-serif;
      }
      #rp-trends .ts-list li::before { content: '» '; color: #ff6600; }
      #rp-trends .ts-email-row { display: flex; gap: 0; margin-bottom: 5px; }
      #rp-trends .ts-email-input {
        flex: 1;
        background: #fff;
        border: 2px inset #808080;
        padding: 4px 6px;
        font-size: 11px;
        font-family: Tahoma, sans-serif;
        outline: none;
      }
      #rp-trends .ts-go {
        background: #ffff00;
        color: #000;
        border: 2px outset #ffff00;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: bold;
        cursor: pointer;
        font-family: 'Arial Black', sans-serif;
        white-space: nowrap;
      }
      #rp-trends .ts-go:active { border-style: inset; }
      #rp-trends .ts-or {
        font-size: 10px; color: #888;
        text-align: center; margin: 4px 0;
        font-family: Tahoma, sans-serif;
      }
      #rp-trends .ts-site-btn {
        display: block;
        width: 100%;
        background: #ffff00;
        color: #000;
        border: 2px outset #cc9900;
        padding: 5px;
        font-size: 11px;
        font-weight: bold;
        cursor: pointer;
        font-family: 'Arial Black', sans-serif;
        text-align: center;
        letter-spacing: 1px;
      }
      #rp-trends .ts-site-btn:active { border-style: inset; }
      #rp-trends .ts-msg { font-size: 10px; color: #00ff00; min-height: 13px; font-family: Tahoma, sans-serif; }
      #rp-trends .ts-fine {
        font-size: 9px; color: #444;
        padding: 5px 10px;
        border-top: 1px solid #222;
        font-family: Tahoma, sans-serif;
      }
      /* DVD-style bouncing t-shirt overlay — floats over content like classic DVD screensaver */
      #rp-trends .ts-dvd-screen {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
        z-index: 10;
      }
      #rp-trends .ts-dvd-tshirt {
        position: absolute;
        width: 72px;
        height: auto;
        object-fit: contain;
      }

      /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━
         CAPTAIN CYPHER — book ad
      ━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
      #rp-cypher {
        width: 450px;
        max-width: 96vw;
        background: #d4d0c8;
        border: 2px solid;
        border-color: #fff #808080 #808080 #fff;
        box-shadow: 3px 3px 6px rgba(0,0,0,0.5);
      }
      #rp-cypher .rp-bar { background: linear-gradient(to right, #cc0000, #ff3300); }
      #rp-cypher .cy-inner { padding: 8px; }
      #rp-cypher .cy-ad {
        background: #fff;
        border: 2px inset #808080;
        margin-bottom: 8px;
        overflow: hidden;
      }
      #rp-cypher .cy-banner {
        background: linear-gradient(to right, #cc0000, #ff3300);
        padding: 5px 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      #rp-cypher .cy-banner span {
        color: #fff;
        font-size: 10px;
        font-weight: bold;
        font-family: 'Arial Black', sans-serif;
        letter-spacing: 1px;
      }
      #rp-cypher .cy-free-badge {
        background: #ffdd00;
        color: #cc0000;
        font-size: 9px;
        font-weight: 900;
        padding: 2px 7px;
        font-family: 'Arial Black', sans-serif;
        border: 1px solid #cc9900;
        white-space: nowrap;
      }
      #rp-cypher .cy-content {
        display: flex;
        min-height: 130px;
      }
      #rp-cypher .cy-left {
        width: 120px;
        flex-shrink: 0;
        background: #f8f0d0;
        border-right: 1px solid #ddd;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
      }
      #rp-cypher .cy-cover {
        width: 100px;
        height: 110px;
        object-fit: cover;
        border: 1px solid #999;
        box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
      }
      #rp-cypher .cy-right { flex: 1; padding: 10px 12px; }
      #rp-cypher .cy-logo {
        max-width: 200px;
        display: block;
        margin-bottom: 4px;
        filter: invert(1);
        background: #000;
        padding: 3px 6px;
      }
      #rp-cypher .cy-by {
        font-size: 10px;
        color: #555;
        font-family: 'Times New Roman', serif;
        font-style: italic;
        margin-bottom: 6px;
      }
      #rp-cypher .cy-bullets { list-style: none; margin-bottom: 0; }
      #rp-cypher .cy-bullets li {
        font-size: 10px;
        color: #000;
        padding: 2px 0;
        font-family: Tahoma, sans-serif;
        display: flex; align-items: flex-start; gap: 4px;
      }
      #rp-cypher .cy-bullets li::before { content: '✔'; color: #009900; flex-shrink: 0; }
      #rp-cypher .cy-callout {
        background: #ffffc0;
        border: 1px solid #cc9900;
        border-left: 4px solid #cc0000;
        padding: 6px 10px;
        font-size: 10px;
        color: #000;
        font-family: 'Times New Roman', serif;
        font-style: italic;
        line-height: 1.4;
      }
      #rp-cypher .cy-email-section {
        background: #f0f0f0;
        border: 2px inset #808080;
        padding: 8px;
        margin-bottom: 8px;
      }
      #rp-cypher .cy-email-label { font-size: 10px; font-weight: bold; color: #000; margin-bottom: 4px; font-family: Tahoma; }
      #rp-cypher .cy-email-row { display: flex; gap: 4px; margin-bottom: 4px; }
      #rp-cypher .cy-msg { font-size: 10px; color: #009900; min-height: 13px; font-family: Tahoma; }
      #rp-cypher .cy-or { font-size: 10px; color: #555; text-align: center; margin: 4px 0; font-family: Tahoma; }
      #rp-cypher .cy-store-btns { display: flex; gap: 4px; }
      #rp-cypher .cy-store-btn {
        flex: 1;
        padding: 5px 4px;
        font-size: 10px;
        font-weight: bold;
        cursor: pointer;
        font-family: Tahoma, sans-serif;
        text-align: center;
        border: 2px solid;
        border-color: #fff #808080 #808080 #fff;
        background: #d4d0c8;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
      }
      #rp-cypher .cy-store-btn:active { border-color: #808080 #fff #fff #808080; }
      #rp-cypher .cy-store-btn img { height: 16px; object-fit: contain; filter: invert(0); }
      #rp-cypher .cy-store-btn.amz { background: #ff9900; border-color: #cc7700 #885500 #885500 #cc7700; color: #000; }
      #rp-cypher .cy-store-btn.bn { background: #3e7b5c; border-color: #5aaa7e #1a4a2e #1a4a2e #5aaa7e; color: #fff; }
      #rp-cypher .cy-footer {
        display: flex; justify-content: flex-end; gap: 4px;
        border-top: 1px solid #808080;
        padding-top: 6px;
      }
      #rp-cypher .cy-fine {
        font-size: 8px; color: #808080;
        text-align: center;
        margin-top: 5px;
        font-family: Tahoma, sans-serif;
      }
    `;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  /* ── BUILD HTML ── */
  function buildPopups() {
    if (document.getElementById('rp-container')) return;
    const html = `

    <!-- LOOP POPUP -->
    <div class="rp-popup" id="rp-loop">
      <div class="rp-bar">
        <div class="rp-bar-title">💿 Loop™ by Opaius — Setup Wizard</div>
        <div class="rp-btns">
          <button class="rp-btn" onclick="window.__rp.minimize('rp-loop')">_</button>
          <button class="rp-btn">□</button>
          <button class="rp-btn x" onclick="window.__rp.close('rp-loop')">✕</button>
        </div>
      </div>
      <div class="lp-inner">
        <div class="lp-top">
          <img class="lp-cd" src="${ASSETS}cd.png" alt="CD">
          <div class="lp-top-text">
            <img class="lp-logo-img" src="${ASSETS}loop-logo.png" alt="Loop">
            <h2>Quality Intelligence Platform</h2>
            <p>Insert disc or enter your e-mail to begin free installation.</p>
          </div>
        </div>
        <div class="lp-progress-label">Loading components... please wait</div>
        <div class="lp-track"><div class="lp-fill"></div></div>
        <div class="lp-specs">
          <div class="lp-spec"><span class="lp-check">✔</span><span>Real-time defect tracking & recall prevention for OEM teams</span></div>
          <div class="lp-spec"><span class="lp-check">✔</span><span>AI-powered recall risk prediction engine</span></div>
          <div class="lp-spec"><span class="lp-check">✔</span><span>Part-level QR traceability — Nissan, Ford, VW, Rivian & more</span></div>
          <div class="lp-spec"><span class="lp-check">✔</span><span>Free tier available. No credit card required.</span></div>
        </div>
        <div class="lp-email-box">
          <div class="lp-email-label">Enter work e-mail to receive download link:</div>
          <div class="lp-row">
            <input class="rp-email-input" type="email" placeholder="user@company.com" id="rp-loop-email">
            <button class="rp-classic-btn" onclick="window.__rp.email('rp-loop-email','${LINKS.loop}','rp-loop','rp-loop-msg')">Next &gt;</button>
          </div>
          <div class="lp-msg" id="rp-loop-msg"></div>
        </div>
        <div class="lp-footer">
          <button class="lp-site-link" onclick="window.__rp.go('${LINKS.loop}','rp-loop')">🌐 Visit loop.opaius.com</button>
          <button class="rp-classic-btn" onclick="window.__rp.email('rp-loop-email','${LINKS.loop}','rp-loop','rp-loop-msg')">Install</button>
          <button class="rp-classic-btn" onclick="window.__rp.close('rp-loop')">Cancel</button>
        </div>
      </div>
    </div>

    <!-- TRENDSETTERS POPUP -->
    <div class="rp-popup" id="rp-trends">
      <div class="rp-bar">
        <div class="rp-bar-title">🌐 trendsetters.me — Advertisement</div>
        <div class="rp-btns">
          <button class="rp-btn" onclick="window.__rp.minimize('rp-trends')">_</button>
          <button class="rp-btn">□</button>
          <button class="rp-btn x" style="background:#000;border-color:#ffff00;color:#ffff00;" onclick="window.__rp.close('rp-trends')">✕</button>
        </div>
      </div>
      <div class="ts-ticker-wrap">
        <span class="ts-ticker">★ LIMITED DROP — JOIN BEFORE IT'S GONE ★ TASTE-MAKERS ONLY ★ STAY AHEAD OF THE CULTURE ★ THE BRAND BUILT DIFFERENT ★</span>
      </div>
      <div class="ts-hero">
        <img class="ts-logo" src="${ASSETS}trendsetters-logo.png" alt="TRENDSETTERS">
        <div class="ts-tag">You have been personally selected.</div>
        <div class="ts-blink">⚠ INVITE ONLY — SPOTS FILLING FAST ⚠</div>
      </div>
      <div class="ts-body">
        <ul class="ts-list">
          <li>First access to drops — before anyone else</li>
          <li>Fashion that moves culture, not the other way around</li>
          <li>Community of builders, taste-makers & originals</li>
        </ul>
        <div class="ts-email-row">
          <input class="ts-email-input" type="email" placeholder="your@email.com" id="rp-trends-email">
          <button class="ts-go" onclick="window.__rp.email('rp-trends-email','${LINKS.trendy}','rp-trends','rp-trends-msg')">JOIN NOW &gt;&gt;</button>
        </div>
        <div class="ts-msg" id="rp-trends-msg"></div>
        <div class="ts-or">— or —</div>
        <button class="ts-site-btn" onclick="window.__rp.go('${LINKS.trendy}','rp-trends')">VISIT TRENDSETTERS.ME »</button>
      </div>
      <div class="ts-fine">trendsetters.me — This is an advertisement. Unsubscribe anytime.</div>
      <div class="ts-dvd-screen">
        <img class="ts-dvd-tshirt" src="${ASSETS}trendsetter-tshirt.png" alt="">
      </div>
    </div>

    <!-- CAPTAIN CYPHER POPUP -->
    <div class="rp-popup" id="rp-cypher">
      <div class="rp-bar">
        <div class="rp-bar-title">📖 Special Captain Cypher Book Offer</div>
        <div class="rp-btns">
          <button class="rp-btn" onclick="window.__rp.minimize('rp-cypher')">_</button>
          <button class="rp-btn">□</button>
          <button class="rp-btn x" onclick="window.__rp.close('rp-cypher')">✕</button>
        </div>
      </div>
      <div class="cy-inner">
        <div class="cy-ad">
          <div class="cy-banner">
            <span>★ NEW CHILDREN'S BOOK — AGES 3+ ★</span>
            <div class="cy-free-badge">FREE CHAPTER</div>
          </div>
          <div class="cy-content">
            <div class="cy-left">
              <img class="cy-cover" src="${ASSETS}cypher-cover.jpg" alt="Captain Cypher Book Cover">
            </div>
            <div class="cy-right">
              <img class="cy-logo" src="${ASSETS}cypher-digital.png" alt="Captain Cypher">
              <div class="cy-by">by Kaya Wesley</div>
              <ul class="cy-bullets">
                <li>The Battle Against The Rampaging Robot!</li>
                <li>Award-winning illustrations. Ages 3+</li>
                <li>Available in digital & physical editions</li>
              </ul>
            </div>
          </div>
          <div class="cy-callout">"A story that sparks imagination and teaches kids that they have the power to solve any problem."</div>
        </div>
        <div class="cy-email-section">
          <div class="cy-email-label">✉ Enter e-mail to receive a FREE chapter instantly:</div>
          <div class="cy-email-row">
            <input class="rp-email-input" type="email" placeholder="yourname@email.com" id="rp-cypher-email">
            <button class="rp-classic-btn" onclick="window.__rp.email('rp-cypher-email','${LINKS.amazon}','rp-cypher','rp-cypher-msg')">Send It!</button>
          </div>
          <div class="cy-msg" id="rp-cypher-msg"></div>
          <div class="cy-or">— or buy your copy now —</div>
          <div class="cy-store-btns">
            <button class="cy-store-btn amz" onclick="window.__rp.go('${LINKS.amazon}','rp-cypher')">
              🛒 Buy on Amazon / Kindle
            </button>
            <button class="cy-store-btn bn" onclick="window.__rp.go('${LINKS.bn}','rp-cypher')">
              📚 Barnes &amp; Noble
            </button>
          </div>
        </div>
        <div class="cy-footer">
          <button class="rp-classic-btn" onclick="window.__rp.close('rp-cypher')">Close</button>
        </div>
        <div class="cy-fine">captaincypher.com — Your info is safe. We hate spam too. Unsubscribe anytime.</div>
      </div>
    </div>
    `;

    const container = document.createElement('div');
    container.id = 'rp-container';
    container.innerHTML = html;
    document.body.appendChild(container);
    document.querySelectorAll('.rp-popup').forEach(makeDraggable);
    try { startDvdTshirt(); } catch (e) { console.warn('[RetroPopups] DVD t-shirt anim:', e); }
    /* Popups only start after user clicks Next on Welcome window (welcome-complete event) */
  }

  function startDvdTshirt() {
    const popup = document.getElementById('rp-trends');
    const img = popup && popup.querySelector('.ts-dvd-tshirt');
    if (!popup || !img) return;
    let x = 20, y = 20, dx = 0.25, dy = 0.2;
    function tick() {
      const screen = popup.querySelector('.ts-dvd-screen');
      if (!screen) { requestAnimationFrame(tick); return; }
      const r = screen.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) {
        requestAnimationFrame(tick);
        return;
      }
      const w = 64;
      const h = (img.naturalHeight && img.naturalWidth) ? Math.round((img.naturalHeight / img.naturalWidth) * w) : 80;
      x += dx;
      y += dy;
      if (x <= 0) { x = 0; dx = -dx; }
      if (x >= r.width - w) { x = r.width - w; dx = -dx; }
      if (y <= 0) { y = 0; dy = -dy; }
      if (y >= r.height - h) { y = r.height - h; dy = -dy; }
      img.style.left = x + 'px';
      img.style.top = y + 'px';
      img.style.width = w + 'px';
      requestAnimationFrame(tick);
    }
    tick();
  }

  /* ── PUBLIC API ── */
  window.__rp = {
    close: closePopup,
    go: goTo,
    email: handleEmail,
    show: showPopup,
    minimize: minimizePopup,
    restore: restorePopup,
  };

  window.RetroPopups = {
    init() {
      function startPopupSequence() {
        const shuffled = [...popupIds].sort(() => Math.random() - 0.5);
        const shown = new Set();
        let firstShown = false;

        function showNext() {
          const available = shuffled.filter(id => !shown.has(id));
          if (available.length === 0) return;
          const id = firstShown ? available[rand(0, available.length - 1)] : (firstShown = true, 'rp-trends');
          if (shown.has(id)) return;
          shown.add(id);
          showPopup(id);
        }

        /* First popup ~1s after user clicks Next (always Trendsetters) */
        setTimeout(showNext, 1000);

        /* Timed: show remaining popups every 12–18 seconds */
        const interval = setInterval(() => {
          if (shuffled.every(id => shown.has(id))) {
            clearInterval(interval);
            return;
          }
          showNext();
        }, rand(12, 18) * 1000);
      }

      /* Wait for welcome-complete event (user clicked Next) before showing any popups */
      window.addEventListener('welcome-complete', startPopupSequence, { once: true });
    },
    show: showPopup,
    close: closePopup,
  };

  /* ── BOOT ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { injectStyles(); buildPopups(); });
  } else {
    injectStyles();
    buildPopups();
  }

})();
