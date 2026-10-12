(function () {
  'use strict';
  const D = window.SITE;
  const LANG = document.documentElement.lang.startsWith('ko') ? 'ko' : 'en';
  const NS = 'http://www.w3.org/2000/svg';
  const C = { ink: '#0f172a', body: '#334155', muted: '#64748b', faint: '#94a3b8', line: '#e2e8f0', soft: '#f8fafc',
    soft2: '#f1f5f9', accent: '#4f46e5', accentSoft: '#eef2ff', accentMid: '#c7d2fe', base: '#cbd5e1', baseInk: '#94a3b8',
    pass: '#059669', passSoft: '#ecfdf5', deny: '#e11d48', denySoft: '#fff1f2', slate: '#475569' };

  /* ── strings used inside figures ─────────────────────────── */
  const T = {
    ko: {
      base: '층 없음', ours: '정책 층', top: '공개 1위', na: '층 없음: 정의 안 됨', naShort: '층 없음 값 없음', delta: '변화', kSub: ['1회', '2회 모두', '3회 모두', '4회 모두'],
      st44: '4회 모두 성공한 과제', st04: '한 번도 못 푼 과제', topShort: '1위',
      model: '모델 (LLM)', modelSub: '다음 턴을 제안', decl: '선언 파일', declSub: '도메인마다 1개', trans: '대화 기록',
      transSub: '호출 · 출력 · 발화', layer: '정책 층', layerSub: '닫힌 조건만 · 도메인 단어 없음', tool: '실제 도구',
      toolSub: '그대로 실행', refusal: '거부문', refusalSub: '호출 · 사실 · 정책 문장', log: '감사 로그',
      logSub: '모든 판정과 그 근거', pass: '통과', deny: '거부', again: '다시 제안 · 예산 안에서', same: '같은 입력 → 같은 판정',
      lv: ['절차', '계산', '근거', '완결', '마무리', '부하', '재료'],
      ablH: '끄면 · 발동 과제 pass^1', below: '층 없음 이하', full: '전체 층', none: '층 없음',
      clickFile: '파일을 눌러 바꿔 보세요', engine: '엔진', engineA: '≈3.3k줄 · 도메인 단어 0', engineB: '세 도메인 모두 같은 코드',
      files: ['banking 선언', 'library 선언', 'airline 선언'], p1: 'pass^1',
      sopRef: n => `공개 최고 GPT-5 ${n}`, corrNote: '보정값은 27B만 측정 · 나머지는 공식값(흐리게)',
      xAx: '층 없는 pass^1', yAx: '층을 더한 이득 (pp)', airNote: 'airline: 기준 점수가 낮은 모델에서 이득이 크다',
      retNote: 'retail: 기준과 무관하게 ≈0', blocked: '막힌 올바른 행동', gates: 'Reason Less 게이트',
      rlFoot: '50과제 × 4회 · 같은 시뮬레이터', copied: '복사됨', copy: '복사',
    },
    en: {
      base: 'no layer', ours: 'policy layer', top: 'public #1', na: 'no layer: undefined', naShort: 'no-layer value n/a', delta: 'change', kSub: ['once', 'all 2 runs', 'all 3 runs', 'all 4 runs'],
      st44: 'tasks solved 4/4', st04: 'tasks never solved', topShort: '#1',
      model: 'LLM agent', modelSub: 'proposes next turn', decl: 'declaration', declSub: 'one per domain', trans: 'transcript',
      transSub: 'calls · outputs · words', layer: 'policy layer', layerSub: 'closed checks · no domain words', tool: 'real tool',
      toolSub: 'runs unchanged', refusal: 'refusal', refusalSub: 'call · fact · policy text', log: 'audit log',
      logSub: 'every decision + its source', pass: 'PASS', deny: 'DENY', again: 'propose again · budgeted', same: 'same input → same decision',
      lv: ['order', 'compute', 'ground', 'complete', 'close', 'load', 'material'],
      ablH: 'Switched off · pass^1 on fired tasks', below: 'below no layer', full: 'full', none: 'none',
      clickFile: 'click a file', engine: 'engine', engineA: '≈3.3k lines · 0 domain words', engineB: 'same code for all three',
      files: ['banking declaration', 'library declaration', 'airline declaration'], p1: 'pass^1',
      sopRef: n => `best public GPT-5 ${n}`, corrNote: 'corrected values measured for 27B only; others official (faded)',
      xAx: 'pass^1 without the layer', yAx: 'gain from the layer (pp)', airNote: 'airline: weaker baselines gain the most',
      retNote: 'retail: ≈0 at every baseline', blocked: 'correct actions blocked', gates: 'Reason Less gates',
      rlFoot: '50 tasks × 4 · same simulator', copied: 'COPIED', copy: 'COPY',
    },
  }[LANG];
  const L = o => (o && typeof o === 'object' && o[LANG] !== undefined ? o[LANG] : o);

  /* ── helpers ─────────────────────────────────────────────── */
  function el(tag, attrs, parent, text) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (text !== undefined) n.textContent = text;
    if (parent) parent.appendChild(n);
    return n;
  }
  function svg(host, w, h) {
    host.innerHTML = '';
    const s = el('svg', { viewBox: `0 0 ${w} ${h}`, width: '100%', role: 'img' }, host);
    const defs = el('defs', {}, s);
    [['i', C.ink], ['a', C.accent], ['p', C.pass], ['d', C.deny], ['b', C.baseInk]].forEach(([id, c]) => {
      const m = el('marker', { id: 'ah' + id, viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 6, markerHeight: 6, orient: 'auto-start-reverse' }, defs);
      el('path', { d: 'M0,0 L10,5 L0,10 z', fill: c }, m);
    });
    return s;
  }
  const AH = { [C.ink]: 'i', [C.accent]: 'a', [C.pass]: 'p', [C.deny]: 'd', [C.baseInk]: 'b' };
  const fmt = v => (v == null ? '—' : (Math.round(v * 10 + 1e-6) / 10).toFixed(1));
  const sign = v => (v > 0 ? '+' : v < 0 ? '−' : '±') + fmt(Math.abs(v));
  function seg(root, onPick) {
    root.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      root.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
      onPick(b.dataset);
    }));
  }
  const tip = document.createElement('div');
  tip.className = 'tip';
  document.body.appendChild(tip);
  function hover(node, html) {
    node.style.cursor = 'default';
    node.addEventListener('mouseenter', () => { tip.innerHTML = html; tip.style.opacity = 1; });
    node.addEventListener('mousemove', e => { tip.style.left = e.clientX + 'px'; tip.style.top = e.clientY + 'px'; });
    node.addEventListener('mouseleave', () => { tip.style.opacity = 0; });
  }
  // charts draw at the container's real width so text keeps its size on phones
  const widthOf = (host, max) => Math.max(320, Math.min(max, Math.round(host.getBoundingClientRect().width) || max));
  // run fn once when host scrolls into view (so movement is seen, not missed)
  function onView(host, fn) {
    if (!('IntersectionObserver' in window)) return fn();
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { fn(); io.disconnect(); } }), { threshold: 0.35 });
    io.observe(host);
  }

  /* ── Figure 1: banking, all four pass^k as dot shifts ─────── */
  function fig1(anim) {
    const host = document.getElementById('f1');
    const W = widthOf(host, 880), nar = W < 600;
    const A = D.banking.arms, L0 = nar ? 62 : 104, R0 = nar ? 50 : 84, lo = 25, hi = 60;
    const rows = [0, 1, 2, 3], rh = i => (i === 0 && !nar ? 92 : 62), top0 = 44;
    let H = top0; rows.forEach(i => { H += rh(i); }); H += 30;
    const s = svg(host, W, H);
    const x = v => L0 + ((v - lo) / (hi - lo)) * (W - L0 - R0);
    for (let t = 30; t <= 60; t += 10) {
      el('line', { x1: x(t), x2: x(t), y1: 10, y2: H - 26, stroke: C.line }, s);
      el('text', { x: x(t), y: H - 6, 'font-size': 12, fill: C.muted, 'text-anchor': 'middle', class: 'mono' }, s, t);
    }
    let y = top0;
    const movers = [];
    if (!nar) el('text', { x: W - R0 + 26, y: 16.5, 'font-size': 12, fill: C.muted, 'font-weight': 700 }, s, T.delta);
    {
      [[C.base, T.base, 'dot'], [C.accent, T.ours, 'dot'], [C.ink, T.top, 'ring']].forEach(([c, nm, k], j) => {
        const lx = nar ? j * (W / 3) : L0 + j * 150;
        el('circle', { cx: lx + 7, cy: 12, r: k === 'ring' ? 6 : 5.5, fill: k === 'ring' ? 'none' : c, stroke: k === 'ring' ? c : 'none', 'stroke-width': 1.5 }, s);
        el('text', { x: lx + 18, y: 16.5, 'font-size': 12.5, fill: C.body }, s, nm);
      });
    }
    rows.forEach(i => {
      const h = rh(i), cy = y + h - 26, b = A.base.k[i], o = A.ours.k[i], tp = A.top.k[i], first = i === 0 && !nar;
      el('text', { x: 0, y: cy + 1, 'font-size': first ? 16 : 14, 'font-weight': first ? 750 : 600, fill: first ? C.ink : C.body, class: 'mono' }, s, `pass^${i + 1}`);
      el('text', { x: 0, y: cy + 18, 'font-size': 11.5, fill: C.faint }, s, T.kSub[i]);
      if (b == null) el('text', { x: 0, y: cy + 33, 'font-size': 11, fill: C.faint }, s, T.naShort);
      el('line', { x1: x(lo), x2: x(hi), y1: cy, y2: cy, stroke: C.soft2, 'stroke-width': 8, 'stroke-linecap': 'round' }, s);
      // public #1: hollow ring
      el('circle', { cx: x(tp), cy, r: 12, fill: 'none', stroke: C.ink, 'stroke-width': 1.6 }, s);
      if (!nar && Math.abs(tp - o) > 0.05) el('text', { x: x(tp), y: cy + 30, 'text-anchor': 'middle', 'font-size': 12, fill: C.ink, 'font-weight': 600 }, s,
        first ? `${T.top} ${fmt(tp)}` : fmt(tp));
      if (b == null) {
      } else {
        el('circle', { cx: x(b), cy, r: 7, fill: C.base }, s);
        el('text', { x: x(b), y: cy - 22, 'text-anchor': 'middle', 'font-size': 12.5, fill: C.baseInk, 'font-weight': 600 }, s,
          first ? `${T.base} ${fmt(b)}` : fmt(b));
        const ringBetween = tp > b && tp < o - 0.3;
        if (ringBetween) el('line', { x1: x(tp) + 13, x2: x(o) - 9, y1: cy, y2: cy, stroke: C.accent, 'stroke-width': 2.5 }, s);
        const ar = el('line', { x1: x(b) + 10, x2: ringBetween ? x(tp) - 15 : x(o) - 13, y1: cy, y2: cy, stroke: C.accent, 'stroke-width': 2.5, 'marker-end': 'url(#aha)' }, s);
        const len = Math.max(0, x(o) - 13 - x(b) - 10);
        if (anim) ar.style.strokeDasharray = len, ar.style.strokeDashoffset = len;
        if (anim) movers.push(() => { ar.style.transition = 'stroke-dashoffset .9s ease .15s'; ar.style.strokeDashoffset = 0; });
        el('text', { x: W - R0 + (nar ? 12 : 26), y: cy + 5, 'font-size': first ? 18 : 14, 'font-weight': 750, fill: C.accent }, s, sign(o - b));
      }
      const g = el('g', {}, s);
      el('circle', { cx: x(o), cy, r: 8.5, fill: C.accent, stroke: '#fff', 'stroke-width': 2 }, g);
      el('text', { x: x(o) + (first ? 14 : 0), y: cy - 22, 'text-anchor': 'middle', 'font-size': first ? 14 : 12.5, fill: C.accent, 'font-weight': 750 }, g,
        first ? `${T.ours} ${fmt(o)}` : fmt(o));
      if (b != null) {
        if (anim) {
          g.style.transform = `translateX(${x(b) - x(o)}px)`;
          movers.push(() => { g.style.transition = 'transform 1s cubic-bezier(.3,.7,.2,1)'; g.style.transform = 'none'; });
        }
      }
      y += h;
    });
    if (anim) onView(host, () => movers.forEach(f => f()));
    document.getElementById('f1stats').innerHTML =
      `<div class="stat">${T.st44} <b>${A.base.t44}</b> <span class="arr">→ ${A.ours.t44}</span> <span class="cond">(${T.topShort} ${A.top.t44})</span></div>` +
      `<div class="stat">${T.st04} <b>${A.base.t04}</b> <span class="arr">→ ${A.ours.t04}</span> <span class="cond">(${T.topShort} ${A.top.t04})</span></div>`;
  }
  fig1(true);

  /* ── Hero: a live stream of calls through the gate ──────── */
  (function hero() {
    const host = document.getElementById('hero-anim');
    if (!host) return;
    const d = host.dataset;
    const s = svg(host, 980, 276);
    const H = { model: '#cbd5e1', gate: '#818cf8', pass: '#34d399', deny: '#fb7185', text: '#e2e8f0', sub: '#94a3b8' };
    const use = (id, x, y, w, color, g) => el('use', { href: `#${id}`, x, y, width: w, height: w, style: `color:${color}` }, g || s);
    use('g-model', 20, 92, 96, H.model);
    el('text', { x: 68, y: 212, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, fill: H.text }, s, d.model);
    el('text', { x: 68, y: 234, 'text-anchor': 'middle', 'font-size': 13.5, fill: H.sub }, s, d.modelSub);
    // the gate: two pillars and seven bars that light up as calls pass
    const gx = 440, gy = 62, gh = 170;
    el('rect', { x: gx - 46, y: gy, width: 14, height: gh, rx: 4, fill: H.gate }, s);
    el('rect', { x: gx + 32, y: gy, width: 14, height: gh, rx: 4, fill: H.gate }, s);
    el('rect', { x: gx - 54, y: gy - 6, width: 108, height: 14, rx: 4, fill: H.gate }, s);
    const bars = [];
    for (let i = 0; i < 7; i++) bars.push(el('rect', { x: gx - 32, y: gy + 18 + i * 21, width: 64, height: 7, rx: 3.5, fill: '#312e81' }, s));
    el('text', { x: gx, y: gy - 36, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#fff' }, s, d.layer);
    el('text', { x: gx, y: gy - 16, 'text-anchor': 'middle', 'font-size': 13.5, fill: '#c7d2fe' }, s, d.layerSub);
    use('g-tool', 800, 30, 78, H.pass);
    el('text', { x: 839, y: 130, 'text-anchor': 'middle', 'font-size': 14.5, 'font-weight': 700, fill: '#6ee7b7' }, s, d.pass);
    use('g-slip', 804, 142, 70, H.deny);
    el('text', { x: 839, y: 235, 'text-anchor': 'middle', 'font-size': 14.5, 'font-weight': 700, fill: '#fda4af' }, s, d.deny);
    el('path', { d: 'M 118 140 L 392 140', stroke: '#475569', 'stroke-dasharray': '3 6', fill: 'none' }, s);
    el('path', { d: 'M 488 132 C 600 132, 700 72, 792 70', stroke: 'rgba(52,211,153,.35)', fill: 'none', 'stroke-width': 2 }, s);
    el('path', { d: 'M 488 150 C 600 150, 700 178, 800 176', stroke: 'rgba(251,113,133,.35)', fill: 'none', 'stroke-width': 2 }, s);
    const back = 'M 800 196 C 650 258, 250 258, 90 178';
    el('path', { d: back, stroke: 'rgba(251,113,133,.45)', 'stroke-dasharray': '3 6', fill: 'none', 'stroke-width': 1.5 }, s);
    el('text', { x: 440, y: 266, 'text-anchor': 'middle', 'font-size': 13, fill: '#fda4af' }, s, d.again);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const layer = el('g', {}, s);
    const pathPass = el('path', { d: 'M 118 140 L 440 140 C 600 132, 700 72, 792 70', fill: 'none' }, s);
    const pathDeny = el('path', { d: 'M 118 140 L 440 140 C 600 150, 700 178, 800 176 ' + back.replace('M 800 196', 'L 800 196'), fill: 'none' }, s);
    const PATTERN = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    let k = 0;
    function spawn() {
      const deny = PATTERN[k++ % PATTERN.length] === 1;
      const p = deny ? pathDeny : pathPass, len = p.getTotalLength(), gate = 322;
      const c = el('circle', { r: 6.5, fill: '#a5b4fc' }, layer);
      const t0 = performance.now(), dur = deny ? 4200 : 2600, speed = len / dur;
      let lit = false;
      (function step(now) {
        const dist = Math.min(len, (now - t0) * speed * (deny ? 1 : 1));
        const pt = p.getPointAtLength(dist);
        c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y);
        if (dist > gate && !lit) {
          lit = true;
          c.setAttribute('fill', deny ? H.deny : H.pass);
          bars.forEach((b, j) => {
            setTimeout(() => b.setAttribute('fill', deny && j === 2 ? H.deny : '#a5b4fc'), j * 35);
            setTimeout(() => b.setAttribute('fill', '#312e81'), 420 + j * 35);
          });
        }
        if (dist < len) requestAnimationFrame(step); else c.remove();
      })(t0);
    }
    spawn();
    setInterval(() => { if (!document.hidden) spawn(); }, 900);
  })();

  /* ── Figure 2: case toggle + lane-to-lane arrows ─────────── */
  const lanes = document.getElementById('lanes');
  lanes.dataset.v = 'off';
  lanes.querySelectorAll('.msg').forEach(m => {
    const g = (m.getAttribute('style') || '').match(/grid-column:\s*(\d+)\s*\/\s*(\d+)/);
    if (g) m.style.setProperty('--span', +g[2] - +g[1]);
  });
  seg(document.getElementById('caseTog'), d => { lanes.dataset.v = d.v; });

  /* ── One-turn figure on the dark band, driven by scroll ─── */
  (function fig4() {
    const s = svg(document.getElementById('f4'), 780, 540);
    const K = { ink: '#e2e8f0', sub: '#94a3b8', gate: '#818cf8', bar: '#1e1b4b', barOn: '#6366f1', pass: '#34d399', deny: '#fb7185', line: '#475569', doc: '#a5b4fc', log: '#cbd5e1' };
    const G = n => el('g', { 'data-s': n, class: 'fg' }, s);
    const use = (id, x, y, w, color, g) => el('use', { href: `#${id}`, x, y, width: w, height: w, style: `color:${color}` }, g);
    const txt = (g, x, y, t, size, color, weight, anchor) => el('text', { x, y, 'font-size': size, fill: color, 'font-weight': weight || 400, 'text-anchor': anchor || 'middle' }, g, t);
    const path = (g, d, color, dash, w) => el('path', { d, fill: 'none', stroke: color, 'stroke-width': w || 2, 'stroke-dasharray': dash || '' }, g);
    const tag = (g, x, y, t, c) => {
      const w = t.length * 9 + 18;
      el('rect', { x: x - w / 2, y: y - 12, width: w, height: 22, rx: 11, fill: c }, g);
      txt(g, x, y + 4, t, 11.5, '#0b1020', 800);
    };
    // 1 · the model proposes
    let g = G(1);
    use('g-model', 18, 150, 92, K.ink, g);
    txt(g, 64, 268, T.model, 16, K.ink, 700);
    txt(g, 64, 290, T.modelSub, 14, K.sub);
    el('rect', { x: 118, y: 164, width: 150, height: 28, rx: 14, fill: 'rgba(255,255,255,.08)' }, g);
    txt(g, 193, 183, 'cancel_reservation(…)', 12.5, K.ink, 500);
    path(g, 'M 112 205 L 262 205', K.line, '', 2);
    // 2 · declaration and transcript feed the gate from below
    g = G(2);
    use('g-doc', 262, 360, 58, K.doc, g);
    txt(g, 291, 440, T.decl, 14, K.ink, 700);
    use('g-log', 350, 360, 58, K.log, g);
    txt(g, 379, 440, T.trans, 14, K.ink, 700);
    path(g, 'M 291 358 L 291 336', K.doc, '3 4');
    path(g, 'M 379 358 L 379 336', K.log, '3 4');
    // 3 · the gate: seven bars, one per lever
    g = G(3);
    txt(g, 335, 42, T.layer, 17, '#fff', 800);
    txt(g, 335, 62, T.layerSub, 13, K.sub);
    el('rect', { x: 262, y: 76, width: 16, height: 262, rx: 5, fill: K.gate }, g);
    el('rect', { x: 392, y: 76, width: 16, height: 262, rx: 5, fill: K.gate }, g);
    const bars = [];
    T.lv.forEach((nm, i) => {
      const y = 86 + i * 35;
      bars.push(el('rect', { x: 282, y, width: 106, height: 27, rx: 6, fill: K.bar, class: 'bar' }, g));
      txt(g, 294, y + 18, `LB${i + 1}`, 12.5, '#c7d2fe', 800, 'start');
      txt(g, 382, y + 18, nm, 12.5, K.ink, 400, 'end');
    });
    // 4 · pass → the real tool
    g = G(4);
    path(g, 'M 410 150 C 470 150, 490 110, 540 110', K.pass, '', 2.5);
    tag(g, 470, 124, T.pass, K.pass);
    use('g-tool', 540, 66, 84, K.pass, g);
    txt(g, 582, 174, T.tool, 15, K.ink, 700);
    txt(g, 582, 194, T.toolSub, 13.5, K.sub);
    // 5 · deny → refusal slip → back to the model
    g = G(5);
    path(g, 'M 410 262 C 470 262, 490 268, 540 268', K.deny, '', 2.5);
    tag(g, 470, 252, T.deny, K.deny);
    use('g-slip', 546, 232, 76, K.deny, g);
    txt(g, 584, 330, T.refusal, 15, K.ink, 700);
    txt(g, 584, 350, T.refusalSub, 13.5, K.sub);
    const loop = 'M 584 362 C 590 540, 40 540, 60 300';
    path(g, loop, K.deny, '5 6', 2);
    txt(g, 330, 522, T.again, 14, '#fda4af', 600);
    // 6 · every decision to the audit log
    g = G(6);
    use('g-log', 690, 178, 62, K.log, g);
    txt(g, 721, 258, T.log, 14, K.ink, 700);
    path(g, 'M 626 110 C 670 116, 700 140, 712 174', K.line, '3 4');
    path(g, 'M 624 268 C 670 262, 700 250, 712 244', K.line, '3 4');
    txt(g, 721, 278, T.same, 12, K.sub);

    const PATHS = { 1: ['M 112 205 L 262 205'], 2: ['M 291 358 L 291 336', 'M 379 358 L 379 336'], 3: ['M 262 205 L 410 205'],
      4: ['M 410 150 C 470 150, 490 110, 540 110'], 5: ['M 410 262 C 470 262, 490 268, 540 268', loop], 6: ['M 626 110 C 670 116, 700 140, 712 174', 'M 624 268 C 670 262, 700 250, 712 244'] };
    const tokenLayer = el('g', {}, s);
    const groups = s.querySelectorAll('.fg');
    const VIS = { 1: [1], 2: [1, 2], 3: [1, 2, 3], 4: [1, 3, 4], 5: [1, 3, 5], 6: [3, 4, 5, 6] };
    function show(n) {
      groups.forEach(gr => { gr.style.transition = 'opacity .35s'; gr.style.opacity = n === 0 || VIS[n].includes(+gr.dataset.s) ? 1 : 0.4; });
      bars.forEach((r, i) => {
        r.style.transition = 'fill .3s'; r.style.transitionDelay = n === 3 ? `${i * 90}ms` : '0ms';
        r.setAttribute('fill', n === 3 ? K.barOn : K.bar);
      });
      tokenLayer.innerHTML = '';
      (PATHS[n] || []).forEach(p => {
        const c = el('circle', { r: 6, fill: n === 5 ? K.deny : n === 4 ? K.pass : '#a5b4fc' }, tokenLayer);
        el('animateMotion', { dur: p.length > 40 ? '2.6s' : '1.2s', repeatCount: 'indefinite', path: p }, c);
      });
      document.querySelectorAll('.step').forEach(st => st.classList.toggle('on', +st.dataset.s === n));
      // phones: the figure is wider than the screen, so slide it to the part the step talks about
      const fr = document.getElementById('f4');
      if (fr && fr.scrollWidth > fr.clientWidth) fr.scrollTo({ left: n >= 4 ? Math.min(fr.scrollWidth - fr.clientWidth, fr.scrollWidth * 250 / 780) : 0, behavior: 'smooth' });
    }
    // phones: no sticky figure; show every part at once and let the steps read as a list
    if (!('IntersectionObserver' in window)) { show(0); return; }
    show(1);
    // on narrow screens the figure occupies the top of the viewport, so a step becomes active in the lower band
    const narrow = matchMedia('(max-width: 1000px)').matches;
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) show(+e.target.dataset.s); }),
      { rootMargin: narrow ? '-56% 0px -22% 0px' : '-45% 0px -45% 0px' });
    document.querySelectorAll('.step').forEach(st => io.observe(st));
  })();

  /* ── Lever explorer ─────────────────────────────────────── */
  const LEVERS = {
    ko: [
      { t: '필요한 조회가 먼저', catch: '정책이 요구한 확인을 하기 전에 카드를 해지합니다.',
        reads: '이 대화에서 성공적으로 돌아온 도구 호출', dec: '쓰기 Y를 제안하기 전에 조회 X가 돌아왔는가?', does: 'Y를 막고, 확인되지 않은 선행 조건과 정책 문장을 돌려줍니다',
        ex: ['<span class="c"># 제안</span>', 'close_credit_card(card=…)', '<span class="c"># 기록: 정책이 요구한 계정 확인이 아직 없음</span>', '<span class="d">NOT EXECUTED</span> close_credit_card', '확인 안 됨: 정책이 요구한 계정 확인', '정책: "…"'] },
      { t: '숫자는 계산기가', catch: '수수료·이자·한도를 머릿속으로 계산하다 틀립니다.',
        reads: '에이전트가 이미 가져온 기록', dec: '값은 결정론적 검증기가 내고, 모델은 어떤 계산이 필요한지만 고릅니다', does: '검증기 도구를 더하고, 쓰는 금액이 같은 기록으로 계산한 값과 같은지 봅니다',
        ex: ['<span class="c"># 암산 대신 요청</span>', 'compute_&lt;quantity&gt;(record=…)', '<span class="p">→ &lt;amount&gt;</span>  입력: 가져온 기록의 날짜 두 개', '<span class="c"># 뒤따르는 쓰기는 이 값을 쓴다</span>'] },
      { t: '출처 없는 값은 쓰지 않는다', catch: '어느 도구 출력에도, 고객 말에도 없는 값을 씁니다. 형식을 바꾼 날짜, 지어낸 사유, 추측한 로그인 값 같은 것입니다.',
        reads: '지금까지의 모든 도구 출력과 고객 메시지', dec: '이 인자 값이 거기에 나오는가? (정규화 후)', does: '쓰기를 막고, 출처 없는 인자를 알려 줍니다',
        ex: ['<span class="c"># 제안</span>', 'update_address(zip="94107", …)', '<span class="c"># 94107을 담은 메시지·도구 출력이 없음</span>', '<span class="d">NOT EXECUTED</span> update_address', '인자 zip: 어느 도구 출력이나 고객 메시지에도', '없는 값'] },
      { t: '요청은 빠짐없이', catch: '고객은 네 가지를 부탁했는데 세 가지만 하고 인사합니다.',
        reads: '대화에서 뽑은 요청들과 실행한 행동들', dec: '(요청 집합 − 처리 집합)이 비었는가?', does: '남은 것을 한 번 보여 줍니다. 끄기 실험에서 이득이 없어 주장에서 뺐습니다',
        ex: ['요청: {A 취소, B 환불, C 변경, D 주소}', '처리: {A 취소, B 환불, C 변경}', '<span class="o">OPEN</span> D 주소 · 한 번 보여 주고 판단은 모델이'] },
      { t: '떠나기 전 열린 일', catch: '요청이 아직 남았는데 대화를 끝내거나 사람에게 넘깁니다.',
        reads: '열린 요청 상태: 행동 · 정보 · 이관 · 없음', dec: '떠나는 턴에 열린 의무가 남았는가?', does: '남은 항목을 한 번 보여 줍니다. 끝낼지는 여전히 모델이 정합니다',
        ex: ['<span class="c"># 제안</span>', 'transfer_to_human_agents(…)', '열림: ACTION (환불 미처리)', '<span class="o">SHOWN</span> 한 번 · 다음 제안은 통과'] },
      { t: '긴 대화에서도 사실 유지', catch: '긴 도구 출력 뒤에 앞에서 읽은 값을 잊습니다.',
        reads: '선언된 조회 출력과 컨텍스트 창 크기', dec: '뒤 턴이 아직 참조하는 기록 값은 무엇인가?', does: '그 값은 창에 남기고, 창이 차면 나머지를 접습니다',
        ex: ['<span class="c"># 40턴 뒤, 창이 거의 참</span>', '유지: account_id, balance, posted_at (참조 중)', '접음: 긴 검색 출력 3개 → 한 줄 요약'] },
      { t: '규칙은 필요한 순간에', catch: '방금 한 행동에 어떤 규칙이 걸리는지 모릅니다.',
        reads: '방금 실행된 도구', dec: '이 도구에 선언된 정책 문장이 있는가?', does: '그 문장을 원문 그대로 도구 출력 바로 뒤에 넣습니다',
        ex: ['get_transactions(…) <span class="p">→ 기록</span>', '<span class="c"># 도구 출력 뒤에 붙음</span>', '정책: "…" (이 도구에 선언된 문장)'] },
    ],
    en: [
      { t: 'Required lookups come first', catch: 'A card is closed before the checks the policy requires were run.',
        reads: 'Which tools have returned successfully in this conversation', dec: 'Has lookup X returned before write Y is proposed?', does: 'Blocks Y; returns the unconfirmed prerequisite and the policy sentence',
        ex: ['<span class="c"># proposed</span>', 'close_credit_card(card=…)', '<span class="c"># transcript: required account check not run yet</span>', '<span class="d">NOT EXECUTED</span> close_credit_card', 'unconfirmed: the account check the policy requires', 'policy: "…"'] },
      { t: 'Numbers come from a calculator', catch: 'Fees, interest and limits computed in the model’s head, and computed wrong.',
        reads: 'Records the agent already fetched', dec: 'The value from a deterministic verifier; the model only picks which computation it needs', does: 'Adds verifier tools; a written amount must match the verifier on the same records',
        ex: ['<span class="c"># the model asks instead of doing arithmetic</span>', 'compute_&lt;quantity&gt;(record=…)', '<span class="p">→ &lt;amount&gt;</span>  inputs listed: two dates from fetched records', '<span class="c"># the write that follows uses this value</span>'] },
      { t: 'Every written value needs a source', catch: 'A value that appears in no tool output and no customer message, such as a reformatted date, an invented reason or a guessed login.',
        reads: 'All tool outputs and customer messages so far', dec: 'Does this argument value appear there (after normalisation)?', does: 'Blocks the write; names the argument whose value has no source',
        ex: ['<span class="c"># proposed</span>', 'update_address(zip="94107", …)', '<span class="c"># no message or tool output contains 94107</span>', '<span class="d">NOT EXECUTED</span> update_address', 'argument zip: value does not appear in any tool', 'output or customer message'] },
      { t: 'Every request gets handled', catch: 'The customer asked for four things; the agent did three and said goodbye.',
        reads: 'Requests extracted from the dialog and actions taken', dec: 'Is (requested set − handled set) empty?', does: 'Shows the remainder once. Slightly negative in ablation; not part of our claim',
        ex: ['requested: {cancel A, refund B, update C, address D}', 'handled:   {cancel A, refund B, update C}', '<span class="o">OPEN</span> address D · shown once, the model decides'] },
      { t: 'Open obligations before hand-off', catch: 'The agent ends or transfers the chat while a request is still open.',
        reads: 'Open-request state: action, information, hand-off, none', dec: 'Is an obligation still open at a leaving turn?', does: 'Shows the open item once. Ending is still the model’s decision',
        ex: ['<span class="c"># proposed</span>', 'transfer_to_human_agents(…)', 'open: ACTION (refund not yet issued)', '<span class="o">SHOWN</span> once · the next proposal passes'] },
      { t: 'Long dialogs keep their facts', catch: 'After long tool outputs the model forgets a value it read early on.',
        reads: 'Declared retrieval outputs and the context window size', dec: 'Which record values do later turns still reference?', does: 'Keeps those values in view and folds the rest when the window fills',
        ex: ['<span class="c"># 40 turns later, context near its limit</span>', 'kept:   account_id, balance, posted_at (still referenced)', 'folded: 3 long search outputs → one-line summaries'] },
      { t: 'The relevant rule arrives on time', catch: 'The agent does not realise a rule applies to the action it just took.',
        reads: 'Which tool just ran', dec: 'Is there a policy sentence declared for this tool?', does: 'Places that sentence, verbatim, right after the tool output',
        ex: ['get_transactions(…) <span class="p">→ records</span>', '<span class="c"># appended after the tool output</span>', 'policy: "…" (the sentence declared for this tool)'] },
    ],
  }[LANG];

  // one row per ablation setting: rose band = at or below no-layer, indigo tick = full layer, dot = this lever off
  function ablRows(id) {
    const host = document.createElement('div');
    const sets = D.ablation.sets.filter(st => st.off[id] != null);
    const W = Math.max(280, Math.min(560, (body.getBoundingClientRect().width || 600) - 56)), nar = W < 460;
    const rh = nar ? 54 : 40, L0 = nar ? 0 : 176, R0 = nar ? 50 : 96, H = sets.length * rh + 26;
    const s = svg(host, W, H);
    const x = v => L0 + (v / 65) * (W - L0 - R0);
    sets.forEach((st, i) => {
      const y = 6 + i * rh, cy = y + (nar ? 30 : 16), v = st.off[id], bad = v <= st.base + 1e-9;
      el('text', { x: 0, y: nar ? y + 10 : cy + 4, 'font-size': 12.5, fill: C.body }, s, L(st.name));
      el('rect', { x: x(0), y: cy - 9, width: x(65) - x(0), height: 18, rx: 3, fill: C.soft2 }, s);
      el('rect', { x: x(0), y: cy - 9, width: x(st.base) - x(0), height: 18, rx: 3, fill: C.denySoft }, s);
      el('text', { x: x(st.base), y: cy - 12, 'font-size': 10.5, fill: C.deny, 'text-anchor': 'middle' }, s, fmt(st.base));
      el('line', { x1: x(st.full), x2: x(st.full), y1: cy - 12, y2: cy + 12, stroke: C.accent, 'stroke-width': 2.5 }, s);
      el('line', { x1: x(st.full), x2: x(v), y1: cy, y2: cy, stroke: bad ? C.deny : C.baseInk, 'stroke-width': 2 }, s);
      const dm = el('circle', { cx: x(v), cy, r: 6, fill: bad ? C.deny : C.ink, stroke: '#fff', 'stroke-width': 1.5 }, s);
      dm.style.transform = `translateX(${x(st.full) - x(v)}px)`;
      requestAnimationFrame(() => requestAnimationFrame(() => { dm.style.transition = 'transform .7s cubic-bezier(.3,.7,.2,1)'; dm.style.transform = 'none'; }));
      el('text', { x: W - R0 + 12, y: cy + 5, 'font-size': 13, 'font-weight': 700, fill: bad ? C.deny : C.ink }, s, fmt(v));
      if (!nar) el('text', { x: W - R0 + 50, y: cy + 5, 'font-size': 12, fill: bad ? C.deny : C.muted, class: 'mono' }, s, sign(v - st.full));
    });
    const ly = H - 4, lx0 = L0;
    el('rect', { x: lx0, y: ly - 9, width: 12, height: 10, rx: 3, fill: C.denySoft }, s);
    el('text', { x: lx0 + 17, y: ly, 'font-size': 11, fill: C.muted }, s, T.below);
    el('line', { x1: lx0 + 110, x2: lx0 + 110, y1: ly - 10, y2: ly + 1, stroke: C.accent, 'stroke-width': 2.5 }, s);
    el('text', { x: lx0 + 117, y: ly, 'font-size': 11, fill: C.muted }, s, T.full);
    return host;
  }
  const tabs = document.getElementById('lxTabs'), body = document.getElementById('lxBody');
  function pick(i) {
    curLever = i;
    const lv = LEVERS[i], id = `LB${i + 1}`;
    tabs.querySelectorAll('.lx-tab').forEach((t, j) => t.classList.toggle('on', i === j));
    const h = LANG === 'ko' ? ['읽는 것', '판정 (닫힌 조건)', '하는 일', '잡는 실수'] : ['Reads', 'Decides (closed)', 'Does', 'Catches'];
    body.innerHTML = `
      <p class="lx-title">${id} · ${lv.t}</p>
      <p class="lx-catch"><b>${h[3]}</b> · ${lv.catch}</p>
      <div class="io">
        <div><span class="h">${h[0]}</span>${lv.reads}</div><i></i>
        <div class="dec"><span class="h">${h[1]}</span>${lv.dec}</div><i></i>
        <div><span class="h">${h[2]}</span>${lv.does}</div>
      </div>
      <div class="ex">${lv.ex.join('\n')}</div>
      <p class="abl-h">${T.ablH}</p>`;
    body.appendChild(ablRows(id));
  }
  const hint = document.createElement('p');
  hint.className = 'lx-hint';
  hint.textContent = LANG === 'ko' ? '체크를 풀어 레버 하나를 꺼 보세요' : 'Uncheck a lever to switch it off';
  tabs.appendChild(hint);
  LEVERS.forEach((lv, i) => {
    const b = document.createElement('button');
    b.className = 'lx-tab';
    b.innerHTML = `<span class="lbl"><span class="id">LB${i + 1}</span>${LANG === 'ko' ? T.lv[i] : ['Procedure', 'Computation', 'Grounding', 'Completeness', 'Closing', 'Load', 'Material'][i]}</span><span class="sw" aria-hidden="true"></span>`;
    b.setAttribute('aria-label', `LB${i + 1} ${LANG === 'ko' ? '끄기' : 'switch off'}`);
    b.addEventListener('click', () => pick(i));
    tabs.appendChild(b);
  });
  let curLever = 2;
  pick(2);

  /* ── Declaration swap ───────────────────────────────────── */
  (function fig6() {
    const host = document.getElementById('f6');
    const files = [
      { bench: 'τ³-bench banking', m: 'Qwen3.8-27B', a: 49.5, b: 57.2 },
      { bench: 'SOPBench library', m: 'Qwen3.8-27B', a: 56.8, b: 72.0 },
      { bench: 'τ²-bench airline', m: 'GPT-4o-mini', a: 27.0, b: 49.0 },
    ];
    let cur = 0;
    function draw() {
      if (widthOf(host, 880) < 640) return drawNarrow();
      const s = svg(host, 880, 270);
      files.forEach((f, i) => {
        const y = 24 + i * 78, on = i === cur;
        const g = el('g', { style: 'cursor:pointer' }, s);
        el('path', { d: `M 16 ${y + 10} q 0 -10 10 -10 h 178 l 26 26 v 34 q 0 10 -10 10 h -194 q -10 0 -10 -10 z`,
          fill: on ? C.accentSoft : '#fff', stroke: on ? C.accent : C.line, 'stroke-width': on ? 2 : 1.3 }, g);
        el('path', { d: `M 204 ${y} v 26 h 26`, fill: 'none', stroke: on ? C.accent : C.line, 'stroke-width': on ? 2 : 1.3 }, g);
        el('text', { x: 32, y: y + 30, 'font-size': 15, 'font-weight': 700, fill: on ? C.accent : C.ink }, g, T.files[i]);
        el('text', { x: 32, y: y + 50, 'font-size': 11, fill: C.muted, class: 'mono' }, g, ['a2/banking_knowledge.lb.json', 'sop_lb/templates/library.json', 'a2/airline.lb.json'][i]);
        g.addEventListener('click', () => { cur = i; draw(); });
        if (on) {
          const p = el('path', { d: `M 232 ${y + 35} C 276 ${y + 35}, 280 135, 328 135`, fill: 'none', stroke: C.accent, 'stroke-width': 2.5 }, s);
          const c = el('circle', { r: 5, fill: C.accent }, s);
          el('animateMotion', { dur: '1.4s', repeatCount: '2', fill: 'freeze', path: p.getAttribute('d') }, c);
        }
      });
      // the engine: the same seven-row panel as the hero, in grey; the rows do not change between domains
      el('rect', { x: 330, y: 52, width: 190, height: 170, fill: '#f7f7f7', stroke: '#e3e3e3' }, s);
      el('text', { x: 344, y: 74, 'font-size': 10.5, fill: '#777777', class: 'mono', 'letter-spacing': '1.2' }, s, 'ENGINE');
      for (let k = 0; k < 7; k++) {
        el('rect', { x: 344, y: 84 + k * 19, width: 162, height: 14, fill: '#ffffff', stroke: '#e3e3e3' }, s);
        el('text', { x: 352, y: 95 + k * 19, 'font-size': 10.5, fill: '#555555', class: 'mono' }, s, `LB${k + 1}`);
      }
      el('text', { x: 425, y: 38, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 600, fill: C.ink }, s, T.engine);
      el('text', { x: 425, y: 242, 'text-anchor': 'middle', 'font-size': 12.5, fill: C.muted }, s, T.engineA);
      el('text', { x: 425, y: 260, 'text-anchor': 'middle', 'font-size': 12.5, fill: C.muted }, s, T.engineB);
      el('line', { x1: 524, y1: 135, x2: 596, y2: 135, stroke: C.accent, 'stroke-width': 2.5, 'marker-end': 'url(#aha)' }, s);
      const f = files[cur];
      el('text', { x: 614, y: 88, 'font-size': 12, fill: C.muted, class: 'mono' }, s, f.bench);
      el('text', { x: 614, y: 108, 'font-size': 13.5, fill: C.body }, s, `${f.m} · pass^1`);
      el('text', { x: 614, y: 156, 'font-size': 36, 'font-weight': 800, fill: C.baseInk }, s, fmt(f.a));
      el('text', { x: 700, y: 153, 'font-size': 24, fill: C.accent }, s, '→');
      el('text', { x: 734, y: 156, 'font-size': 36, 'font-weight': 800, fill: C.accent }, s, fmt(f.b));
      el('text', { x: 614, y: 189, 'text-anchor': 'start', 'font-size': 13, 'font-weight': 700, fill: C.accent }, s, sign(f.b - f.a));
      el('text', { x: 16, y: 262, 'font-size': 13.5, fill: C.body, 'font-weight': 700 }, s, '↑ ' + T.clickFile);
    }
    function drawNarrow() {
      const W = widthOf(host, 640), s = svg(host, W, 330), bw = (W - 16) / 3;
      files.forEach((f, i) => {
        const x0 = i * (bw + 8), on = i === cur;
        const g = el('g', { style: 'cursor:pointer' }, s);
        el('rect', { x: x0, y: 0, width: bw, height: 54, rx: 3, fill: on ? C.accentSoft : '#fff', stroke: on ? C.accent : C.line, 'stroke-width': on ? 2 : 1.3 }, g);
        el('text', { x: x0 + bw / 2, y: 32, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: on ? C.accent : C.ink }, g, ['banking', 'library', 'airline'][i]);
        g.addEventListener('click', () => { cur = i; draw(); });
        if (on) el('path', { d: `M ${x0 + bw / 2} 54 C ${x0 + bw / 2} 76, ${W / 2} 70, ${W / 2} 92`, fill: 'none', stroke: C.accent, 'stroke-width': 2.5 }, s);
      });
      el('rect', { x: 0, y: 92, width: W, height: 92, rx: 0, fill: '#111111' }, s);
      el('text', { x: W / 2, y: 128, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: '#fff' }, s, T.engine);
      el('text', { x: W / 2, y: 152, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#9a9a9a' }, s, T.engineA);
      el('text', { x: W / 2, y: 170, 'text-anchor': 'middle', 'font-size': 12.5, fill: '#9a9a9a' }, s, T.engineB);
      el('line', { x1: W / 2, y1: 184, x2: W / 2, y2: 206, stroke: C.accent, 'stroke-width': 2.5, 'marker-end': 'url(#aha)' }, s);
      const f = files[cur];
      el('text', { x: W / 2, y: 232, 'text-anchor': 'middle', 'font-size': 12.5, fill: C.muted }, s, `${f.bench} · ${f.m}`);
      el('text', { x: W / 2 - 16, y: 276, 'text-anchor': 'end', 'font-size': 34, 'font-weight': 800, fill: C.baseInk }, s, fmt(f.a));
      el('text', { x: W / 2, y: 272, 'text-anchor': 'middle', 'font-size': 22, fill: C.accent }, s, '→');
      el('text', { x: W / 2 + 16, y: 276, 'font-size': 34, 'font-weight': 800, fill: C.accent }, s, fmt(f.b));
      el('text', { x: W / 2, y: 304, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: C.accent }, s, sign(f.b - f.a));
    }
    draw();
    window.addEventListener('resize', () => { clearTimeout(draw.t); draw.t = setTimeout(draw, 150); });
  })();

  /* ── Transfer: dumbbells (scores) or scatter (gain vs baseline) ── */
  let tView = 'score', tMode = 'official';
  function rowVals(g, r) {
    if (g.key === 'sop' && tMode === 'corr') return r.corr ? { a: r.corr[0], b: r.corr[1], fade: false } : { a: r.a, b: r.b, fade: true };
    return { a: r.a, b: r.b, fade: false };
  }
  function fig7() {
    const host = document.getElementById('f7');
    if (tView === 'score') return dumbbell(host);
    return scatter(host);
  }
  function dumbbell(host) {
    const W = widthOf(host, 880), nar = W < 600, rh = 32, gh = nar ? 62 : 46, L0 = nar ? 88 : 190, R0 = nar ? 44 : 80;
    let n = 0; D.transfer.forEach(g => { n += g.rows.length; });
    const H = n * rh + D.transfer.length * gh + 54;
    const s = svg(host, W, H);
    const x = v => L0 + (v / 100) * (W - L0 - R0);
    el('text', { x: nar ? W : W - R0 + 46, y: 16, 'font-size': 12, 'font-weight': 700, fill: C.muted, 'text-anchor': nar ? 'end' : 'middle' }, s, LANG === 'ko' ? '이득(pp)' : 'gain (pp)');
    el('text', { x: (x(0) + x(100)) / 2, y: H - 2, 'font-size': 12.5, fill: C.muted, 'text-anchor': 'middle' }, s, 'pass^1 (%)');
    for (let t = 0; t <= 100; t += 20) {
      el('line', { x1: x(t), x2: x(t), y1: 26, y2: H - 44, stroke: C.line }, s);
      el('text', { x: x(t), y: H - 24, 'font-size': 12, fill: C.faint, 'text-anchor': 'middle', class: 'mono' }, s, t);
    }
    let y = 20;
    D.transfer.forEach(g => {
      y += gh;
      el('text', { x: 0, y: y - (nar ? 32 : 14), 'font-size': 15, 'font-weight': 750, fill: C.ink }, s, g.group);
      el('text', { x: nar ? 0 : L0, y: y - 14, 'font-size': 12, fill: C.faint }, s, g.key === 'sop' && tMode === 'corr' ? T.corrNote : L(g.note));
      const y0 = y;
      g.rows.forEach(r => {
        const v = rowVals(g, r), cy = y + rh / 2, d = v.b - v.a, flat = Math.abs(d) < 2;
        const gg = el('g', { opacity: v.fade ? 0.28 : 1 }, s);
        el('rect', { x: 0, y: y + 2, width: W, height: rh - 4, fill: 'transparent' }, gg);
        el('text', { x: 0, y: cy + 5, 'font-size': nar ? 12.5 : 14, fill: C.body }, gg, r.m);
        el('line', { x1: x(Math.min(v.a, v.b)), x2: x(Math.max(v.a, v.b)), y1: cy, y2: cy, stroke: flat ? C.base : C.accentMid, 'stroke-width': 6, 'stroke-linecap': 'round' }, gg);
        el('circle', { cx: x(v.a), cy, r: 6.5, fill: C.base }, gg);
        el('circle', { cx: x(v.b), cy, r: 7.5, fill: flat ? C.slate : C.accent, stroke: '#fff', 'stroke-width': 2 }, gg);
        const w = nar ? 48 : 56, bx = nar ? W - w : W - R0 + 18;
        el('rect', { x: bx, y: cy - 11, width: w, height: 22, rx: 11, fill: flat ? C.soft2 : C.accentSoft }, gg);
        el('text', { x: bx + w / 2, y: cy + 5, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 700, fill: flat ? C.muted : C.accent }, gg, flat ? '≈0' : sign(d));
        hover(gg, `${r.m} · ${g.group}<br>${T.base} ${fmt(v.a)} → <b>${fmt(v.b)}</b> (${sign(d)})`);
        y += rh;
      });
      if (g.ref) {
        const ref = tMode === 'corr' ? g.ref.corr : g.ref.official;
        el('line', { x1: x(ref), x2: x(ref), y1: y0, y2: y, stroke: C.ink, 'stroke-dasharray': '3 4' }, s);
        el('text', { x: x(ref) + 5, y: y0 - 3, 'font-size': 11, fill: C.ink }, s, nar ? `GPT-5 ${ref}` : T.sopRef(ref));
      }
    });
  }
  function scatter(host) {
    const W = widthOf(host, 880), nar = W < 600, H = nar ? 380 : 460, L0 = nar ? 48 : 60, R0 = nar ? 8 : 24, T0 = 20, B0 = 56;
    const s = svg(host, W, H);
    const x = v => L0 + ((v - 20) / 70) * (W - L0 - R0);
    const y = v => T0 + ((25 - v) / 30) * (H - T0 - B0);
    el('rect', { x: x(20), y: y(0), width: x(90) - x(20), height: y(-5) - y(0), fill: C.soft }, s);
    for (let t = 20; t <= 90; t += 10) {
      el('line', { x1: x(t), x2: x(t), y1: y(25), y2: y(-5), stroke: C.line }, s);
      el('text', { x: x(t), y: y(-5) + 18, 'font-size': 12, fill: C.faint, 'text-anchor': 'middle', class: 'mono' }, s, t);
    }
    for (let t = -5; t <= 25; t += 5) {
      el('line', { x1: x(20), x2: x(90), y1: y(t), y2: y(t), stroke: t === 0 ? C.baseInk : C.line, 'stroke-width': t === 0 ? 1.5 : 1 }, s);
      el('text', { x: x(20) - 10, y: y(t) + 4, 'font-size': 12, fill: C.faint, 'text-anchor': 'end', class: 'mono' }, s, t > 0 ? `+${t}` : t);
    }
    el('text', { x: (x(20) + x(90)) / 2, y: H - 6, 'font-size': 12.5, fill: C.muted, 'text-anchor': 'middle' }, s, T.xAx);
    el('text', { x: 0, y: 0, 'font-size': 12.5, fill: C.muted, 'text-anchor': 'middle', transform: `translate(14 ${(y(25) + y(-5)) / 2}) rotate(-90)` }, s, T.yAx);
    const style = { air: { fill: C.accent, stroke: '#fff' }, sop: { fill: '#fff', stroke: C.accent }, ret: { fill: C.base, stroke: C.baseInk } };
    D.transfer.forEach(g => g.rows.forEach(r => {
      const v = rowVals(g, r), d = v.b - v.a;
      const c = el('circle', { cx: x(v.a), cy: y(d), r: 8, fill: style[g.key].fill, stroke: style[g.key].stroke, 'stroke-width': 2, opacity: v.fade ? 0.3 : 1 }, s);
      hover(c, `${r.m} · ${g.group}<br>${T.base} ${fmt(v.a)} → <b>${fmt(v.b)}</b> (${sign(d)})`);
    }));
    const lab = (vx, vy, txt, dx, dy, anchor, col, bold) =>
      el('text', { x: x(vx) + dx, y: y(vy) + dy, 'font-size': 12.5, 'text-anchor': anchor || 'start', fill: col || C.body, 'font-weight': bold ? 700 : 500 }, s, txt);
    if (nar) return;
    lab(28, 22.25, 'GPT-4o-mini · Qwen2.5-32B', 14, -12, 'start', C.accent, true);
    lab(56.5, 14.5, 'GPT-5.2', 12, 20, 'start', C.accent);
    lab(82.5, 1, 'Qwen3.8-27B', 0, -16, 'middle', C.accent);
    const s27 = tMode === 'corr' ? [69.3, 16.7] : [56.8, 15.2];
    lab(s27[0], s27[1], 'Qwen3.8-27B (library)', -12, -14, 'end', C.accent);
    lab(37.6, 10.6, 'Qwen3-8B · 14B', 14, 4, 'start', C.accent);
    lab(24.2, 10.6, 'Qwen2.5-32B (library)', -4, 26, 'start', C.accent);
    lab(66, -1.2, 'τ² retail · 4', 0, 22, 'middle', C.muted, true);
    el('text', { x: x(89), y: y(23.5), 'font-size': 12.5, fill: C.muted, 'text-anchor': 'end' }, s, T.airNote);
    el('text', { x: x(89), y: y(21.5), 'font-size': 12.5, fill: C.muted, 'text-anchor': 'end' }, s, T.retNote);
  }

  // one-line legend above figure 6, matched to the current view
  function f7legend() {
    const el7 = document.getElementById('f7legend');
    if (!el7) return;
    const ko = LANG === 'ko';
    el7.innerHTML = tView === 'score'
      ? `<span><i style="background:${C.base}"></i>${ko ? '층 없음' : 'no layer'}</span><span><i style="background:${C.accent}"></i>${ko ? '층 있음' : 'with layer'}</span><span><i style="background:${C.slate}"></i>${ko ? '변화 없음(≈0)' : 'no change (≈0)'}</span>`
      : `<span><i style="background:${C.accent}"></i>τ² airline</span><span><i style="background:#fff;border:2px solid ${C.accent}"></i>SOPBench library</span><span><i style="background:${C.base}"></i>τ² retail</span><span>${ko ? '가로 = 층 없는 점수 · 세로 = 층이 더한 점수' : 'x = score without the layer · y = gain from the layer'}</span>`;
  }
  fig7(); f7legend();
  seg(document.getElementById('tView'), d => { tView = d.v; fig7(); f7legend(); });
  seg(document.getElementById('sopTog'), d => { tMode = d.v; fig7(); });

  /* ── Ablation, three settings ──────────────────────────── */
  function fig8() {
    const host = document.getElementById('f8');
    const sets = D.ablation.sets, W = widthOf(host, 880), nar = W < 640, gap = 26, rh = 30, L0 = 52, R0 = 44;
    const pw = nar ? W : (W - gap * 2) / 3;
    const maxRows = Math.max(...sets.map(st => Object.keys(st.off).length));
    const ph = st => 58 + Object.keys(st.off).length * rh + 70;
    const H = nar ? sets.reduce((a, st) => a + ph(st), 0) : 58 + maxRows * rh + 64;
    const s = svg(host, W, H);
    let oy = 0;
    sets.forEach((st, p) => {
      const ox = nar ? 0 : p * (pw + gap), x = v => ox + L0 + (v / 65) * (pw - L0 - R0);
      const ids = Object.entries(st.off).sort((a, b) => a[1] - b[1]);
      const top = oy + 58, bottom = top + (nar ? ids.length : maxRows) * rh;
      if (nar) oy += ph(st);
      el('text', { x: ox, y: top - 40, 'font-size': 14, 'font-weight': 750, fill: C.ink }, s, L(st.name));
      el('text', { x: ox, y: top - 20, 'font-size': 12, fill: C.faint }, s, L(st.n));
      el('rect', { x: x(0), y: top - 8, width: x(st.base) - x(0), height: bottom - top + 12, rx: 3, fill: C.denySoft }, s);
      el('line', { x1: x(st.full), x2: x(st.full), y1: top - 12, y2: bottom + 4, stroke: C.accent, 'stroke-width': 2.5 }, s);
      [0, 20, 40, 60].forEach(t => el('text', { x: x(t), y: bottom + 20, 'font-size': 10.5, fill: C.faint, 'text-anchor': 'middle', class: 'mono' }, s, t));
      el('text', { x: x(0), y: bottom + 42, 'font-size': 11.5, fill: C.deny, 'font-weight': 700 }, s, LANG === 'ko' ? `층 없음 ${fmt(st.base)} 이하` : `${T.below} ${fmt(st.base)}`);
      el('text', { x: ox + pw, y: bottom + 42, 'font-size': 11.5, fill: C.accent, 'text-anchor': 'end', 'font-weight': 700 }, s, `${T.full} ${fmt(st.full)}`);
      ids.forEach(([id, v], i) => {
        const cy = top + i * rh + rh / 2 - 4, bad = v <= st.base + 1e-9;
        el('text', { x: ox, y: cy + 4, 'font-size': 12, 'font-weight': bad ? 800 : 600, fill: bad ? C.deny : C.body, class: 'mono' }, s, `−${id}`);
        el('line', { x1: x(st.full), x2: x(v), y1: cy, y2: cy, stroke: bad ? C.deny : C.baseInk, 'stroke-width': 2 }, s);
        const c = el('circle', { cx: x(v), cy, r: 6, fill: bad ? C.deny : C.ink, stroke: '#fff', 'stroke-width': 1.5 }, s);
        el('text', { x: ox + pw, y: cy + 4, 'font-size': 12, 'text-anchor': 'end', fill: bad ? C.deny : C.muted, 'font-weight': bad ? 800 : 500 }, s, fmt(v));
        hover(c, `${L(st.name)} · −${id}<br>${fmt(st.full)} → <b>${fmt(v)}</b> (${sign(v - st.full)})`);
      });
    });
  }
  fig8();

  /* ── Reliability ────────────────────────────────────────── */
  (function fig9() {
    const h = D.heldout;
    let s = svg(document.getElementById('f9a'), 420, 156);
    let x = v => 20 + ((v - 20) / 45) * 380;
    el('line', { x1: x(20), x2: x(65), y1: 56, y2: 56, stroke: '#fff', 'stroke-width': 10, 'stroke-linecap': 'round' }, s);
    el('circle', { cx: x(h.a), cy: 56, r: 8, fill: C.base }, s);
    el('text', { x: x(h.a), y: 34, 'text-anchor': 'middle', 'font-size': 13, fill: C.baseInk, 'font-weight': 700 }, s, `${T.base} ${fmt(h.a)}`);
    el('line', { x1: x(h.a) + 11, x2: x(h.b) - 14, y1: 56, y2: 56, stroke: C.accent, 'stroke-width': 2.5, 'marker-end': 'url(#aha)' }, s);
    el('circle', { cx: x(h.b), cy: 56, r: 9, fill: C.accent, stroke: '#fff', 'stroke-width': 2 }, s);
    el('text', { x: x(h.b), y: 34, 'text-anchor': 'middle', 'font-size': 14, fill: C.accent, 'font-weight': 800 }, s, `${T.ours} ${fmt(h.b)}`);
    el('text', { x: 20, y: 134, 'font-size': 46, 'font-weight': 800, fill: C.ink }, s, String(h.overblock));
    el('text', { x: 28 + 30 * String(h.overblock).length, y: 128, 'font-size': 14, 'font-weight': 600, fill: C.body }, s, T.blocked);

    const R = D.reasonless;
    s = svg(document.getElementById('f9b'), 420, 214);
    x = v => 108 + (v / 80) * 290;
    const arms = [['none', C.base, T.base], ['gates', C.slate, T.gates], ['ours', C.accent, T.ours]];
    let lx = 112;  // legend items spaced by their measured width (labels differ by language)
    arms.forEach(([, c, nm]) => {
      el('circle', { cx: lx, cy: 8, r: 5.5, fill: c === C.slate ? '#ffffff' : c, stroke: c, 'stroke-width': c === C.slate ? 2 : 0 }, s);
      const lt = el('text', { x: lx + 9, y: 12, 'font-size': 12, fill: C.body }, s, nm);
      lx += 9 + lt.getComputedTextLength() + 22;
    });
    let yy = 40;
    R.rows.forEach(r => {
      el('text', { x: 0, y: yy + 4, 'font-size': 13, 'font-weight': 700, fill: C.ink }, s, r.m);
      [0, 1].forEach(k => {
        const cy = yy + 22 + k * 26;
        el('text', { x: 0, y: cy + 4, 'font-size': 13, fill: C.muted, class: 'mono' }, s, `pass^${k === 0 ? 1 : 4}`);
        el('line', { x1: x(0), x2: x(80), y1: cy, y2: cy, stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round' }, s);
        arms.forEach(([key, c]) => {
          const dot = el('circle', { cx: x(r[key][k]), cy, r: key === 'ours' ? 7 : 6, fill: key === 'gates' ? '#ffffff' : c, stroke: key === 'gates' ? C.slate : '#fff', 'stroke-width': key === 'gates' ? 2 : 1.5 }, s);
          hover(dot, `${r.m} · pass^${k === 0 ? 1 : 4}<br><b>${fmt(r[key][k])}</b>`);
        });
        el('text', { x: x(r.ours[k]) + 12, y: cy + 5, 'font-size': 13.5, fill: C.accent, 'font-weight': 800 }, s, fmt(r.ours[k]));
        el('text', { x: x(r.gates[k]), y: cy - 12, 'font-size': 12, fill: C.slate, 'text-anchor': 'middle' }, s, fmt(r.gates[k]));
      });
      yy += 84;
    });
    el('text', { x: 0, y: 210, 'font-size': 12, fill: C.faint }, s, T.rlFoot);
  })();

  let lastW = innerWidth;
  window.addEventListener('resize', () => {
    clearTimeout(window.__rz);
    window.__rz = setTimeout(() => {
      if (Math.abs(innerWidth - lastW) < 40) return;
      lastW = innerWidth;
      fig1(false); fig7(); fig8(); pick(curLever);
    }, 150);
  });

  /* ── Cite copy ──────────────────────────────────────────── */
  const copyBib = document.getElementById('copyBib');
  if (copyBib) copyBib.addEventListener('click', e => {
    const t = document.getElementById('bib').textContent;
    try { navigator.clipboard.writeText(t); e.target.textContent = T.copied; } catch (_) { /* clipboard blocked */ }
    setTimeout(() => { e.target.textContent = T.copy; }, 1400);
  });
})();
