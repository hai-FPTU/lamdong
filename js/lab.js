/* =========================================================
   PHÒNG LAB: Bàn phân tích nhật ký + 6 bài lab + phiếu ghi nhận chấm tự động
   ========================================================= */
(function(){
const A = window.APP, st = A.st, $ = A.$, $$ = A.$$, esc = A.esc, I = window.ICON, P = window.PAGES;
const SRC = window.LABSRC || [];
const DESC = {
  'mail.log': 'Nhật ký máy chủ thư (postfix)', 'dns.log': 'Truy vấn DNS nội bộ', 'proxy.log': 'Truy cập web qua proxy', 'web_access.log': 'Truy cập cổng thông tin',
  'fw.log': 'Nhật ký tường lửa', 'fw_rules.csv': 'Bộ quy tắc tường lửa', 'ho_so_thay_doi.csv': 'Hồ sơ quản lý thay đổi', 'windows_security.ndjson': 'Sự kiện bảo mật Windows',
  'wazuh_alerts.ndjson': 'Cảnh báo Wazuh (có FIM)', 'suricata_eve.json': 'Cảnh báo Suricata EVE', 'netflow.csv': 'Luồng mạng (netflow)', 'kiem_ke_tai_san.csv': 'Danh mục tài sản',
  'nhan_su.csv': 'Danh sách nhân sự', 'nmap_192.168.56.20.txt': 'Kết quả Nmap (ghi sẵn)', 'http_mau.txt': 'Mẫu HTTP request/response', 'thu_gia_mao.eml': 'Thư giả mạo (.eml)', 'thu_hop_le.eml': 'Thư hợp lệ (.eml)', 'thu_huan_luyen.csv': 'Thư giả lập đã gán nhãn – huấn luyện (Lab AI)', 'thu_kiem_tra.csv': 'Thư giả lập – kiểm tra mô hình (Lab AI)', 'thu_ne_tranh.csv': 'Thư lừa đảo kiểu mới – thử né tránh (Lab AI)'
};

/* ================= ĐỌC VÀ TÁCH TRƯỜNG ================= */
const MON = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 };
function flat(o, p, out){ out = out || {}; for (const k in o) { const v = o[k], key = p ? p + '.' + k : k; if (v && typeof v === 'object' && !Array.isArray(v)) flat(v, key, out); else out[key] = v; } return out; }
function csvSplit(l){ const r = []; let cur = '', q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (c === '"') { q = !q; continue; } if (c === ',' && !q) { r.push(cur); cur = ''; } else cur += c; } r.push(cur); return r; }
function kv(s, out){ const re = /([\w.]+)=("([^"]*)"|<([^>]*)>|\[([^\]]*)\]|(\S+))/g; let m; while ((m = re.exec(s))) out[m[1]] = m[3] != null ? m[3] : m[4] != null ? m[4] : m[5] != null ? m[5] : m[6]; return out; }
function parse(name, text){
  const lines = text.split('\n').filter(x => x.length); const rows = []; let cols = [];
  if (/\.(ndjson|json)$/.test(name)) { lines.forEach(l => { try { const o = flat(JSON.parse(l)); o._raw = l; o._t = Date.parse(o.TimeCreated || o.timestamp); rows.push(o); } catch(e) {} }); }
  else if (/\.csv$/.test(name)) { const h = csvSplit(lines[0]); cols = h; lines.slice(1).forEach(l => { const v = csvSplit(l), o = { _raw: l }; h.forEach((k, i) => o[k] = v[i]); o._t = o.bat_dau ? Date.parse(o.bat_dau) : NaN; rows.push(o); }); }
  else if (name === 'web_access.log') { const re = /^(\S+) - - \[(\d+)\/(\w+)\/(\d+):(\d+):(\d+):(\d+) [^\]]+\] "(\S+) (\S+) [^"]*" (\d+) (\d+) "[^"]*" "([^"]*)"/; lines.forEach(l => { const m = re.exec(l); if (!m) return; rows.push({ _raw: l, _t: new Date(Date.UTC(+m[4], MON[m[3]], +m[2], +m[5] - 7, +m[6], +m[7])).getTime(), ip: m[1], method: m[8], path: m[9], status: m[10], size: m[11], ua: m[12] }); }); cols = ['ip', 'method', 'path', 'status', 'size', 'ua']; }
  else if (name === 'fw.log') { lines.forEach(l => { const o = kv(l, { _raw: l }); o._t = Date.parse(l.split(' ')[0]); rows.push(o); }); cols = ['rule', 'act', 'if', 'proto', 'src', 'sport', 'dst', 'dport']; }
  else if (name === 'mail.log') { lines.forEach(l => { const m = /^(\w+)\s+(\d+) (\d+):(\d+):(\d+)/.exec(l); const o = kv(l, { _raw: l }); if (m) o._t = new Date(Date.UTC(2026, MON[m[1]], +m[2], +m[3] - 7, +m[4], +m[5])).getTime(); rows.push(o); }); cols = ['client', 'from', 'to', 'spf', 'dkim', 'subject', 'att']; }
  else if (name === 'dns.log') { lines.forEach(l => { const p = l.split(' '); rows.push({ _raw: l, _t: Date.parse(p[0]), client: (p[2] || '').split('#')[0], query: p[4] }); }); cols = ['client', 'query']; }
  else if (name === 'proxy.log') { lines.forEach(l => { const p = l.split(' '); rows.push({ _raw: l, _t: Date.parse(p[0]), ip: p[1], user: p[2], method: p[3], url: p[4], status: p[5], size: p[6] }); }); cols = ['ip', 'user', 'method', 'url', 'status', 'size']; }
  else { lines.forEach(l => rows.push({ _raw: l, _t: NaN })); }
  if (!cols.length) { const seen = {}; rows.slice(0, 300).forEach(r => Object.keys(r).forEach(k => { if (k[0] !== '_') seen[k] = 1; })); cols = Object.keys(seen); }
  return { rows, cols, raw: text };
}
const CACHE = {};
async function getSrc(name){
  if (CACHE[name]) return CACHE[name];
  await A.loadScript('lab/data/' + name + '.js');
  return (CACHE[name] = parse(name, window.LABDATA[name]));
}
const pad = n => String(n).padStart(2, '0');
function fmtT(ms, b){ if (isNaN(ms)) return ''; const d = new Date(ms + 7 * 3600e3); const s = d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()); if (b === 'day') return s; if (b === 'hour') return s + ' ' + pad(d.getUTCHours()) + 'h'; return s + ' ' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + (b === 'minute' ? '' : ':' + pad(d.getUTCSeconds())); }
const BMS = { minute: 60e3, hour: 3600e3, day: 86400e3 };
function bucket(ms, b){ return Math.floor((ms + 7 * 3600e3) / BMS[b]) * BMS[b] - 7 * 3600e3; }
function human(n){ n = +n; if (n > 1048576 * 1024) return (n / 1073741824).toFixed(2) + ' GB'; if (n > 1048576) return Math.round(n / 1048576).toLocaleString('vi-VN') + ' MB'; return n.toLocaleString('vi-VN'); }

