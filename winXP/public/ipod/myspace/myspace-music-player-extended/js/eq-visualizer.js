/**
 * MySpace-style EQ Visualizer
 * Usage: attach to any <canvas> element
 * Call: initEQ('your-canvas-id')
 * Stop: stopEQ()
 */

function initEQ(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const COLS = 4;
  const ROWS = 7;
  const SW = 8;   // segment width
  const SH = 3;   // segment height
  const GX = 3;   // gap between columns
  const GY = 1;   // gap between rows
  const OX = 2;   // x offset
  const OY = 1;   // y offset

  canvas.width = COLS * (SW + GX) - GX + OX * 2;
  canvas.height = ROWS * (SH + GY) - GY + OY * 2;

  const lvl = [4, 3, 5, 4].map(v => v * 1.0);
  const tgt = lvl.slice();
  const pk  = lvl.slice();
  const hold = Array(COLS).fill(25);

  let animFrame;

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

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let c = 0; c < COLS; c++) {
      const lit = Math.round(lvl[c]);
      for (let r = 0; r < ROWS; r++) {
        const x = OX + c * (SW + GX);
        const y = OY + (ROWS - 1 - r) * (SH + GY);
        ctx.fillStyle = r < lit ? segColor(r) : dimColor(r);
        ctx.fillRect(x, y, SW, SH);
      }
      const pr = Math.min(Math.round(pk[c]) - 1, ROWS - 1);
      if (pr >= 0) {
        const px2 = OX + c * (SW + GX);
        const py2 = OY + (ROWS - 1 - pr) * (SH + GY);
        ctx.fillStyle = segColor(pr);
        ctx.fillRect(px2, py2, SW, SH);
      }
    }
  }

  function tick() {
    for (let c = 0; c < COLS; c++) {
      if (Math.random() < 0.07) tgt[c] = Math.random() * ROWS * 0.92 + 0.3;
      lvl[c] += (tgt[c] - lvl[c]) * 0.14 + (Math.random() - 0.5) * 0.25;
      lvl[c] = Math.max(0.1, Math.min(ROWS, lvl[c]));
      if (lvl[c] >= pk[c]) { pk[c] = lvl[c]; hold[c] = 24; }
      else if (hold[c] > 0) hold[c]--;
      else pk[c] = Math.max(lvl[c], pk[c] - 0.07);
    }
    draw();
    animFrame = requestAnimationFrame(tick);
  }

  tick();

  window.stopEQ = function () {
    cancelAnimationFrame(animFrame);
  };
}
