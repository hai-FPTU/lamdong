/* =========================================================
   PHÒNG LAB – "LÀM TRÊN WEB": mô phỏng các bước dòng lệnh cho người không dùng Ubuntu
   - curl:     máy web giả lập 127.0.0.1:3000 (giống congcu/may_web_gia_lap.py) + nhật ký truy cập
   - suricata: Suricata đọc tệp bắt gói giả lập (giống congcu/sinh_pcap.py + marker.rules)
   - sha:      tính SHA-256 tệp dữ liệu (bằng chứng), kiểm tra dữ liệu gốc nguyên vẹn
   ========================================================= */
(function(){
const A = window.APP, esc = A.esc, I = window.ICON;

/* ---------- SHA-256 thuần JS (không phụ thuộc HTTPS/crypto.subtle) ---------- */
const K = new Uint32Array([0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2]);
function sha256(bytes){
  const l = bytes.length, nb = ((l + 9 + 63) >> 6) << 6, m = new Uint8Array(nb); m.set(bytes); m[l] = 0x80;
  const dv = new DataView(m.buffer); dv.setUint32(nb - 4, (l * 8) >>> 0); dv.setUint32(nb - 8, Math.floor(l / 0x20000000));
  const H = new Uint32Array([0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19]), W = new Uint32Array(64);
  for (let o = 0; o < nb; o += 64) {
    for (let i = 0; i < 16; i++) W[i] = dv.getUint32(o + i * 4);
    for (let i = 16; i < 64; i++) { const a = W[i - 15], b = W[i - 2];
      W[i] = (((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3)) + W[i - 16] + (((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10)) + W[i - 7]; }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i++) {
      const t1 = (h + (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) + ((e & f) ^ (~e & g)) + K[i] + W[i]) >>> 0;
      const t2 = ((((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    H[0] += a; H[1] += b; H[2] += c; H[3] += d; H[4] += e; H[5] += f; H[6] += g; H[7] += h;
  }
  return Array.from(H, x => ('0000000' + x.toString(16)).slice(-8)).join('');
}
const enc = s => new TextEncoder().encode(s);
async function fileText(name){ if (!(window.LABDATA && window.LABDATA[name] != null)) await A.loadScript('lab/data/' + name + '.js'); return window.LABDATA[name]; }
const now = () => { const d = new Date(), p = n => ('0' + n).slice(-2), M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const tz = -d.getTimezoneOffset(), sg = tz >= 0 ? '+' : '-', az = Math.abs(tz);
  return p(d.getDate()) + '/' + M[d.getMonth()] + '/' + d.getFullYear() + ':' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()) + ' ' + sg + p(az / 60 | 0) + p(az % 60); };
const httpDate = () => new Date().toUTCString();

/* ---------- 1. Máy web giả lập + curl ---------- */
const WEBLOG = [];
const SP = [{ id: 1, name: 'Apple Juice (1000ml)', price: 1.99 }, { id: 2, name: 'Orange Juice (1000ml)', price: 2.99 }, { id: 3, name: 'Banana Juice (1000ml)', price: 1.99 }, { id: 4, name: 'Lemon Juice (500ml)', price: 2.49 }];
const TRANG = '<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8"><title>Cổng thử nghiệm – phòng lab (giả lập)</title></head><body><h1>Cổng thử nghiệm của phòng lab</h1><p>Máy web giả lập phục vụ tập huấn. Không chứa dữ liệu thật.</p><p>API: <code>/rest/products/search?q=</code></p></body></html>';
function phucVu(method, path){
  const u = new URL(path, 'http://127.0.0.1:3000'); let code = 404, type = 'text/html; charset=utf-8', body;
  if (u.pathname === '/' || u.pathname === '/index.html') { code = 200; body = TRANG; }
  else if (u.pathname === '/rest/products/search') { const q = (u.searchParams.get('q') || '').toLowerCase(); code = 200; type = 'application/json; charset=utf-8'; body = JSON.stringify({ status: 'success', data: SP.filter(p => p.name.toLowerCase().indexOf(q) >= 0) }).replace(/,"/g, ', "').replace(/":/g, '": '); }  // định dạng giống json.dumps của Python
  else if (u.pathname === '/robots.txt') { code = 200; type = 'text/plain; charset=utf-8'; body = 'User-agent: *\nDisallow: /ftp\n'; }
  else body = '<!DOCTYPE html><html><body><pre>Cannot GET ' + u.pathname.replace(/</g, '&lt;') + '</pre></body></html>';
  const n = enc(body).length;
  const hd = [['Date', httpDate()], ['Access-Control-Allow-Origin', '*'], ['X-Content-Type-Options', 'nosniff'], ['X-Frame-Options', 'SAMEORIGIN'], ['Feature-Policy', "payment 'self'"], ['Content-Type', type], ['Content-Length', String(n)]];
  WEBLOG.push('127.0.0.1 - - [' + now() + '] "' + method + ' ' + u.pathname + u.search + ' HTTP/1.1" ' + code + ' ' + n + ' "-" "curl/8.5.0"');
  return { code, msg: code === 200 ? 'OK' : 'Not Found', hd, body: method === 'HEAD' ? '' : body, path: u.pathname + u.search };
}
function curl(box, cfg){
  const def = (cfg && cfg.path) || '/';
  box.innerHTML = '<div class="webw"><div class="webw-h">' + I('terminal') + ' <b>Mô phỏng trên web:</b> máy web giả lập ở <code>127.0.0.1:3000</code> và lệnh <code>curl</code> – kết quả giống khi chạy trên Ubuntu WSL</div>' +
    '<div class="row mt" style="gap:8px;flex-wrap:wrap"><select data-m><option value="HEAD">curl -sI (chỉ xem tiêu đề – kiểm tra trạng thái)</option><option value="GET">curl -sv (yêu cầu GET đầy đủ)</option></select>' +
    '<span class="mono small">http://127.0.0.1:3000</span><input data-p value="' + esc(def) + '" style="flex:1;min-width:220px">' +
    '<button class="btn small" data-go>' + I('play') + ' Gửi yêu cầu</button></div>' +
    '<div class="row small muted mt" style="gap:6px;flex-wrap:wrap">Thử nhanh: ' + ['/', '/rest/products/search?q=apple', '/robots.txt', '/lab-marker-test'].map(p => '<button class="chip" data-q="' + esc(p) + '">' + esc(p) + '</button>').join('') + '</div>' +
    '<div class="cmdline" data-out style="min-height:60px">Chọn kiểu yêu cầu, bấm “Gửi yêu cầu”.</div>' +
    '<div class="row between mt"><b class="small">Nhật ký của máy web giả lập (định dạng giống web_access.log)</b><span class="small" data-cnt></span></div><div class="cmdline" data-log style="min-height:40px">(chưa có yêu cầu nào)</div>' +
    '<p class="small muted">Chỉ là mô phỏng trong trình duyệt – không gửi gì ra mạng. Ánh xạ cột: $1 địa chỉ · $4 thời gian · $6–$7 phương thức, đường dẫn · $9 mã trạng thái · $10 kích thước.</p></div>';
  const $b = s => box.querySelector(s);
  const ve = () => { $b('[data-log]').textContent = WEBLOG.length ? WEBLOG.slice(-6).join('\n') : '(chưa có yêu cầu nào)';
    const c = {}; WEBLOG.forEach(l => { const k = l.split('" ')[1].split(' ')[0]; c[k] = (c[k] || 0) + 1; });
    $b('[data-cnt]').textContent = WEBLOG.length ? 'Đếm theo mã: ' + Object.keys(c).map(k => c[k] + ' × ' + k).join(' · ') : ''; };
  const go = () => { const m = $b('[data-m]').value, p = $b('[data-p]').value.trim() || '/';
    if (!p.startsWith('/')) { $b('[data-out]').textContent = 'Chỉ nhập đường dẫn bắt đầu bằng “/”. Phạm vi thử nghiệm duy nhất là 127.0.0.1:3000.'; return; }
    const r = phucVu(m, p);
    const st = 'HTTP/1.1 ' + r.code + ' ' + r.msg;
    if (m === 'HEAD') $b('[data-out]').textContent = '$ curl -sI http://127.0.0.1:3000' + r.path + ' | head -5\n' + [st].concat(r.hd.slice(0, 4).map(h => h[0] + ': ' + h[1])).join('\n');
    else $b('[data-out]').textContent = '$ curl -sv "http://127.0.0.1:3000' + r.path + '" -o /dev/null 2>&1 | grep -E "^(>|<)"\n> GET ' + r.path + ' HTTP/1.1\n> Host: 127.0.0.1:3000\n> User-Agent: curl/8.5.0\n> Accept: */*\n> \n< ' + st + '\n' + r.hd.map(h => '< ' + h[0] + ': ' + h[1]).join('\n') + '\n< \n\n(nội dung phản hồi)\n' + r.body.slice(0, 400);
    ve(); A.SND && A.SND.tap && A.SND.tap(); };
  box.addEventListener('click', e => { const q = e.target.closest('[data-q]'); if (q) { $b('[data-p]').value = q.dataset.q; go(); } if (e.target.closest('[data-go]')) go(); });
  if (cfg && cfg.m) $b('[data-m]').value = cfg.m;
  ve();
}

/* ---------- 2. Suricata đọc tệp bắt gói giả lập ---------- */
const PHIEN = [ // giống congcu/sinh_pcap.py
  { t: '2026-11-16T10:05:00.012000+0700', sp: 41001, uri: '/', st: 200 },
  { t: '2026-11-16T10:05:05.012000+0700', sp: 41002, uri: '/rest/products/search?q=apple', st: 200 },
  { t: '2026-11-16T10:05:12.012000+0700', sp: 41003, uri: '/lab-marker-test', st: 404 }];
const RULE0 = 'alert http any any -> any any (msg:"LAB-MARKER kiem thu quy tac (khong phai tan cong)"; flow:to_server,established; http.uri; content:"/lab-marker-test"; sid:1000001; rev:1;)';
function suricata(box){
  box.innerHTML = '<div class="webw"><div class="webw-h">' + I('terminal') + ' <b>Mô phỏng trên web:</b> Suricata đọc tệp bắt gói <code>lab_marker.pcap</code> (30 gói, 3 phiên HTTP) với quy tắc của nhóm – kết quả giống khi chạy trên Ubuntu WSL</div>' +
    '<div class="tbl-wrap mt"><table class="tbl"><thead><tr><th>Phiên</th><th>Thời điểm</th><th>Nguồn → đích</th><th>Yêu cầu</th><th>Phản hồi</th></tr></thead><tbody>' + PHIEN.map((p, i) => '<tr><td>' + (i + 1) + '</td><td class="mono small">' + p.t.slice(11, 19) + '</td><td class="mono small">192.168.56.10:' + p.sp + ' → 192.168.56.20:3000</td><td class="mono small">GET ' + esc(p.uri) + '</td><td>' + p.st + '</td></tr>').join('') + '</tbody></table></div>' +
    '<label class="small mt" style="display:block"><b>Tệp quy tắc</b> (mỗi dòng một quy tắc; dòng bắt đầu bằng # là chú thích). Thử thêm quy tắc SID 1000002 bắt <code>/rest/products/search</code>.</label>' +
    '<textarea data-r rows="3" class="mono" style="width:100%;font-size:.8rem;border:1.5px solid var(--line);border-radius:10px;padding:8px">' + esc(RULE0) + '</textarea>' +
    '<div class="row mt" style="gap:8px"><button class="btn small" data-run>' + I('play') + ' Chạy: suricata -r lab_marker.pcap -S quy_tac.rules</button><button class="btn small ghost" data-reset>Khôi phục quy tắc mẫu</button></div>' +
    '<div class="cmdline" data-out style="min-height:60px">Bấm “Chạy”.</div></div>';
  const $b = s => box.querySelector(s);
  const run = () => {
    const lines = $b('[data-r]').value.split('\n').map(x => x.trim()).filter(x => x && !x.startsWith('#'));
    const rules = [], errs = [];
    lines.forEach((l, i) => { const m = /^alert\s+http\s+\S+\s+\S+\s+->\s+\S+\s+\S+\s+\((.*)\)\s*$/.exec(l);
      const c = m && /content\s*:\s*"([^"]+)"/.exec(m[1]), sid = m && /sid\s*:\s*(\d+)/.exec(m[1]), msg = m && /msg\s*:\s*"([^"]*)"/.exec(m[1]);
      if (!m || !c || !sid) errs.push('E: detect-parse: lỗi cú pháp quy tắc dòng ' + (i + 1) + ' – cần dạng: alert http any any -> any any (msg:"..."; http.uri; content:"..."; sid:N; rev:1;)');
      else if (rules.some(r => r.sid === sid[1])) errs.push('E: detect-parse: trùng sid ' + sid[1] + ' ở dòng ' + (i + 1));
      else rules.push({ sid: sid[1], c: c[1], msg: msg ? msg[1] : '' }); });
    const al = [];
    PHIEN.forEach((p, k) => rules.forEach(r => { if (p.uri.indexOf(r.c) >= 0) al.push(JSON.stringify({ timestamp: p.t, src_ip: '192.168.56.10', dest_ip: '192.168.56.20', dest_port: 3000, sid: +r.sid })); }));
    const out = ['$ suricata -r lab_marker.pcap -S quy_tac.rules -l ketqua/suricata -k none', 'i: suricata: This is Suricata version 7.0.3 RELEASE running in USER mode'];
    if (errs.length) { $b('[data-out]').textContent = out.concat(errs, ['E: suricata: Loading signatures failed.']).join('\n'); return; }
    out.push(rules.length + ' signatures processed', 'i: pcap: read 1 file, 30 packets, 2296 bytes', '', '$ jq -c \'select(.event_type=="alert") | {timestamp,src_ip,dest_ip,dest_port,sid:.alert.signature_id}\' ketqua/suricata/eve.json');
    out.push(al.length ? al.join('\n') : '(không có cảnh báo nào)');
    out.push('', '$ jq -r \'.event_type\' ketqua/suricata/eve.json | sort | uniq -c', (al.length ? '      ' + al.length + ' alert\n' : '') + '      3 fileinfo\n      3 flow\n      3 http\n      1 stats');
    $b('[data-out]').textContent = out.join('\n'); A.SND && A.SND.tap && A.SND.tap();
  };
  box.addEventListener('click', e => { if (e.target.closest('[data-run]')) run(); if (e.target.closest('[data-reset]')) { $b('[data-r]').value = RULE0; } });
}

/* ---------- 3. SHA-256: bảo toàn bằng chứng và kiểm tra dữ liệu gốc ---------- */
function sha(box, cfg){
  const SRC = window.LABSRC || []; const kiemtra = cfg && cfg.mode === 'kiemtra';
  const chon = kiemtra ? SRC.map(s => s[0]) : ['windows_security.ndjson', 'wazuh_alerts.ndjson', 'suricata_eve.json', 'netflow.csv'];
  box.innerHTML = '<div class="webw"><div class="webw-h">' + I('terminal') + ' <b>Mô phỏng trên web:</b> ' + (kiemtra ? 'kiểm tra 20 tệp dữ liệu gốc không bị thay đổi (tương đương <code>sha512sum -c congcu/SHA512SUMS</code>)' : 'tính mã băm SHA-256 các tệp bằng chứng – kết quả giống lệnh <code>sha256sum</code> trên Ubuntu') + '</div>' +
    (kiemtra ? '' : '<div class="row mt" style="gap:10px;flex-wrap:wrap">' + SRC.map(s => '<label class="small"><input type="checkbox" data-f="' + esc(s[0]) + '"' + (chon.indexOf(s[0]) >= 0 ? ' checked' : '') + '> ' + esc(s[0]) + '</label>').join('') + '</div>') +
    '<div class="row mt"><button class="btn small" data-run>' + I('play') + (kiemtra ? ' Kiểm tra dữ liệu gốc' : ' Tính SHA-256') + '</button></div><div class="cmdline" data-out style="min-height:50px">' + (kiemtra ? 'Bấm “Kiểm tra dữ liệu gốc”.' : 'Chọn tệp, bấm “Tính SHA-256”.') + '</div>' +
    (kiemtra ? '' : '<p class="small muted">Ghi vào phiếu chuỗi bàn giao: tệp – mã băm – người thu – thời điểm – nơi lưu. Mã băm chỉ đúng khi tệp không bị sửa, kể cả đổi ký tự xuống dòng.</p>') + '</div>';
  const $b = s => box.querySelector(s);
  box.addEventListener('click', async e => { if (!e.target.closest('[data-run]')) return;
    const files = kiemtra ? chon : Array.from(box.querySelectorAll('[data-f]:checked')).map(x => x.dataset.f);
    if (!files.length) { $b('[data-out]').textContent = 'Chưa chọn tệp nào.'; return; }
    $b('[data-out]').textContent = 'Đang tính…'; const rs = [];
    for (const f of files) { const h = sha256(enc(await fileText(f))); rs.push([f, h]); }
    if (kiemtra) {
      const bad = rs.filter(r => { const s = SRC.find(x => x[0] === r[0]); return !s || !s[3] || sha256(enc(r[1] + '|ok')).slice(0, 16) !== s[3]; });
      $b('[data-out]').textContent = '$ sha512sum -c --quiet congcu/SHA512SUMS && echo \'Dữ liệu gốc nguyên vẹn\'\n' + (bad.length ? bad.map(r => r[0] + ': FAILED').join('\n') + '\nsha512sum: WARNING: ' + bad.length + ' computed checksum did NOT match' : rs.length + ' tệp khớp mã băm gốc.\nDữ liệu gốc nguyên vẹn');
    } else $b('[data-out]').textContent = '$ sha256sum ' + files.join(' ') + ' | tee ~/lab/ketqua/bang_chung.sha256\n' + rs.map(r => r[1] + '  ' + r[0]).join('\n') + '\n\n$ sha256sum -c ~/lab/ketqua/bang_chung.sha256\n' + rs.map(r => r[0] + ': OK').join('\n');
    A.SND && A.SND.tap && A.SND.tap(); });
}

window.LABWEB = { curl, suricata, sha, sha256 };
})();