/* ================= BÀN PHÂN TÍCH ================= */
function Console(host, preset){
  const S = Object.assign({ src: 'windows_security.ndjson', q: '', f: [], view: 'table', g: '', b: 'hour', sf: '' }, preset || {});
  S.f = (S.f || []).map(x => x.slice());
  const fieldsOf = d => d.cols.concat(isNaN(d.rows[0] && d.rows[0]._t) ? [] : []);
  host.innerHTML = '<div class="console"><div class="con-top"><span class="lbl">Nguồn</span><select data-k="src">' + SRC.map(s => '<option value="' + s[0] + '"' + (s[0] === S.src ? ' selected' : '') + '>' + s[0] + ' · ' + (DESC[s[0]] || '') + ' (' + s[1].toLocaleString('vi-VN') + ' dòng)</option>').join('') + '</select><input data-k="q" placeholder="Tìm chuỗi bất kỳ trong dòng…" value="' + esc(S.q) + '"><button class="btn small orange" data-a="run">' + I('search') + ' Lọc</button></div>' +
    '<div class="con-filters" data-r="filters"></div><div class="con-tabs" data-r="tabs"></div><div class="con-body" data-r="body"><p class="muted">Đang tải dữ liệu…</p></div><div data-r="cmd" style="padding:0 12px 12px"></div></div>';
  const $h = s => host.querySelector(s);
  let D = null, M = [];
  const TABS = [['table', 'Bảng'], ['group', 'Đếm theo trường'], ['time', 'Theo thời gian'], ['window', 'Đếm theo cửa sổ thời gian'], ['sum', 'Tổng theo trường'], ['raw', 'Tệp gốc']];
  function match(r){
    if (S.q && r._raw.toLowerCase().indexOf(S.q.toLowerCase()) < 0) return false;
    for (const f of S.f) { const v = r[f[0]] == null ? '' : String(r[f[0]]); if (f[1] === '=' && v !== f[2]) return false; if (f[1] === '!=' && v === f[2]) return false; if (f[1] === '~' && v.indexOf(f[2]) < 0) return false; if (f[1] === '!~' && v.indexOf(f[2]) >= 0) return false; }
    return true;
  }
  function fsel(k, val, list){ return '<select data-k="' + k + '">' + list.map(c => '<option' + (c === val ? ' selected' : '') + '>' + esc(c) + '</option>').join('') + '</select>'; }
  function cmdText(){
    if (preset && preset.cmd && S.src === preset.src) return preset.cmd;
    let c = 'cd ~/lab/dulieu\ncat ' + S.src; if (S.q) c += ' | grep -i ' + JSON.stringify(S.q);
    S.f.forEach(f => { c += ' | grep ' + (f[1][0] === '!' ? '-v ' : '') + JSON.stringify(/\.(ndjson|json)$/.test(S.src) ? '"' + f[0].split('.').pop() + '": ' + (/^\d+$/.test(f[2]) ? f[2] : '"' + f[2] + '"') : f[2]); });
    return c + ' | head';
  }
  function draw(){
    if (!D) return;
    M = D.rows.filter(match);
    $h('[data-r=filters]').innerHTML = (S.f.length || S.q ? '' : '<span class="small muted">Chưa có bộ lọc. Bấm vào một ô trong bảng để lọc theo giá trị đó.</span>') + (S.q ? '<span class="fchip">chứa “' + esc(S.q) + '” <button data-rmq="1" aria-label="Bỏ">✕</button></span>' : '') + S.f.map((f, i) => '<span class="fchip' + (f[1][0] === '!' ? ' neg' : '') + '">' + esc(f[0]) + ' ' + ({ '=': '=', '!=': '≠', '~': 'chứa', '!~': 'không chứa' })[f[1]] + ' ' + esc(f[2]) + ' <button data-rmf="' + i + '" aria-label="Bỏ">✕</button></span>').join('') + (S.f.length || S.q ? '<button class="btn small ghost" data-a="clear">Xoá lọc</button>' : '');
    $h('[data-r=tabs]').innerHTML = TABS.map(t => '<button class="' + (t[0] === S.view ? 'on' : '') + '" data-v="' + t[0] + '">' + t[1] + '</button>').join('');
    const cols = D.cols; if (!S.g || cols.indexOf(S.g) < 0) S.g = cols[0] || '';
    const numCols = cols.filter(c => D.rows.slice(0, 50).every(r => r[c] == null || r[c] === '' || !isNaN(+r[c])));
    let h = '<div class="con-stat"><span><b>' + M.length.toLocaleString('vi-VN') + '</b> / ' + D.rows.length.toLocaleString('vi-VN') + ' dòng khớp</span>' + (M.length && !isNaN(M[0]._t) ? '<span>từ <b>' + fmtT(Math.min.apply(null, M.map(r => r._t))) + '</b> đến <b>' + fmtT(Math.max.apply(null, M.map(r => r._t))) + '</b></span>' : '') + '</div>';
    if (S.view === 'table') {
      const show = M.slice(0, 200), cs = cols.slice(0, 9);
      if (!cols.length) h += '<pre class="demo-box">' + esc(show.map(r => r._raw).join('\n')) + '</pre>';
      else h += '<div class="tbl-wrap"><table class="tbl logtbl"><thead><tr>' + (isNaN(show[0] && show[0]._t) ? '' : '<th>Thời gian (+07)</th>') + cs.map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + show.map(r => '<tr>' + (isNaN(r._t) ? '' : '<td>' + fmtT(r._t) + '</td>') + cs.map(c => '<td data-c="' + esc(c) + '" title="Bấm để lọc">' + esc(r[c] == null ? '' : String(r[c]).slice(0, 80)) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>' + (M.length > 200 ? '<p class="small muted">Hiển thị 200 dòng đầu. Thêm bộ lọc hoặc chuyển sang “Đếm theo trường”.</p>' : '');
    } else if (S.view === 'group' || S.view === 'sum') {
      const sf = S.sf && numCols.indexOf(S.sf) >= 0 ? S.sf : numCols[numCols.length - 1];
      const cnt = {}; M.forEach(r => { const k = r[S.g] == null ? '(trống)' : String(r[S.g]); cnt[k] = (cnt[k] || 0) + (S.view === 'sum' ? (+r[sf] || 0) : 1); });
      const arr = Object.entries(cnt).sort((a, b) => b[1] - a[1]), top = arr.slice(0, 40), mx = top.length ? top[0][1] : 1;
      h += '<div class="row mb"><span class="small"><b>' + (S.view === 'sum' ? 'Cộng trường' : 'Đếm theo') + '</b></span>' + (S.view === 'sum' ? fsel('sf', sf, numCols) + '<span class="small"><b>nhóm theo</b></span>' : '') + fsel('g', S.g, cols) + '<span class="small muted">' + arr.length + ' giá trị khác nhau</span></div>';
      h += '<div class="bars">' + top.map(([k, n]) => '<div class="bar"><span class="bk" data-gk="' + esc(k) + '" title="Lọc theo giá trị này">' + esc(k) + '</span><span><i class="bv" style="display:block;width:' + Math.max(.5, n / mx * 100) + '%"></i></span><span class="bn">' + (S.view === 'sum' ? human(n) : n.toLocaleString('vi-VN')) + '</span></div>').join('') + '</div>';
    } else if (S.view === 'time' || S.view === 'window') {
      const ts = M.map(r => r._t).filter(x => !isNaN(x));
      if (!ts.length) h += '<p class="muted">Nguồn này không có trường thời gian.</p>';
      else {
        let b = S.b; const span = Math.max.apply(null, ts) - Math.min.apply(null, ts);
        if (S.view === 'time' && span / BMS[b] > 1500) { b = span / BMS.hour > 1500 ? 'day' : 'hour'; h += '<div class="note info">' + I('alert') + '<div>Khoảng thời gian quá dài để vẽ theo ' + (S.b === 'minute' ? 'phút' : 'giờ') + ' – đang hiển thị theo ' + (b === 'hour' ? 'giờ' : 'ngày') + '. Thêm bộ lọc để thu hẹp.</div></div>'; }
        h += '<div class="row mb"><span class="small"><b>Cửa sổ</b></span>' + '<select data-k="b">' + [['minute', 'phút'], ['hour', 'giờ'], ['day', 'ngày']].map(x => '<option value="' + x[0] + '"' + (x[0] === S.b ? ' selected' : '') + '>' + x[1] + '</option>').join('') + '</select>' + (S.view === 'window' ? '<span class="small"><b>theo trường</b></span>' + fsel('g', S.g, cols) : '') + '</div>';
        if (S.view === 'time') {
          const t0 = bucket(Math.min.apply(null, ts), b), t1 = bucket(Math.max.apply(null, ts), b), n = Math.round((t1 - t0) / BMS[b]) + 1, arr = new Array(n).fill(0);
          ts.forEach(t => arr[Math.round((bucket(t, b) - t0) / BMS[b])]++); const mx = Math.max.apply(null, arr);
          h += '<div class="hist">' + arr.map((c, i) => '<i style="height:' + (c / mx * 100) + '%" title="' + fmtT(t0 + i * BMS[b], b) + ': ' + c + '"></i>').join('') + '</div><div class="hist-ax"><span>' + fmtT(t0, b) + '</span><span>đỉnh: ' + mx + ' dòng/' + ({ minute: 'phút', hour: 'giờ', day: 'ngày' })[b] + '</span><span>' + fmtT(t1, b) + '</span></div>';
        } else {
          const cnt = {}; M.forEach(r => { if (isNaN(r._t)) return; const k = fmtT(bucket(r._t, b), b) + '  ·  ' + (r[S.g] == null ? '' : r[S.g]); cnt[k] = (cnt[k] || 0) + 1; });
          const top = Object.entries(cnt).sort((a, c) => c[1] - a[1]).slice(0, 25), mx = top.length ? top[0][1] : 1;
          h += '<div class="bars">' + top.map(([k, n]) => '<div class="bar"><span class="bk">' + esc(k) + '</span><span><i class="bv" style="display:block;width:' + Math.max(.5, n / mx * 100) + '%"></i></span><span class="bn">' + n + '</span></div>').join('') + '</div><p class="small muted mt">Mỗi dòng = một ' + ({ minute: 'phút', hour: 'giờ', day: 'ngày' })[b] + ' × một giá trị của trường “' + esc(S.g) + '”. Đây là cách phát hiện dò mật khẩu thay vì đếm tổng.</p>';
        }
      }
    } else if (S.view === 'raw') {
      const lines = D.raw.split('\n'); h += '<pre class="demo-box" style="white-space:pre-wrap;max-height:480px">' + esc(lines.slice(0, 400).join('\n')) + (lines.length > 400 ? '\n… (' + lines.length + ' dòng)' : '') + '</pre>';
    }
    $h('[data-r=body]').innerHTML = h;
    $h('[data-r=cmd]').innerHTML = '<div class="cmdline"><button class="cp" data-a="copy">' + 'Sao chép</button>' + esc(cmdText()) + '</div>';
  }
  async function load(){ $h('[data-r=body]').innerHTML = '<p class="muted">Đang tải ' + esc(S.src) + '…</p>'; try { D = await getSrc(S.src); } catch(e) { $h('[data-r=body]').innerHTML = '<div class="note warn">' + I('alert') + '<div>Không tải được tệp dữ liệu ' + esc(S.src) + '. Kiểm tra thư mục lab/data/.</div></div>'; return; } draw(); }
  host.addEventListener('change', e => { const k = e.target.dataset.k; if (!k) return; if (k === 'src') { S.src = e.target.value; S.f = []; S.q = ''; host.querySelector('[data-k=q]').value = ''; S.g = ''; load(); return; } S[k] = e.target.value; if (k !== 'q') draw(); });
  host.addEventListener('keydown', e => { if (e.target.dataset.k === 'q' && e.key === 'Enter') { S.q = e.target.value.trim(); draw(); } });
  host.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('[data-a=run]')) { S.q = host.querySelector('[data-k=q]').value.trim(); draw(); return; }
    if (t.closest('[data-a=clear]')) { S.f = []; S.q = ''; host.querySelector('[data-k=q]').value = ''; draw(); return; }
    if (t.closest('[data-a=copy]')) { try { navigator.clipboard.writeText(cmdText()); A.toast('Đã sao chép lệnh'); } catch(err) {} return; }
    const v = t.closest('[data-v]'); if (v) { S.view = v.dataset.v; A.SND.tap(); draw(); return; }
    const rf = t.closest('[data-rmf]'); if (rf) { S.f.splice(+rf.dataset.rmf, 1); draw(); return; }
    if (t.closest('[data-rmq]')) { S.q = ''; host.querySelector('[data-k=q]').value = ''; draw(); return; }
    const gk = t.closest('[data-gk]'); if (gk) { S.f.push([S.g, '=', gk.dataset.gk]); S.view = 'table'; A.SND.tap(); draw(); return; }
    const td = t.closest('td[data-c]'); if (td) {
      const c = td.dataset.c, row = td.parentNode.rowIndex - 1, val = M[row] && M[row][c] != null ? String(M[row][c]) : '';
      const old = host.querySelector('.cmenu'); if (old) old.remove();
      const m = document.createElement('div'); m.className = 'cmenu card'; m.style.cssText = 'position:fixed;z-index:80;padding:6px;display:grid;gap:4px;min-width:220px';
      const r = td.getBoundingClientRect(); m.style.left = Math.min(r.left, innerWidth - 240) + 'px'; m.style.top = Math.min(r.bottom + 4, innerHeight - 160) + 'px';
      m.innerHTML = '<div class="small muted" style="padding:2px 6px">' + esc(c) + ' = <b>' + esc(val.slice(0, 40)) + '</b></div><button class="btn small ghost" data-m="=">Chỉ giữ giá trị này</button><button class="btn small ghost" data-m="!=">Loại bỏ giá trị này</button><button class="btn small ghost" data-m="g">Đếm theo trường “' + esc(c) + '”</button>';
      document.body.appendChild(m);
      const close = () => { m.remove(); document.removeEventListener('click', away, true); };
      const away = ev => { if (!m.contains(ev.target)) close(); };
      setTimeout(() => document.addEventListener('click', away, true), 0);
      m.onclick = ev => { const b = ev.target.closest('[data-m]'); if (!b) return; if (b.dataset.m === 'g') { S.g = c; S.view = 'group'; } else S.f.push([c, b.dataset.m, val]); close(); A.SND.tap(); draw(); };
    }
  });
  load();
  return { set(p){ Object.assign(S, { q: '', f: [], view: 'table', g: '', b: 'hour', sf: '' }, p); S.f = (p.f || []).map(x => x.slice()); host.querySelector('[data-k=src]').value = S.src; host.querySelector('[data-k=q]').value = S.q || ''; preset = p; load(); } };
}
window.LabConsole = Console;

/* ================= LƯU BÀI LÀM ================= */
function rec(id){ st.labAns[id] = st.labAns[id] || { grp: st.grp || '', mem: '', a: {}, f: {}, tool: {}, ok: {} }; return st.labAns[id]; }
const grpOpts = v => '<option value="">– chọn nhóm –</option>' + Array.from({ length: 10 }, (_, i) => 'G' + pad(i + 1)).map(g => '<option' + (g === v ? ' selected' : '') + '>' + g + '</option>').join('');
function score(L){ const R = rec(L.id); return L.qs.filter(q => R.ok[q.id]).length; }

