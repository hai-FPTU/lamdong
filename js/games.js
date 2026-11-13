/* =========================================================
   TRÒ CHƠI / BÀI TẬP TƯƠNG TÁC – các bộ máy dùng chung
   ========================================================= */
(function(){
const A = window.APP, st = A.st, $ = A.$, $$ = A.$$, esc = A.esc, I = window.ICON, P = window.PAGES, V = window.VIZ;
const COL = window.DATA.colors;

function done(g, score, max){
  const prev = st.prac[g.id] || 0, pct = Math.round(score / max * 100);
  if (pct > prev) { st.prac[g.id] = pct; A.save(); }
  if (pct >= 70) { A.SND.win(); A.confetti(); } else A.SND.ok();
  A.addXP(Math.max(5, Math.round(pct / 5)), 'Hoàn thành “' + g.t + '”: ' + pct + '%');
}
function head(g){
  return P.pageHead('<a href="#thuchanh">Thực hành</a>', g.t, g.d) +
    '<div class="wrap prac-layout"><div class="game-intro"><span class="ibox" style="background:' + g.c + '">' + I(g.ic) + '</span><div><div class="eyebrow">Chuyên đề ' + g.cd + ' · ' + esc(window.CD[g.cd - 1].short) + '</div><p style="margin:2px 0 0">' + esc(g.intro || '') + '</p></div></div>';
}
function foot(g){
  const i = window.GAMES.indexOf(g), nx = window.GAMES[(i + 1) % window.GAMES.length];
  return '<div class="lesson-nav"><a class="btn ghost" href="#thuchanh">' + I('left') + ' Tất cả bài thực hành</a><a class="btn ghost" href="#chuyende-' + g.cd + '">Về Chuyên đề ' + g.cd + '</a><a class="btn" href="#thuchanh-' + nx.id + '">' + esc(nx.t) + ' ' + I('arrow') + '</a></div></div>';
}

/* ================= CẢNH SVG CÓ ĐIỂM BẤM ================= */
const SCENES = {
  net(){
    const t = V.txt, z = V.zone;
    let s = '<rect width="660" height="420" fill="#f8fbff"/>';
    s += z(170, 20, 160, 90, 'DMZ', '#0ea5e9') + z(380, 20, 270, 230, 'VÙNG MÁY CHỦ 10.20.1.0/24', '#2563eb') + z(170, 270, 480, 140, 'VÙNG VĂN PHÒNG 10.20.10.0/24', '#7c3aed');
    s += '<ellipse cx="70" cy="150" rx="58" ry="38" fill="#e2e8f0" stroke="#94a3b8"/>' + t(70, 154, 'Internet', { s: 12 });
    s += '<rect x="140" y="128" width="54" height="64" rx="8" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>' + t(167, 162, 'FW01', { s: 10 });
    s += '<rect x="190" y="50" width="120" height="40" rx="8" fill="#fff" stroke="#0ea5e9" stroke-width="2"/>' + t(250, 74, 'SRV-WEB01', { s: 10 });
    s += '<rect x="20" y="230" width="120" height="44" rx="8" fill="#fff" stroke="#f59e0b" stroke-width="2"/>' + t(80, 248, 'Cổng VPN', { s: 10 }) + t(80, 263, 'chỉ mật khẩu', { s: 8.5, w: 600, c: '#b45309' });
    const srv = [['SRV-VB01', 400, 50], ['SRV-FILE01', 520, 50], ['SRV-MAIL01', 400, 110], ['SRV-DC01', 520, 110]];
    srv.forEach(x => { s += '<rect x="' + x[1] + '" y="' + x[2] + '" width="110" height="40" rx="8" fill="#fff" stroke="#2563eb" stroke-width="2"/>' + t(x[1] + 55, x[2] + 25, x[0], { s: 10 }); });
    s += '<rect x="400" y="180" width="110" height="50" rx="8" fill="#fff" stroke="#16a34a" stroke-width="2"/>' + t(455, 200, 'SRV-BK01 sao lưu', { s: 9.5 }) + t(455, 216, 'ổ luôn gắn, cùng vùng', { s: 8, w: 600, c: '#b91c1c' });
    s += '<rect x="530" y="180" width="100" height="50" rx="8" fill="#fff" stroke="#64748b" stroke-width="2"/>' + t(580, 200, 'PRN-VP-01', { s: 9.5 }) + t(580, 216, 'máy in quét', { s: 8, w: 600, c: '#64748b' });
    s += '<rect x="20" y="320" width="130" height="50" rx="8" fill="#fff" stroke="#94a3b8" stroke-width="2" stroke-dasharray="4 3"/>' + t(85, 340, 'NAS-CU ? 10.20.1.66', { s: 9.5 }) + t(85, 356, 'thấy trong netflow', { s: 8, w: 600, c: '#64748b' }) + '<path d="M150 345 C300 345 360 250 380 240" stroke="#94a3b8" stroke-width="1.5" stroke-dasharray="3 4" fill="none"/>';
    for (let i = 0; i < 5; i++) s += '<rect x="' + (190 + i * 62) + '" y="300" width="50" height="34" rx="6" fill="#fff" stroke="#7c3aed"/>' + t(215 + i * 62, 322, 'PC', { s: 9 });
    s += '<rect x="250" y="360" width="200" height="22" rx="6" fill="#ede9fe" stroke="#7c3aed"/>' + t(350, 375, 'Switch văn phòng', { s: 9 });
    s += '<circle cx="510" cy="370" r="20" fill="#fff" stroke="#e11d48" stroke-width="2"/>' + t(510, 374, 'Wi-Fi', { s: 8.5 }) + t(510, 402, 'Wi-Fi khách', { s: 8.5, c: '#e11d48' });
    s += '<path d="M128 150 H140 M194 150 C230 150 240 100 250 90 M194 160 C300 160 380 90 400 70 M194 170 H380 L400 120 M455 160 V180 M80 230 L150 192 M350 360 V334 M490 370 H450" stroke="#94a3b8" stroke-width="2" fill="none" class="flow"/>';
    s += '<rect x="196" y="196" width="160" height="40" rx="8" fill="#fff7ed" stroke="#f97316"/>' + t(276, 212, 'Quy tắc 14: any → SRV-VB01', { s: 9 }) + t(276, 226, 'cổng 3389 (tạm, hỗ trợ)', { s: 8.5, w: 600, c: '#c2410c' });
    s += '<rect class="hs" data-h="rdp" x="190" y="190" width="172" height="52" rx="10"/><rect class="hs" data-h="vpn" x="14" y="224" width="132" height="56" rx="10"/><rect class="hs" data-h="flat" x="524" y="174" width="112" height="62" rx="10"/><rect class="hs" data-h="bk" x="394" y="174" width="122" height="62" rx="10"/><rect class="hs" data-h="nas" x="14" y="314" width="142" height="62" rx="10"/><rect class="hs" data-h="wifi" x="484" y="344" width="52" height="66" rx="10"/>';
    return '<svg viewBox="0 0 660 420" xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
  },
  office(){
    const t = V.txt;
    let s = '<rect width="660" height="420" fill="#fefce8"/><rect y="320" width="660" height="100" fill="#e7e5e4"/>';
    s += '<rect x="440" y="40" width="190" height="120" rx="6" fill="#bae6fd" stroke="#94a3b8" stroke-width="4"/><path d="M535 40 V160 M440 100 H630" stroke="#94a3b8" stroke-width="3"/>';
    s += '<rect x="30" y="40" width="170" height="110" rx="6" fill="#fff" stroke="#cbd5e1" stroke-width="3"/>' + t(115, 64, 'Lịch tuần 46', { s: 10 }) + '<path d="M50 80 H180 M50 96 H160" stroke="#cbd5e1" stroke-width="3"/>' + t(115, 130, 'WIFI: CQMau@2026', { s: 11, c: '#dc2626' });
    s += '<rect x="230" y="210" width="300" height="16" fill="#a16207"/><rect x="245" y="226" width="12" height="94" fill="#854d0e"/><rect x="505" y="226" width="12" height="94" fill="#854d0e"/>';
    s += '<rect x="300" y="110" width="150" height="96" rx="8" fill="#0f172a"/><rect x="308" y="118" width="134" height="76" rx="4" fill="#1e3a8a"/>' + t(375, 146, 'Đang đăng nhập:', { s: 9, c: '#bfdbfe', w: 600 }) + t(375, 164, 'quantri (Admin)', { s: 11, c: '#fff' }) + '<rect x="364" y="206" width="22" height="6" fill="#334155"/>';
    s += '<rect x="420" y="100" width="40" height="34" fill="#fde047" transform="rotate(8 440 117)"/>' + t(440, 118, 'MK:', { s: 8 }) + t(441, 130, 'Ha@123', { s: 8, c: '#b91c1c' });
    s += '<rect x="470" y="150" width="46" height="60" rx="4" fill="#cbd5e1" stroke="#64748b"/><rect x="460" y="176" width="14" height="8" rx="2" fill="#e11d48"/>' + t(492, 200, 'PC', { s: 8 });
    s += '<path d="M320 260 Q330 230 360 232 Q392 230 398 262 L396 320 H320Z" fill="#475569"/>' + t(360, 300, 'ghế trống', { s: 9, c: '#e2e8f0', w: 600 });
    s += '<rect x="560" y="230" width="80" height="60" rx="6" fill="#e5e7eb" stroke="#6b7280"/><rect x="570" y="216" width="60" height="16" fill="#fff" stroke="#9ca3af"/>' + t(600, 270, 'Máy in', { s: 9 }) + '<rect x="586" y="196" width="34" height="22" fill="#fff" stroke="#9ca3af"/>' + t(603, 210, 'MẬT', { s: 7, c: '#dc2626' });
    s += '<rect x="40" y="190" width="110" height="160" rx="4" fill="#78716c" stroke="#44403c" stroke-width="3"/>' + t(95, 214, 'PHÒNG MÁY CHỦ', { s: 8.5, c: '#fff' }) + '<path d="M150 200 L182 214 L182 360 L150 350Z" fill="#a8a29e"/><rect x="160" y="330" width="22" height="18" fill="#92400e"/>' + t(171, 372, 'chèn cửa', { s: 7.5, c: '#92400e' });
    s += '<circle cx="230" cy="250" r="16" fill="#fcd34d"/><rect x="214" y="266" width="32" height="54" rx="10" fill="#2563eb"/><rect x="242" y="246" width="8" height="16" rx="2" fill="#111827"/><path d="M250 236 h96 a8 8 0 0 1 8 8 v24 a8 8 0 0 1 -8 8 h-80 l-12 10 v-10 a8 8 0 0 1 -4 -8 z" fill="#fff" stroke="#94a3b8" transform="translate(-24 -36)"/>' + t(276, 222, '“Mã OTP là', { s: 8.5 }) + t(276, 234, '4 8 2 …”', { s: 8.5, c: '#dc2626' });
    s += '<circle cx="610" cy="350" r="22" fill="#16a34a"/><rect x="600" y="368" width="20" height="30" fill="#92400e"/>' + '<circle cx="540" cy="70" r="0"/>';
    s += '<rect class="hs" data-h="note" x="412" y="94" width="58" height="48" rx="8"/><rect class="hs" data-h="lock" x="300" y="112" width="110" height="88" rx="8"/><rect class="hs" data-h="usb" x="452" y="168" width="28" height="24" rx="6"/><rect class="hs" data-h="print" x="576" y="188" width="54" height="34" rx="6"/><rect class="hs" data-h="wifi" x="40" y="112" width="152" height="30" rx="6"/><rect class="hs" data-h="door" x="146" y="196" width="44" height="182" rx="6"/><rect class="hs" data-h="phone" x="206" y="180" width="130" height="76" rx="8"/>';
    return '<svg viewBox="0 0 660 420" xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
  }
};

/* ================= BỘ MÁY: SOI BẤT THƯỜNG ================= */
function spot(v, g){
  const ids = Object.keys(g.spots), N = ids.length; let found = [], miss = 0, askI = 0;
  v.innerHTML = head(g) + '<div class="spot-wrap"><div><div class="spot-stage" id="stage">' + (g.svg ? SCENES[g.svg]() : '<div style="padding:16px">' + g.html + '</div>') + '</div></div>' +
    '<div class="spot-panel card"><div class="g-score"><span class="counter">' + I('target') + ' <b id="fc">0</b>/' + N + '</span><span class="counter" style="background:#fff1f2;color:#be123c">Bấm trượt: <b id="mc">0</b></span></div>' +
    (g.quiz ? '<div class="note info" id="ask"></div>' : '') +
    '<div class="row"><button class="btn small ghost" id="hint">' + I('sparkle') + ' Gợi ý</button><button class="btn small ghost" id="show">' + I('eye') + ' Xem đáp án</button><button class="btn small ghost" id="again">' + I('refresh') + ' Làm lại</button></div>' +
    '<div class="found-list" id="fl"></div><div id="lesson"></div></div></div>' + foot(g);
  const stage = $('#stage', v), fl = $('#fl', v);
  const nodes = id => $$('[data-h="' + id + '"]', stage);
  function ask(){ if (!g.quiz) return; const a = $('#ask', v); if (askI < g.asks.length) a.innerHTML = I('search') + '<div><b>Câu ' + (askI + 1) + '/' + g.asks.length + ':</b> ' + esc(g.asks[askI][1]) + '</div>'; else a.innerHTML = I('check') + '<div>Đã xong tất cả câu hỏi.</div>'; }
  function mark(id, rv){
    nodes(id).forEach(n => { n.classList.add(rv ? 'reveal' : 'found'); if (!rv && n.classList.contains('seg')) n.classList.add('found'); });
    fl.insertAdjacentHTML('beforeend', '<div class="fi' + (rv ? ' rv' : '') + '">' + I(rv ? 'eye' : 'check') + '<div><b>' + esc(g.spots[id][0]) + '.</b> ' + esc(g.spots[id][1]) + '</div></div>');
  }
  function finish(){ $('#lesson', v).innerHTML = (g.lesson ? '<div class="remember"><span class="ibox">' + I('flag') + '</span><div><b>Bài học</b><p>' + esc(g.lesson) + '</p></div></div>' : ''); done(g, Math.max(0, found.length - Math.floor(miss / 3)), N); }
  stage.addEventListener('click', e => {
    const h = e.target.closest('[data-h]');
    if (h) {
      const id = h.dataset.h; if (found.includes(id)) return;
      if (g.quiz && g.asks[askI] && g.asks[askI][0] !== id) { miss++; $('#mc', v).textContent = miss; A.SND.no(); h.classList.add('nope'); setTimeout(() => h.classList.remove('nope'), 400); return; }
      found.push(id); mark(id); A.SND.ok(); $('#fc', v).textContent = found.length; askI++; ask();
      A.announce(g.spots[id][0]);
      if (found.length === N) finish();
      return;
    }
    miss++; $('#mc', v).textContent = miss; A.SND.no();
    const r = stage.getBoundingClientRect(); const m = document.createElement('i'); m.className = 'miss'; m.style.left = (e.clientX - r.left) + 'px'; m.style.top = (e.clientY - r.top) + 'px'; stage.appendChild(m); setTimeout(() => m.remove(), 700);
  });
  $('#hint', v).onclick = () => { const left = g.quiz ? [g.asks[askI] && g.asks[askI][0]].filter(Boolean) : ids.filter(i => !found.includes(i)); if (!left.length) return; const id = left[Math.floor(Math.random() * left.length)]; nodes(id).forEach(n => { n.classList.add('reveal'); setTimeout(() => n.classList.remove('reveal'), 900); }); miss++; $('#mc', v).textContent = miss; };
  $('#show', v).onclick = () => { ids.filter(i => !found.includes(i)).forEach(i => mark(i, true)); found = ids.slice(); $('#fc', v).textContent = N; $('#lesson', v).innerHTML = g.lesson ? '<div class="remember"><span class="ibox">' + I('flag') + '</span><div><b>Bài học</b><p>' + esc(g.lesson) + '</p></div></div>' : ''; };
  $('#again', v).onclick = () => spot(v, g);
  ask();
}

/* ================= BỘ MÁY: PHÂN LOẠI ================= */
function sort(v, g){
  const items = A.shuffle(g.items.map((x, i) => ({ i, t: x[0], b: x[1], why: x[2] || '' })));
  let sel = null, err = 0, placed = 0;
  v.innerHTML = head(g) + '<div class="g-score"><span class="counter">' + I('check') + ' Đã xếp <b id="pc">0</b>/' + items.length + '</span><span class="counter" style="background:#fff1f2;color:#be123c">Sai: <b id="ec">0</b></span><button class="btn small ghost" id="again">' + I('refresh') + ' Làm lại</button></div>' +
    '<div class="sort-pool" id="pool">' + items.map(x => '<button class="chipc' + (g.mono ? ' mono' : '') + '" draggable="true" data-i="' + x.i + '">' + esc(x.t) + '</button>').join('') + '</div>' +
    '<div class="bins2" style="grid-template-columns:repeat(' + Math.min(g.bins.length, 3) + ',1fr)">' + g.bins.map(b => '<div class="bin2" data-b="' + b[0] + '"><h4><i style="background:' + b[2] + '"></i>' + esc(b[1]) + '</h4><div class="in"></div></div>').join('') + '</div><div id="res"></div>' + foot(g);
  const pool = $('#pool', v);
  function choose(btn){ $$('.chipc.sel', v).forEach(x => x.classList.remove('sel')); sel = btn; if (btn) { btn.classList.add('sel'); $$('.bin2', v).forEach(b => b.classList.add('can')); A.SND.tap(); } else $$('.bin2', v).forEach(b => b.classList.remove('can')); }
  function drop(btn, bin){
    const it = g.items[+btn.dataset.i];
    if (it[1] === bin.dataset.b) {
      btn.classList.remove('sel'); btn.classList.add('ok'); btn.draggable = false; btn.disabled = true;
      if (it[2]) btn.insertAdjacentHTML('beforeend', '<span class="why">' + esc(it[2]) + '</span>');
      $('.in', bin).appendChild(btn); placed++; $('#pc', v).textContent = placed; A.SND.ok();
      if (placed === items.length) { const sc = Math.max(0, items.length - err); $('#res', v).innerHTML = '<div class="fb ' + (err <= 2 ? 'ok' : 'mid') + '">' + I('award') + '<div><b>Hoàn thành!</b> Sai ' + err + ' lần. Điểm: ' + Math.round(sc / items.length * 100) + '%.</div></div>'; done(g, sc, items.length); }
    } else { err++; $('#ec', v).textContent = err; A.SND.no(); btn.classList.add('no'); setTimeout(() => btn.classList.remove('no'), 400); A.toast('Chưa đúng, thử ô khác'); }
    choose(null);
  }
  v.addEventListener('click', e => {
    const c = e.target.closest('.chipc'); if (c && !c.disabled) { choose(sel === c ? null : c); return; }
    const b = e.target.closest('.bin2'); if (b && sel) drop(sel, b);
  });
  v.addEventListener('dragstart', e => { const c = e.target.closest('.chipc'); if (c) { choose(c); e.dataTransfer.setData('text/plain', c.dataset.i); } });
  $$('.bin2', v).forEach(b => { b.addEventListener('dragover', e => { e.preventDefault(); b.classList.add('over'); }); b.addEventListener('dragleave', () => b.classList.remove('over')); b.addEventListener('drop', e => { e.preventDefault(); b.classList.remove('over'); const c = $('.chipc[data-i="' + e.dataTransfer.getData('text/plain') + '"]', v); if (c && !c.disabled) drop(c, b); }); });
  $('#again', v).onclick = () => sort(v, g);
}

/* ================= BỘ MÁY: SẮP XẾP ================= */
function order(v, g){
  let cur = A.shuffle(g.items.map((x, i) => i)); let tries = 0;
  if (cur.every((x, i) => x === i)) cur.reverse();
  v.innerHTML = head(g) + '<div class="order-list" id="ol"></div><div class="row mt"><button class="btn" id="chk">' + I('check') + ' Kiểm tra thứ tự</button><button class="btn ghost" id="again">' + I('refresh') + ' Xáo lại</button></div><div id="res" class="mt"></div>' + foot(g);
  const ol = $('#ol', v);
  function draw(marks){ ol.innerHTML = cur.map((k, p) => '<div class="oi' + (marks ? (k === p ? ' okp' : ' badp') : '') + '" draggable="true" data-k="' + k + '"><span class="h">' + I('grip') + '</span><b>' + (p + 1) + '</b>' + (g.showTime ? '<span class="tm">' + esc(g.items[k][1]) + '</span>' : '') + '<span class="t">' + esc(g.items[k][0]) + (marks && !g.showTime ? ' <span class="chip" style="background:#eef4ff;border-radius:999px;padding:2px 8px;font-size:.74rem;font-weight:800;color:#1d4ed8">' + esc(g.items[k][1]) + '</span>' : '') + '</span><span class="mv"><button data-u="' + p + '" aria-label="Lên">' + I('up') + '</button><button data-d="' + p + '" aria-label="Xuống">' + I('down') + '</button></span></div>').join(''); }
  draw();
  ol.addEventListener('click', e => { const u = e.target.closest('[data-u]'), d = e.target.closest('[data-d]'); if (u) { const p = +u.dataset.u; if (p > 0) { [cur[p - 1], cur[p]] = [cur[p], cur[p - 1]]; A.SND.tap(); draw(); } } if (d) { const p = +d.dataset.d; if (p < cur.length - 1) { [cur[p + 1], cur[p]] = [cur[p], cur[p + 1]]; A.SND.tap(); draw(); } } });
  let dragK = null;
  ol.addEventListener('dragstart', e => { const o = e.target.closest('.oi'); if (o) { dragK = +o.dataset.k; o.classList.add('dragging'); } });
  ol.addEventListener('dragover', e => { e.preventDefault(); const o = e.target.closest('.oi'); if (!o || dragK == null) return; const k = +o.dataset.k; if (k === dragK) return; const a = cur.indexOf(dragK), b = cur.indexOf(k); cur.splice(a, 1); cur.splice(b, 0, dragK); draw(); $('.oi[data-k="' + dragK + '"]', ol).classList.add('dragging'); });
  ol.addEventListener('dragend', () => { dragK = null; draw(); });
  $('#chk', v).onclick = () => { tries++; const ok = cur.filter((k, p) => k === p).length; draw(true); if (ok === cur.length) { $('#res', v).innerHTML = '<div class="fb ok">' + I('award') + '<div><b>Chính xác sau ' + tries + ' lần kiểm tra.</b> ' + esc(g.lesson || '') + '</div></div>'; done(g, Math.max(cur.length - (tries - 1) * 2, cur.length / 2), cur.length); } else { A.SND.no(); $('#res', v).innerHTML = '<div class="fb mid">' + I('alert') + '<div>Đúng vị trí ' + ok + '/' + cur.length + '. Ô đỏ đang sai chỗ – chỉnh lại rồi kiểm tra tiếp.</div></div>'; } };
  $('#again', v).onclick = () => order(v, g);
}

/* ================= BỘ MÁY: MA TRẬN RỦI RO ================= */
function matrix(v, g){
  const ans = {}; let cur = g.risks[0].id;
  const color = r => r >= 20 ? '#b91c1c' : r >= 10 ? '#f97316' : r >= 5 ? '#facc15' : '#4ade80';
  v.innerHTML = head(g) + '<div class="grid g2" style="align-items:start;gap:24px"><div><div id="rlist" class="sortlist"></div><div class="row mt"><button class="btn" id="cmp">' + I('users') + ' So sánh với chuyên gia</button><button class="btn ghost" id="again">' + I('refresh') + ' Làm lại</button></div><div id="res" class="mt"></div></div>' +
    '<div class="card"><div class="rm" id="rm"></div><div class="rm-legend"><span style="--c:#4ade80">Thấp 1–4</span><span style="--c:#facc15">Trung bình 5–9</span><span style="--c:#f97316">Cao 10–16</span><span style="--c:#b91c1c">Rất cao 20–25</span></div><p class="small muted mt">Trục đứng: L – khả năng (1–5). Trục ngang: I – tác động (1–5). Quy ước bài học R = L × I.</p></div></div>' + foot(g);
  function draw(show){
    $('#rlist', v).innerHTML = g.risks.map(r => '<button class="sortitem' + (r.id === cur ? ' picked' : '') + (ans[r.id] ? ' okp' : '') + '" data-r="' + r.id + '"><span class="bn">' + r.id.slice(1) + '</span><span><b>' + r.id + '</b> ' + esc(r.t) + (ans[r.id] ? '<br><span class="small muted">Đồng chí chấm: L=' + ans[r.id][0] + ', I=' + ans[r.id][1] + ' → R=' + ans[r.id][0] * ans[r.id][1] + '</span>' : '') + (show ? '<br><span class="small" style="color:#9a3412">Chuyên gia: L=' + r.L + ', I=' + r.I + '. ' + esc(r.why) + '</span>' : '') + '</span></button>').join('');
    let h = '';
    for (let L = 5; L >= 1; L--) { h += '<div class="ax">' + L + '</div>'; for (let I_ = 1; I_ <= 5; I_++) { const toks = g.risks.filter(r => ans[r.id] && ans[r.id][0] === L && ans[r.id][1] === I_).map(r => '<span class="tok">' + r.id + '</span>').join('') + (show ? g.risks.filter(r => r.L === L && r.I === I_).map(r => '<span class="tok ex">' + r.id + '</span>').join('') : ''); h += '<div class="cell" style="background:' + color(L * I_) + '" data-l="' + L + '" data-i="' + I_ + '" title="L=' + L + ', I=' + I_ + '">' + toks + '</div>'; } }
    h += '<div></div>' + [1, 2, 3, 4, 5].map(i => '<div class="ax">' + i + '</div>').join('');
    $('#rm', v).innerHTML = h;
  }
  draw();
  v.addEventListener('click', e => {
    const r = e.target.closest('[data-r]'); if (r) { cur = r.dataset.r; A.SND.tap(); draw(); return; }
    const c = e.target.closest('.cell'); if (c && cur) { ans[cur] = [+c.dataset.l, +c.dataset.i]; A.SND.ok(); const nx = g.risks.find(x => !ans[x.id]); if (nx) cur = nx.id; draw(); }
  });
  $('#cmp', v).onclick = () => {
    if (Object.keys(ans).length < g.risks.length) { A.toast('Hãy chấm đủ ' + g.risks.length + ' kịch bản'); return; }
    let ok = 0; g.risks.forEach(r => { if (Math.abs(ans[r.id][0] - r.L) <= 1 && Math.abs(ans[r.id][1] - r.I) <= 1) ok++; });
    draw(true);
    $('#res', v).innerHTML = '<div class="fb ' + (ok >= 4 ? 'ok' : 'mid') + '">' + I('chart') + '<div><b>' + ok + '/' + g.risks.length + ' kịch bản lệch không quá 1 bậc.</b> Ô viền đứt là đánh giá của chuyên gia. Chênh lệch không sai nếu có luận cứ – hãy ghi luận cứ vào PL-02.</div></div>';
    done(g, ok, g.risks.length);
  };
  $('#again', v).onclick = () => matrix(v, g);
}

/* ================= BỘ MÁY: TƯỜNG LỬA ================= */
function fw(v, g){
  let rules = g.start.map(r => r.slice());
  const Z = ['any'].concat(g.zones), PO = g.ports;
  const opt = (arr, val) => arr.map(x => '<option' + (x === val ? ' selected' : '') + '>' + esc(x) + '</option>').join('');
  v.innerHTML = head(g) + '<div class="fwsim"><div class="card fw-rules"><h3 class="mb">Bộ quy tắc (xét từ trên xuống)</h3><div class="rule hdr"><span>#</span><span>Nguồn</span><span>Đích</span><span>Cổng</span><span>Hành động</span><span></span></div><div id="rules"></div>' +
    '<div class="rule"><span class="no">∞</span><span class="wide" style="grid-column:span 4;font-size:.85rem;color:#64748b">Mặc định: CHẶN tất cả (không sửa được)</span></div>' +
    '<div class="row mt"><button class="btn small ghost" id="add">' + I('plus') + ' Thêm quy tắc</button><button class="btn small" id="run">' + I('play') + ' Chạy thử</button><button class="btn small ghost" id="again">' + I('refresh') + ' Về ban đầu</button></div><div id="res" class="mt"></div></div>' +
    '<div><div class="fw-stage" id="fst"></div><div class="pk-list" id="pk"></div></div></div>' + foot(g);
  function drawRules(){ $('#rules', v).innerHTML = rules.map((r, i) => '<div class="rule" data-i="' + i + '"><span class="no">' + (i + 1) + '</span><select data-f="0">' + opt(Z, r[0]) + '</select><select data-f="1">' + opt(Z, r[1]) + '</select><select data-f="2">' + opt(PO, r[2]) + '</select><select data-f="3">' + opt(['allow', 'deny'], r[3]) + '</select><span class="mv" style="display:flex;gap:2px"><button class="iconbtn" style="width:28px;height:28px" data-up="' + i + '" title="Lên">' + I('up') + '</button><button class="iconbtn" style="width:28px;height:28px" data-del="' + i + '" title="Xoá">' + I('trash') + '</button></span></div>').join(''); }
  function evalPk(p){ for (let i = 0; i < rules.length; i++) { const r = rules[i]; if ((r[0] === 'any' || r[0] === p[1]) && (r[1] === 'any' || r[1] === p[2]) && (r[2] === 'any' || r[2] === p[3])) return [r[3], i + 1]; } return ['deny', '∞']; }
  function drawPk(res){ $('#pk', v).innerHTML = '<div class="pk" style="background:#f8fafc;font-weight:800;font-size:.74rem"><span>Gói tin</span><span class="center">Cần</span><span class="center">Kết quả</span></div>' + g.packets.map((p, i) => { const r = res && res[i]; return '<div class="pk' + (r ? (r[0] === p[4] ? ' ok' : ' bad') : '') + '"><span><b>' + esc(p[0]) + '</b><br><span class="small muted">' + esc(p[1]) + ' → ' + esc(p[2]) + ' : ' + p[3] + '</span></span><span class="exp ' + p[4] + '">' + (p[4] === 'allow' ? 'CHO PHÉP' : 'CHẶN') + '</span><span class="got ' + (r ? r[0] : 'unk') + '">' + (r ? (r[0] === 'allow' ? 'CHO PHÉP' : 'CHẶN') + ' #' + r[1] : '?') + '</span></div>'; }).join(''); }
  function stage(res){
    const t = V.txt; let s = '<rect width="560" height="220" fill="#0b1220"/>';
    s += '<rect x="250" y="40" width="60" height="140" rx="10" fill="#7f1d1d" stroke="#ef4444" stroke-width="2"/>' + t(280, 115, 'FW', { s: 14, c: '#fff' });
    s += t(90, 24, 'NGUỒN', { s: 10, c: '#93c5fd' }) + t(470, 24, 'ĐÍCH', { s: 10, c: '#93c5fd' });
    g.packets.forEach((p, i) => { const y = 40 + i * 19; const r = res ? res[i] : null; const col = !r ? '#64748b' : r[0] === 'allow' ? '#22c55e' : '#ef4444';
      s += t(20, y + 4, p[1].slice(0, 14), { a: 'start', s: 8.5, c: '#cbd5e1', w: 600 }) + t(540, y + 4, p[2] + ':' + p[3], { a: 'end', s: 8.5, c: '#cbd5e1', w: 600 });
      if (r) { const path = r[0] === 'allow' ? 'M120 ' + y + ' L440 ' + y : 'M120 ' + y + ' L246 ' + y; s += '<path d="' + path + '" stroke="' + col + '" stroke-width="1.5" stroke-dasharray="3 4" opacity=".6"/><circle r="5" fill="' + col + '"><animateMotion dur="1.4s" begin="' + (i * .15) + 's" fill="freeze" path="' + path + '"/></circle>' + (r[0] === 'deny' ? t(240, y + 4, '✕', { a: 'end', s: 11, c: '#ef4444' }) : ''); }
    });
    $('#fst', v).innerHTML = '<svg viewBox="0 0 560 220" xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
  }
  drawRules(); drawPk(); stage();
  $('#rules', v).addEventListener('change', e => { const row = e.target.closest('.rule'); rules[+row.dataset.i][+e.target.dataset.f] = e.target.value; });
  $('#rules', v).addEventListener('click', e => { const u = e.target.closest('[data-up]'), d = e.target.closest('[data-del]'); if (u) { const i = +u.dataset.up; if (i > 0) { [rules[i - 1], rules[i]] = [rules[i], rules[i - 1]]; drawRules(); } } if (d) { rules.splice(+d.dataset.del, 1); drawRules(); } });
  $('#add', v).onclick = () => { rules.push(['Văn phòng', 'Máy chủ', '443', 'allow']); drawRules(); };
  $('#run', v).onclick = () => { const res = g.packets.map(evalPk); stage(res); drawPk(res); const ok = res.filter((r, i) => r[0] === g.packets[i][4]).length;
    $('#res', v).innerHTML = '<div class="fb ' + (ok === g.packets.length ? 'ok' : 'mid') + '">' + I(ok === g.packets.length ? 'award' : 'alert') + '<div><b>' + ok + '/' + g.packets.length + ' gói tin đi đúng.</b> ' + (ok === g.packets.length ? 'Bộ quy tắc đạt yêu cầu: chỉ cho phép luồng cần thiết. Hãy ghi lý do từng quy tắc vào ma trận firewall của nhóm.' : 'Gợi ý: quy tắc “any → Máy chủ : 3389” đang cho cả Internet và Văn phòng vào RDP; quy tắc cụ thể phải đặt TRƯỚC quy tắc chung.') + '</div></div>';
    if (ok === g.packets.length) done(g, ok, ok); else A.SND.no(); };
  $('#again', v).onclick = () => fw(v, g);
}

/* ================= BỘ MÁY: THẺ CHỌN MỨC ================= */
function cards(v, g){
  const items = A.shuffle(g.items); let k = 0, ok = 0;
  v.innerHTML = head(g) + '<div class="note warn">' + I('alert') + '<div>Bài luyện lập luận theo bản tóm tắt tiêu chí. Hồ sơ thật phải đối chiếu nguyên văn Điều 11–16 Nghị định 331/2026/NĐ-CP.</div></div><div class="game"><div class="gcard" id="gc"></div></div>' + foot(g);
  function show(){
    if (k >= items.length) { $('#gc', v).innerHTML = '<div class="gres">' + ok + '/' + items.length + '</div><p>Đề xuất đúng mức tham chiếu.</p><button class="btn" id="re">' + I('refresh') + ' Làm lại</button>'; $('#re', v).onclick = () => cards(v, g); done(g, ok, items.length); return; }
    const it = items[k];
    $('#gc', v).innerHTML = '<div class="gtop"><span class="pill">Hệ thống ' + (k + 1) + '/' + items.length + '</span><span class="pill">Đúng: ' + ok + '</span></div><div class="gq" style="min-height:90px">' + esc(it.t) + '</div><p class="muted">Đề xuất cấp độ:</p><div class="row" style="justify-content:center">' + g.opts.map(o => '<button class="btn ghost" style="min-width:64px;font-size:1.2rem" data-o="' + o + '">' + o + '</button>').join('') + '</div><div id="fb"></div>';
  }
  v.addEventListener('click', e => { const b = e.target.closest('[data-o]'); if (!b || b.disabled) return; const it = items[k]; $$('[data-o]', v).forEach(x => { x.disabled = true; if (x.dataset.o === it.a) x.classList.add('green'); }); const r = b.dataset.o === it.a; if (r) { ok++; A.SND.ok(); } else { A.SND.no(); b.classList.add('red'); }
    $('#fb', v).innerHTML = '<div class="fb ' + (r ? 'ok' : 'no') + '" style="text-align:left">' + I(r ? 'check' : 'alert') + '<div><b>' + (r ? 'Hợp lý. ' : 'Mức tham chiếu là cấp ' + it.a + '. ') + '</b>' + esc(it.why) + '</div></div><button class="btn mt" id="nx">Tiếp ' + I('arrow') + '</button>'; $('#nx', v).onclick = () => { k++; show(); }; });
  show();
}

/* ================= BỘ MÁY: TÌNH HUỐNG PHÂN NHÁNH ================= */
function branch(v, g){
  let m = { d: 20, e: 80, s: 90 }, path = [];
  v.innerHTML = head(g) + '<div class="meters"><div><b>Thiệt hại</b> (thấp là tốt)<div class="m"><i id="md" style="background:#e11d48"></i></div></div><div><b>Bằng chứng còn giữ</b><div class="m"><i id="me" style="background:#2563eb"></i></div></div><div><b>Dịch vụ</b> (văn bản điều hành)<div class="m"><i id="ms" style="background:#16a34a"></i></div></div></div><div class="scn-card" id="sc"></div><div id="hist" class="mt"></div>' + foot(g);
  const clamp = x => Math.max(0, Math.min(100, x));
  function meters(){ $('#md', v).style.width = m.d + '%'; $('#me', v).style.width = m.e + '%'; $('#ms', v).style.width = m.s + '%'; }
  function node(id){
    const n = g.nodes[id]; meters();
    if (n.end) {
      const good = id === 'f';
      $('#sc', v).innerHTML = '<h3>' + (good ? 'Kết thúc tốt' : 'Kết thúc chưa tốt') + '</h3><p>' + esc(n.t) + '</p><p><b>Thiệt hại:</b> ' + m.d + ' · <b>Bằng chứng:</b> ' + m.e + '</p><div class="row"><button class="btn orange" id="re">' + I('refresh') + ' Diễn tập lại</button><a class="btn ghost-light" href="#lab-6">Sang Lab 6</a></div>';
      $('#re', v).onclick = () => branch(v, g); if (good) done(g, Math.max(1, Math.round((100 - m.d + m.e + m.s) / 3)), 100); else A.SND.no(); return;
    }
    $('#sc', v).innerHTML = '<h3>' + esc(n.t.split(' – ')[0]) + '</h3><p>' + esc(n.t.split(' – ').slice(1).join(' – ') || n.t) + '</p><div class="scn-opts">' + n.o.map((o, i) => '<button data-i="' + i + '">' + esc(o[0]) + '</button>').join('') + '</div>';
    $$('.scn-opts button', v).forEach(b => b.onclick = () => { const o = n.o[+b.dataset.i]; m.d = clamp(m.d + o[2].d); m.e = clamp(m.e + o[2].e); m.s = clamp(m.s + o[2].s); path.push(o); const cls = o[2].d <= 0 && o[2].e >= 0 ? 'good' : o[2].d > 10 || o[2].e < -10 ? 'bad' : 'mid'; A.SND[cls === 'bad' ? 'no' : 'ok']();
      $('#hist', v).insertAdjacentHTML('beforeend', '<div class="scn-res ' + cls + '"><b>' + esc(o[0]) + '</b><br>' + esc(o[3]) + '</div>'); node(o[1]); });
  }
  node('s');
}

const ENGINES = { spot, sort, order, matrix, fw, cards, branch };

/* ================= TRANG DANH SÁCH ================= */
P.thuchanh = function(v, param){
  if (param) { const g = window.GAMES.find(x => x.id === param); if (g) return ENGINES[g.type](v, g); }
  const types = { spot: 'Soi bất thường', sort: 'Phân loại', order: 'Sắp xếp', matrix: 'Ma trận', fw: 'Mô phỏng', cards: 'Chọn mức', branch: 'Tình huống' };
  let h = P.pageHead('Thực hành', 'Bài tập tương tác', window.GAMES.length + ' bài tập: soi bất thường trong ảnh, sơ đồ, thư, trang web; phân loại; sắp xếp; mô phỏng tường lửa; ma trận rủi ro; diễn tập ra quyết định. Mỗi bài 3–8 phút, làm được trên điện thoại.');
  h += '<section class="sec"><div class="wrap">';
  for (let c = 1; c <= 6; c++) {
    const gs = window.GAMES.filter(g => g.cd === c); if (!gs.length) continue;
    h += '<div class="sec-head" style="margin-top:' + (c > 1 ? 34 : 0) + 'px"><div><div class="eyebrow" style="color:' + COL[c - 1] + '">Chuyên đề ' + c + '</div><h2 style="font-size:1.35rem">' + esc(window.CD[c - 1].short) + '</h2></div><a class="btn small ghost" href="#chuyende-' + c + '">Bài giảng CĐ' + c + '</a></div>';
    h += '<div class="grid g4">' + gs.map((g, i) => '<a class="tile reveal" style="transition-delay:' + i * 40 + 'ms" href="#thuchanh-' + g.id + '">' + (st.prac[g.id] ? '<span class="done-badge">' + st.prac[g.id] + '%</span>' : '') + '<span class="ibox" style="background:' + g.c + '">' + I(g.ic) + '</span><h3>' + esc(g.t) + '</h3><p>' + esc(g.d) + '</p><span class="chips"><span class="chip">' + types[g.type] + '</span></span><span class="go">Bắt đầu ' + I('arrow') + '</span></a>').join('') + '</div>';
  }
  h += '</div></section>';
  v.innerHTML = h;
};
})();
