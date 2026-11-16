/* Deniz Kromaj intro: elektroliz + krom kaplama animasyonu (ilk ziyarette bir kez) */
(function () {
  const el = document.getElementById('intro');
  if (!el) return;
  let seen = false;
  try { seen = sessionStorage.getItem('dk-intro') === '1'; } catch (e) {}
  if (seen || matchMedia('(prefers-reduced-motion: reduce)').matches) { el.remove(); return; }
  document.body.classList.add('intro-on');

  const TITLE = 'DENİZ KROMAJ', SUB = 'YÜZEY TEKNOLOJİLERİ', TAG = 'SAVUNMA  ·  HAVACILIK  ·  ENDÜSTRİ';
  const BG = '#0a0e13', BLUE = '#5cc8ff', CH = 'ABCDEFGHİKLMNOPRSTUVYZ0123456789#%';
  const cl = v => Math.max(0, Math.min(1, v)), eio = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, eo = t => 1 - Math.pow(1 - t, 3);
  const cv = document.getElementById('intro-cv'), ctx = cv.getContext('2d');
  const vw = innerWidth, vh = innerHeight, dpr = Math.min(devicePixelRatio || 1, 2);
  const k = Math.min(vw / 1920, vh / 1080), W = vw / k, H = vh / k, OX = (W - 1920) / 2;
  const portrait = vh > vw, u = Math.max(1, .5 / k), L = v => Math.max(v, .8 / k);
  cv.width = vw * dpr; cv.height = vh * dpr; ctx.setTransform(k * dpr, 0, 0, k * dpr, 0, 0);
  const mk = () => { const o = document.createElement('canvas'); o.width = vw * dpr; o.height = vh * dpr; const x = o.getContext('2d'); x.setTransform(k * dpr, 0, 0, k * dpr, 0, 0); return { o, x }; };
  const ls = (x, v) => { if ('letterSpacing' in x) x.letterSpacing = v + 'px'; };
  const line = (x, a, b, c, d) => { x.beginPath(); x.moveTo(a, b); x.lineTo(c, d); x.stroke(); };
  const draw = (x, o) => x.drawImage(o, 0, 0, W, H);
  const MONO = s => '500 ' + s + 'px "IBM Plex Mono", monospace';
  const EY = H - 92 * Math.min(u, 2), CX = W / 2;
  let fz, cy, tTop, tBot, tW, B, BP, T, C, D, P, ps, fl = [], arcs = [], amb = [], raf, start, done = false;

  function fit(x, font, size, sp, txt, maxW) {
    for (; size > 8; size -= 1) { x.font = font(size); ls(x, sp); if (x.measureText(txt).width <= maxW) break; }
    return size;
  }
  function title(x, fill) { x.clearRect(0, 0, W, H); x.font = '700 ' + fz + 'px Montserrat'; x.textAlign = 'center'; x.textBaseline = 'middle'; ls(x, 14); x.fillStyle = fill; x.fillText(TITLE, CX, cy); }
  function chrome(x) { const g = x.createLinearGradient(0, tTop - 10, 0, tBot + 10); g.addColorStop(0, '#ffffff'); g.addColorStop(.4, '#b4bec9'); g.addColorStop(.52, '#3c4652'); g.addColorStop(.62, '#cfd7e0'); g.addColorStop(1, '#f5f8fb'); return g; }
  function arrow(x, ax, ay, dir) { x.beginPath(); x.moveTo(ax, ay); x.lineTo(ax + dir * 14, ay - 5); x.lineTo(ax + dir * 14, ay + 5); x.closePath(); x.fill(); }
  function hatch(x, rx, ry, rw, rh) { x.save(); x.beginPath(); x.rect(rx, ry, rw, rh); x.clip(); for (let i = -rh; i < rw; i += 9) line(x, rx + i, ry + rh, rx + i + rh, ry); x.restore(); }
  function callout(x, px, py, qx, qy, ex, txt) { x.beginPath(); x.moveTo(px, py); x.lineTo(qx, qy); x.lineTo(ex, qy); x.stroke(); x.beginPath(); x.arc(px, py, 4, 0, 7); x.fill(); x.font = MONO(18); x.textBaseline = 'bottom'; x.textAlign = ex > qx ? 'left' : 'right'; ls(x, 2); x.fillText(txt, qx + (ex > qx ? 6 : -6), qy - 6); }

  function blueprint() {
    const x = BP.x; x.strokeStyle = x.fillStyle = 'rgb(120,210,255)'; const lw = L(1.6), lt = L(1);
    x.save(); x.translate(OX, portrait ? 160 : 0); x.lineWidth = lw;
    x.strokeRect(150, 205, 170, 90); hatch(x, 160, 215, 150, 70);
    x.beginPath(); x.moveTo(320, 222); x.lineTo(1000, 232); x.lineTo(1000, 268); x.lineTo(320, 278); x.closePath(); x.stroke();
    x.lineWidth = lt; line(x, 320, 240, 1000, 243); line(x, 320, 260, 1000, 257); hatch(x, 560, 226, 80, 13); hatch(x, 560, 261, 80, 13);
    x.lineWidth = lw; x.strokeRect(1000, 222, 112, 56); for (let i = 0; i < 4; i++) x.strokeRect(1014 + i * 24, 230, 12, 40);
    x.lineWidth = lt; x.setLineDash([34, 8, 4, 8]); line(x, 110, 250, 1160, 250); x.setLineDash([]);
    line(x, 150, 300, 150, 335); line(x, 1112, 282, 1112, 335); line(x, 150, 325, 1112, 325); arrow(x, 150, 325, 1); arrow(x, 1112, 325, -1);
    x.font = MONO(18); x.textAlign = 'center'; x.textBaseline = 'bottom'; ls(x, 2); x.fillText('L = 52 CAL', 631, 319);
    x.textAlign = 'left'; x.fillText('NAMLU KESİTİ  A-A', 150, 192);
    callout(x, 760, 251, 820, 150, 1110, 'İÇ YÜZEY · SERT KROM');
    const jx = 1560, jy = 250, pts = [[240, 0], [170, -12], [60, -18], [-40, -122], [-82, -122], [-60, -22], [-130, -22], [-182, -72], [-206, -72], [-192, -16], [-216, -10]];
    const full = pts.concat(pts.slice(1, -1).reverse().map(p => [p[0], -p[1]])).concat([[-216, 10]]);
    x.lineWidth = lw; x.beginPath(); full.forEach((p, i) => i ? x.lineTo(jx + p[0], jy + p[1]) : x.moveTo(jx + p[0], jy + p[1])); x.closePath(); x.stroke();
    x.lineWidth = lt; x.setLineDash([34, 8, 4, 8]); line(x, jx - 260, jy, jx + 280, jy); x.setLineDash([]);
    line(x, jx + 60, jy - 18, jx - 60, jy - 22); line(x, jx + 60, jy + 18, jx - 60, jy + 22);
    x.beginPath(); x.arc(jx + 10, jy + 46, 7, 0, 7); x.stroke(); x.beginPath(); x.arc(jx + 10, jy - 46, 7, 0, 7); x.stroke();
    x.font = MONO(18); x.textAlign = 'right'; x.textBaseline = 'top'; ls(x, 2); x.fillText('HAVACILIK  C-C', jx + 260, jy + 140);
    callout(x, jx + 10, jy + 46, jx - 40, jy + 150, jx - 360, 'İNİŞ TAKIMI · KROM');
    x.restore();
    x.save(); x.translate(OX, H - 1080); x.lineWidth = lw;
    x.beginPath(); x.arc(170, 860, 26, 0, 7); x.stroke(); x.beginPath(); x.arc(170, 860, 10, 0, 7); x.stroke();
    x.strokeRect(196, 828, 380, 64); hatch(x, 200, 832, 40, 56); x.strokeRect(576, 836, 30, 48);
    x.strokeRect(606, 846, 300, 28); x.lineWidth = lt; line(x, 612, 852, 900, 852); line(x, 612, 868, 900, 868);
    x.lineWidth = lw; x.strokeRect(225, 814, 20, 14); x.strokeRect(530, 814, 20, 14);
    x.beginPath(); x.arc(930, 860, 24, 0, 7); x.stroke(); x.beginPath(); x.arc(930, 860, 9, 0, 7); x.stroke();
    x.lineWidth = lt; x.setLineDash([34, 8, 4, 8]); line(x, 120, 860, 980, 860); x.setLineDash([]);
    x.font = MONO(18); x.textAlign = 'left'; x.textBaseline = 'bottom'; ls(x, 2); x.fillText('HİDROLİK AKTÜATÖR  B-B', 196, 800);
    callout(x, 780, 874, 830, 950, 1110, 'PİSTON MİLİ · KROM');
    x.restore();
  }

  function init() {
    const m = document.createElement('canvas').getContext('2d');
    fz = fit(m, s => '700 ' + s + 'px Montserrat', 176, 14, TITLE, 1920 * (portrait ? .86 : .66));
    m.font = '700 ' + fz + 'px Montserrat'; ls(m, 14); tW = m.measureText(TITLE).width;
    cy = H / 2 - 30; tTop = cy - fz * .42; tBot = cy + fz * .38;
    B = mk(); BP = mk(); T = mk(); C = mk(); D = mk(); P = mk();
    const b = B.x; b.fillStyle = BG; b.fillRect(0, 0, W, H); b.lineWidth = L(1);
    b.strokeStyle = 'rgba(92,200,255,0.05)'; for (let x = 0; x < W; x += 48) line(b, x, 0, x, H); for (let y = 0; y < H; y += 48) line(b, 0, y, W, y);
    b.strokeStyle = 'rgba(92,200,255,0.09)'; for (let x = 0; x < W; x += 240) line(b, x, 0, x, H); for (let y = 0; y < H; y += 240) line(b, 0, y, W, y);
    const vg = b.createRadialGradient(CX, H / 2, 120, CX, H / 2, Math.max(W, H) * .62); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.78)'); b.fillStyle = vg; b.fillRect(0, 0, W, H);
    blueprint(); title(T.x, '#fff'); title(D.x, '#000');
    const kk = k * dpr, iw = Math.floor(vw * dpr), im = T.x.getImageData(0, 0, iw, Math.floor(vh * dpr)).data;
    const step = portrait ? 4 : 5; ps = [];
    for (let y = Math.floor(tTop - 40); y < tBot + 40; y += step) for (let x = 0; x < W; x += step) {
      if (im[(Math.floor(y * kk) * iw + Math.floor(x * kk)) * 4 + 3] > 128) {
        const sx = CX - 768 + Math.random() * 1536;
        ps.push({ tx: x, ty: y, sx, sy: EY, cx: (sx + x) / 2 + (Math.random() - .5) * 480, cy: y + (EY - y) * .55 + (Math.random() - .5) * 180, dl: 600 + Math.random() * 900 + ((x - OX) / 1920) * 300, du: 850 + Math.random() * 450, ld: false });
      }
    }
  }

  function radar(t, a) {
    if (a <= 0) return; const X = OX + 1690, Y = H - 290, R = 140, ang = (t / 2600) * Math.PI * 2 - Math.PI / 2;
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = 'rgba(92,200,255,0.28)'; ctx.lineWidth = L(1.2);
    [.33, .66, 1].forEach(q => { ctx.beginPath(); ctx.arc(X, Y, R * q, 0, 7); ctx.stroke(); });
    line(ctx, X - R - 14, Y, X + R + 14, Y); line(ctx, X, Y - R - 14, X, Y + R + 14);
    if (ctx.createConicGradient) {
      const g = ctx.createConicGradient(ang - 1.3, X, Y), s = 1.3 / (Math.PI * 2);
      g.addColorStop(0, 'rgba(92,200,255,0)'); g.addColorStop(s, 'rgba(92,200,255,0.32)'); g.addColorStop(s + .001, 'rgba(92,200,255,0)'); g.addColorStop(1, 'rgba(92,200,255,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(X, Y, R, 0, 7); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(170,230,255,0.9)'; ctx.lineWidth = L(2); line(ctx, X, Y, X + Math.cos(ang) * R, Y + Math.sin(ang) * R);
    [[.6, .55], [2.2, .8], [3.5, .4], [4.6, .7], [5.5, .9]].forEach(([q, r]) => {
      const dd = ((ang - (q - Math.PI / 2)) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2), bb = Math.max(0, 1 - dd / 2.6);
      ctx.fillStyle = 'rgba(180,235,255,' + (.15 + .85 * bb) + ')'; ctx.beginPath(); ctx.arc(X + Math.cos(q - Math.PI / 2) * R * r, Y + Math.sin(q - Math.PI / 2) * R * r, 3 + 3 * bb, 0, 7); ctx.fill();
    });
    ctx.restore();
  }

  function frame(t) {
    ctx.globalAlpha = cl(t / 500); draw(ctx, B.o); ctx.globalAlpha = 1;
    const rv = eio(cl((t - 200) / 1800)), rx = rv * W;
    ctx.save(); ctx.beginPath(); ctx.rect(0, 0, rx, H); ctx.clip(); ctx.globalAlpha = .22; draw(ctx, BP.o); ctx.restore(); ctx.globalAlpha = 1;
    if (rv > 0 && rv < 1) { ctx.strokeStyle = 'rgba(92,200,255,0.35)'; ctx.lineWidth = L(2); line(ctx, rx, 0, rx, H); ctx.fillStyle = 'rgba(92,200,255,0.05)'; ctx.fillRect(rx - 60, 0, 60, H); }
    if (!portrait) radar(t, cl((t - 400) / 600));
    const act = t < 2400, pulse = act ? .75 + .25 * Math.sin(t / 60) : .28 + .1 * Math.sin(t / 400), ew = eo(cl((t - 300) / 500));
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(92,200,255,' + (.18 * pulse) + ')'; ctx.lineWidth = L(22); line(ctx, CX - 768 * ew, EY, CX + 768 * ew, EY);
    ctx.strokeStyle = 'rgba(150,220,255,' + pulse + ')'; ctx.lineWidth = L(3); line(ctx, CX - 768 * ew, EY, CX + 768 * ew, EY);
    ctx.globalCompositeOperation = 'source-over';

    const lv = eio(cl((t - 2400) / 850)), edge = tBot - lv * (tBot - tTop + 30), ps2 = Math.max(3.2, 1.3 / k);
    P.x.globalCompositeOperation = 'destination-out'; P.x.fillStyle = 'rgba(0,0,0,0.3)'; P.x.fillRect(0, 0, W, H); P.x.globalCompositeOperation = 'lighter';
    if (lv < 1) for (const q of ps) {
      if (q.ld && lv > 0 && q.ty > edge - 2) continue;
      const kq = eo(cl((t - q.dl) / q.du)); if (kq <= 0) continue; const uu = 1 - kq;
      const x = uu * uu * q.sx + 2 * uu * kq * q.cx + kq * kq * q.tx, y = uu * uu * q.sy + 2 * uu * kq * q.cy + kq * kq * q.ty;
      if (kq >= 1 && !q.ld) { q.ld = true; if (Math.random() < .1) fl.push({ x: q.tx, y: q.ty, b: t }); }
      const h = kq * kq; P.x.fillStyle = 'rgba(' + Math.round(92 + 163 * h) + ',' + Math.round(200 + 55 * h) + ',255,' + (.4 + .6 * kq) + ')'; P.x.fillRect(x - ps2 / 2, y - ps2 / 2, ps2, ps2);
    }
    fl = fl.filter(z => t - z.b < 280); for (const z of fl) { const a = 1 - (t - z.b) / 280; P.x.fillStyle = 'rgba(220,245,255,' + a + ')'; P.x.beginPath(); P.x.arc(z.x, z.y, 5 * a + ps2 / 2, 0, 7); P.x.fill(); }
    if (t > 4800 && Math.random() < .5) amb.push({ x: CX - 768 + Math.random() * 1536, y: EY, v: 1 + Math.random() * 1.6, b: t });
    amb = amb.filter(z => t - z.b < 3500); for (const z of amb) { z.y -= z.v; P.x.fillStyle = 'rgba(92,200,255,' + (.4 * (1 - (t - z.b) / 3500)) + ')'; P.x.fillRect(z.x, z.y, ps2 * .8, ps2 * .8); }
    P.x.globalCompositeOperation = 'source-over'; draw(ctx, P.o);

    if (t > 700 && act && Math.random() < .35 && ps.length) {
      const q = ps[Math.floor(Math.random() * ps.length)], x0 = CX - 768 + Math.random() * 1536, pts = [];
      for (let i = 0; i <= 11; i++) { const s = i / 11; pts.push([x0 + (q.tx - x0) * s + (i && i < 11 ? (Math.random() - .5) * 70 : 0), EY + (q.ty - EY) * s]); }
      arcs.push({ pts, b: t });
    }
    arcs = arcs.filter(a => t - a.b < 160); ctx.globalCompositeOperation = 'lighter';
    for (const a of arcs) { const al = 1 - (t - a.b) / 160; ctx.beginPath(); a.pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.strokeStyle = 'rgba(92,200,255,' + (.22 * al) + ')'; ctx.lineWidth = L(12); ctx.stroke(); ctx.strokeStyle = 'rgba(210,240,255,' + al + ')'; ctx.lineWidth = L(2.4); ctx.stroke(); }
    ctx.globalCompositeOperation = 'source-over';

    if (lv > 0) {
      title(C.x, chrome(C.x)); C.x.globalCompositeOperation = 'source-atop';
      if (lv < 1) { C.x.fillStyle = 'rgba(160,228,255,0.95)'; C.x.fillRect(0, edge - 3, W, 5); }
      if (t > 3250) { const bx = eio(cl((t - 3250) / 900)) * (W + 700) - 350, g = C.x.createLinearGradient(bx - 200, 0, bx + 200, 0); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,0.92)'); g.addColorStop(1, 'rgba(255,255,255,0)'); C.x.fillStyle = g; C.x.fillRect(0, 0, W, H); }
      C.x.globalCompositeOperation = 'source-over';
      ctx.save(); ctx.beginPath(); ctx.rect(0, edge, W, H - edge); ctx.clip(); ctx.globalAlpha = .9; ctx.drawImage(D.o, 0, 7, W, H); ctx.globalAlpha = 1; draw(ctx, C.o); ctx.restore();
      if (lv < 1) { ctx.globalCompositeOperation = 'lighter'; ctx.strokeStyle = 'rgba(92,200,255,0.55)'; ctx.lineWidth = L(2); line(ctx, CX - tW / 2 - 80, edge, CX + tW / 2 + 80, edge); ctx.globalCompositeOperation = 'source-over'; }
    }

    const su = Math.min(u, 2.4), sy = tBot + 92 * su * .8, dw = eo(cl((t - 3300) / 650)) * 380;
    ctx.strokeStyle = 'rgba(92,200,255,0.7)'; ctx.lineWidth = L(2); line(ctx, CX - dw / 2, sy - 40 * su * .7, CX + dw / 2, sy - 40 * su * .7);
    if (t > 3350) {
      let s = ''; for (let i = 0; i < SUB.length; i++) { const c = SUB[i]; s += (c === ' ' || t > 3400 + i * 40) ? c : CH[Math.floor(Math.random() * CH.length)]; }
      const f = fit(ctx, z => '500 ' + z + 'px Montserrat', Math.round(34 * su), 16, SUB, 1920 * .9);
      ctx.font = '500 ' + f + 'px Montserrat'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ls(ctx, 16); ctx.fillStyle = '#93a0ad'; ctx.fillText(s, CX, sy);
    }
    if (t > 3950) {
      const p = eo(cl((t - 3950) / 550)), sc = 1 + .7 * (1 - p), bw = Math.min((tW / 2 + 90) * sc, W / 2 - 40 * Math.min(u, 1.6) - 24), bh = (fz * .5 + 56) * sc, Lb = 48, Y = cy;
      const fla = t > 4500 ? Math.max(0, 1 - (t - 4500) / 300) : 0;
      ctx.strokeStyle = fla > 0 ? 'rgba(255,255,255,' + (.6 + .4 * fla) + ')' : 'rgba(92,200,255,' + (.35 + .5 * p) + ')'; ctx.lineWidth = L(2.5);
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([a, b]) => { const x0 = CX + a * bw, y0 = Y + b * bh; ctx.beginPath(); ctx.moveTo(x0, y0 - b * Lb); ctx.lineTo(x0, y0); ctx.lineTo(x0 - a * Lb, y0); ctx.stroke(); });
      if (t > 4500) { ctx.globalAlpha = cl((t - 4500) / 300); ctx.font = MONO(Math.round(17 * su)); ls(ctx, 3); ctx.textBaseline = 'bottom'; ctx.textAlign = 'left'; ctx.fillStyle = '#9be7b0'; ctx.fillText('✓ KALİTE KONTROL · ONAYLANDI', CX - bw, Y - bh - 14); ctx.globalAlpha = 1; }
    }
    if (t > 4650) {
      const a = eo(cl((t - 4650) / 700)), f = fit(ctx, z => '500 ' + z + 'px Montserrat', Math.round(28 * su), 10, TAG, 1920 * .92);
      ctx.globalAlpha = a; ctx.font = '500 ' + f + 'px Montserrat'; ls(ctx, 10); ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = BLUE; ctx.fillText(TAG, CX, sy + 78 * su * .8 - 12 * (1 - a)); ctx.globalAlpha = 1;
    }
    const ha = cl((t - 150) / 500), m = 36 * Math.min(u, 1.6), bl = 46 * Math.min(u, 1.6) * eo(cl(t / 500)), hf = Math.round(20 * Math.min(u, 2.6));
    ctx.strokeStyle = 'rgba(92,200,255,' + (.55 * ha) + ')'; ctx.lineWidth = L(2.5);
    [[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]].forEach(([x, y, sx, sy2]) => { ctx.beginPath(); ctx.moveTo(x, y + sy2 * bl); ctx.lineTo(x, y); ctx.lineTo(x + sx * bl, y); ctx.stroke(); });
    ctx.globalAlpha = ha; ctx.font = MONO(hf); ctx.textBaseline = 'middle'; ls(ctx, 3);
    const lv2 = lv, th = (lv2 * 25).toFixed(1) + ' µm';
    ctx.textAlign = 'left'; ctx.fillStyle = '#5b6673'; ctx.fillText(portrait ? 'DK-01' : 'DK-01 · ELEKTROLİTİK KAPLAMA SİSTEMİ', m + hf * 1.3, m + hf * 2);
    const st = t < 2400 ? 'İYON TRANSFERİ' : t < 3250 ? 'KAPLAMA' : 'TAMAMLANDI';
    ctx.fillText('DURUM  ', m + hf * 1.3, H - m - hf * 1.1); ctx.fillStyle = t < 3250 ? BLUE : '#9be7b0'; ctx.fillText(st, m + hf * 1.3 + ctx.measureText('DURUM  ').width, H - m - hf * 1.1);
    ctx.textAlign = 'right'; ctx.fillStyle = BLUE; ctx.fillText(th, W - m - hf * 1.3, m + hf * 2); ctx.fillStyle = '#5b6673'; ctx.fillText('KALINLIK  ', W - m - hf * 1.3 - ctx.measureText(th).width, m + hf * 2);
    ctx.globalAlpha = 1; ls(ctx, 0);
  }

  function finish() {
    if (done) return; done = true;
    try { sessionStorage.setItem('dk-intro', '1'); } catch (e) {}
    el.classList.add('out'); document.body.classList.remove('intro-on');
    setTimeout(() => { cancelAnimationFrame(raf); el.remove(); }, 900);
  }
  function loop(n) { if (!start) start = n; const t = n - start; frame(t); if (t > 5900) finish(); if (!done || t < 6800) raf = requestAnimationFrame(loop); }
  document.getElementById('intro-skip').addEventListener('click', finish);
  addEventListener('keydown', e => { if (e.key === 'Escape') finish(); });

  const fontsReady = document.fonts ? Promise.all([
    document.fonts.load('700 100px Montserrat', 'İÜ'), document.fonts.load('500 30px Montserrat', 'İÜ'), document.fonts.load('500 20px "IBM Plex Mono"', 'İµ')
  ]) : Promise.resolve();
  Promise.race([fontsReady, new Promise(r => setTimeout(r, 1500))]).then(() => { init(); raf = requestAnimationFrame(loop); }).catch(() => finish());
  window.__dkIntroFrame = t => frame(t);
})();
