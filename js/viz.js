/* =========================================================
   HÌNH MINH HOẠ ĐỘNG (SVG) CHO CÁC CHUYÊN ĐỀ
   VIZ.html(id) trả về chuỗi SVG; VIZ.bind(root) gắn tương tác
   ========================================================= */
(function(){
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const C = { navy: '#0b1b3f', blue: '#2563eb', sky: '#0ea5e9', cyan: '#22d3ee', red: '#e11d48', orange: '#f97316', green: '#16a34a', violet: '#7c3aed', amber: '#f59e0b', teal: '#0d9488', slate: '#64748b', line: '#cbd5e1' };
let uid = 0;
function svg(w, h, body, extra){ uid++; return '<svg viewBox="0 0 ' + w + ' ' + h + '" xmlns="http://www.w3.org/2000/svg" role="img" ' + (extra || '') + '><defs><marker id="ar' + uid + '" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#64748b"/></marker></defs>' + body.replace(/MARK/g, 'url(#ar' + uid + ')') + '</svg>'; }
function wrapText(t, max){ const w = String(t).split(' '); const out = []; let cur = ''; w.forEach(x => { if ((cur + ' ' + x).trim().length > max) { if (cur) out.push(cur); cur = x; } else cur = (cur + ' ' + x).trim(); }); if (cur) out.push(cur); return out; }
function txt(x, y, t, o){ o = o || {}; const lines = o.wrap ? wrapText(t, o.wrap) : [t]; const lh = o.lh || 13; const y0 = y - (lines.length - 1) * lh / 2; return '<text x="' + x + '" y="' + y0 + '" text-anchor="' + (o.a || 'middle') + '" font-size="' + (o.s || 11) + '" font-weight="' + (o.w || 700) + '" fill="' + (o.c || '#0f172a') + '" font-family="Be Vietnam Pro,system-ui,sans-serif">' + lines.map((l, i) => '<tspan x="' + x + '" dy="' + (i ? lh : 0) + '">' + esc(l) + '</tspan>').join('') + '</text>'; }
function box(n, i){
  const d = (i || 0) * 0.08;
  const fill = n.fill || '#fff', stroke = n.c || C.blue;
  let s = '<g class="pop' + (n.info ? ' vbtn' : '') + '" style="animation-delay:' + d + 's"' + (n.info ? ' data-info="' + esc(n.info) + '" tabindex="0"' : '') + '>';
  s += '<rect class="bg" x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="' + n.h + '" rx="' + (n.r == null ? 10 : n.r) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="2"' + (n.dash ? ' stroke-dasharray="6 4"' : '') + '/>';
  if (n.bar) s += '<rect x="' + n.x + '" y="' + n.y + '" width="' + n.w + '" height="5" rx="2" fill="' + stroke + '"/>';
  s += txt(n.x + n.w / 2, n.y + n.h / 2 + (n.s ? -5 : 4), n.t, { s: n.fs || 11, wrap: n.wrap || Math.max(8, Math.floor(n.w / 6.6)), c: n.tc || '#0f172a' });
  if (n.s) s += txt(n.x + n.w / 2, n.y + n.h / 2 + 12, n.s, { s: 9, w: 600, c: n.sc || '#64748b', wrap: Math.floor(n.w / 5.4) });
  return s + '</g>';
}
function cen(n, side){ if (side === 'r') return [n.x + n.w, n.y + n.h / 2]; if (side === 'l') return [n.x, n.y + n.h / 2]; if (side === 't') return [n.x + n.w / 2, n.y]; if (side === 'b') return [n.x + n.w / 2, n.y + n.h]; return [n.x + n.w / 2, n.y + n.h / 2]; }
function edge(N, e){
  const a = N[e[0]], b = N[e[1]]; const o = e[3] || {};
  let p1, p2;
  if (o.from) p1 = cen(a, o.from); else p1 = a.x + a.w <= b.x ? cen(a, 'r') : b.x + b.w <= a.x ? cen(a, 'l') : a.y < b.y ? cen(a, 'b') : cen(a, 't');
  if (o.to) p2 = cen(b, o.to); else p2 = a.x + a.w <= b.x ? cen(b, 'l') : b.x + b.w <= a.x ? cen(b, 'r') : a.y < b.y ? cen(b, 't') : cen(b, 'b');
  const path = o.path || ('M' + p1[0] + ' ' + p1[1] + ' L' + p2[0] + ' ' + p2[1]);
  let s = '<path d="' + path + '" fill="none" stroke="' + (o.c || '#94a3b8') + '" stroke-width="' + (o.sw || 2) + '"' + (o.flow === false ? '' : ' class="flow"') + (o.noarrow ? '' : ' marker-end="MARK"') + '/>';
  if (e[2]) { const mx = (p1[0] + p2[0]) / 2 + (o.lx || 0), my = (p1[1] + p2[1]) / 2 + (o.ly || -6); s += '<rect x="' + (mx - e[2].length * 2.9 - 4) + '" y="' + (my - 9) + '" width="' + (e[2].length * 5.8 + 8) + '" height="13" rx="4" fill="#fff" opacity=".9"/>' + txt(mx, my + 1, e[2], { s: 8.5, w: 700, c: o.c || '#475569' }); }
  if (o.pkt) s += '<circle r="' + (o.pr || 5) + '" fill="' + (o.pkt === true ? C.orange : o.pkt) + '"><animateMotion dur="' + (o.dur || 2.4) + 's" begin="' + (o.begin || 0) + 's" repeatCount="indefinite" path="' + path + '"/></circle>';
  return s;
}
function diagram(W, H, nodes, edges, extra){
  const N = {}; nodes.forEach(n => N[n.id] = n);
  let body = (extra && extra.pre) || '';
  body += edges.map(e => edge(N, e)).join('');
  body += nodes.map(box).join('');
  body += (extra && extra.post) || '';
  return svg(W, H, body);
}
function zone(x, y, w, h, t, c){ return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="14" fill="' + c + '" fill-opacity=".07" stroke="' + c + '" stroke-dasharray="6 5" stroke-width="1.5"/>' + txt(x + 10, y + 15, t, { a: 'start', s: 9.5, w: 800, c: c }); }

const V = {};
/* ---------- CĐ1 ---------- */
V.cia = () => {
  const P = [[260, 34, 'BÍ MẬT', 'C', C.blue, 'Không bị LỘ: văn bản dự thảo gửi nhầm ra ngoài, tài khoản bị đọc trộm thư.'], [90, 262, 'TOÀN VẸN', 'I', C.violet, 'Không bị SỬA: số, ngày văn bản bị đổi; trang tin bị thay nội dung.'], [430, 262, 'SẴN SÀNG', 'A', C.orange, 'Không bị MẤT/GIÁN ĐOẠN: máy chủ bị mã hoá, tấn công từ chối dịch vụ.']];
  let s = '<polygon points="260,40 90,262 430,262" fill="#eef4ff" stroke="#93c5fd" stroke-width="3" stroke-dasharray="10 6" class="flow"/>';
  s += '<g class="pop" style="animation-delay:.3s"><circle cx="260" cy="182" r="54" fill="#0b1b3f"/>' + txt(260, 175, 'THÔNG TIN', { s: 12, c: '#fff' }) + txt(260, 193, 'DỮ LIỆU', { s: 10, c: '#67e8f9' }) + '</g>';
  P.forEach((p, i) => { s += '<g class="vbtn pop" style="animation-delay:' + (.1 + i * .15) + 's" data-info="' + esc(p[5]) + '" tabindex="0"><circle class="bg" cx="' + p[0] + '" cy="' + p[1] + '" r="34" fill="' + p[4] + '"/>' + txt(p[0], p[1] + 9, p[3], { s: 26, c: '#fff', w: 900 }) + txt(p[0], p[1] + 52, p[2], { s: 12, c: p[4], w: 900 }) + '</g>'; });
  s += '<circle r="6" fill="#e11d48"><animateMotion dur="5s" repeatCount="indefinite" path="M260 40 L430 262 L90 262 Z"/></circle>';
  return svg(520, 330, s);
};
V.riskchain = () => diagram(560, 230, [
  { id: 'a', x: 10, y: 80, w: 115, h: 64, t: 'Nguồn đe dọa', s: 'kẻ lừa đảo, nội bộ, lỗi vận hành', c: C.red, info: 'Ai/cái gì gây hại. Ghi cụ thể: “nhóm lừa đảo qua thư”, không ghi chung chung “hacker”.' },
  { id: 'b', x: 150, y: 80, w: 115, h: 64, t: 'Điểm yếu', s: 'chưa MFA, chưa vá, quyền thừa', c: C.amber, info: 'Điều kiện cho phép xảy ra. Phải kiểm chứng được (ảnh cấu hình, danh sách quyền).' },
  { id: 'c', x: 290, y: 80, w: 115, h: 64, t: 'Tài sản', s: 'hộp thư, máy chủ văn bản', c: C.blue, info: 'Thứ bị tác động. Lấy từ danh mục tài sản PL-01, có chủ sở hữu.' },
  { id: 'd', x: 430, y: 80, w: 115, h: 64, t: 'Hậu quả', s: 'lộ / sửa / mất (C-I-A)', c: C.violet, info: 'Mô tả bằng hậu quả nghiệp vụ, gắn với C, I hoặc A.' },
  { id: 'e', x: 170, y: 172, w: 215, h: 44, t: 'Rủi ro = L × I (quy ước bài học)', c: C.navy, fill: '#0b1b3f', tc: '#fff' }],
  [['a', 'b', 'lợi dụng', { pkt: C.red }], ['b', 'c', 'tác động', { pkt: C.red, begin: .6 }], ['c', 'd', 'gây ra', { pkt: C.red, begin: 1.2 }]],
  { post: txt(280, 40, 'Một kịch bản rủi ro phải đủ 4 thành phần – bấm vào từng ô', { s: 11, c: '#475569' }) });
V.threats = () => {
  const items = [['Phishing', 'thư, tin nhắn giả danh', C.red, 'T1566'], ['RaaS', 'mã độc tống tiền cho thuê', C.violet, 'đánh cắp rồi mã hoá'], ['Chuỗi cung ứng', 'qua nhà thầu, bản cập nhật', C.amber, 'OWASP A03:2025'], ['Deepfake', 'giả giọng, giả mặt lãnh đạo', C.teal, 'điểm g k2 Điều 7 Luật 2025']];
  let s = '<g class="pop"><circle cx="270" cy="150" r="56" fill="#0b1b3f"/>' + txt(270, 145, 'CƠ QUAN', { c: '#fff', s: 12 }) + txt(270, 162, 'cán bộ · dữ liệu', { c: '#67e8f9', s: 9 }) + '</g>';
  const pos = [[70, 50], [470, 50], [70, 250], [470, 250]];
  items.forEach((it, i) => { const [x, y] = pos[i]; s += '<path d="M' + x + ' ' + y + ' L270 150" stroke="' + it[2] + '" stroke-width="2" class="flow" fill="none"/><circle r="5" fill="' + it[2] + '"><animateMotion dur="2.2s" begin="' + i * .5 + 's" repeatCount="indefinite" path="M' + x + ' ' + y + ' L270 150"/></circle>'; s += box({ x: x - 68, y: y - 30, w: 136, h: 60, t: it[0], s: it[1], c: it[2], bar: 1, info: it[0] + ': ' + it[1] + ' (' + it[3] + ').' }, i); });
  return svg(540, 300, s);
};
V.csf = () => {
  const F = [['QUẢN TRỊ', 'Govern', C.navy, 'Chiến lược, vai trò, chính sách, quản lý rủi ro chuỗi cung ứng – nằm ở trung tâm.'], ['NHẬN DIỆN', 'Identify', C.blue, 'Kiểm kê tài sản, đánh giá rủi ro, cải tiến.'], ['BẢO VỆ', 'Protect', C.violet, 'Quản lý danh tính, truy cập, đào tạo, bảo vệ dữ liệu, nền tảng.'], ['PHÁT HIỆN', 'Detect', C.amber, 'Giám sát liên tục, phân tích sự kiện bất lợi.'], ['ỨNG PHÓ', 'Respond', C.red, 'Quản lý sự cố, phân tích, báo cáo, ngăn chặn.'], ['KHÔI PHỤC', 'Recover', C.green, 'Thực hiện kế hoạch khôi phục, truyền thông khôi phục.']];
  let s = ''; const cx = 270, cy = 160, R = 120, r = 62;
  for (let i = 1; i < 6; i++) {
    const a0 = (-90 + (i - 1) * 72) * Math.PI / 180, a1 = (-90 + i * 72) * Math.PI / 180;
    const p = (a, rr) => (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1);
    const am = (a0 + a1) / 2;
    s += '<g class="vbtn pop" style="animation-delay:' + i * .1 + 's" data-info="' + esc(F[i][0] + ' (' + F[i][1] + '): ' + F[i][3]) + '" tabindex="0"><path class="bg" d="M' + p(a0, r + 4) + ' L' + p(a0, R) + ' A' + R + ' ' + R + ' 0 0 1 ' + p(a1, R) + ' L' + p(a1, r + 4) + ' A' + (r + 4) + ' ' + (r + 4) + ' 0 0 0 ' + p(a0, r + 4) + 'Z" fill="' + F[i][2] + '" stroke="#fff" stroke-width="3"/>' + txt(cx + (r + R) / 2 * Math.cos(am), cy + (r + R) / 2 * Math.sin(am) - 2, F[i][0], { c: '#fff', s: 10.5 }) + txt(cx + (r + R) / 2 * Math.cos(am), cy + (r + R) / 2 * Math.sin(am) + 11, F[i][1], { c: '#e0e7ff', s: 8.5, w: 600 }) + '</g>';
  }
  s += '<g class="vbtn pop" data-info="' + esc(F[0][0] + ' (Govern): ' + F[0][3]) + '" tabindex="0"><circle class="bg" cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + C.navy + '"/>' + txt(cx, cy - 2, 'QUẢN TRỊ', { c: '#fff', s: 13, w: 900 }) + txt(cx, cy + 14, 'Govern', { c: '#67e8f9', s: 10 }) + '</g>';
  s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 10) + '" fill="none" stroke="#93c5fd" stroke-width="2" stroke-dasharray="4 8" style="transform-origin:' + cx + 'px ' + cy + 'px; animation:spin 40s linear infinite"/>';
  return svg(540, 320, s);
};
V.matrix = () => {
  let s = ''; const x0 = 70, y0 = 20, cw = 70, ch = 48;
  for (let l = 1; l <= 5; l++) for (let i = 1; i <= 5; i++) {
    const r = l * i, col = r >= 20 ? '#b91c1c' : r >= 10 ? '#f97316' : r >= 5 ? '#facc15' : '#4ade80';
    s += '<rect x="' + (x0 + (i - 1) * cw) + '" y="' + (y0 + (5 - l) * ch) + '" width="' + (cw - 3) + '" height="' + (ch - 3) + '" rx="6" fill="' + col + '" opacity=".85" class="pop" style="animation-delay:' + ((l + i) * .04) + 's"/>' + txt(x0 + (i - 1) * cw + cw / 2, y0 + (5 - l) * ch + ch / 2 + 4, String(r), { s: 13, c: '#0f172a', w: 800 });
  }
  for (let k = 1; k <= 5; k++) { s += txt(x0 - 14, y0 + (5 - k) * ch + ch / 2 + 4, String(k), { s: 11, c: '#64748b' }); s += txt(x0 + (k - 1) * cw + cw / 2, y0 + 5 * ch + 14, String(k), { s: 11, c: '#64748b' }); }
  s += txt(30, y0 + 2.5 * ch, 'L', { s: 14, c: '#0f172a', w: 900 }) + txt(x0 + 2.5 * cw, y0 + 5 * ch + 32, 'I – Tác động', { s: 11, c: '#0f172a' });
  s += '<g><circle r="13" fill="#0b1b3f" stroke="#fff" stroke-width="3"><animate attributeName="cx" values="' + (x0 + 3.5 * cw) + ';' + (x0 + 3.5 * cw) + ';' + (x0 + 1.5 * cw) + ';' + (x0 + 1.5 * cw) + '" dur="6s" repeatCount="indefinite"/><animate attributeName="cy" values="' + (y0 + 1.5 * ch) + ';' + (y0 + 1.5 * ch) + ';' + (y0 + 3.5 * ch) + ';' + (y0 + 3.5 * ch) + '" dur="6s" repeatCount="indefinite"/></circle></g>';
  s += txt(470, 70, 'R01 trước xử lý', { s: 10, a: 'start' }) + txt(470, 86, 'L=4, I=4 → 16', { s: 10, a: 'start', c: '#c2410c' }) + txt(470, 120, 'Sau khi bật MFA', { s: 10, a: 'start' }) + txt(470, 136, 'L=2, I=4 → 8', { s: 10, a: 'start', c: '#a16207' }) + txt(470, 170, 'Quy ước bài học,', { s: 9, a: 'start', c: '#64748b', w: 600 }) + txt(470, 183, 'không phải công thức', { s: 9, a: 'start', c: '#64748b', w: 600 }) + txt(470, 196, 'bắt buộc của NIST', { s: 9, a: 'start', c: '#64748b', w: 600 });
  return svg(600, 300, s);
};
V.emaildemo = () => {
  const rows = [['Received', 'mx.cqrnau.lab (203.0.113.66)', 1], ['SPF / DKIM', 'spf=fail · dkim=none', 1], ['From', 'thongbao@cqrnau.lab', 1], ['Reply-To', 'hop.khan.2026@mailtam.lab', 1], ['Subject', '…lich hop khan… phan hoi truoc 10h', 1], ['Đính kèm', 'ThongBao_LichHop_T11.html', 1]];
  let s = '<rect x="10" y="10" width="520" height="250" rx="14" fill="#fff" stroke="#cbd5e1"/><rect x="10" y="10" width="520" height="30" rx="14" fill="#0b1b3f"/>' + txt(270, 30, 'thu_gia_mao.eml – tiêu đề thư', { c: '#fff', s: 11 });
  rows.forEach((r, i) => { const y = 58 + i * 32; s += '<g class="pop" style="animation-delay:' + (i * .35) + 's">' + txt(28, y + 4, r[0], { a: 'start', s: 10.5, c: '#475569' }) + '<rect x="130" y="' + (y - 11) + '" width="380" height="22" rx="6" fill="#fff1f2" stroke="#fda4af"/>' + txt(140, y + 4, r[1], { a: 'start', s: 10.5, c: '#9f1239', w: 700 }) + '</g>'; });
  return svg(540, 270, s);
};
V.netmap = () => {
  const n = [
    { id: 'inet', x: 10, y: 120, w: 80, h: 46, t: 'Internet', c: C.slate },
    { id: 'fw', x: 120, y: 120, w: 80, h: 46, t: 'FW01', s: 'tường lửa biên', c: C.red, info: 'Tường lửa biên: quy tắc NAT 203.0.113.10 → cổng thông tin, 203.0.113.11 → hệ thống văn bản.' },
    { id: 'web', x: 240, y: 22, w: 110, h: 44, t: 'SRV-WEB01', s: '10.20.1.20 · cổng TT', c: C.blue },
    { id: 'vb', x: 240, y: 80, w: 110, h: 44, t: 'SRV-VB01', s: '10.20.1.21 · văn bản', c: C.blue, info: 'Hệ thống quản lý văn bản và điều hành – tài sản trọng yếu.' },
    { id: 'file', x: 240, y: 138, w: 110, h: 44, t: 'SRV-FILE01', s: '10.20.1.22 · tệp', c: C.blue },
    { id: 'mail', x: 240, y: 196, w: 110, h: 44, t: 'SRV-MAIL01', s: '10.20.1.25 · thư', c: C.blue },
    { id: 'bk', x: 390, y: 210, w: 120, h: 44, t: 'SRV-BK01', s: '10.20.1.30 · sao lưu', c: C.green },
    { id: 'vp', x: 390, y: 40, w: 120, h: 44, t: 'Văn phòng', s: '10.20.10.0/24', c: C.violet },
    { id: 'it', x: 390, y: 120, w: 120, h: 44, t: 'CNTT', s: '10.20.20.0/24', c: C.teal }];
  return diagram(520, 270, n, [['inet', 'fw', '', { pkt: true }], ['fw', 'web', '', { pkt: C.cyan, begin: .4 }], ['fw', 'vb', '', {}], ['vp', 'vb', '', { pkt: C.violet, begin: .8 }], ['vb', 'bk', '', { pkt: C.green, begin: 1.1, from: 'r', to: 'l' }], ['it', 'file', '', {}]],
    { pre: zone(230, 10, 130, 245, 'VÙNG MÁY CHỦ', C.blue) });
};
/* ---------- CĐ2 ---------- */
V.lawmap = () => diagram(560, 260, [
  { id: 'l', x: 200, y: 14, w: 160, h: 50, t: 'Luật An ninh mạng', s: '116/2025/QH15 · 01/7/2026', c: C.red, fill: '#fff1f2', bar: 1 },
  { id: 'o1', x: 10, y: 14, w: 150, h: 50, t: 'Luật ATTTM 2015', s: 'hết hiệu lực 01/7/2026', c: C.slate, dash: 1 },
  { id: 'o2', x: 400, y: 14, w: 150, h: 50, t: 'Luật ANM 2018', s: 'hết hiệu lực 01/7/2026', c: C.slate, dash: 1 },
  { id: 'n327', x: 10, y: 120, w: 98, h: 50, t: 'NĐ 327', s: 'xử lý thông tin vi phạm', c: C.blue },
  { id: 'n330', x: 118, y: 120, w: 98, h: 50, t: 'NĐ 330', s: 'xử phạt ANM, DLCN', c: C.violet },
  { id: 'n331', x: 226, y: 120, w: 98, h: 50, t: 'NĐ 331', s: 'bảo vệ HTTT, cấp độ', c: C.orange, fill: '#fff7ed' },
  { id: 'n332', x: 334, y: 120, w: 98, h: 50, t: 'NĐ 332', s: 'kinh doanh SP, DV', c: C.teal },
  { id: 'n333', x: 442, y: 120, w: 108, h: 50, t: 'NĐ 333', s: 'chi tiết, biện pháp thi hành', c: C.blue },
  { id: 'dl', x: 160, y: 200, w: 240, h: 46, t: 'Luật BVDLCN 91/2025 + NĐ 356/2025', s: 'hiệu lực 01/01/2026', c: C.green }],
  [['o1', 'l', 'thay thế', { c: C.red }], ['o2', 'l', 'thay thế', { c: C.red }], ['l', 'n327', '', { from: 'b', to: 't' }], ['l', 'n330', '', { from: 'b', to: 't' }], ['l', 'n331', '', { from: 'b', to: 't', pkt: true }], ['l', 'n332', '', { from: 'b', to: 't' }], ['l', 'n333', '', { from: 'b', to: 't' }], ['n330', 'dl', 'xử phạt', { from: 'b', to: 't' }]]);
V.decrees = V.lawmap;
V.levels = () => {
  const L = [['1', 'Nội bộ, chỉ thông tin công cộng', '#4ade80'], ['2', 'Nội bộ có thông tin riêng, cá nhân; không bí mật nhà nước', '#a3e635'], ['3', 'Bí mật nhà nước (mức tổn hại ANQG), thủ tục hành chính, DLCN quy mô lớn, hạ tầng dùng chung cấp tỉnh', '#facc15'], ['4', 'Tổn hại nghiêm trọng ANQG; hệ thống quốc gia 24/7', '#f97316'], ['5', 'Tổn hại đặc biệt nghiêm trọng; mặc định là HTTT quan trọng về ANQG', '#dc2626']];
  let s = '';
  L.forEach((l, i) => { const y = 240 - i * 50, w = 150 + i * 70; s += '<g class="vbtn pop" style="animation-delay:' + (i * .15) + 's" data-info="' + esc('Cấp độ ' + l[0] + ': ' + l[1] + '. (Tóm tắt Điều ' + (11 + i) + ' NĐ 331/2026 – đối chiếu nguyên văn.)') + '" tabindex="0"><rect class="bg" x="20" y="' + y + '" width="' + w + '" height="42" rx="10" fill="' + l[2] + '"/>' + txt(40, y + 27, l[0], { s: 20, w: 900, c: '#0f172a' }) + txt(62, y + 26, l[1], { a: 'start', s: 9.5, c: '#0f172a', w: 700 }) + '</g>'; });
  s += txt(470, 30, '↑ mức tổn hại', { s: 10, c: '#64748b' });
  return svg(560, 292, s);
};
V.datalife = () => {
  const st = [['Thu thập', 'căn cứ, sự đồng ý'], ['Lưu trữ', 'phân quyền, mã hoá'], ['Sử dụng', 'đúng mục đích, nhật ký'], ['Chia sẻ', 'hợp đồng bên xử lý'], ['Xoá, huỷ', 'biên bản huỷ']];
  let s = ''; const cx = 270, cy = 150, R = 105;
  st.forEach((x, i) => { const a = (-90 + i * 72) * Math.PI / 180; const X = cx + R * Math.cos(a), Y = cy + R * Math.sin(a); s += box({ x: X - 62, y: Y - 26, w: 124, h: 52, t: x[0], s: 'Bằng chứng: ' + x[1], c: [C.blue, C.violet, C.teal, C.amber, C.red][i], bar: 1 }, i); });
  s = '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#93c5fd" stroke-width="3" class="flow"/><circle r="7" fill="#f97316"><animateMotion dur="8s" repeatCount="indefinite" path="M' + cx + ' ' + (cy - R) + ' A' + R + ' ' + R + ' 0 1 1 ' + (cx - .1) + ' ' + (cy - R) + '"/></circle>' + s + '<g class="pop">' + txt(cx, cy - 4, 'DỮ LIỆU CÁ NHÂN', { s: 11, c: '#0b1b3f' }) + txt(cx, cy + 12, 'cơ bản · nhạy cảm', { s: 9, c: '#64748b' }) + '</g>';
  return svg(540, 300, s);
};
V.transition = () => diagram(560, 220, [
  { id: 'a', x: 10, y: 30, w: 130, h: 56, t: 'Hồ sơ cấp độ cũ', s: 'theo NĐ 85/2016', c: C.slate, dash: 1 },
  { id: 'b', x: 180, y: 30, w: 150, h: 56, t: 'Điều 39 NĐ 331', s: 'đang đầu tư trước 01/7/2026', c: C.amber },
  { id: 'c', x: 370, y: 10, w: 180, h: 46, t: '≤ 06 tháng', s: 'hoàn thành thẩm định, phê duyệt', c: C.orange },
  { id: 'd', x: 370, y: 70, w: 180, h: 46, t: '≤ 12 tháng', s: 'đủ biện pháp theo cấp độ', c: C.red },
  { id: 'e', x: 180, y: 140, w: 150, h: 56, t: 'Điều 25 NĐ 331', s: 'thay đổi → xác định lại như lần đầu', c: C.blue },
  { id: 'f', x: 370, y: 145, w: 180, h: 46, t: 'NĐ 333: kế thừa kết quả', s: 'không thẩm định lại nếu không đổi', c: C.teal }],
  [['a', 'b', '', { pkt: true }], ['b', 'c', ''], ['b', 'd', ''], ['a', 'e', 'có thay đổi', { from: 'b', to: 'l', path: 'M75 86 L75 168 L180 168' }], ['e', 'f', '']]);
V.lookup = () => {
  const st = ['Gõ số hiệu đầy đủ', 'Xem thuộc tính hiệu lực', 'Đọc điều Hiệu lực, Chuyển tiếp', 'Ghi nguồn, ngày tra, người tra'];
  let s = ''; st.forEach((t, i) => { s += box({ x: 10 + i * 135, y: 70, w: 120, h: 70, t: (i + 1) + '. ' + t, c: [C.blue, C.violet, C.orange, C.green][i], bar: 1 }, i); if (i < 3) s += '<path d="M' + (130 + i * 135) + ' 105 L' + (145 + i * 135) + ' 105" stroke="#94a3b8" stroke-width="2" marker-end="MARK"/>'; });
  s += txt(270, 30, 'vbpl.moj.gov.vn · congbao.chinhphu.vn · vanban.chinhphu.vn', { s: 11, c: '#1e40af' }) + txt(270, 175, 'Thiếu một trong ba (nguồn – ngày – người) → trạng thái “cần xác minh”', { s: 10, c: '#b45309' });
  return svg(560, 200, s);
};
V.matrixdemo = () => {
  const H = ['Căn cứ', 'Nghĩa vụ', 'Bằng chứng', 'Trạng thái'], R = [['Đ.x NĐ 331 (đã tra)', 'Phân quyền theo vai trò', 'Ma trận quyền 15/9', 'THIẾU'], ['Luật 91/2025', 'Kiểm soát truy cập DLCN', 'Nhật ký truy cập', 'CẦN XÁC MINH'], ['Quy chế nội bộ', 'Sao lưu hằng ngày', 'Nhật ký job + thử khôi phục', 'ĐỦ']];
  const col = { 'THIẾU': '#fee2e2', 'CẦN XÁC MINH': '#e0e7ff', 'ĐỦ': '#dcfce7' };
  let s = ''; H.forEach((h, i) => s += '<rect x="' + (10 + i * 135) + '" y="20" width="130" height="28" rx="6" fill="#0b1b3f"/>' + txt(75 + i * 135, 38, h, { c: '#fff', s: 10 }));
  R.forEach((r, j) => r.forEach((c, i) => { s += '<g class="pop" style="animation-delay:' + (j * .4 + i * .1) + 's"><rect x="' + (10 + i * 135) + '" y="' + (56 + j * 48) + '" width="130" height="42" rx="6" fill="' + (i === 3 ? col[c] : '#fff') + '" stroke="#cbd5e1"/>' + txt(75 + i * 135, 80 + j * 48, c, { s: 9.5, wrap: 22 }) + '</g>'; }));
  return svg(560, 210, s);
};
/* ---------- CĐ3 ---------- */
V.killchain = () => {
  const K = [['Trinh sát', 'OSINT, quét cổng'], ['Vũ khí hoá', 'soạn thư, tệp độc'], ['Phát tán', 'gửi thư, web'], ['Khai thác', 'chạy mã, lỗi'], ['Cài đặt', 'tạo tài khoản, tệp'], ['Điều khiển C2', 'kết nối ra ngoài'], ['Hành động', 'đánh cắp, mã hoá']];
  let s = ''; K.forEach((k, i) => { const x = 8 + i * 78; s += '<g class="vbtn pop" style="animation-delay:' + i * .12 + 's" data-info="' + esc('Giai đoạn ' + (i + 1) + ' – ' + k[0] + ': ' + k[1] + '. Chặn ở giai đoạn càng sớm, thiệt hại càng nhỏ.') + '" tabindex="0"><path class="bg" d="M' + x + ' 60 h66 l12 34 l-12 34 h-66 l12 -34z" fill="' + ['#1e3a8a', '#1d4ed8', '#2563eb', '#7c3aed', '#c026d3', '#e11d48', '#b91c1c'][i] + '"/>' + txt(x + 42, 90, k[0], { c: '#fff', s: 9.5, wrap: 10 }) + txt(x + 42, 150, k[1], { c: '#475569', s: 8.5, wrap: 14, w: 600 }) + '</g>'; });
  s += '<rect x="8" y="190" width="0" height="10" rx="5" fill="#f97316"><animate attributeName="width" values="0;540;540" dur="7s" repeatCount="indefinite"/></rect>' + txt(280, 222, 'Thanh cam = tiến trình tấn công. Mục tiêu phòng thủ: cắt đứt chuỗi trước giai đoạn 4.', { s: 10, c: '#475569' });
  return svg(560, 240, s);
};
V.portscan = () => {
  let s = box({ x: 10, y: 110, w: 110, h: 60, t: 'Kali', s: '192.168.56.10', c: C.navy, fill: '#0b1b3f', tc: '#fff', sc: '#93c5fd' }) + box({ x: 400, y: 30, w: 140, h: 230, t: '', c: C.blue });
  s += txt(470, 50, 'Web 192.168.56.20', { s: 10 });
  const P = [['22', 'open', 'ssh', C.green], ['80', 'closed', '', C.slate], ['443', 'closed', '', C.slate], ['3000', 'open', 'http', C.green]];
  P.forEach((p, i) => { const y = 80 + i * 44; s += '<rect x="414" y="' + (y - 16) + '" width="112" height="32" rx="8" fill="' + (p[1] === 'open' ? '#dcfce7' : '#f1f5f9') + '" stroke="' + p[3] + '"/>' + txt(470, y + 4, p[0] + '/tcp ' + p[1] + ' ' + p[2], { s: 9.5, c: '#0f172a' }); s += '<path d="M120 140 L414 ' + y + '" stroke="' + p[3] + '" stroke-width="1.5" class="flow" fill="none"/><circle r="4" fill="#f97316"><animateMotion dur="1.6s" begin="' + i * .4 + 's" repeatCount="indefinite" path="M120 140 L414 ' + y + '"/></circle>'; });
  s += txt(250, 280, 'open = có dịch vụ lắng nghe · closed = đến được, không có dịch vụ · filtered = bị chặn', { s: 9.5, c: '#475569' });
  return svg(560, 295, s);
};
V.nmapdemo = V.portscan;
V.owasp = () => {
  const O = [['A01', 'Kiểm soát truy cập', 1], ['A02', 'Cấu hình sai', 1], ['A03', 'Chuỗi cung ứng', 2], ['A04', 'Lỗi mật mã', 0], ['A05', 'Chèn mã (Injection)', 0], ['A06', 'Thiết kế không an toàn', 0], ['A07', 'Lỗi xác thực', 0], ['A08', 'Toàn vẹn PM, dữ liệu', 0], ['A09', 'Ghi log, cảnh báo', 0], ['A10', 'Xử lý ngoại lệ', 2]];
  let s = ''; O.forEach((o, i) => { const x = 10 + (i % 5) * 108, y = 30 + Math.floor(i / 5) * 92; s += '<g class="pop" style="animation-delay:' + i * .07 + 's"><rect x="' + x + '" y="' + y + '" width="100" height="80" rx="12" fill="' + (o[2] === 2 ? '#fff7ed' : '#fff') + '" stroke="' + (o[2] === 2 ? '#f97316' : '#93c5fd') + '" stroke-width="2"/>' + txt(x + 50, y + 26, o[0] + ':2025', { s: 12, c: '#1e40af', w: 900 }) + txt(x + 50, y + 52, o[1], { s: 9.5, wrap: 14 }) + (o[2] === 2 ? '<rect x="' + (x + 62) + '" y="' + (y - 8) + '" width="40" height="16" rx="8" fill="#f97316"/>' + txt(x + 82, y + 4, 'MỚI', { s: 8.5, c: '#fff' }) : '') + '</g>'; });
  return svg(560, 225, s);
};
V.lateral = () => diagram(560, 250, [
  { id: 'a', x: 10, y: 100, w: 110, h: 50, t: 'Tài khoản thường', s: 'bị chiếm qua RDP', c: C.amber },
  { id: 'b', x: 160, y: 30, w: 120, h: 50, t: 'Leo thang quyền', s: '4720 tạo TK · 4732 thêm nhóm', c: C.red },
  { id: 'c', x: 160, y: 170, w: 120, h: 50, t: 'Di chuyển ngang', s: 'RDP/SMB sang máy khác', c: C.violet },
  { id: 'd', x: 320, y: 30, w: 110, h: 50, t: 'Đánh cắp', s: 'netflow ra ngoài lớn', c: C.red },
  { id: 'e', x: 320, y: 170, w: 110, h: 50, t: 'Mã hoá', s: 'FIM nhiều tệp đổi', c: C.red },
  { id: 'f', x: 450, y: 100, w: 100, h: 50, t: 'Xoá dấu vết', s: 'sự kiện 1102', c: C.navy }],
  [['a', 'b', '', { pkt: true }], ['a', 'c', '', { pkt: true, begin: .5 }], ['b', 'd', ''], ['c', 'e', ''], ['d', 'f', ''], ['e', 'f', '']]);
V.labnet = () => {
  const n = [{ id: 'k', x: 20, y: 30, w: 110, h: 46, t: 'Kali .10', s: 'Nmap, ZAP/Burp', c: C.navy }, { id: 'w', x: 220, y: 30, w: 120, h: 46, t: 'Web .20', s: 'Juice Shop :3000', c: C.blue }, { id: 's', x: 420, y: 30, w: 120, h: 46, t: 'Suricata .30', s: 'IDS, EVE JSON', c: C.amber }, { id: 'z', x: 120, y: 150, w: 120, h: 46, t: 'Wazuh .40', s: 'SIEM', c: C.teal }, { id: 'x', x: 320, y: 150, w: 120, h: 46, t: 'Windows .50', s: '4624/4625', c: C.violet }];
  return diagram(560, 250, n, [['k', 'w', '', { pkt: true }], ['w', 's', 'bản sao lưu lượng', { c: C.amber }], ['s', 'z', 'eve.json', { from: 'b', to: 't' }], ['x', 'z', 'agent', {}]],
    { pre: zone(8, 10, 544, 200, 'HOST-ONLY 192.168.56.0/24 – KHÔNG BRIDGE, KHÔNG ĐỊNH TUYẾN RA MẠNG THẬT', C.green), post: '<line x1="8" y1="230" x2="552" y2="230" stroke="#dc2626" stroke-width="3" stroke-dasharray="8 6"/>' + txt(280, 246, '✕ mạng cơ quan / Internet', { s: 10, c: '#dc2626' }) });
};
V.httpdemo = () => {
  const L = [['GET', ' /rest/products/search?q=apple HTTP/1.1', C.blue], ['Host:', ' 192.168.56.20:3000', C.slate], ['Cookie:', ' language=vi_VN; token=<ĐÃ LÀM SẠCH>', C.red], ['', '', ''], ['HTTP/1.1', ' 200 OK', C.green], ['X-Frame-Options:', ' SAMEORIGIN', C.violet], ['Content-Type:', ' application/json', C.slate]];
  let s = '<rect x="10" y="10" width="540" height="230" rx="12" fill="#0b1220"/>';
  L.forEach((l, i) => { if (!l[0]) return; s += '<g class="pop" style="animation-delay:' + i * .25 + 's"><text x="26" y="' + (42 + i * 28) + '" font-family="ui-monospace,monospace" font-size="12"><tspan fill="' + l[2] + '" font-weight="800" style="filter:brightness(1.6)">' + esc(l[0]) + '</tspan><tspan fill="#e2e8f0">' + esc(l[1]) + '</tspan></text></g>'; });
  return svg(560, 250, s);
};
/* ---------- CĐ4 ---------- */
V.layers = () => {
  const L = [['Dữ liệu', 'mã hoá, phân quyền', C.red], ['Ứng dụng', 'WAF, vá lỗi', C.orange], ['Máy chủ, máy trạm', 'EDR, cấu hình CIS', C.amber], ['Mạng nội bộ', 'phân vùng, IDS', C.green], ['Vùng biên', 'tường lửa, VPN+MFA', C.teal], ['Chính sách, con người', 'đào tạo, quy trình', C.blue]];
  let s = ''; L.forEach((l, i) => { const r = 30 + i * 22; s = '<g class="vbtn pop" style="animation-delay:' + (.6 - i * .1) + 's" data-info="' + esc('Lớp ' + l[0] + ': ' + l[1]) + '" tabindex="0"><circle class="bg" cx="190" cy="150" r="' + r + '" fill="' + l[2] + '" fill-opacity=".85" stroke="#fff" stroke-width="2"/></g>' + s; });
  L.forEach((l, i) => { s += txt(370, 40 + i * 38, l[0], { a: 'start', s: 11, c: l[2] }) + txt(370, 54 + i * 38, l[1], { a: 'start', s: 9, w: 600, c: '#475569' }); s += '<line x1="' + (190 + 30 + i * 22 - 6) + '" y1="150" x2="362" y2="' + (36 + i * 38) + '" stroke="' + l[2] + '" stroke-width="1" opacity=".5"/>'; });
  s += '<circle r="6" fill="#0f172a"><animate attributeName="cx" values="-10;160;160" dur="4s" repeatCount="indefinite"/><animate attributeName="cy" values="150;150;150" dur="4s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;1;0" dur="4s" repeatCount="indefinite"/></circle>';
  return svg(560, 300, s);
};
V.idsips = () => {
  let s = box({ x: 10, y: 50, w: 90, h: 44, t: 'Internet', c: C.slate }) + box({ x: 150, y: 50, w: 90, h: 44, t: 'Tường lửa', c: C.red }) + box({ x: 290, y: 50, w: 90, h: 44, t: 'IPS inline', s: 'có thể CHẶN', c: C.orange }) + box({ x: 440, y: 50, w: 110, h: 44, t: 'Máy chủ web', c: C.blue });
  s += box({ x: 290, y: 170, w: 90, h: 44, t: 'IDS', s: 'chỉ CẢNH BÁO', c: C.amber }) + box({ x: 440, y: 170, w: 110, h: 44, t: 'WAF', s: 'trước ứng dụng web', c: C.violet });
  s += '<path d="M100 72 H150 M240 72 H290 M380 72 H440" stroke="#94a3b8" stroke-width="2" class="flow" marker-end="MARK"/><path d="M265 72 V192 H290" stroke="#f59e0b" stroke-width="2" stroke-dasharray="4 4" fill="none" marker-end="MARK"/>' + txt(232, 140, 'SPAN/TAP: bản sao', { s: 9, c: '#b45309' });
  s += '<circle r="6" fill="#16a34a"><animateMotion dur="3s" repeatCount="indefinite" path="M100 72 H440"/></circle><circle r="6" fill="#e11d48"><animateMotion dur="3s" begin="1.5s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" path="M100 72 H335"/><animate attributeName="opacity" values="1;1;0" dur="3s" begin="1.5s" repeatCount="indefinite"/></circle>' + txt(335, 40, '✕ gói độc bị IPS chặn', { s: 9, c: '#e11d48' });
  return svg(560, 240, s);
};
V.rbac = () => {
  const R = ['Văn thư', 'Chuyên viên', 'Lãnh đạo', 'Quản trị'], P = ['Đọc văn bản', 'Tạo văn bản', 'Ký duyệt', 'Cấu hình'], M = [[1, 1, 0, 0], [1, 1, 0, 0], [1, 0, 1, 0], [0, 0, 0, 1]];
  let s = ''; P.forEach((p, i) => s += txt(190 + i * 92, 30, p, { s: 10 })); R.forEach((r, j) => { s += txt(80, 70 + j * 46, r, { s: 10.5 }); M[j].forEach((m, i) => { s += '<rect x="' + (150 + i * 92) + '" y="' + (50 + j * 46) + '" width="80" height="36" rx="8" fill="' + (m ? '#dcfce7' : '#f8fafc') + '" stroke="#cbd5e1" class="pop" style="animation-delay:' + (j * .1 + i * .05) + 's"/>' + (m ? txt(190 + i * 92, 73 + j * 46, '✓', { s: 16, c: '#16a34a' }) : ''); }); });
  s += txt(280, 245, 'Quyền gán cho VAI TRÒ; người được gán vào vai trò. Quản trị tách khỏi tài khoản hằng ngày.', { s: 9.5, c: '#475569' });
  return svg(560, 260, s);
};
V.backup = () => diagram(560, 240, [
  { id: 'p', x: 10, y: 90, w: 110, h: 50, t: 'Dữ liệu gốc', c: C.blue },
  { id: 'a', x: 170, y: 20, w: 130, h: 46, t: 'Bản 1: ổ cục bộ', s: 'phục hồi nhanh', c: C.teal },
  { id: 'b', x: 170, y: 92, w: 130, h: 46, t: 'Bản 2: phương tiện khác', s: 'NAS/băng từ', c: C.violet },
  { id: 'c', x: 170, y: 164, w: 130, h: 46, t: 'Bản 3: nơi khác', s: 'không ghi đè được', c: C.orange },
  { id: 't', x: 350, y: 80, w: 190, h: 70, t: 'THỬ KHÔI PHỤC', s: 'đo RTO, RPO · có biên bản', c: C.green, fill: '#f0fdf4' }],
  [['p', 'a', '', { pkt: true }], ['p', 'b', '', { pkt: true, begin: .4 }], ['p', 'c', '', { pkt: true, begin: .8 }], ['b', 't', 'restore test', { c: C.green }]], { post: txt(445, 190, 'Backup job ≠ khôi phục được', { s: 10, c: '#b91c1c' }) });
V.pipeline = () => {
  const n = [{ id: 'tr', x: 8, y: 100, w: 80, h: 46, t: 'Lưu lượng', c: C.slate }, { id: 's', x: 108, y: 100, w: 82, h: 46, t: 'Suricata', s: 'quy tắc khớp', c: C.amber }, { id: 'e', x: 210, y: 100, w: 82, h: 46, t: 'eve.json', s: 'mỗi dòng 1 JSON', c: C.amber }, { id: 'a', x: 312, y: 100, w: 70, h: 46, t: 'Agent', s: 'localfile', c: C.teal }, { id: 'm', x: 400, y: 30, w: 70, h: 46, t: 'Manager', s: 'decoder, rule', c: C.teal }, { id: 'i', x: 400, y: 170, w: 70, h: 46, t: 'Indexer', c: C.teal }, { id: 'd', x: 485, y: 100, w: 70, h: 46, t: 'Dashboard', c: C.blue }];
  let pre = ''; const chk = [[148, 'Cảm biến thấy?'], [251, 'Có quyền đọc?'], [347, 'Kết nối OK?'], [435, 'Rule khớp?'], [520, 'Đúng giờ?']];
  return diagram(560, 260, n, [['tr', 's', '', { pkt: true }], ['s', 'e', '', { pkt: true, begin: .3 }], ['e', 'a', '', { pkt: true, begin: .6 }], ['a', 'm', '', { pkt: true, begin: .9 }], ['m', 'i', '', { from: 'b', to: 't' }], ['i', 'd', '', {}]], { post: chk.map((c, i) => '<g class="pop" style="animation-delay:' + (1 + i * .2) + 's"><circle cx="' + c[0] + '" cy="236" r="7" fill="#f97316"/>' + txt(c[0], 254, c[1], { s: 8.5, c: '#9a3412' }) + '</g>').join('') });
};
V.fwdemo = () => {
  let s = box({ x: 10, y: 40, w: 110, h: 44, t: 'Vùng VP', s: '10.20.10.0/24', c: C.violet }) + box({ x: 10, y: 150, w: 110, h: 44, t: 'Internet', c: C.slate }) + box({ x: 220, y: 90, w: 100, h: 60, t: 'Tường lửa', s: 'quy tắc 1..n', c: C.red }) + box({ x: 420, y: 40, w: 130, h: 44, t: 'SRV-VB01 :443', c: C.blue }) + box({ x: 420, y: 150, w: 130, h: 44, t: 'SRV-VB01 :3389', c: C.blue });
  s += '<path d="M120 62 L220 110 M320 110 L420 62" stroke="#16a34a" stroke-width="2.5" class="flow" fill="none"/><circle r="6" fill="#16a34a"><animateMotion dur="2.6s" repeatCount="indefinite" path="M120 62 L220 110 L320 110 L420 62"/></circle>' + txt(370, 100, 'ALLOW ✓', { s: 10, c: '#16a34a' });
  s += '<path d="M120 172 L220 130" stroke="#e11d48" stroke-width="2.5" class="flow" fill="none"/><circle r="6" fill="#e11d48"><animateMotion dur="2s" repeatCount="indefinite" path="M120 172 L220 130"/></circle>' + txt(370, 182, 'DENY ✕ (phải chứng minh)', { s: 10, c: '#e11d48' });
  return svg(560, 220, s);
};
V.evedemo = () => {
  const j = ['{', '  "timestamp": "2026-11-07T09:20:31.000+07:00",', '  "event_type": "alert",', '  "src_ip": "10.20.20.12",  "dest_ip": "10.20.1.20",', '  "alert": {', '    "signature_id": 1000001,', '    "signature": "LAB-MARKER kiem thu quy tac",', '    "action": "allowed"', '  }', '}'];
  let s = '<rect x="10" y="10" width="540" height="250" rx="12" fill="#0b1220"/>'; j.forEach((l, i) => { s += '<text x="26" y="' + (36 + i * 22) + '" font-family="ui-monospace,monospace" font-size="12" fill="' + (/signature_id|timestamp|src_ip/.test(l) ? '#fde68a' : '#e2e8f0') + '" class="pop" style="animation-delay:' + i * .1 + 's">' + esc(l) + '</text>'; });
  return svg(560, 270, s);
};
V.wazuhdemo = V.pipeline;
/* ---------- CĐ5 ---------- */
V.archvb = () => {
  const n = [{ id: 'u', x: 8, y: 30, w: 92, h: 44, t: 'Người dùng', s: 'VP, lãnh đạo', c: C.violet }, { id: 'nt', x: 8, y: 170, w: 92, h: 44, t: 'Nhà thầu', s: 'qua VPN', c: C.amber }, { id: 'vpn', x: 120, y: 100, w: 80, h: 44, t: 'VPN / FW', c: C.red }, { id: 'rp', x: 220, y: 100, w: 82, h: 44, t: 'Reverse proxy', c: C.slate }, { id: 'web', x: 320, y: 30, w: 70, h: 40, t: 'Web', c: C.blue }, { id: 'api', x: 320, y: 100, w: 70, h: 40, t: 'API', c: C.blue }, { id: 'db', x: 320, y: 170, w: 70, h: 40, t: 'CSDL', c: C.blue }, { id: 'iam', x: 420, y: 30, w: 128, h: 40, t: 'IAM (AD)', s: 'dùng chung', c: C.teal, dash: 1 }, { id: 'f', x: 420, y: 100, w: 128, h: 40, t: 'Tệp đính kèm', c: C.blue }, { id: 'bk', x: 420, y: 170, w: 128, h: 40, t: 'Sao lưu', c: C.green }];
  return diagram(560, 240, n, [['u', 'vpn', '', { pkt: true }], ['nt', 'vpn', '', { pkt: C.amber, begin: .6 }], ['vpn', 'rp', ''], ['rp', 'api', '', { pkt: true, begin: .3 }], ['api', 'db', '', { from: 'b', to: 't' }], ['api', 'iam', '', { c: C.teal }], ['api', 'f', ''], ['db', 'bk', '', { c: C.green }], ['rp', 'web', '']],
    { pre: zone(212, 10, 196, 220, 'RANH GIỚI HỆ THỐNG', C.blue) + '<line x1="110" y1="12" x2="110" y2="228" stroke="#e11d48" stroke-width="2.5" stroke-dasharray="5 5"/>' + txt(110, 236, 'trust boundary', { s: 8.5, c: '#e11d48' }) });
};
V.boundary = V.archvb;
V.dossier = () => {
  const H = [['HS-01', 'Tổng quan, ranh giới'], ['HS-02', 'Kiến trúc as-is'], ['HS-03', 'Thuyết minh cấp độ'], ['HS-04', 'Phương án bảo đảm ANM'], ['HS-05', 'Log, sao lưu, ứng cứu'], ['HS-06', 'Biên bản rà soát, tồn tại']];
  let s = ''; H.forEach((h, i) => { const x = 20 + (i % 3) * 178, y = 20 + Math.floor(i / 3) * 110; s += '<g class="pop" style="animation-delay:' + i * .12 + 's"><path d="M' + x + ' ' + y + ' h130 l20 20 v70 h-150z" fill="#fff" stroke="#2563eb" stroke-width="2"/><path d="M' + (x + 130) + ' ' + y + ' v20 h20" fill="#dbeafe" stroke="#2563eb"/>' + txt(x + 75, y + 40, h[0], { s: 14, c: '#1e40af', w: 900 }) + txt(x + 75, y + 65, h[1], { s: 9.5, wrap: 18 }) + '</g>'; });
  return svg(560, 240, s);
};
V.checklist = V.dossier;
V.controls = () => diagram(560, 200, [
  { id: 'y', x: 10, y: 70, w: 150, h: 60, t: 'YÊU CẦU', s: 'nhật ký tập trung', c: C.blue, bar: 1 },
  { id: 'b', x: 205, y: 70, w: 150, h: 60, t: 'BIỆN PHÁP', s: 'Wazuh thu log 5 máy chủ', c: C.violet, bar: 1 },
  { id: 'e', x: 400, y: 70, w: 150, h: 60, t: 'BẰNG CHỨNG', s: 'ảnh dashboard, cấu hình agent, lưu 90 ngày', c: C.green, bar: 1 }],
  [['y', 'b', 'đáp ứng bằng', { pkt: true }], ['b', 'e', 'chứng minh bằng', { pkt: true, begin: .7 }]], { post: txt(280, 170, 'Thiếu bằng chứng → ghi vào HS-06 danh sách tồn tại, không ghi “đạt”', { s: 10, c: '#b45309' }) });
V.approval = () => {
  const R = [['Cấp 1–2', 'Đơn vị chuyên trách ANM của chủ quản', 'thẩm định và phê duyệt', C.green], ['Cấp 3', 'Đơn vị chuyên trách thẩm định', 'chủ quản phê duyệt · ≤15 ngày thẩm định', C.amber], ['Cấp 4–5', 'Bộ Công an chủ trì thẩm định*', 'chủ quản phê duyệt cấp 4 · ≤25 ngày', C.red]];
  let s = ''; R.forEach((r, i) => { const y = 20 + i * 70; s += '<g class="pop" style="animation-delay:' + i * .2 + 's"><rect x="10" y="' + y + '" width="100" height="56" rx="10" fill="' + r[3] + '"/>' + txt(60, y + 33, r[0], { c: '#fff', s: 13, w: 900 }) + '<rect x="120" y="' + y + '" width="430" height="56" rx="10" fill="#fff" stroke="#cbd5e1"/>' + txt(135, y + 24, r[1], { a: 'start', s: 11 }) + txt(135, y + 42, r[2], { a: 'start', s: 9.5, w: 600, c: '#475569' }) + '</g>'; });
  s += txt(280, 238, '* Bộ Quốc phòng, Ban Cơ yếu Chính phủ với hệ thống thuộc phạm vi quản lý. Tóm tắt Điều 18 NĐ 331/2026.', { s: 9, c: '#64748b' });
  return svg(560, 250, s);
};
/* ---------- CĐ6 ---------- */
V.ir = () => {
  let s = ''; const cx = 160, cy = 140;
  [['QUẢN TRỊ', C.navy], ['NHẬN DIỆN', C.blue], ['BẢO VỆ', C.violet]].forEach((x, i) => { s += box({ x: 20, y: 30 + i * 70, w: 150, h: 56, t: x[0], s: 'chuẩn bị · cải tiến', c: x[1], fill: x[1], tc: '#fff', sc: '#c7d2fe' }, i); });
  [['PHÁT HIỆN', C.amber], ['ỨNG PHÓ', C.red], ['KHÔI PHỤC', C.green]].forEach((x, i) => { s += box({ x: 380, y: 30 + i * 70, w: 160, h: 56, t: x[0], s: 'xử lý sự cố', c: x[1], fill: x[1], tc: '#fff', sc: '#fee2e2' }, i + 3); });
  s += '<path d="M175 130 C250 60 300 60 375 130" stroke="#94a3b8" stroke-width="2" fill="none" class="flow" marker-end="MARK"/><path d="M375 160 C300 230 250 230 175 160" stroke="#94a3b8" stroke-width="2" fill="none" class="flow" marker-end="MARK"/>' + txt(275, 70, 'sự cố xảy ra', { s: 9.5, c: '#475569' }) + txt(275, 222, 'bài học → cải tiến', { s: 9.5, c: '#475569' });
  s += '<circle r="7" fill="#f97316"><animateMotion dur="5s" repeatCount="indefinite" path="M175 130 C250 60 300 60 375 130 L375 160 C300 230 250 230 175 160 Z"/></circle>';
  return svg(560, 260, s);
};
V.raci = () => {
  const P = ['Chỉ huy', 'Phân tích', 'Kỹ thuật', 'Chủ HT', 'Pháp chế'], T = [['Xác định SEV', 'A', 'R', 'C', 'C', 'I'], ['Cô lập máy chủ', 'A', 'C', 'R', 'C', 'I'], ['Thu bằng chứng', 'I', 'R', 'R', 'I', 'A'], ['Báo cáo', 'A', 'C', 'I', 'C', 'R']];
  const col = { R: '#2563eb', A: '#e11d48', C: '#f59e0b', I: '#94a3b8' };
  let s = ''; P.forEach((p, i) => s += txt(210 + i * 75, 30, p, { s: 10 }));
  T.forEach((t, j) => { s += txt(80, 70 + j * 46, t[0], { s: 10.5 }); t.slice(1).forEach((v, i) => { s += '<g class="pop" style="animation-delay:' + (j * .12 + i * .05) + 's"><circle cx="' + (210 + i * 75) + '" cy="' + (66 + j * 46) + '" r="17" fill="' + col[v] + '"/>' + txt(210 + i * 75, 71 + j * 46, v, { s: 13, c: '#fff', w: 900 }) + '</g>'; }); });
  return svg(580, 260, s);
};
V.evidence = () => diagram(560, 200, [
  { id: 'a', x: 10, y: 70, w: 100, h: 56, t: 'Thu nguyên trạng', s: 'evtx, eve.json', c: C.blue },
  { id: 'b', x: 140, y: 70, w: 100, h: 56, t: 'SHA-256', s: 'băm ngay', c: C.violet },
  { id: 'c', x: 270, y: 70, w: 120, h: 56, t: 'Chuỗi bàn giao', s: 'ai · lúc nào · làm gì', c: C.amber },
  { id: 'd', x: 420, y: 70, w: 130, h: 56, t: 'Lưu kho bằng chứng', s: 'chỉ đọc, phân tích bản sao', c: C.green }],
  [['a', 'b', '', { pkt: true }], ['b', 'c', '', { pkt: true, begin: .5 }], ['c', 'd', '', { pkt: true, begin: 1 }]]);
V.playbooks = () => {
  const P = [['Ransomware', 'tệp đổi hàng loạt, ghi chú đòi tiền', C.red], ['Phishing', 'thư giả, người dùng bấm', C.orange], ['Chiếm tài khoản', 'đăng nhập lạ thành công', C.violet], ['Tấn công web', '4xx/5xx bất thường, WAF', C.blue], ['Lộ lọt dữ liệu', 'khối lượng lớn ra ngoài', C.teal]];
  let s = ''; P.forEach((p, i) => { const x = 10 + i * 110; s += '<g class="pop" style="animation-delay:' + i * .12 + 's"><rect x="' + x + '" y="40" width="100" height="150" rx="14" fill="' + p[2] + '"/>' + txt(x + 50, 80, p[0], { s: 11, c: '#fff', wrap: 12 }) + '<rect x="' + (x + 8) + '" y="110" width="84" height="70" rx="8" fill="#fff" fill-opacity=".92"/>' + txt(x + 50, 145, p[1], { s: 9, wrap: 15, w: 600 }) + '</g>'; });
  s += txt(280, 220, 'Chọn playbook theo TÍN HIỆU quan sát được', { s: 10.5, c: '#475569' });
  return svg(560, 235, s);
};
V.correl = () => {
  const E = [['09:10', '4625 × 176', 'Windows · SRV-VB01', C.red, 0], ['09:13', '4624 nguyen.thu.ha', 'Windows · SRV-VB01', C.red, 1], ['09:18', 'FIM 14 tệp đổi', 'Wazuh · SRV-VB01', C.red, 2], ['09:20', 'SID 1000001', 'Suricata · 10.20.20.12', C.slate, 3]];
  let s = '<line x1="40" y1="120" x2="530" y2="120" stroke="#cbd5e1" stroke-width="4"/>';
  E.forEach((e, i) => { const x = 70 + i * 140; s += '<g class="pop" style="animation-delay:' + i * .4 + 's"><circle cx="' + x + '" cy="120" r="10" fill="' + e[3] + '"/>' + txt(x, 98, e[0], { s: 13, c: e[3], w: 900 }) + '<rect x="' + (x - 62) + '" y="140" width="124" height="54" rx="10" fill="#fff" stroke="' + e[3] + '"/>' + txt(x, 162, e[1], { s: 10 }) + txt(x, 180, e[2], { s: 8.5, w: 600, c: '#475569' }) + '</g>'; });
  s += '<path d="M60 70 Q200 30 360 70" stroke="#e11d48" fill="none" stroke-width="2" class="flow"/>' + txt(210, 40, 'cùng máy, cùng tài khoản → một chuỗi', { s: 9.5, c: '#e11d48' }) + txt(490, 225, 'khác nguồn → xác minh riêng', { s: 9.5, c: '#475569' });
  return svg(560, 240, s);
};
V.timelinedemo = V.correl;
V.containdemo = () => {
  const O = [['Ngắt mạng SRV-VB01', 'chặn ngay đánh cắp · dừng điều hành văn bản', C.red], ['Khoá TK nguyen.thu.ha + hotro.it2', 'ít ảnh hưởng · kẻ tấn công có thể còn phiên', C.orange], ['Chặn 198.51.100.23, 203.0.113.77', 'nhanh · dễ bị đổi địa chỉ', C.amber], ['Tiếp tục theo dõi', 'thêm bằng chứng · tiếp tục mất dữ liệu', C.slate]];
  let s = ''; O.forEach((o, i) => { s += '<g class="pop" style="animation-delay:' + i * .15 + 's"><rect x="10" y="' + (14 + i * 56) + '" width="540" height="46" rx="10" fill="#fff" stroke="' + o[2] + '" stroke-width="2"/><rect x="10" y="' + (14 + i * 56) + '" width="8" height="46" rx="4" fill="' + o[2] + '"/>' + txt(30, 34 + i * 56, o[0], { a: 'start', s: 11 }) + txt(30, 50 + i * 56, o[1], { a: 'start', s: 9.5, w: 600, c: '#475569' }) + '</g>'; });
  return svg(560, 240, s);
};

const API = {
  has: id => !!V[id],
  html: id => V[id] ? V[id]() : '',
  bind(root){
    root.querySelectorAll('.viz').forEach(vz => {
      const info = vz.querySelector('.vinfo');
      vz.addEventListener('click', e => { const g = e.target.closest('.vbtn'); if (!g || !info) return; vz.querySelectorAll('.vbtn.on').forEach(x => x.classList.remove('on')); g.classList.add('on'); info.textContent = g.dataset.info; info.classList.remove('hide'); window.APP && APP.SND.tap(); });
      vz.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.closest('.vbtn')) e.target.closest('.vbtn').dispatchEvent(new MouseEvent('click', { bubbles: true })); });
    });
  },
  /* dùng lại cho trò chơi */
  svg, txt, box, diagram, zone, C, esc
};
window.VIZ = API;
})();