/* ================= CÔNG CỤ RIÊNG TỪNG LAB ================= */
const TOOLS = window.LAB_TOOLS = {};
/* --- Sổ đăng ký rủi ro --- */
TOOLS.riskreg = (box, L, R) => {
  R.tool.assets = R.tool.assets || [['A-01', 'SRV-VB01 – hệ thống văn bản', 'Máy chủ / ứng dụng', 'Vùng máy chủ 10.20.1.21', 'Chánh Văn phòng', 'C: Cao · I: Cao · A: Cao', 'AD, SRV-FILE01, SRV-BK01', 'Có – SRV-BK01 hằng đêm', '']];
  const AH = ['Mã', 'Tài sản', 'Loại', 'Vị trí / vùng', 'Chủ sở hữu', 'Mức C – I – A', 'Phụ thuộc', 'Sao lưu', 'Phát hiện / ghi chú'];
  R.tool.rows = R.tool.rows || [['R01', 'Hộp thư công vụ', 'Nhóm lừa đảo qua thư', 'Chưa bật MFA', 'Lộ văn bản đến (C)', 4, 4, '7/30 hộp thư nhận thư giả trong tuần', 'Bật MFA, đổi mật khẩu', 'Phòng CNTT', 'Ảnh cấu hình MFA + thử đăng nhập']];
  const H = ['ID', 'Tài sản', 'Nguồn đe dọa', 'Điểm yếu / điều kiện', 'Hậu quả (C/I/A)', 'L', 'I', 'Luận cứ L, I', 'Biện pháp xử lý', 'Người xử lý', 'Cách kiểm chứng'];
  function draw(){
    const rows = R.tool.rows;
    const as = R.tool.assets;
    let h = '<h3>Ranh giới hệ thống</h3><textarea data-bd="1" rows="3" style="width:100%;border:1.5px solid var(--line);border-radius:10px;padding:8px;font:inherit" placeholder="Trong ranh giới gồm… · Kết nối ra ngoài (Internet, nhà thầu, mạng chuyên dùng)… · Dịch vụ phụ thuộc…">' + esc(R.tool.bd || '') + '</textarea>' +
      '<h3 class="mt">Danh mục tài sản (PL-01)</h3><p class="small muted">Tối thiểu 6 tài sản, mỗi tài sản có chủ sở hữu.</p><div class="tbl-wrap"><table class="tbl"><thead><tr>' + AH.map(x => '<th>' + x + '</th>').join('') + '<th></th></tr></thead><tbody>' +
      as.map((r, i) => '<tr>' + r.map((c, j) => '<td style="min-width:' + (j === 0 ? 70 : 120) + 'px"><textarea data-ar="' + i + '" data-c="' + j + '">' + esc(c) + '</textarea></td>').join('') + '<td><button class="iconbtn" data-adel="' + i + '" title="Xoá">' + I('trash') + '</button></td></tr>').join('') + '</tbody></table></div>' +
      '<div class="row mt"><button class="btn small ghost" data-aadd="1">' + I('plus') + ' Thêm tài sản</button><button class="btn small" data-aval="1">' + I('check') + ' Kiểm tra danh mục</button></div><div data-aout></div>' +
      '<h3 class="mt">Sổ đăng ký rủi ro (PL-02)</h3><p class="small muted">Quy ước bài học R = L × I. Tối thiểu 4 kịch bản đủ thành phần.</p><div class="tbl-wrap"><table class="tbl"><thead><tr>' + H.map(x => '<th>' + x + '</th>').join('') + '<th>R</th><th></th></tr></thead><tbody>' +
      rows.map((r, i) => '<tr>' + r.map((c, j) => '<td style="min-width:' + (j === 0 ? 70 : j === 5 || j === 6 ? 70 : 130) + 'px">' + (j === 5 || j === 6 ? '<select data-r="' + i + '" data-c="' + j + '" style="min-width:58px;padding:6px 4px;font:inherit">' + [1, 2, 3, 4, 5].map(n => '<option' + (+c === n ? ' selected' : '') + '>' + n + '</option>').join('') + '</select>' : '<textarea data-r="' + i + '" data-c="' + j + '">' + esc(c) + '</textarea>') + '</td>').join('') + '<td class="num"><b>' + r[5] * r[6] + '</b></td><td><button class="iconbtn" data-del="' + i + '" title="Xoá">' + I('trash') + '</button></td></tr>').join('') + '</tbody></table></div>' +
      '<div class="row mt"><button class="btn small ghost" data-add="1">' + I('plus') + ' Thêm kịch bản</button><button class="btn small" data-val="1">' + I('check') + ' Kiểm tra đủ thành phần</button></div><div data-out></div>';
    box.innerHTML = h;
  }
  draw();
  box.addEventListener('input', e => { const t = e.target; if (t.dataset.bd) { R.tool.bd = t.value; A.save(); return; } if (t.dataset.ar != null) { R.tool.assets[+t.dataset.ar][+t.dataset.c] = t.value; A.save(); return; } if (t.dataset.r == null) return; R.tool.rows[+t.dataset.r][+t.dataset.c] = t.tagName === 'SELECT' ? +t.value : t.value; A.save(); if (t.tagName === 'SELECT') draw(); });
  box.addEventListener('click', e => {
    if (e.target.closest('[data-aadd]')) { R.tool.assets.push(['A-' + pad(R.tool.assets.length + 1), '', '', '', '', '', '', '', '']); A.save(); draw(); return; }
    const ad = e.target.closest('[data-adel]'); if (ad) { R.tool.assets.splice(+ad.dataset.adel, 1); A.save(); draw(); return; }
    if (e.target.closest('[data-aval]')) { const as = R.tool.assets, noOwn = as.filter(r => !String(r[1]).trim() || !String(r[4]).trim()), ok = as.length >= 6 && !noOwn.length;
      $('[data-aout]', box).innerHTML = '<div class="fb ' + (ok ? 'ok' : 'mid') + ' mt">' + I(ok ? 'check' : 'alert') + '<div>' + as.length + ' tài sản' + (as.length < 6 ? ' – cần tối thiểu 6.' : '.') + (noOwn.length ? ' ' + noOwn.length + ' dòng thiếu tên hoặc chủ sở hữu (' + noOwn.map(r => r[0]).join(', ') + ').' : ' Tất cả có chủ sở hữu.') + (R.tool.bd ? '' : ' Chưa ghi ranh giới hệ thống.') + '</div></div>'; return; }
    if (e.target.closest('[data-add]')) { R.tool.rows.push(['R' + pad(R.tool.rows.length + 1), '', '', '', '', 3, 3, '', '', '', '']); A.save(); draw(); }
    const d = e.target.closest('[data-del]'); if (d) { R.tool.rows.splice(+d.dataset.del, 1); A.save(); draw(); }
    if (e.target.closest('[data-val]')) { const rows = R.tool.rows; const bad = rows.filter(r => [1, 2, 3, 4, 7, 9, 10].some(j => !String(r[j]).trim())); const out = $('[data-out]', box);
      out.innerHTML = '<div class="fb ' + (rows.length >= 4 && !bad.length ? 'ok' : 'mid') + ' mt">' + I(rows.length >= 4 && !bad.length ? 'check' : 'alert') + '<div>' + rows.length + ' kịch bản; ' + (bad.length ? bad.length + ' kịch bản còn thiếu thành phần (' + bad.map(r => r[0]).join(', ') + ').' : 'tất cả đủ thành phần.') + (rows.length < 4 ? ' Cần tối thiểu 4 kịch bản.' : '') + '</div></div>'; }
  });
};
/* --- Ma trận tuân thủ --- */
TOOLS.compliance = (box, L, R) => {
  R.tool.ev = R.tool.ev || {};
  const ST = ['', 'Đủ', 'Thiếu', 'Cần xác minh'];
  box.innerHTML = '<h3>Hồ sơ hệ thống SRV-VB01 – ma trận căn cứ, nghĩa vụ, bằng chứng (PL-03)</h3><p class="small muted">Với mỗi tài liệu: chọn trạng thái, ghi căn cứ đã tra, nghĩa vụ, người phụ trách, hạn kiểm tra lại.</p><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tài liệu trong hồ sơ</th><th style="min-width:130px">Trạng thái</th><th>Căn cứ đã tra (số hiệu, Điều)</th><th>Nghĩa vụ cần kiểm chứng</th><th>Người phụ trách / hạn</th><th></th></tr></thead><tbody>' +
    window.LAB_EVID.map(ev => { const v = R.tool.ev[ev.id] || {}; return '<tr data-e="' + ev.id + '"><td><b>' + ev.id + '. ' + esc(ev.t) + '</b><br><span class="small muted">' + esc(ev.d) + '</span></td><td><select data-k="s">' + ST.map(s => '<option' + (s === v.s ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></td><td><textarea data-k="c">' + esc(v.c || '') + '</textarea></td><td><textarea data-k="n">' + esc(v.n || '') + '</textarea></td><td><textarea data-k="p">' + esc(v.p || '') + '</textarea></td><td data-res></td></tr>'; }).join('') + '</tbody></table></div><div class="row mt"><button class="btn small" data-chk="1">' + I('check') + ' Chấm trạng thái</button></div><div data-out></div>';
  box.addEventListener('input', e => { const tr = e.target.closest('tr[data-e]'); if (!tr) return; const id = tr.dataset.e; R.tool.ev[id] = R.tool.ev[id] || {}; R.tool.ev[id][e.target.dataset.k] = e.target.value; A.save(); });
  box.addEventListener('click', e => { if (!e.target.closest('[data-chk]')) return; let ok = 0;
    window.LAB_EVID.forEach(ev => { const v = (R.tool.ev[ev.id] || {}).s; const good = !!v && A.check('E|' + ev.id, v, [ev.k]); if (good) ok++; $('tr[data-e="' + ev.id + '"] [data-res]', box).innerHTML = v ? '<span class="badge ' + (good ? 'b-ok' : 'b-end') + '">' + (good ? 'Đúng' : 'Xem lại') + '</span>' : ''; });
    $('[data-out]', box).innerHTML = '<div class="fb ' + (ok >= 8 ? 'ok' : 'mid') + ' mt">' + I('scale') + '<div><b>' + ok + '/10 trạng thái hợp lý.</b> Nhớ: thiếu căn cứ đã tra thì trạng thái là “Cần xác minh”; không kết luận “Đủ” khi chưa có bằng chứng.</div></div>'; if (ok >= 8) { A.SND.win(); A.addXP(20, 'Ma trận tuân thủ'); } else A.SND.no(); });
};
/* --- Hồ sơ cấp độ --- */
TOOLS.dossier = (box, L, R) => {
  const T = R.tool; T.hs = T.hs || {}; T.comp = T.comp || {}; T.cia = T.cia || {}; T.ctl = T.ctl || [['Xác thực', 'AD + MFA cho quản trị', '', 'Thiếu'], ['Phân quyền', 'RBAC theo vai trò', 'Bảng phân quyền 15/09', 'Thiếu'], ['Nhật ký', 'Wazuh thu log', 'Ảnh dashboard, cấu hình agent', 'Đủ'], ['Sao lưu', 'Sao lưu hằng đêm', 'Nhật ký job; chưa thử khôi phục', 'Thiếu'], ['Nhà thầu', 'VPN theo hợp đồng', 'Hợp đồng hết hạn 30/06/2026', 'Thiếu']];
  const COMP = [['rp', 'Reverse proxy'], ['web', 'Máy chủ web'], ['api', 'API'], ['db', 'Cơ sở dữ liệu'], ['file', 'Tệp đính kèm (SRV-FILE01)'], ['ad', 'Xác thực AD (dùng chung)'], ['bk', 'Sao lưu (SRV-BK01)'], ['mail', 'Thư điện tử (SRV-MAIL01)'], ['vpn', 'VPN nhà thầu']];
  const HS = [['HS-01', 'Tổng quan và ranh giới', 'Mục tiêu, chủ quản, đơn vị vận hành, người dùng, loại dữ liệu'], ['HS-02', 'Kiến trúc / thiết kế as-is', 'Sơ đồ, vùng tin cậy, inventory'], ['HS-03', 'Thuyết minh cấp độ', 'Kịch bản tác động và căn cứ đối chiếu'], ['HS-04', 'Phương án bảo đảm an ninh mạng', 'Kiểm soát quản lý + kỹ thuật + bằng chứng'], ['HS-05', 'Quy trình log, sao lưu, ứng cứu', 'SOP, RPO/RTO, đầu mối, log'], ['HS-06', 'Biên bản rà soát và tồn tại', 'Người rà soát và hạng mục bổ sung']];
  function wiz(){ const a = T.wz || {}; if (!a.t || !a.d || !a.m) return '<span class="muted small">Trả lời đủ 3 câu để xem gợi ý.</span>';
    let lv = a.t === 'cc' ? 1 : a.t === 'cn' ? 2 : 3; if (a.d === 'dan') lv = Math.max(lv, 3); if (a.d === 'qg') lv = Math.max(lv, 4); if (a.m === 'ng') lv = Math.max(lv, 4); if (a.m === 'dbng') lv = 5;
    return '<div class="note law">' + I('scale') + '<div><b>Gợi ý tham chiếu: cấp độ ' + lv + '.</b> Căn cứ đối chiếu: Điều ' + (10 + lv) + ' Nghị định 331/2026/NĐ-CP (đọc nguyên văn). Đây là gợi ý để lập luận, không phải kết luận pháp lý; ghi rõ khoản, điểm đã đối chiếu vào HS-03.</div></div>'; }
  function draw(){
    box.innerHTML = '<h3>Bộ hồ sơ minh hoạ HS-01…HS-06</h3>' +
      '<div class="grid g2 mt"><div class="card"><h4>Ranh giới hệ thống</h4><p class="small muted">Đánh dấu THUỘC hệ thống hay PHỤ THUỘC dùng chung.</p>' + COMP.map(c => '<div class="row" style="justify-content:space-between;border-top:1px solid var(--line);padding:6px 0"><span>' + c[1] + '</span><select data-comp="' + c[0] + '"><option value="">–</option><option value="in"' + (T.comp[c[0]] === 'in' ? ' selected' : '') + '>Thuộc hệ thống</option><option value="dep"' + (T.comp[c[0]] === 'dep' ? ' selected' : '') + '>Phụ thuộc</option><option value="out"' + (T.comp[c[0]] === 'out' ? ' selected' : '') + '>Ngoài phạm vi</option></select></div>').join('') + '</div>' +
      '<div class="card"><h4>Trình hỗ trợ lập luận cấp độ</h4>' +
      '<div class="field"><label>1. Loại thông tin xử lý</label><select data-wz="t"><option value="">–</option><option value="cc"' + ((T.wz || {}).t === 'cc' ? ' selected' : '') + '>Chỉ thông tin công cộng</option><option value="cn"' + ((T.wz || {}).t === 'cn' ? ' selected' : '') + '>Thông tin riêng, cá nhân; không bí mật nhà nước</option><option value="bm"' + ((T.wz || {}).t === 'bm' ? ' selected' : '') + '>Có bí mật nhà nước</option></select></div>' +
      '<div class="field"><label>2. Đối tượng phục vụ</label><select data-wz="d"><option value="">–</option><option value="nb"' + ((T.wz || {}).d === 'nb' ? ' selected' : '') + '>Nội bộ một cơ quan</option><option value="dan"' + ((T.wz || {}).d === 'dan' ? ' selected' : '') + '>Người dân, doanh nghiệp / dùng chung cấp tỉnh</option><option value="qg"' + ((T.wz || {}).d === 'qg' ? ' selected' : '') + '>Toàn quốc, 24/7</option></select></div>' +
      '<div class="field"><label>3. Mức tổn hại nếu bị phá hoại</label><select data-wz="m"><option value="">–</option><option value="tc"' + ((T.wz || {}).m === 'tc' ? ' selected' : '') + '>Ảnh hưởng hoạt động cơ quan</option><option value="ng"' + ((T.wz || {}).m === 'ng' ? ' selected' : '') + '>Tổn hại nghiêm trọng an ninh quốc gia</option><option value="dbng"' + ((T.wz || {}).m === 'dbng' ? ' selected' : '') + '>Tổn hại đặc biệt nghiêm trọng</option></select></div><div data-wzout>' + wiz() + '</div></div></div>' +
      '<div class="card mt"><h4>Tác động khi mất C – I – A (mô tả bằng hậu quả nghiệp vụ)</h4><div class="grid g3">' + [['c', 'Bị LỘ (C)'], ['i', 'Bị SỬA (I)'], ['a', 'Bị GIÁN ĐOẠN (A)']].map(x => '<div class="field"><label>' + x[1] + '</label><textarea data-cia="' + x[0] + '" rows="3" style="border:1.5px solid var(--line);border-radius:10px;padding:8px;font:inherit">' + esc(T.cia[x[0]] || '') + '</textarea></div>').join('') + '</div></div>' +
      '<div class="card mt"><h4>Ma trận yêu cầu – biện pháp – bằng chứng (HS-04)</h4><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Yêu cầu</th><th>Biện pháp</th><th>Bằng chứng</th><th>Trạng thái</th><th></th></tr></thead><tbody>' + T.ctl.map((r, i) => '<tr>' + r.map((c, j) => '<td>' + (j === 3 ? '<select data-ct="' + i + '" data-j="3">' + ['Đủ', 'Thiếu', 'Cần xác minh'].map(s => '<option' + (s === c ? ' selected' : '') + '>' + s + '</option>').join('') + '</select>' : '<textarea data-ct="' + i + '" data-j="' + j + '">' + esc(c) + '</textarea>') + '</td>').join('') + '<td><button class="iconbtn" data-ctdel="' + i + '">' + I('trash') + '</button></td></tr>').join('') + '</tbody></table></div><button class="btn small ghost mt" data-ctadd="1">' + I('plus') + ' Thêm dòng</button></div>' +
      '<div class="card mt"><h4>Nội dung từng thành phần hồ sơ</h4>' + HS.map(h => '<div class="field"><label>' + h[0] + '. ' + h[1] + ' <span class="small muted">– ' + h[2] + '</span></label><textarea data-hs="' + h[0] + '" rows="3" style="border:1.5px solid var(--line);border-radius:10px;padding:8px;font:inherit">' + esc(T.hs[h[0]] || '') + '</textarea></div>').join('') + '<button class="btn small" data-hschk="1">' + I('check') + ' Kiểm tra hồ sơ đã đủ phần</button><div data-out></div></div>';
  }
  draw();
  box.addEventListener('input', e => { const t = e.target;
    if (t.dataset.comp) T.comp[t.dataset.comp] = t.value; else if (t.dataset.wz) { T.wz = T.wz || {}; T.wz[t.dataset.wz] = t.value; $('[data-wzout]', box).innerHTML = wiz(); } else if (t.dataset.cia) T.cia[t.dataset.cia] = t.value; else if (t.dataset.hs) T.hs[t.dataset.hs] = t.value; else if (t.dataset.ct != null) T.ctl[+t.dataset.ct][+t.dataset.j] = t.value; A.save(); });
  box.addEventListener('click', e => {
    if (e.target.closest('[data-ctadd]')) { T.ctl.push(['', '', '', 'Cần xác minh']); A.save(); draw(); }
    const d = e.target.closest('[data-ctdel]'); if (d) { T.ctl.splice(+d.dataset.ctdel, 1); A.save(); draw(); }
    if (e.target.closest('[data-hschk]')) { const miss = HS.filter(h => !(T.hs[h[0]] || '').trim()).map(h => h[0]); const comp = COMP.filter(c => !T.comp[c[0]]).length; const cia = ['c', 'i', 'a'].filter(k => !(T.cia[k] || '').trim()).length;
      $('[data-out]', box).innerHTML = '<div class="fb ' + (!miss.length && !comp && !cia ? 'ok' : 'mid') + ' mt">' + I('form') + '<div>' + (miss.length ? 'Còn trống: ' + miss.join(', ') + '. ' : 'Đủ 6 thành phần. ') + (comp ? comp + ' thành phần chưa xác định ranh giới. ' : '') + (cia ? 'Còn ' + cia + ' ô tác động CIA trống. ' : '') + 'Mỗi tồn tại (trạng thái Thiếu/Cần xác minh) phải ghi vào HS-06.</div></div>'; }
  });
};
/* --- Diễn tập tabletop --- */
TOOLS.tabletop = (box, L, R) => {
  const T = R.tool; T.roles = T.roles || {}; T.ev = T.ev || {}; T.dec = T.dec || [['Chặn 203.0.113.77, 198.51.100.23 trên tường lửa', '', '', ''], ['Vô hiệu hoá quy tắc 14 (RDP)', '', '', ''], ['Khoá nguyen.thu.ha và hotro.it2', '', '', '']];
  const ROLES = ['Chỉ huy sự cố (IR)', 'Phân tích (SOC)', 'Kỹ thuật hệ thống (IT)', 'Pháp chế – báo cáo', 'Chủ hệ thống (nghiệp vụ)', 'Thư ký – ghi biên bản'];
  const EV = [['e1', '07/11 09:10:04', 'Windows SRV-VB01', 'Bắt đầu 176 lần 4625 từ 198.51.100.23 trong ~3 phút'], ['e2', '07/11 09:13:07', 'Windows SRV-VB01', '4624 nguyen.thu.ha, LogonType 10, từ 198.51.100.23'], ['e3', '07/11 09:16:12', 'Windows SRV-VB01', '4688 PowerShell tải s.exe từ 203.0.113.77'], ['e4', '07/11 09:18:02', 'Wazuh FIM', '14 tệp D:\\VanBan\\Den\\2026-11 thay đổi; sync_tool.exe xuất hiện'], ['e5', '07/11 09:20:31', 'Suricata', 'SID 1000001 từ 10.20.20.12 (PC-IT-02)'], ['e6', '07/11 09:21–09:39', 'Netflow', '~2 GB từ 10.20.1.21 tới 203.0.113.77:443'], ['e7', '07/11 09:24:03', 'Windows SRV-VB01', '4720 tạo hotro.it2; 09:24:30 thêm vào Administrators'], ['e8', '07/11 09:41:55', 'Windows/Wazuh', '1102 nhật ký bảo mật bị xoá'], ['e9', '05/11 08:58:29', 'Proxy', 'nguyen.thu.ha POST mật khẩu lên cqmau-xacthuc.lab'], ['e10', '—', 'Giả thuyết', 'Các tệp văn bản đã bị mã hoá'], ['e11', '—', 'Giả thuyết', 'Dữ liệu gửi ra ngoài là các văn bản đến tháng 11']];
  function report(){
    const sevT = T.sev || '(chưa chọn)';
    const tl = EV.filter(e => (T.ev[e[0]] || {}).inc !== false).map(e => '- ' + e[1] + ' [' + e[2] + '] ' + e[3] + ' — ' + (((T.ev[e[0]] || {}).k) || 'chưa phân loại')).join('\n');
    return 'BÁO CÁO SAU SỰ CỐ – ' + (T.code || 'SC-2026-11-07-01') + '\nNhóm: ' + (R.grp || '…') + '\n\n1. Phạm vi và tài sản: SRV-VB01 (10.20.1.21) – Hệ thống quản lý văn bản và điều hành; tài khoản nguyen.thu.ha, hotro.it2.\n2. Dòng thời gian (+07:00):\n' + tl + '\n3. Bằng chứng và nơi lưu: ' + (T.evid || '…') + '\n4. Mức SEV: ' + sevT + ' – căn cứ: ' + (T.sevWhy || '…') + '\n5. Quyết định ngăn chặn:\n' + T.dec.map(d => '- ' + d[0] + ' | phê duyệt: ' + (d[1] || '…') + ' | rủi ro: ' + (d[2] || '…') + ' | lúc: ' + (d[3] || '…')).join('\n') + '\n6. Khắc phục, khôi phục, retest: ' + ((R.f || {}).f2 || '…') + '\n7. Kết luận và cải tiến: ' + ((R.f || {}).f3 || '…') + '\n\nVai trò: ' + ROLES.map((r, i) => r + ': ' + (T.roles[i] || '…')).join('; ');
  }
  function draw(){
    box.innerHTML = '<h3>Bàn diễn tập</h3><div class="grid g2 mt"><div class="card"><h4>1. Phân vai</h4>' + ROLES.map((r, i) => '<div class="field"><label>' + r + '</label><input data-role="' + i + '" value="' + esc(T.roles[i] || '') + '" placeholder="Họ tên thành viên"></div>').join('') + '</div>' +
      '<div class="card"><h4>3. Mức SEV và căn cứ</h4><div class="field"><label>Mã sự cố</label><input data-k="code" value="' + esc(T.code || 'SC-2026-11-07-01') + '"></div><div class="field"><label>Mức SEV</label><select data-k="sev"><option></option>' + ['SEV-1', 'SEV-2', 'SEV-3', 'SEV-4'].map(s => '<option' + (s === T.sev ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></div><div class="field"><label>Căn cứ</label><textarea data-k="sevWhy" rows="3" style="border:1.5px solid var(--line);border-radius:10px;padding:8px;font:inherit">' + esc(T.sevWhy || '') + '</textarea></div><div class="field"><label>Bằng chứng đã thu, SHA-256, nơi lưu</label><textarea data-k="evid" rows="3" style="border:1.5px solid var(--line);border-radius:10px;padding:8px;font:inherit">' + esc(T.evid || '') + '</textarea></div></div></div>' +
      '<div class="card mt"><h4>2. Dòng thời gian – tách dữ kiện và giả thuyết</h4><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Đưa vào</th><th>Thời điểm</th><th>Nguồn</th><th>Nội dung</th><th>Phân loại</th></tr></thead><tbody>' + EV.map(e => { const v = T.ev[e[0]] || {}; return '<tr><td><input type="checkbox" data-inc="' + e[0] + '"' + (v.inc === false ? '' : ' checked') + '></td><td class="mono small">' + e[1] + '</td><td>' + e[2] + '</td><td>' + esc(e[3]) + '</td><td><select data-ek="' + e[0] + '"><option></option>' + ['Dữ kiện', 'Giả thuyết'].map(s => '<option' + (s === v.k ? ' selected' : '') + '>' + s + '</option>').join('') + '</select></td></tr>'; }).join('') + '</tbody></table></div><button class="btn small mt" data-tlchk="1">' + I('check') + ' Kiểm tra phân loại</button><div data-tlout></div></div>' +
      '<div class="card mt"><h4>4. Quyết định ngăn chặn</h4><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Quyết định</th><th>Người phê duyệt</th><th>Rủi ro / ảnh hưởng</th><th>Thời điểm</th><th></th></tr></thead><tbody>' + T.dec.map((d, i) => '<tr>' + d.map((c, j) => '<td><textarea data-dec="' + i + '" data-j="' + j + '">' + esc(c) + '</textarea></td>').join('') + '<td><button class="iconbtn" data-decdel="' + i + '">' + I('trash') + '</button></td></tr>').join('') + '</tbody></table></div><button class="btn small ghost mt" data-decadd="1">' + I('plus') + ' Thêm quyết định</button></div>' +
      '<div class="card mt"><div class="row between"><h4>5. Báo cáo sau sự cố (tự tổng hợp)</h4><button class="btn small" data-rep="1">' + I('refresh') + ' Tạo báo cáo</button></div><pre class="demo-box" style="white-space:pre-wrap;max-height:420px" data-repout>' + esc(report()) + '</pre></div>';
  }
  draw();
  box.addEventListener('input', e => { const t = e.target;
    if (t.dataset.role != null) T.roles[t.dataset.role] = t.value; else if (t.dataset.k) T[t.dataset.k] = t.value; else if (t.dataset.ek) { T.ev[t.dataset.ek] = T.ev[t.dataset.ek] || {}; T.ev[t.dataset.ek].k = t.value; } else if (t.dataset.inc) { T.ev[t.dataset.inc] = T.ev[t.dataset.inc] || {}; T.ev[t.dataset.inc].inc = t.checked; } else if (t.dataset.dec != null) T.dec[+t.dataset.dec][+t.dataset.j] = t.value; A.save(); });
  box.addEventListener('click', e => {
    if (e.target.closest('[data-decadd]')) { T.dec.push(['', '', '', '']); A.save(); draw(); }
    const d = e.target.closest('[data-decdel]'); if (d) { T.dec.splice(+d.dataset.decdel, 1); A.save(); draw(); }
    if (e.target.closest('[data-rep]')) { $('[data-repout]', box).textContent = report(); A.SND.ok(); }
    if (e.target.closest('[data-tlchk]')) { const want = { e1: 'Dữ kiện', e2: 'Dữ kiện', e3: 'Dữ kiện', e4: 'Dữ kiện', e5: 'Dữ kiện', e6: 'Dữ kiện', e7: 'Dữ kiện', e8: 'Dữ kiện', e9: 'Dữ kiện', e10: 'Giả thuyết', e11: 'Giả thuyết' }; let ok = 0; Object.keys(want).forEach(k => { if ((T.ev[k] || {}).k === want[k]) ok++; });
      const inc5 = (T.ev.e5 || {}).inc !== false;
      $('[data-tlout]', box).innerHTML = '<div class="fb ' + (ok === 11 ? 'ok' : 'mid') + ' mt">' + I('search') + '<div><b>' + ok + '/11 phân loại hợp lý.</b> ' + (inc5 ? 'Lưu ý: mốc 09:20 (SID 1000001) là dữ kiện có thật nhưng KHÁC máy nguồn – ghi rõ “chưa xác định liên quan”, không gộp vào chuỗi tấn công.' : 'Đã loại mốc 09:20 khỏi chuỗi – nhớ ghi lý do loại trong báo cáo.') + '</div></div>'; }
  });
};

/* ================= TRANG LAB ================= */
function labList(v){
  const L = window.LABS;
  v.innerHTML = P.pageHead('Phòng lab', 'Phòng lab – 6 bài thực hành theo tình huống, 1 lab mở rộng AI, 1 lab dự phòng máy ảo', 'Một bộ dữ liệu giả lập (' + SRC.length + ' tệp, ' + SRC.reduce((a, s) => a + s[1], 0).toLocaleString('vi-VN') + ' dòng) với nhiều sự việc được cấy sẵn. Mỗi buổi một tình huống: câu hỏi phải trả lời, các bước, Bàn phân tích ngay trên trình duyệt (nhánh văn phòng), lệnh Linux trên Ubuntu WSL (nhánh IT), phiếu ghi nhận chấm tự động, xuất Word nộp bài.') +
  '<section class="sec" style="padding-bottom:0"><div class="wrap"><div class="envrow">' + '<a class="btn dlbig" href="taive/Goi_du_lieu_LAB_ANM_LamDong.zip" download="Goi_du_lieu_LAB_ANM_LamDong.zip" data-taigoi="1">' + I('download') + '<span><b>Tải gói dữ liệu lab</b><small>Goi_du_lieu_LAB_ANM_LamDong.zip · 0,5 MB · lưu vào Downloads</small></span></a>' + '<a class="envbar cn" href="#camnang">' + I('book') + '<div><b>Cẩm nang thực hành</b><span>Hiểu bộ dữ liệu, dùng Bàn phân tích, lệnh cơ bản, phương pháp và bốn cái bẫy, bảng tra nhanh, xử lý sự cố.</span></div>' + I('arrow') + '</a>' + '<a class="envbar" href="#moitruong">' + I('terminal') + '<div><b>Chuẩn bị máy cho nhánh IT: Ubuntu trên WSL</b><span>5 bước, 20–30 phút trên Windows 10/11: cài Ubuntu, bấm nút tải gói dữ liệu, dán một khối lệnh là xong. Kèm sơ đồ mạng Cơ quan Mẫu và nguồn của từng tệp dữ liệu.</span></div>' + I('arrow') + '</a></div><div class="note ok mt">' + I('check') + '<div><b>Không dùng Linux / Ubuntu WSL vẫn làm đủ mọi lab trên web.</b> Bước đọc dữ liệu: bấm <b>Mở trong Bàn phân tích</b> (đã đặt sẵn bộ lọc). Bước cần dòng lệnh: bấm <b>Làm trên web</b> – mô phỏng máy web giả lập và curl, Suricata đọc tệp bắt gói, tính mã băm SHA-256. Riêng Lab 8 cần máy ảo thật.</div></div></div></section>' +
  '<section class="sec"><div class="wrap"><div class="grid g3">' + L.map((x, i) => { const R = st.labAns[x.id]; const sc = R ? score(x) : 0; return '<a class="tile reveal" href="#lab-' + x.id + '">' + (sc ? '<span class="done-badge">' + sc + '/' + x.qs.length + '</span>' : '') + '<span class="ibox" style="background:' + (x.vm ? '#475569' : (window.DATA.colors[i] || '#0E7490')) + '">' + I(x.vm ? 'server' : (window.DATA.cdIcons[i] || 'activity')) + '</span><div class="eyebrow">' + (x.ext ? (x.vm ? 'Lab ' + x.id + ' · dự phòng · khi cài được máy ảo' : 'Lab ' + x.id + ' · mở rộng · tự học / làm thêm') : 'Lab ' + x.id + ' · Buổi ' + x.buoi) + '</div><h3>' + esc(x.title) + '</h3><p>' + esc(x.story.slice(0, 150)) + '…</p><span class="chips"><span class="chip">' + x.qs.length + ' câu chấm tự động</span><span class="chip">' + x.steps.length + ' bước</span></span><span class="go">Vào lab ' + I('arrow') + '</span></a>'; }).join('') + '</div>' +
  '<div class="grid g2 mt" style="margin-top:28px"><div class="card"><h3>' + I('terminal') + ' Bàn phân tích dùng tự do</h3><p class="muted">Mở bất kỳ tệp nào trong bộ dữ liệu, lọc, đếm, vẽ theo thời gian. Có lệnh tương đương cho cán bộ IT.</p><a class="btn" href="#banphantich">Mở Bàn phân tích</a></div>' +
  '<div class="card"><h3>' + I('folder') + ' Bộ dữ liệu</h3><div class="tbl-wrap" style="max-height:220px"><table class="tbl"><tbody>' + SRC.map(s => '<tr><td class="mono small">' + s[0] + '</td><td class="small">' + (DESC[s[0]] || '') + '</td><td class="num small">' + s[1].toLocaleString('vi-VN') + '</td></tr>').join('') + '</tbody></table></div><p class="small muted mt">Tổ chức giả định: Văn phòng Cơ quan Mẫu (cqmau.lab). Cửa sổ dữ liệu 03/11/2026 00:00 → 09/11/2026 23:59 (+07:00). Mọi địa chỉ Internet thuộc dải tài liệu RFC 5737.</p><div class="row mt"><a class="btn small" href="taive/Goi_du_lieu_LAB_ANM_LamDong.zip" download="Goi_du_lieu_LAB_ANM_LamDong.zip" data-taigoi="1">' + I('download') + ' Tải gói dữ liệu (.zip)</a><a class="btn small ghost" href="#moitruong">Cách đưa vào Ubuntu WSL</a></div></div></div>' +
  '<div class="note info mt">' + I('alert') + '<div><b>Nguyên tắc an toàn:</b> chỉ thao tác trên dữ liệu giả lập; trên Ubuntu WSL chỉ thử nghiệm máy web giả lập ở 127.0.0.1; phòng lab máy ảo (Lab 8) chỉ trong hai mạng nội bộ 192.168.56.0/24 và 192.168.57.0/24; không quét bất kỳ địa chỉ nào khác, kể cả địa chỉ xuất hiện trong dữ liệu; không đưa token, cookie, mật khẩu thật vào báo cáo.</div></div></div></section>';
}
function labDetail(v, id){
  const L = window.LABS.find(x => x.id === +id); if (!L) return labList(v);
  const R = rec(L.id); const col = window.DATA.colors[L.id - 1] || '#0E7490';
  const sess = L.ext ? null : window.CT.sess[L.buoi - 1];
  let h = '<section class="cd-hero" style="--c:' + col + '"><div class="wrap"><div class="crumb"><a href="#home">Trang chủ</a> / <a href="#lab">Phòng lab</a> / Lab ' + L.id + '</div><h1>Lab ' + L.id + ' · ' + esc(L.title) + '</h1><div class="meta">' + (sess ? '<span>Buổi ' + L.buoi + ' · ' + esc(sess.date) + ' · ' + sess.buoi + '</span><span>Chuyên đề ' + sess.cd + '</span>' : (L.vm ? '<span>Lab dự phòng · ngoài lịch 6 buổi</span><span>Làm thật phần máy ảo của Chuyên đề 3, 4</span>' : '<span>Lab mở rộng · ngoài lịch 6 buổi</span><span>Liên quan Chuyên đề 1, 3, 6</span>')) + '<span>' + L.qs.length + ' câu chấm tự động</span></div><div class="goal"><b>' + (sess ? 'Theo chương trình:' : 'Cách dùng:') + '</b> ' + esc(L.program) + '</div></div></section>';
  h += '<div class="wrap" style="padding:28px 20px 56px"><div class="lab-head"><div><div class="eyebrow">Tình huống</div><div class="story mt">' + esc(L.story) + '</div><h3 class="mt">Câu hỏi phải trả lời</h3><ol class="qlist">' + L.asks.map(a => '<li>' + esc(a) + '</li>').join('') + '</ol><p><b>Mục tiêu kỹ năng:</b> ' + esc(L.skill) + '</p>' +
    '<div class="branch"><div class="vp"><b>Nhánh cán bộ văn phòng</b>' + esc(L.vp) + '</div><div class="it"><b>Nhánh cán bộ IT</b>' + esc(L.it) + '</div></div>' + (L.vm ? '' : '<p class="small muted" style="margin-top:10px">' + I('terminal') + ' Nhánh IT chạy lệnh trên <b>Ubuntu WSL</b>, thư mục <code>~/lab/dulieu</code> – <a href="#" data-taigoi="1">tải gói dữ liệu</a> · <a href="#moitruong">cách cài và đưa dữ liệu vào</a>.</p>') + '</div>' +
    '<div class="lab-meta"><div><b>Sản phẩm phải nộp</b>' + esc(L.sanpham) + '</div><div><b>Tiêu chí đánh giá</b>' + esc(L.tieuchi) + '</div><div><b>Nhóm</b><div class="grp-pick mt"><select data-grp>' + grpOpts(R.grp) + '</select></div></div></div></div>';
  if (L.vm && window.LAB_SODO) h += '<div class="card mt sodo" style="margin-top:24px">' + window.LAB_SODO.lab8 + '<p class="small muted" style="margin:8px 4px 0">Ba mạng nội bộ (Internal Network) của VirtualBox – không mạng nào ra Internet hay nối với máy thật. Chuẩn bị máy ảo: <a href="#camnang-lab8">Cẩm nang thực hành – Chuẩn bị phòng lab máy ảo</a>.</p></div>';
  h += '<h2 class="mt" style="margin-top:30px">Cách đi tới câu trả lời</h2><div class="row mb"><span class="small muted">Lọc bước theo nhánh:</span><div class="seg-ctrl" data-who><button class="on" data-w="">Tất cả</button><button data-w="vp">Văn phòng</button><button data-w="it">IT</button></div></div>';
  h += L.steps.map((s, i) => '<div class="lstep" data-sw="' + s.w + '"><span class="sn">' + (i + 1) + '</span><div><h4>' + esc(s.t) + '<span class="tag ' + s.w + '">' + ({ all: 'Tất cả', vp: 'Văn phòng', it: 'IT' })[s.w] + '</span></h4><p style="margin:0">' + esc(s.d) + '</p><div class="row mt">' + (s.con ? '<button class="btn small" data-con="' + i + '">' + I('terminal') + ' Mở trong Bàn phân tích</button>' : '') + (s.go ? '<a class="btn small ghost" href="' + s.go[1] + '">' + esc(s.go[0]) + ' ' + I('arrow') + '</a>' : '') + (s.web ? '<button class="btn small webbtn" data-web="' + i + '">' + I('play') + ' Làm trên web (không cần Ubuntu)</button>' : '') + '</div>' + (s.web ? '<div data-webbox="' + i + '"></div>' : '') + (function(){ const tp = window.CAMNANG && window.CAMNANG.tips[L.id + '-' + (i + 1)]; return tp ? '<details class="lhint"><summary>' + I('search') + ' Gợi ý từ cẩm nang: bạn sẽ thấy gì, cần cẩn thận gì</summary>' + (tp[0] ? '<p><b>Bạn sẽ thấy:</b> ' + esc(tp[0]) + '</p>' : '') + (tp[1] ? '<p><b>Cẩn thận:</b> ' + esc(tp[1]) + '</p>' : '') + '</details>' : ''; })() + (s.cmd && !s.con ? '<div class="cmdline' + (L.vm ? ' vm' : '') + '"><button class="cp" data-cpcmd="' + i + '">Sao chép</button>' + esc(s.cmd) + '</div>' : '') + '</div></div>').join('');
  h += '<div id="conback" class="conback" hidden></div><div id="conwrap" class="mt" style="scroll-margin-top:130px"></div>';
  if (L.tool) h += '<div class="card mt" style="margin-top:26px" id="toolbox"></div>';
  h += '<div class="phieu mt" style="margin-top:26px" id="phieu"><div class="phieu-h"><b>' + I('form') + ' Phiếu ghi nhận Lab ' + L.id + '</b><span class="small">Nhóm <b data-gshow>' + (R.grp || '…') + '</b> · tên tệp nộp: <b data-fname>' + fname(L, R) + '</b></span></div>' +
    '<div class="pfree"><label>Thành viên nhóm (họ tên, nhánh VP/IT)</label><textarea data-mem rows="2">' + esc(R.mem || '') + '</textarea></div>' +
    L.qs.map(q => { const v = R.a[q.id] || ''; return '<div class="pq' + (R.ok[q.id] ? ' ok' : '') + '" data-q="' + q.id + '"><label>' + esc(q.l) + '<small>' + ({ all: 'Tất cả', vp: 'Nhánh văn phòng', it: 'Nhánh IT' })[q.w] + (q.h ? ' · ' + esc(q.h) : '') + '</small></label>' + (q.t === 'sel' ? '<select data-a="' + q.id + '"><option value=""></option>' + q.o.map(o => '<option' + (o === v ? ' selected' : '') + '>' + esc(o) + '</option>').join('') + '</select>' : '<input data-a="' + q.id + '" value="' + esc(v) + '"' + (q.t === 'num' ? ' inputmode="numeric"' : '') + ' autocomplete="off">') + '<span class="res ' + (R.ok[q.id] ? 'ok' : (v ? 'no' : 'wait')) + '" data-res>' + (R.ok[q.id] ? 'Đúng' : (v ? 'Chưa đúng' : '—')) + '</span></div>'; }).join('') +
    L.free.map(f => '<div class="pfree"><label>' + esc(f[1]) + '</label><textarea data-f="' + f[0] + '">' + esc((R.f || {})[f[0]] || '') + '</textarea></div>').join('') +
    '<div class="phieu-f"><button class="btn small" data-chk>' + I('check') + ' Chấm phiếu</button><button class="btn small ghost" data-doc>' + I('download') + ' Xuất Word</button><button class="btn small ghost" data-print>' + I('printer') + ' In / PDF</button><button class="btn small ghost" data-json>' + I('copy') + ' Lưu tệp bài làm</button><label class="btn small ghost" style="cursor:pointer">' + I('upload') + ' Nạp bài làm<input type="file" accept=".json" data-load hidden></label><span class="sc" data-score>' + score(L) + '/' + L.qs.length + '</span></div></div>';
  h += '<div class="lesson-nav"><a class="btn ghost" href="#lab">' + I('left') + ' Phòng lab</a>' + (sess ? '<a class="btn ghost" href="#chuyende-' + sess.cd + '">Bài giảng Chuyên đề ' + sess.cd + '</a>' : '') + (L.id < 6 ? '<a class="btn" href="#lab-' + (L.id + 1) + '">Lab ' + (L.id + 1) + ' ' + I('arrow') + '</a>' : '<a class="btn" href="#kiemtra">Kiểm tra cuối khoá ' + I('arrow') + '</a>') + (L.id === 6 && window.LABS.some(x => x.ext) ? '<a class="btn ghost" href="#lab-7">Lab mở rộng: AI ' + I('arrow') + '</a>' : '') + (L.id === 7 && window.LABS.some(x => x.vm) ? '<a class="btn ghost" href="#lab-8">Lab dự phòng: máy ảo ' + I('arrow') + '</a>' : '') + '</div></div>';
  v.innerHTML = h;

  let con = null;
  const openCon = s => { const w = $('#conwrap', v); const k = L.steps.indexOf(s), cb = $('#conback', v); cb.hidden = false; cb.innerHTML = '<span>' + I('terminal') + ' Bàn phân tích đang mở cho <b>bước ' + (k + 1) + ': ' + esc(s.t) + '</b></span><button class="btn small ghost" data-backstep="' + k + '">' + I('up') + ' Quay lại bước ' + (k + 1) + '</button><button class="btn small ghost" data-jump="phieu">' + I('form') + ' Đến phiếu ghi nhận</button>'; if (!con) con = Console(w, Object.assign({ cmd: s.cmd }, s.con)); else con.set(Object.assign({ cmd: s.cmd }, s.con)); w.scrollIntoView({ behavior: 'smooth' }); };
  if (L.tool) TOOLS[L.tool]($('#toolbox', v), L, R);
  v.addEventListener('click', e => {
    const c = e.target.closest('[data-con]'); if (c) { openCon(L.steps[+c.dataset.con]); A.SND.tap(); return; }
    const bs = e.target.closest('[data-backstep]'); if (bs) { const el = v.querySelectorAll('.lstep')[+bs.dataset.backstep]; if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
    const wb = e.target.closest('[data-web]'); if (wb) { const k = +wb.dataset.web, box = v.querySelector('[data-webbox="' + k + '"]'); if (box.innerHTML) { box.innerHTML = ''; return; } const W = L.steps[k].web; window.LABWEB[W.kind](box, W); box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); return; }
    const cc = e.target.closest('[data-cpcmd]'); if (cc) { try { navigator.clipboard.writeText(L.steps[+cc.dataset.cpcmd].cmd); A.toast('Đã sao chép lệnh'); } catch(err) {} return; }
    const w = e.target.closest('[data-who] button'); if (w) { $$('[data-who] button', v).forEach(b => b.classList.toggle('on', b === w)); $$('.lstep', v).forEach(s => s.classList.toggle('hide', !!w.dataset.w && s.dataset.sw !== 'all' && s.dataset.sw !== w.dataset.w)); return; }
    if (e.target.closest('[data-chk]')) { let ok = 0; L.qs.forEach(q => { const val = R.a[q.id] || ''; const good = !!val && A.check('L' + L.id + q.id, val, q.k); R.ok[q.id] = good; if (good) ok++; const row = $('.pq[data-q="' + q.id + '"]', v); row.classList.toggle('ok', good); const rs = $('[data-res]', row); rs.className = 'res ' + (good ? 'ok' : val ? 'no' : 'wait'); rs.textContent = good ? 'Đúng' : val ? 'Chưa đúng' : '—'; });
      A.save(); $('[data-score]', v).textContent = ok + '/' + L.qs.length; if (ok === L.qs.length) { A.SND.win(); A.confetti(); A.addXP(40, 'Hoàn thành phiếu Lab ' + L.id); } else { A.SND.ok(); A.toast('Đúng ' + ok + '/' + L.qs.length + ' câu'); } return; }
    if (e.target.closest('[data-doc]')) { exportDoc(L, R); return; }
    if (e.target.closest('[data-print]')) { printView(L, R); return; }
    if (e.target.closest('[data-json]')) { A.saveFile(fname(L, R) + '.json', new Blob([JSON.stringify({ lab: L.id, data: R }, null, 1)], { type: 'application/json' })); return; }
  });
  v.addEventListener('input', e => { const t = e.target;
    if (t.dataset.a) { R.a[t.dataset.a] = t.value; R.ok[t.dataset.a] = false; A.save(); }
    else if (t.dataset.f) { R.f[t.dataset.f] = t.value; A.save(); }
    else if (t.hasAttribute('data-mem')) { R.mem = t.value; A.save(); }
  });
  v.addEventListener('change', e => { const t = e.target;
    if (t.hasAttribute('data-grp')) { R.grp = t.value; st.grp = t.value; A.save(); $('[data-gshow]', v).textContent = t.value || '…'; $('[data-fname]', v).textContent = fname(L, R); }
    if (t.hasAttribute('data-load') && t.files[0]) { const fr = new FileReader(); fr.onload = () => { try { const o = JSON.parse(fr.result); if (o.lab !== L.id) { A.toast('Tệp không phải của Lab ' + L.id); return; } st.labAns[L.id] = o.data; A.save(); labDetail(v, L.id); A.toast('Đã nạp bài làm'); } catch(err) { A.toast('Tệp không hợp lệ'); } }; fr.readAsText(t.files[0]); }
  });
}
function fname(L, R){ return (R.grp || 'Gxx') + (L.ext ? (L.vm ? '_LabMayAo' : '_LabMoRong') : '_Buoi' + L.buoi); }
function docHTML(L, R){
  const tool = R.tool || {}; let th = '';
  if (L.tool === 'riskreg' && tool.rows) th = '<h2>Ranh giới hệ thống</h2><p style="white-space:pre-wrap">' + esc(tool.bd || '') + '</p><h2>Danh mục tài sản (PL-01)</h2><table><tr><th>Mã</th><th>Tài sản</th><th>Loại</th><th>Vị trí / vùng</th><th>Chủ sở hữu</th><th>Mức C–I–A</th><th>Phụ thuộc</th><th>Sao lưu</th><th>Ghi chú</th></tr>' + (tool.assets || []).map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</table><h2>Sổ đăng ký rủi ro (PL-02)</h2><table><tr><th>ID</th><th>Tài sản</th><th>Nguồn đe dọa</th><th>Điểm yếu</th><th>Hậu quả</th><th>L</th><th>I</th><th>R</th><th>Luận cứ</th><th>Xử lý</th><th>Người xử lý</th><th>Kiểm chứng</th></tr>' + tool.rows.map(r => '<tr>' + r.slice(0, 7).map(c => '<td>' + esc(c) + '</td>').join('') + '<td>' + r[5] * r[6] + '</td>' + r.slice(7).map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</table>';
  if (L.tool === 'compliance' && tool.ev) th = '<h2>Ma trận nghĩa vụ và bằng chứng (PL-03)</h2><table><tr><th>Tài liệu</th><th>Trạng thái</th><th>Căn cứ</th><th>Nghĩa vụ</th><th>Phụ trách / hạn</th></tr>' + window.LAB_EVID.map(e => { const x = tool.ev[e.id] || {}; return '<tr><td>' + e.id + '. ' + esc(e.t) + '</td><td>' + esc(x.s || '') + '</td><td>' + esc(x.c || '') + '</td><td>' + esc(x.n || '') + '</td><td>' + esc(x.p || '') + '</td></tr>'; }).join('') + '</table>';
  if (L.tool === 'dossier') th = '<h2>Hồ sơ đề xuất cấp độ (minh hoạ)</h2>' + ['HS-01', 'HS-02', 'HS-03', 'HS-04', 'HS-05', 'HS-06'].map(k => '<h3>' + k + '</h3><p>' + esc((tool.hs || {})[k] || '') + '</p>').join('') + '<h3>Tác động CIA</h3><p>C: ' + esc((tool.cia || {}).c || '') + '<br>I: ' + esc((tool.cia || {}).i || '') + '<br>A: ' + esc((tool.cia || {}).a || '') + '</p><h3>Yêu cầu – biện pháp – bằng chứng</h3><table><tr><th>Yêu cầu</th><th>Biện pháp</th><th>Bằng chứng</th><th>Trạng thái</th></tr>' + (tool.ctl || []).map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</table>';
  if (L.tool === 'aimodel' && window.AILAB) th = window.AILAB.doc(tool);
  if (L.tool === 'tabletop') { const pre = document.querySelector('[data-repout]'); th = '<h2>Báo cáo sau sự cố</h2><pre style="white-space:pre-wrap;font-family:inherit">' + esc(pre ? pre.textContent : '') + '</pre>'; }
  return '<html><head><meta charset="utf-8"><title>' + fname(L, R) + '</title><style>body{font-family:"Times New Roman",serif;font-size:13pt}table{border-collapse:collapse;width:100%}td,th{border:1px solid #444;padding:4px 6px;vertical-align:top;font-size:11pt}th{background:#e8eef8}h1{font-size:16pt;text-align:center}h2{font-size:14pt;margin-top:16pt}</style></head><body>' +
    '<p style="text-align:center"><b>TẬP HUẤN AN NINH MẠNG VÀ BẢO VỆ HỆ THỐNG THÔNG TIN</b><br>Văn phòng Tỉnh ủy Lâm Đồng · 17–19/11/2026</p><h1>PHIẾU GHI NHẬN LAB ' + L.id + ' – ' + esc(L.title.toUpperCase()) + '</h1>' +
    '<p><b>Nhóm:</b> ' + esc(R.grp || '') + ' &nbsp; <b>' + (L.ext ? (L.vm ? 'Lab dự phòng máy ảo' : 'Lab mở rộng') : 'Buổi:</b> ' + L.buoi) + (L.ext ? '</b>' : '') + ' &nbsp; <b>Điểm phần chấm tự động:</b> ' + score(L) + '/' + L.qs.length + '</p><p><b>Thành viên:</b> ' + esc(R.mem || '') + '</p>' +
    '<h2>Trả lời câu hỏi</h2><table><tr><th>#</th><th>Câu hỏi</th><th>Trả lời</th><th>Máy chấm</th></tr>' + L.qs.map(q => '<tr><td>' + q.id + '</td><td>' + esc(q.l) + '</td><td>' + esc(R.a[q.id] || '') + '</td><td>' + (R.ok[q.id] ? 'Đúng' : (R.a[q.id] ? 'Chưa đúng' : '')) + '</td></tr>').join('') + '</table>' +
    L.free.map(f => '<h2>' + esc(f[1]) + '</h2><p style="white-space:pre-wrap">' + esc((R.f || {})[f[0]] || '') + '</p>').join('') + th +
    '<h2>Chấm sản phẩm nhóm theo rubric chung (giảng viên ghi)</h2><table><tr><th>Tiêu chí</th><th>Tối đa</th><th>Điểm</th><th>Nhận xét</th></tr>' + (window.CT.rubric || []).slice(1, -1).map(r => '<tr><td>' + esc(r[0]) + '</td><td>' + esc(r[1]) + '</td><td></td><td></td></tr>').join('') + '<tr><td><b>TỔNG</b></td><td><b>100</b></td><td></td><td></td></tr></table>' +
    '<p style="margin-top:20pt;font-size:10pt;color:#555">Dữ liệu giả lập phục vụ đào tạo. Xuất từ giáo trình tương tác SaigonLab lúc ' + new Date().toLocaleString('vi-VN') + '.</p></body></html>';
}
function exportDoc(L, R){ A.saveFile(fname(L, R) + '.doc', new Blob(['\ufeff' + docHTML(L, R)], { type: 'application/msword' })); A.toast('Đã xuất ' + fname(L, R) + '.doc'); }
function printView(L, R){ const w = window.open('', '_blank'); if (!w) { A.toast('Trình duyệt chặn cửa sổ mới'); return; } w.document.write(docHTML(L, R)); w.document.close(); setTimeout(() => w.print(), 400); }
/* Nút tải gói dữ liệu: tạo tệp zip ngay trong trình duyệt (chạy cả khi mở tệp trên máy lẫn khi đưa lên mạng) */
function taiGoi(){
  const luu = () => { const G = window.LAB_GOI; const bin = atob(G.b64); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
    const url = URL.createObjectURL(new Blob([u], { type: 'application/zip' })); const a = document.createElement('a'); a.href = url; a.download = G.ten; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 4000);
    A.toast('Đã tải ' + G.ten + ' – xem thư mục Downloads'); };
  if (window.LAB_GOI) return luu();
  const sc = document.createElement('script'); sc.src = 'taive/goi.js'; sc.onload = luu; sc.onerror = () => A.toast('Không tải được gói dữ liệu – lấy tệp giảng viên phát'); document.head.appendChild(sc);
}
document.addEventListener('click', e => { const b = e.target.closest('[data-taigoi]'); if (!b) return; e.preventDefault(); taiGoi(); });
P.lab = function(v, param){ if (param) labDetail(v, param); else labList(v); };
/* ================= THANH ĐIỀU HƯỚNG KHU PHÒNG LAB ================= */
window.LABNAV = function(route, param){
  const L = window.LABS || [], cur = route === 'lab' && param && /^\d+$/.test(param) ? +param : null;
  const it = (href, txt, on, title) => '<a href="' + href + '" class="' + (on ? 'on' : '') + '"' + (title ? ' title="' + esc(title) + '"' : '') + '>' + txt + '</a>';
  return '<nav class="labnav" aria-label="Điều hướng Phòng lab"><div class="wrap labnav-in">' +
    (A.canBack && A.canBack() ? '<button class="lnb-back" data-navback title="Quay lại trang trước, đúng chỗ đang đọc">' + I('left') + ' Quay lại</button>' : '') +
    it('#lab', I('terminal') + ' Phòng lab', route === 'lab' && !cur) + '<span class="lnb-sep"></span>' +
    L.map(x => it('#lab-' + x.id, 'Lab ' + x.id + (x.vm ? ' · máy ảo' : x.ext ? ' · AI' : ''), cur === x.id, x.title)).join('') + '<span class="lnb-sep"></span>' +
    it('#banphantich', I('chart') + ' Bàn phân tích', route === 'banphantich') + it('#camnang', I('book') + ' Cẩm nang', route === 'camnang') + it('#moitruong', I('download') + ' Dữ liệu & WSL', route === 'moitruong') +
    (cur ? '<span class="lnb-sep"></span><button class="lnb-jump" data-jump="phieu">' + I('form') + ' Phiếu ghi nhận</button>' : '') +
    '</div></nav>' + (route !== 'camnang' ? '<button class="cnfab" data-cnopen title="Mở cẩm nang bên cạnh, không rời trang">' + I('book') + '<span>Cẩm nang</span></button>' : '');
};
/* Cẩm nang mở bên cạnh (không rời trang đang làm) */
function cnPanel(sec){
  const C = window.CAMNANG; if (!C) return;
  let p = document.getElementById('cnpanel');
  if (!p) {
    p = document.createElement('div'); p.id = 'cnpanel'; p.className = 'cnpanel';
    p.innerHTML = '<div class="cnp-bg" data-cnclose></div><aside class="cnp" role="dialog" aria-label="Cẩm nang thực hành"><div class="cnp-h"><b>' + I('book') + ' Cẩm nang thực hành</b><select data-cnsec>' + C.secs.map(x => '<option value="' + x[0] + '">' + esc(x[1]) + '</option>').join('') + '</select><a class="btn small ghost" href="#camnang" data-cnclose>Mở toàn trang</a><button class="iconbtn" data-cnclose aria-label="Đóng">' + I('x') + '</button></div><div class="cnp-b cn">' + C.secs.map(x => '<section class="ch" id="cnp-' + x[0] + '">' + x[2] + '</section>').join('') + '</div></aside>';
    document.body.appendChild(p);
    p.addEventListener('click', e => { if (e.target.closest('[data-cnclose]')) { p.classList.remove('open'); } });
    p.querySelector('[data-cnsec]').addEventListener('change', e => { const el = p.querySelector('#cnp-' + e.target.value); if (el) el.scrollIntoView(); });
    p.querySelector('.cnp-b').addEventListener('scroll', () => { const b = p.querySelector('.cnp-b'); let k = C.secs[0][0]; C.secs.forEach(x => { const el = p.querySelector('#cnp-' + x[0]); if (el && el.offsetTop - b.offsetTop <= b.scrollTop + 40) k = x[0]; }); p.querySelector('[data-cnsec]').value = k; });
  }
  p.classList.add('open');
  if (sec) { const el = p.querySelector('#cnp-' + sec); if (el) setTimeout(() => el.scrollIntoView(), 30); p.querySelector('[data-cnsec]').value = sec; }
}
document.addEventListener('click', e => {
  if (e.target.closest('[data-navback]')) { A.navBack(); return; }
  const j = e.target.closest('[data-jump]'); if (j) { const el = document.getElementById(j.dataset.jump); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); return; }
  if (e.target.closest('[data-cnopen]')) { cnPanel(); return; }
  const a = e.target.closest('a[href^="#camnang"]');
  if (a && !/^#camnang/.test(location.hash) && !a.closest('#cnpanel') && !a.closest('.labnav')) { e.preventDefault(); const m = /^#camnang-(\w+)/.exec(a.getAttribute('href')); cnPanel(m ? m[1] : null); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { const p = document.getElementById('cnpanel'); if (p) p.classList.remove('open'); } });
window.addEventListener('hashchange', () => { const p = document.getElementById('cnpanel'); if (p) p.classList.remove('open'); });

/* ================= CẨM NANG THỰC HÀNH (trong giáo trình) ================= */
P.camnang = function(v, param){
  const C = window.CAMNANG || { secs: [] };
  v.innerHTML = P.pageHead('<a href="#lab">Phòng lab</a>', 'Cẩm nang thực hành', 'Cách làm các bài lab trên bộ dữ liệu giả lập: hiểu dữ liệu, dùng Bàn phân tích, lệnh cơ bản, phương pháp, bảng tra nhanh và xử lý sự cố. Cẩm nang chỉ cách đi tới câu trả lời – không ghi sẵn đáp án.') +
    '<section class="sec"><div class="wrap cn-lay"><nav class="cn-toc card"><b>Mục lục</b>' + C.secs.map(x => '<a href="#camnang-' + x[0] + '" data-cn="' + x[0] + '">' + esc(x[1]) + '</a>').join('') +
    '<hr><a href="#lab">' + I('left') + ' Phòng lab</a><button class="btn small ghost" data-print style="margin-top:8px">' + I('printer') + ' In cẩm nang</button></nav>' +
    '<div class="cn">' + C.secs.map(x => '<section class="ch" id="cn-' + x[0] + '">' + x[2] + '</section>').join('') + '</div></div></section>';
  v.addEventListener('click', e => { if (e.target.closest('[data-print]')) window.print(); const a = e.target.closest('.cn-toc [data-cn]'); if (a) { e.preventDefault(); const el = document.getElementById('cn-' + a.dataset.cn); if (el) el.scrollIntoView({ behavior: 'smooth' }); history.replaceState(null, '', '#camnang-' + a.dataset.cn); $$('.cn-toc a', v).forEach(x => x.classList.toggle('on', x === a)); } });
  if (param) setTimeout(() => { const el = document.getElementById('cn-' + param); if (el) el.scrollIntoView(); }, 60);
};
/* ================= MÔI TRƯỜNG THỰC HÀNH: UBUNTU TRÊN WSL ================= */
P.moitruong = function(v){
  const sh = (c, lbl) => '<div class="shell" data-lbl="' + esc(lbl || 'Ubuntu') + '"><button class="cp" data-cp>Sao chép</button><code>' + esc(c) + '</code></div>';
  const SD = window.LAB_SODO || {};
  const step = (n, t, body) => '<div class="lstep"><span class="sn">' + n + '</span><div><h4>' + t + '</h4>' + body + '</div></div>';
  v.innerHTML = P.pageHead('<a href="#lab">Phòng lab</a>', 'Chuẩn bị môi trường thực hành: Ubuntu trên WSL', 'Nhánh IT phân tích nhật ký bằng dòng lệnh Linux ngay trên máy Windows của mình – không cần máy ảo, không cần Kali. Nhánh văn phòng chỉ cần trình duyệt và Bàn phân tích.') +
  '<section class="sec"><div class="wrap">' +
  '<div class="envrow" style="margin-bottom:22px">' + '<a class="btn dlbig" href="taive/Goi_du_lieu_LAB_ANM_LamDong.zip" download="Goi_du_lieu_LAB_ANM_LamDong.zip" data-taigoi="1">' + I('download') + '<span><b>Tải gói dữ liệu lab</b><small>Goi_du_lieu_LAB_ANM_LamDong.zip · 0,5 MB · lưu vào Downloads</small></span></a>' + '<div class="envbar" style="cursor:default">' + I('terminal') + '<div><b>Tóm tắt 5 bước</b><span>Kiểm tra máy → cài Ubuntu 24.04 → bấm nút tải gói dữ liệu (bên trái) → dán một khối lệnh vào Ubuntu → làm lab. Chi tiết ở phần “Cài đặt trong 5 bước” bên dưới.</span></div></div></div>' +
  '<div class="card sodo">' + (SD.coquan || '') + '<p class="small muted" style="margin:10px 4px 0">Bộ dữ liệu 20 tệp là nhật ký 7 ngày (03–09/11/2026) thu từ mạng giả lập này, cộng hồ sơ quản lý và hai bản ghi sẵn từ phòng lab máy ảo. Khi phân tích, luôn hỏi: tệp này do thiết bị nào ghi, thiết bị đó thấy được gì và <b>không</b> thấy được gì. Mọi địa chỉ, tài khoản đều là giả lập.</p></div>' +
  '<div class="card sodo mt">' + (SD.moitruong || '') + '</div>' +
  '<h2 style="margin-top:34px">Cài đặt trong 5 bước</h2><p class="muted">Làm một lần trước buổi học (20–30 phút, cần Internet). Ai cũng làm đúng 5 bước này theo cùng một thứ tự. Bộ phận CNTT có thể cài sẵn cho cả phòng (xem sổ tay giảng viên).</p>' +
  step(1, 'Kiểm tra máy Windows', '<ul class="pts"><li>Windows 10 bản 2004 (bản dựng 19041) trở lên hoặc Windows 11: bấm <b>Win + R</b>, gõ <code>winver</code>.</li><li>Có quyền quản trị máy (hoặc nhờ bộ phận CNTT cài giúp).</li><li>Ảo hoá đang bật: Task Manager → Performance → CPU → dòng <b>Virtualization: Enabled</b>.</li><li>Còn trống tối thiểu 5 GB trên ổ C:.</li></ul>') +
  step(2, 'Cài Ubuntu 24.04 trên WSL', '<p>Bấm Start, gõ <b>PowerShell</b>, chuột phải → <b>Run as administrator</b>, chạy lần lượt (khởi động lại máy nếu được yêu cầu, rồi chạy lại lệnh thứ hai):</p>' + sh('wsl --install -d Ubuntu-24.04\nwsl --set-default Ubuntu-24.04', 'PowerShell (quản trị)') +
    '<p>Mở <b>Ubuntu 24.04</b> từ Start. Lần đầu Ubuntu hỏi tên người dùng (chữ thường không dấu, ví dụ <code>hocvien</code>) và mật khẩu – khi gõ mật khẩu không hiện ký tự, đó là bình thường; <b>ghi nhớ mật khẩu này</b>, bước 4 sẽ dùng. Kiểm tra cửa sổ vừa mở đúng là Ubuntu:</p>' + sh('head -n 2 /etc/os-release') +
    '<p>Phải thấy <code>Ubuntu 24.04</code>; dấu nhắc có dạng <code>hocvien@TÊN-MÁY:~$</code>. Thấy <code>Docker Desktop</code> hay Alpine là đang mở nhầm bản Linux: đóng cửa sổ, mở đúng mục <b>Ubuntu 24.04</b> trong Start (bản <code>docker-desktop</code> là của Docker – không dùng, không gỡ).</p>' +
    '<div class="note info">' + I('alert') + '<div>Cài đứng mãi ở 0,0%: <code>wsl --install --web-download -d Ubuntu-24.04</code>. Lỗi 0x80370102 (ảo hoá chưa bật) mà không bật được: <code>wsl --set-default-version 1</code> rồi cài lại – WSL 1 đủ cho phân tích nhật ký. Dấu nhắc kết thúc bằng <code>#</code> (tài khoản root) vẫn làm lab bình thường.</div></div>') +
  step(3, 'Tải gói dữ liệu về thư mục Downloads', '<p>Bấm nút dưới đây. Trình duyệt lưu tệp vào thư mục <b>Downloads</b> (Tải về) của Windows.</p><p><a class="btn" href="taive/Goi_du_lieu_LAB_ANM_LamDong.zip" download="Goi_du_lieu_LAB_ANM_LamDong.zip" data-taigoi="1">' + I('download') + ' Tải gói dữ liệu (Goi_du_lieu_LAB_ANM_LamDong.zip, khoảng 0,5 MB)</a></p>' +
    '<ul class="pts"><li>Trình duyệt hỏi nơi lưu: chọn <b>Downloads</b>, giữ nguyên tên tệp.</li><li><b>Không</b> giải nén, <b>không</b> mở tệp trên Windows – bước 4 tự làm.</li><li>Tải lại nhiều lần không sao: bước 4 luôn lấy tệp mới nhất, kể cả tên có thêm “(1)”, “(2)”.</li><li>Nút không tải được (giáo trình mở qua một trang không cho tải tệp): lấy tệp cùng tên do giảng viên phát, chép vào thư mục Downloads.</li></ul>') +
  step(4, 'Dán một khối lệnh vào Ubuntu', '<p>Bấm <b>Sao chép</b>, chuyển sang cửa sổ Ubuntu, bấm chuột phải (hoặc <b>Ctrl + Shift + V</b>) để dán, rồi Enter nếu cần. Khối lệnh tự làm ba việc: tìm gói dữ liệu mới nhất trong Downloads và giải nén thành thư mục <code>~/lab</code> (dữ liệu gốc, làm lại từ đầu); cài các công cụ còn thiếu – Ubuntu hỏi mật khẩu đặt ở bước 2, cần Internet, vài phút; kiểm tra toàn bộ môi trường.</p>' + sh('cd ~\nZ=$(ls -t /mnt/c/Users/*/Downloads/Goi_du_lieu_LAB*.zip 2>/dev/null | head -n 1)\nif [ -z "$Z" ]; then echo "CHƯA THẤY GÓI DỮ LIỆU TRONG DOWNLOADS – bấm nút Tải gói dữ liệu trên giáo trình rồi dán lại"; else\n  echo "Gói dữ liệu: $Z"\n  rm -rf ~/lab ~/02_Goi_du_lieu_LAB\n  python3 -m zipfile -e "$Z" ~\n  [ -d ~/02_Goi_du_lieu_LAB ] && mv ~/02_Goi_du_lieu_LAB ~/lab\n  bash ~/lab/congcu/cai_dat_cong_cu.sh\nfi') +
    '<p>Kết thúc đúng là dòng <b>KẾT QUẢ: máy đã sẵn sàng.</b> Dòng <b>[THIẾU]</b> ghi kèm cách xử lý. Dán lại khối lệnh bất cứ lúc nào để đưa dữ liệu về trạng thái gốc.</p>' +
    '<div class="note warn">' + I('alert') + '<div>Không mở rồi lưu tệp dữ liệu bằng Notepad hay Excel (đổi ký tự xuống dòng, mã băm sai). Luôn làm việc trong <code>~/lab</code>.</div></div>') +
  step(5, 'Trong giờ lab', '<p>Mở <b>Ubuntu 24.04</b> từ Start. Mỗi khung lệnh trong bài lab đã có sẵn dòng <code>cd ~/lab/dulieu</code> ở đầu: bấm <b>Sao chép</b>, dán vào Ubuntu là chạy – không cần tự chuyển thư mục. Tệp do lab tạo ra (nhật ký máy web giả lập, kết quả Suricata, mã băm bằng chứng) nằm trong <code>~/lab/ketqua</code>.</p><p class="small muted">Thoát Ubuntu: <code>exit</code>. Giải phóng bộ nhớ sau buổi học: <code>wsl --shutdown</code> trong PowerShell.</p>') +
  '<h2 style="margin-top:34px">Sự cố thường gặp</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Hiện tượng</th><th>Cách xử lý</th></tr></thead><tbody>' +
  [['Lỗi 0x80370102 khi cài Ubuntu', 'Ảo hoá chưa bật trong BIOS/UEFI (Intel VT-x / AMD-V). Bật lên, hoặc dùng WSL 1: <code>wsl --set-default-version 1</code> rồi cài lại.'],
   ['Cài đứng ở 0,0%', '<code>wsl --install --web-download -d Ubuntu-24.04</code>'],
   ['<code>wsl</code> không phải là lệnh, hoặc Windows cũ hơn bản 2004', 'Cập nhật Windows; trong lúc chờ dùng Bàn phân tích trên web.'],
   ['Không có quyền quản trị', 'Nhờ bộ phận CNTT cài trước buổi học (có thể dùng gói Ubuntu cài sẵn của giảng viên).'],
   ['Bước 4 in “CHƯA THẤY GÓI DỮ LIỆU TRONG DOWNLOADS”', 'Chưa tải (bước 3), hoặc trình duyệt lưu nơi khác: Cài đặt trình duyệt → Tải xuống → vị trí lưu là thư mục Downloads. Có tệp do giảng viên phát thì chép vào Downloads. Rồi dán lại khối lệnh.'],
   ['Thông báo <code>unzip: can\'t open</code>, <code>apt-get: not found</code>; dấu nhắc <code>TÊN-MÁY:~#</code> không có <code>tên@</code>', 'Đang mở nhầm bản Linux (thường là <code>docker-desktop</code> hoặc Alpine). Kiểm tra <code>head -n 2 /etc/os-release</code>; mở đúng <b>Ubuntu 24.04</b> từ Start (bước 2).'],
   ['Hỏi mật khẩu rồi báo <code>Sorry, try again</code>', 'Gõ mật khẩu Ubuntu đặt ở bước 2 (không phải mật khẩu Windows); khi gõ không hiện ký tự.'],
   ['Cài công cụ báo “Cài chưa xong”', 'Kiểm tra Internet, proxy của cơ quan, rồi chạy lại <code>bash ~/lab/congcu/cai_dat_cong_cu.sh</code>.'],
   ['Cổng 3000 đang bận', 'Máy web giả lập đã chạy từ trước: <code>pkill -f may_web_gia_lap.py</code>.'],
   ['Kiểm tra báo mã băm không khớp', 'Dán lại khối lệnh ở bước 4 (giải nén lại dữ liệu gốc); không sửa tệp dữ liệu bằng phần mềm Windows.']].map(r => '<tr><td>' + r[0] + '</td><td>' + r[1] + '</td></tr>').join('') + '</tbody></table></div>' +
  '<div class="grid g2 mt" style="margin-top:26px"><div class="card"><h3>' + I('chart') + ' Không cài được WSL?</h3><p class="muted">Mọi bước và mọi câu hỏi chấm tự động của Lab 1–7 đều làm được trên web: Bàn phân tích cho bước đọc dữ liệu, nút “Làm trên web” cho bước dòng lệnh (máy web giả lập, Suricata, mã băm).</p><a class="btn" href="#banphantich">Mở Bàn phân tích</a></div>' +
  '<div class="card"><h3>' + I('server') + ' Phòng học cài được máy ảo?</h3><p class="muted">Lab 8 dựng phòng lab cô lập Kali – pfSense – SRV-LAB: kiểm thử tường lửa ALLOW/DENY, quét qua tường lửa, Suricata giám sát trực tiếp, hoàn nguyên snapshot.</p><a class="btn ghost" href="#lab-8">Vào Lab 8</a></div></div>' +
  '<div class="note info mt">' + I('alert') + '<div><b>Phạm vi thử nghiệm trên Ubuntu WSL:</b> chỉ máy web giả lập ở <code>127.0.0.1</code> (chính máy mình). Không quét, không gửi yêu cầu tới bất kỳ địa chỉ nào khác.</div></div>' +
  '</div></section>';
  v.addEventListener('click', e => { const b = e.target.closest('[data-cp]'); if (!b) return; const c = b.parentNode.querySelector('code').textContent; try { navigator.clipboard.writeText(c); A.toast('Đã sao chép lệnh'); } catch(err) {} });
};
P.banphantich = function(v){
  v.innerHTML = P.pageHead('<a href="#lab">Phòng lab</a>', 'Bàn phân tích nhật ký', 'Chọn tệp, gõ chuỗi cần tìm, bấm vào ô để lọc, chuyển tab để đếm, vẽ theo thời gian, đếm theo cửa sổ hoặc cộng khối lượng. Không cần cài đặt, chạy ngay trong trình duyệt.') + '<div class="wrap" style="padding:24px 20px 56px"><div id="c"></div><div class="grid g3 mt"><div class="card"><h4>' + I('search') + ' Lọc</h4><p class="small">Gõ chuỗi vào ô tìm kiếm rồi Enter. Bấm vào ô trong bảng: chỉ giữ hoặc loại bỏ giá trị đó.</p></div><div class="card"><h4>' + I('chart') + ' Đếm</h4><p class="small">“Đếm theo trường” cho biết giá trị nào nhiều nhất – nhưng nhiều nhất chưa chắc là tấn công.</p></div><div class="card"><h4>' + I('clock') + ' Cửa sổ thời gian</h4><p class="small">“Đếm theo cửa sổ” ghép phút/giờ với một trường – cách phát hiện dò mật khẩu, quét.</p></div></div></div>';
  Console($('#c', v), { src: 'windows_security.ndjson', view: 'table' });
};
})();
