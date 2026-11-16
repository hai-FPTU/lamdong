/* =========================================================
   LAB MỞ RỘNG – AI phát hiện thư lừa đảo
   Hồi quy logistic, học bằng giảm dần độ dốc, chạy hoàn toàn trên trình duyệt.
   Cùng thuật toán, cùng tham số với congcu/ai_phishing.py (Python) để hai bên ra cùng kết quả.
   ========================================================= */
(function(){
const A = window.APP, $ = A.$, $$ = A.$$, esc = A.esc, I = window.ICON;
const F = [
  ['spf_khong_dat', 'SPF không đạt', 'Kết quả kiểm tra SPF là fail hoặc none', r => r.spf !== 'pass' ? 1 : 0],
  ['dkim_khong_dat', 'DKIM không đạt', 'Chữ ký DKIM fail hoặc không có', r => r.dkim !== 'pass' ? 1 : 0],
  ['reply_to_khac', 'Reply-To khác người gửi', 'Thư trả lời sẽ đi tới địa chỉ khác', r => +r.reply_to_khac],
  ['ten_mien_na_na', 'Tên miền na ná', 'Tên miền giống tên miền quen (cqrnau thay cqmau…)', r => +r.ten_mien_na_na],
  ['lien_ket_khac_hien_thi', 'Liên kết đánh lừa', 'Chữ hiển thị một địa chỉ, liên kết thật trỏ nơi khác', r => +r.lien_ket_khac_hien_thi],
  ['dinh_kem_nguy_hiem', 'Đính kèm nguy hiểm', 'Tệp .html, .zip, .docm, .iso', r => ['html', 'zip', 'docm', 'iso'].includes(r.dinh_kem) ? 1 : 0],
  ['tu_khan_cap', 'Lời lẽ khẩn cấp', 'Số từ như “khẩn”, “ngay”, “trước 17h” (0–3)', r => Math.min(+r.tu_khan_cap, 3) / 3],
  ['ben_ngoai', 'Gửi từ bên ngoài', 'Người gửi không thuộc tên miền cơ quan', r => +r.ben_ngoai],
  ['lan_dau_lien_lac', 'Lần đầu liên lạc', 'Chưa từng trao đổi thư với người gửi', r => +r.lan_dau_lien_lac],
  ['nhieu_lien_ket', 'Số liên kết', 'Số liên kết trong thư (0–5)', r => Math.min(+r.so_lien_ket, 5) / 5],
  ['yeu_cau_nhay_cam', 'Yêu cầu nhạy cảm', 'Đòi mật khẩu, chuyển tiền, đổi tài khoản, gửi tài liệu', r => +r.yeu_cau_nhay_cam]];
const CO_BAN = F.slice(0, 10).map(f => f[0]);
const HOC = { lr: 1.0, lam: 0.001, vong: 500 };
const FILES = { hl: 'thu_huan_luyen.csv', kt: 'thu_kiem_tra.csv', nt: 'thu_ne_tranh.csv' };
const SETS = { kt: 'Tập kiểm tra (200 thư)', nt: 'Tập “né tránh” (60 thư kiểu mới)' };
const DATA = {};

function csvSplit(l){ const r = []; let cur = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (c === '"') { q = !q; continue; } if (c === ',' && !q) { r.push(cur); cur = ''; } else cur += c; } r.push(cur); return r; }
function parse(txt){ const L = txt.replace(/\r/g, '').split('\n').filter(Boolean), h = csvSplit(L[0]); return L.slice(1).map(l => { const v = csvSplit(l), o = {}; h.forEach((k, i) => o[k] = v[i]); return o; }); }
async function load(){
  for (const k in FILES) if (!DATA[k]) { await A.loadScript('lab/data/' + FILES[k] + '.js'); DATA[k] = parse(window.LABDATA[FILES[k]]); }
}
function mat(rows, chon){ const fs = F.filter(f => chon.includes(f[0])); return { X: rows.map(r => fs.map(f => f[3](r))), y: rows.map(r => r.nhan === 'lừa đảo' ? 1 : 0), fs }; }
function train(X, y){
  const n = X.length, m = X[0].length; const w = new Array(m).fill(0); let b = 0;
  for (let e = 0; e < HOC.vong; e++) {
    const gw = new Array(m).fill(0); let gb = 0;
    for (let i = 0; i < n; i++) { let z = b; for (let j = 0; j < m; j++) z += w[j] * X[i][j]; const g = 1 / (1 + Math.exp(-z)) - y[i]; for (let j = 0; j < m; j++) gw[j] += g * X[i][j]; gb += g; }
    for (let j = 0; j < m; j++) w[j] -= HOC.lr * (gw[j] / n + HOC.lam * w[j]);
    b -= HOC.lr * gb / n;
  }
  return { w, b };
}
const score = (M, x) => { let z = M.b; for (let j = 0; j < M.w.length; j++) z += M.w[j] * x[j]; return 1 / (1 + Math.exp(-z)); };
function evalAt(M, X, y, t){ let tp = 0, fp = 0, fn = 0, tn = 0; X.forEach((x, i) => { const d = score(M, x) >= t; if (d && y[i]) tp++; else if (d) fp++; else if (y[i]) fn++; else tn++; });
  const pr = tp + fp ? tp / (tp + fp) : 0, rc = tp + fn ? tp / (tp + fn) : 0; return { tp, fp, fn, tn, acc: (tp + tn) / y.length, pr, rc, f1: pr + rc ? 2 * pr * rc / (pr + rc) : 0 }; }
function ruleSPF(rows){ let tp = 0, fp = 0, fn = 0, tn = 0; rows.forEach(r => { const d = r.spf !== 'pass', t = r.nhan === 'lừa đảo'; if (d && t) tp++; else if (d) fp++; else if (t) fn++; else tn++; }); return { tp, fp, fn, tn, rc: tp / (tp + fn || 1), pr: tp / (tp + fp || 1), acc: (tp + tn) / rows.length }; }
const pct = x => (x * 100).toFixed(1).replace('.', ',') + '%';

window.AILAB = { F, CO_BAN, HOC, train, mat, evalAt, score, parse, FILES,
  doc(T){
    if (!T || !T.res) return '';
    return '<h2>Kết quả mô hình AI phát hiện thư lừa đảo</h2><p><b>Đặc trưng đã chọn:</b> ' + T.f.map(k => (F.find(f => f[0] === k) || [k, k])[1]).join(', ') + '</p><p><b>Ngưỡng chặn:</b> ' + T.ng.toFixed(2) + '</p>' +
      '<table><tr><th>Đặc trưng</th><th>Trọng số</th></tr>' + (T.wt || []).map(r => '<tr><td>' + esc(r[0]) + '</td><td>' + r[1].toFixed(3) + '</td></tr>').join('') + '</table>' +
      '<table><tr><th>Tập đánh giá</th><th>Chặn đúng</th><th>Chặn nhầm</th><th>Lọt</th><th>Cho qua đúng</th><th>Độ chuẩn xác</th><th>Độ phủ</th></tr>' +
      Object.keys(T.res).map(k => { const r = T.res[k]; return '<tr><td>' + SETS[k] + '</td><td>' + r.tp + '</td><td>' + r.fp + '</td><td>' + r.fn + '</td><td>' + r.tn + '</td><td>' + pct(r.pr) + '</td><td>' + pct(r.rc) + '</td></tr>'; }).join('') + '</table>';
  }};

const TOOLS = window.LAB_TOOLS; if (!TOOLS) return;
TOOLS.aimodel = async (box, L, R) => {
  const T = R.tool; T.f = T.f || CO_BAN.slice(); T.ng = T.ng == null ? 0.5 : T.ng; T.set = T.set || 'kt'; T.mo = !!T.mo;
  box.innerHTML = '<p class="muted">Đang nạp bộ thư giả lập…</p>';
  try { await load(); } catch (e) { box.innerHTML = '<div class="note warn">Không nạp được dữ liệu thư. Kiểm tra thư mục lab/data.</div>'; return; }
  let M = null;
  const hl = DATA.hl;
  const rate = (k, lab) => { const f = F.find(x => x[0] === k), rs = hl.filter(r => (r.nhan === 'lừa đảo') === lab); return rs.reduce((a, r) => a + (f[3](r) > 0 ? 1 : 0), 0) / rs.length; };

  function draw(){
    const nL = hl.filter(r => r.nhan === 'lừa đảo').length;
    let h = '<h3>' + I('activity') + ' Công cụ huấn luyện mô hình – chạy ngay trên trình duyệt</h3>' +
      '<p class="small muted">Bộ thư giả lập: ' + hl.length + ' thư huấn luyện (' + nL + ' lừa đảo), ' + DATA.kt.length + ' thư kiểm tra, ' + DATA.nt.length + ' thư “né tránh”. Mỗi thư đã được trích thành các đặc trưng có/không. Mô hình: hồi quy logistic, ' + HOC.vong + ' vòng học.</p>';
    /* A. dữ liệu */
    h += '<div class="ai-blk"><h4><span class="ai-n">A</span>Nhìn dữ liệu trước khi dạy máy</h4><p class="small">Tỉ lệ thư có đặc trưng trong <b style="color:#B91C1C">thư lừa đảo</b> và <b style="color:#1D4ED8">thư hợp lệ</b> (tập huấn luyện). Đặc trưng tốt là đặc trưng có hai thanh chênh nhau rõ.</p><div class="ai-rates">' +
      F.map((f, i) => { const a = rate(f[0], true), b = rate(f[0], false), lock = i === 10 && !T.mo; return '<div class="ai-rate' + (lock ? ' lock' : '') + '"><span class="nm" title="' + esc(f[2]) + '">' + esc(f[1]) + (lock ? ' 🔒' : '') + '</span><span class="bars"><i class="p" style="width:' + (lock ? 0 : a * 100) + '%"></i><i class="h" style="width:' + (lock ? 0 : b * 100) + '%"></i></span><span class="v">' + (lock ? '—' : pct(a) + ' / ' + pct(b)) + '</span></div>'; }).join('') + '</div></div>';
    /* B. chọn đặc trưng + huấn luyện */
    h += '<div class="ai-blk"><h4><span class="ai-n">B</span>Chọn đặc trưng và huấn luyện</h4><div class="ai-feats">' +
      F.map((f, i) => { const lock = i === 10 && !T.mo; return '<label class="ai-chk' + (lock ? ' lock' : '') + '"><input type="checkbox" data-feat="' + f[0] + '"' + (T.f.includes(f[0]) ? ' checked' : '') + (lock ? ' disabled' : '') + '><span><b>' + esc(f[1]) + '</b><small>' + esc(f[2]) + '</small></span></label>'; }).join('') + '</div>' +
      '<div class="row mt"><button class="btn" data-train>' + I('activity') + ' Huấn luyện mô hình</button><button class="btn ghost small" data-all>Chọn 10 đặc trưng cơ bản</button>' + (T.mo ? '' : '<button class="btn ghost small" data-unlock>' + I('plus') + ' Vòng 2: mở khoá đặc trưng mới</button>') + '</div><div data-w></div></div>';
    /* C. đánh giá */
    h += '<div class="ai-blk" data-eval hidden><h4><span class="ai-n">C</span>Đánh giá trên thư mô hình chưa từng thấy</h4><div class="row mb"><div class="seg-ctrl" data-set>' + Object.keys(SETS).map(k => '<button data-s="' + k + '"' + (T.set === k ? ' class="on"' : '') + '>' + SETS[k] + '</button>').join('') + '</div></div>' +
      '<div class="ai-thr"><label>Ngưỡng chặn: <b data-ngv>' + T.ng.toFixed(2).replace('.', ',') + '</b></label><input type="range" min="0.05" max="0.95" step="0.05" value="' + T.ng + '" data-ng><span class="small muted">Thư có điểm nghi ngờ ≥ ngưỡng sẽ bị chặn.</span></div><div data-cm></div></div>';
    /* D. thử thư */
    h += '<div class="ai-blk" data-try hidden><h4><span class="ai-n">D</span>Tự soạn một thư để thử mô hình</h4><p class="small">Đánh dấu đặc điểm của một thư bạn tưởng tượng, xem điểm nghi ngờ thay đổi thế nào.</p><div class="ai-feats sm" data-tryf></div><div data-tryo></div></div>';
    box.innerHTML = h;
    if (T.w) { M = { w: T.w, b: T.b }; showModel(); }
  }
  function curMat(set){ return mat(DATA[set], T.fTrained || T.f); }
  function showModel(){
    const fs = F.filter(f => (T.fTrained || []).includes(f[0])); const mx = Math.max(...M.w.map(Math.abs), 1);
    const rows = fs.map((f, j) => [f[1], M.w[j]]).sort((a, b) => b[1] - a[1]); T.wt = rows;
    $('[data-w]', box).innerHTML = '<div class="ai-wts mt"><div class="small muted mb">Trọng số đã học – thanh đỏ làm <b>tăng</b> điểm nghi ngờ, thanh xanh làm <b>giảm</b>. Hệ số chặn: ' + M.b.toFixed(2) + '</div>' +
      rows.map(r => '<div class="ai-w"><span class="nm">' + esc(r[0]) + '</span><span class="axis"><i class="' + (r[1] >= 0 ? 'pos' : 'neg') + '" style="width:' + (Math.abs(r[1]) / mx * 50) + '%"></i></span><span class="v">' + (r[1] >= 0 ? '+' : '') + r[1].toFixed(2) + '</span></div>').join('') + '</div>';
    $('[data-eval]', box).hidden = false; $('[data-try]', box).hidden = false; showEval(); showTry();
  }
  function showEval(){
    const { X, y } = curMat(T.set), r = evalAt(M, X, y, T.ng), rule = ruleSPF(DATA[T.set]);
    T.res = T.res || {}; T.res[T.set] = r; A.save();
    /* đường đánh đổi */
    const pts = []; for (let t = 0.05; t <= 0.951; t += 0.05) { const e = evalAt(M, X, y, t); pts.push([t, e.fp, e.fn]); }
    const maxY = Math.max(1, ...pts.map(p => Math.max(p[1], p[2]))), W = 420, H = 150, px = t => 30 + (t - 0.05) / 0.9 * (W - 40), py = v => H - 20 - v / maxY * (H - 34);
    const line = (k, c) => '<polyline fill="none" stroke="' + c + '" stroke-width="2.5" points="' + pts.map(p => px(p[0]).toFixed(1) + ',' + py(p[k]).toFixed(1)).join(' ') + '"/>';
    const svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" class="ai-curve" role="img" aria-label="Số thư chặn nhầm và số thư lọt theo ngưỡng"><line x1="30" y1="' + (H - 20) + '" x2="' + (W - 10) + '" y2="' + (H - 20) + '" stroke="#94a3b8"/>' + line(1, '#2563EB') + line(2, '#DC2626') +
      '<line x1="' + px(T.ng) + '" y1="8" x2="' + px(T.ng) + '" y2="' + (H - 20) + '" stroke="#0B1B3F" stroke-dasharray="4 3"/><text x="30" y="' + (H - 4) + '" font-size="11" fill="#475569">0,05</text><text x="' + (W - 40) + '" y="' + (H - 4) + '" font-size="11" fill="#475569">0,95</text><text x="' + (px(T.ng) + 4) + '" y="16" font-size="11" fill="#0B1B3F">ngưỡng</text>' +
      '<text x="36" y="14" font-size="11" fill="#2563EB">— chặn nhầm thư hợp lệ</text><text x="36" y="28" font-size="11" fill="#DC2626">— thư lừa đảo lọt qua</text></svg>';
    const wrong = DATA[T.set].map((row, i) => ({ row, s: score(M, X[i]), t: y[i] })).filter(o => (o.s >= T.ng) !== !!o.t).sort((a, b) => Math.abs(b.s - T.ng) - Math.abs(a.s - T.ng)).slice(0, 6);
    $('[data-cm]', box).innerHTML = '<div class="ai-eval"><div><table class="ai-cm"><tr><th></th><th>Mô hình CHẶN</th><th>Mô hình CHO QUA</th></tr><tr><th>Thực tế lừa đảo</th><td class="good">' + r.tp + '<small>chặn đúng</small></td><td class="bad">' + r.fn + '<small>lọt lưới</small></td></tr><tr><th>Thực tế hợp lệ</th><td class="bad">' + r.fp + '<small>chặn nhầm</small></td><td class="good">' + r.tn + '<small>cho qua đúng</small></td></tr></table>' +
      '<div class="ai-met"><div><b>' + pct(r.acc) + '</b><span>Độ chính xác chung</span></div><div><b>' + pct(r.pr) + '</b><span>Độ chuẩn xác – trong thư bị chặn, bao nhiêu là lừa đảo thật</span></div><div><b>' + pct(r.rc) + '</b><span>Độ phủ – bắt được bao nhiêu thư lừa đảo</span></div></div>' +
      '<p class="small mt"><b>So sánh với quy tắc đơn giản “chặn khi SPF không đạt”:</b> chặn đúng ' + rule.tp + ', chặn nhầm ' + rule.fp + ', lọt ' + rule.fn + ' (độ phủ ' + pct(rule.rc) + ').</p></div><div>' + svg + '</div></div>' +
      (wrong.length ? '<h5 class="mt">Một số thư mô hình phân loại sai</h5><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Mã</th><th>Tiêu đề</th><th>Tên miền</th><th>Thực tế</th><th>Điểm</th><th>Đặc điểm nổi bật</th></tr></thead><tbody>' +
        wrong.map(o => { const fs = F.filter(f => (T.fTrained || []).includes(f[0])); const c = fs.map((f, j) => [f[1], M.w[j] * f[3](o.row)]).filter(z => Math.abs(z[1]) > 0.01).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 3);
          return '<tr><td class="mono small">' + esc(o.row.ma_thu) + '</td><td>' + esc(o.row.tieu_de) + '</td><td class="mono small">' + esc(o.row.ten_mien) + '</td><td>' + esc(o.row.nhan) + '</td><td class="num">' + o.s.toFixed(2) + '</td><td class="small">' + (c.map(z => esc(z[0]) + ' (' + (z[1] > 0 ? '+' : '') + z[1].toFixed(1) + ')').join(', ') || 'không có dấu hiệu nào') + '</td></tr>'; }).join('') + '</tbody></table></div>' : '<p class="small mt">Không có thư nào bị phân loại sai ở ngưỡng này.</p>');
  }
  function showTry(){
    const fs = F.filter(f => (T.fTrained || []).includes(f[0])); T.thu = T.thu || {};
    $('[data-tryf]', box).innerHTML = fs.map(f => '<label class="ai-chk"><input type="checkbox" data-tf="' + f[0] + '"' + (T.thu[f[0]] ? ' checked' : '') + '><span><b>' + esc(f[1]) + '</b></span></label>').join('');
    const x = fs.map(f => T.thu[f[0]] ? 1 : 0), s = score(M, x);
    $('[data-tryo]', box).innerHTML = '<div class="ai-gauge mt"><div class="bar"><i style="width:' + (s * 100).toFixed(1) + '%;background:' + (s >= T.ng ? '#DC2626' : '#16A34A') + '"></i><span class="mk" style="left:' + (T.ng * 100) + '%"></span></div><p><b>Điểm nghi ngờ: ' + s.toFixed(2).replace('.', ',') + '</b> → mô hình sẽ <b>' + (s >= T.ng ? 'CHẶN' : 'CHO QUA') + '</b> thư này (ngưỡng ' + T.ng.toFixed(2).replace('.', ',') + ').</p></div>';
  }
  draw();
  box.addEventListener('change', e => { const t = e.target;
    if (t.dataset.feat) { T.f = $$('[data-feat]', box).filter(c => c.checked).map(c => c.dataset.feat); A.save(); }
    if (t.dataset.tf) { T.thu[t.dataset.tf] = t.checked; A.save(); showTry(); }
  });
  box.addEventListener('input', e => { if (e.target.hasAttribute('data-ng')) { T.ng = +e.target.value; $('[data-ngv]', box).textContent = T.ng.toFixed(2).replace('.', ','); A.save(); if (M) { showEval(); showTry(); } } });
  box.addEventListener('click', e => {
    if (e.target.closest('[data-train]')) {
      if (!T.f.length) { A.toast('Hãy chọn ít nhất một đặc trưng'); return; }
      const t0 = performance.now(); const { X, y } = mat(hl, T.f); M = train(X, y); T.w = M.w; T.b = M.b; T.fTrained = T.f.slice(); T.res = {}; A.save();
      showModel(); A.SND.ok(); A.toast('Đã huấn luyện xong trong ' + Math.round(performance.now() - t0) + ' ms'); return; }
    if (e.target.closest('[data-all]')) { T.f = CO_BAN.slice(); A.save(); draw(); return; }
    if (e.target.closest('[data-unlock]')) { T.mo = true; A.save(); draw(); A.toast('Đã mở khoá đặc trưng “Yêu cầu nhạy cảm”'); return; }
    const s = e.target.closest('[data-set] button'); if (s) { T.set = s.dataset.s; $$('[data-set] button', box).forEach(b => b.classList.toggle('on', b === s)); A.save(); if (M) showEval(); }
  });
};
})();
