/* =========================================================
   CÁC TRANG: Trang chủ, Chương trình, Chuyên đề, Pháp luật, Biểu mẫu,
   Kiểm tra cuối khoá, Chế độ giảng viên, Giấy xác nhận
   ========================================================= */
(function(){
const A = window.APP, D = A.D, st = A.st, $ = A.$, $$ = A.$$, esc = A.esc, I = window.ICON, V = window.VIZ;
const CT = window.CT, CD = window.CD, LUAT = window.LUAT, COL = D.colors;
const P = window.PAGES = window.PAGES || {};

function backBtn(){ return (A.canBack && A.canBack() && !/^#(lab|banphantich|camnang|moitruong)/.test(location.hash)) ? '<button class="crumb-back" data-navback title="Quay lại trang trước, đúng chỗ đang đọc">← Quay lại</button>' : ''; }
P.backBtn = backBtn;
function pageHead(crumb, title, sub){
  return '<section class="page-head"><div class="wrap"><div class="crumb">' + backBtn() + '<a href="#home">Trang chủ</a> / ' + crumb + '</div><h1>' + title + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div></section>';
}
P.pageHead = pageHead;
const HT = { 'LT': ['lt', 'Lý thuyết'], 'Demo': ['demo', 'Trình diễn'], 'TH': ['th', 'Thực hành'], 'ĐG': ['dg', 'Đánh giá'], 'Nghỉ': ['nghi', 'Giải lao'] };
const htBadge = h => '<span class="badge ' + (HT[h] || ['nghi'])[0] + '">' + (HT[h] || [h, h])[1] + '</span>';
function secDone(cd){ const c = CD[cd - 1]; return c.sections.filter((s, i) => st.sec[cd + '-' + i]).length; }
function heroArt(){
  const t = V.txt; let s = '<defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee"/><stop offset=".6" stop-color="#2563eb"/><stop offset="1" stop-color="#1e3a8a"/></linearGradient></defs>';
  s += '<circle cx="250" cy="220" r="170" fill="none" stroke="#67e8f9" stroke-opacity=".25" stroke-dasharray="4 10" style="transform-origin:250px 220px;animation:spin 60s linear infinite"/><circle cx="250" cy="220" r="120" fill="none" stroke="#a5b4fc" stroke-opacity=".25" stroke-dasharray="2 8" style="transform-origin:250px 220px;animation:spin 40s linear infinite reverse"/>';
  const N = [[90, 110, 'FW'], [410, 110, 'SIEM'], [70, 320, 'IDS'], [430, 320, 'WEB'], [250, 410, 'DB'], [250, 30, 'MAIL']];
  N.forEach((n, i) => { s += '<path d="M' + n[0] + ' ' + n[1] + ' L250 220" stroke="#67e8f9" stroke-opacity=".5" stroke-width="2" class="flow"/><circle r="5" fill="#f97316"><animateMotion dur="' + (2 + i * .3) + 's" repeatCount="indefinite" path="M' + n[0] + ' ' + n[1] + ' L250 220"/></circle><g class="pop" style="animation-delay:' + i * .12 + 's"><rect x="' + (n[0] - 34) + '" y="' + (n[1] - 20) + '" width="68" height="40" rx="10" fill="#0f2557" stroke="#38bdf8"/>' + t(n[0], n[1] + 4, n[2], { s: 12, c: '#e0f2fe', w: 800 }) + '</g>'; });
  s += '<path d="M250 120l80 30v58c0 52-34 92-80 112-46-20-80-60-80-112v-58z" fill="url(#hg)" stroke="#fff" stroke-opacity=".5" stroke-width="2"/><rect x="220" y="200" width="60" height="48" rx="8" fill="#fff"/><path d="M231 200v-14a19 19 0 0 1 38 0v14" fill="none" stroke="#fff" stroke-width="7"/><circle cx="250" cy="220" r="7" fill="#f97316"/><rect x="247" y="224" width="6" height="12" rx="3" fill="#f97316"/>';
  s += t(250, 300, '0101 1101 0011', { s: 10, c: '#67e8f9', w: 600 });
  return '<svg class="hero-art" viewBox="0 0 500 450" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lá chắn bảo vệ hệ thống thông tin">' + s + '</svg>';
}

/* ================= TRANG CHỦ ================= */
P.home = function(v){
  const tot = CT.phanbo[CT.phanbo.length - 1];
  const labsDone = window.LABS.filter(L => st.labAns[L.id] && L.qs.some(q => st.labAns[L.id].ok[q.id])).length;
  const tiles = [
    ['chuyende', 'cap', '#2563eb', 'Bài giảng 6 chuyên đề', 'Hình động, thuật ngữ bấm để mở, ví dụ thực tế cơ quan, câu hỏi nhanh cuối mỗi chuyên đề.'],
    ['thuchanh', 'puzzle', '#7c3aed', 'Bài tập tương tác', window.GAMES.length + ' bài: soi bất thường trong ảnh, sơ đồ, thư, web; phân loại; mô phỏng tường lửa; diễn tập.'],
    ['lab', 'terminal', '#0d9488', 'Phòng lab', '6 tình huống trên bộ dữ liệu giả lập 7 ngày, Bàn phân tích trên trình duyệt, phiếu chấm tự động.'],
    ['moitruong', 'download', '#ea580c', 'Tải dữ liệu lab, cài Ubuntu WSL', 'Nút tải gói dữ liệu 20 tệp; 5 bước đưa dữ liệu vào Ubuntu trên Windows cho nhánh IT; sơ đồ mạng và nguồn từng tệp.'],
    ['phapluat', 'scale', '#e11d48', 'Sổ tra cứu hiệu lực văn bản', 'Luật ANM 2025, gói NĐ 327–333/2026, BVDLCN – trạng thái rà soát đến ' + LUAT.checked + '.'],
    ['bieumau', 'form', '#f97316', 'Biểu mẫu PL-01 … PL-06', 'Điền trực tiếp, thêm dòng, xuất Word nộp theo nhóm.'],
    ['kiemtra', 'award', '#16a34a', 'Kiểm tra cuối khoá', '20 câu ngẫu nhiên từ 6 chuyên đề, 15 phút, kết quả theo từng chuyên đề.'],
    ['giangvien', 'presenter', '#0b1b3f', 'Chế độ giảng viên', 'Kế hoạch 240 phút từng buổi, đồng hồ theo mốc phút, theo dõi nộp sản phẩm 10 nhóm.'],
    ['chuongtrinh', 'list', '#0ea5e9', 'Chương trình 3 ngày', 'Bảng tổng hợp, phân bổ thời gian, phương án tổ chức lớp 60 học viên.']];
  const days = [1, 2, 3].map(d => { const ss = CT.sess.filter(s => s.ngay === d); return '<div class="day reveal"><div class="dh"><b>Ngày ' + d + '</b><span>' + ss[0].date + '</span></div>' + ss.map(s => '<a class="ses" href="#chuyende-' + s.cd + '"><span class="cdn" style="background:' + COL[s.cd - 1] + '">' + s.cd + '</span><span><small>Buổi ' + s.buoi.toLowerCase() + ' · Chuyên đề ' + s.cd + '</small><b>' + esc(s.ten.charAt(0) + s.ten.slice(1).toLowerCase()) + '</b></span></a>').join('') + '</div>'; }).join('');
  v.innerHTML =
  '<section class="hero"><div class="wrap hero-in"><div>' +
    '<div class="school-line">' + I('shield') + '<span>' + esc(D.site.org2) + '</span></div>' +
    '<h1>' + esc(D.site.h1a) + '</h1>' +
    '<div class="hero-meta"><span class="lead">' + esc(D.site.h1b) + ' · <b>' + esc(D.site.org) + '</b></span><span class="hero-date">' + I('clock') + ' ' + esc(D.site.date) + '</span></div>' +
    '<div class="quick"><a class="primary" href="#chuyende">' + I('cap') + ' Bài giảng</a><a href="#thuchanh">' + I('puzzle') + ' Thực hành</a><a href="#lab">' + I('terminal') + ' Phòng lab</a><a href="#phapluat">' + I('scale') + ' Pháp luật</a><a href="#kiemtra">' + I('award') + ' Kiểm tra</a></div>' +
    '<div class="hero-stats"><div><b>6</b><span>chuyên đề · 6 buổi</span></div><div><b>' + (CT.phanbo.slice(1, 7).length * 240).toLocaleString('vi-VN') + '</b><span>phút (' + tot[3] + ' thực hành)</span></div><div><b>' + Object.keys(st.prac).length + '/' + window.GAMES.length + '</b><span>bài tập đã làm</span></div><div><b>' + labsDone + '/6</b><span>lab đã nộp phiếu</span></div></div>' +
    '<div class="org-line"><span>' + I('users') + ' 60 học viên · 10 nhóm</span><span>' + I('book') + ' Biên soạn: ' + esc(D.site.editor) + '</span></div>' +
  '</div>' + heroArt() + '</div></section>' +
  '<section class="sec"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Lịch học</div><h2>3 ngày · 6 buổi · 6 chuyên đề</h2><p>Mỗi buổi 240 phút gồm lý thuyết, trình diễn, thực hành, đánh giá và 15 phút giải lao. Bấm vào buổi để mở bài giảng.</p></div><a class="btn ghost" href="#chuongtrinh">' + I('list') + ' Xem chương trình chi tiết</a></div><div class="days">' + days + '</div></div></section>' +
  '<section class="sec alt"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Bắt đầu nhanh</div><h2>Đồng chí muốn làm gì?</h2><p>Không cần tài khoản. Tiến độ và bài làm tự lưu trên máy này.</p></div></div><div class="grid g4">' + tiles.map((t, i) => '<a class="tile reveal" style="transition-delay:' + i * 50 + 'ms" href="#' + t[0] + '"><span class="ibox" style="background:' + t[2] + '">' + I(t[1]) + '</span><h3>' + t[3] + '</h3><p>' + t[4] + '</p><span class="go">Mở ' + I('arrow') + '</span></a>').join('') + '</div></div></section>' +
  '<section class="sec"><div class="wrap"><div class="grid g2" style="gap:30px;align-items:center"><div class="reveal"><div class="eyebrow">Mục tiêu chương trình</div><h2>Từ kiến thức đến thao tác, biểu mẫu và quyết định có chứng cứ</h2><p class="muted">' + esc(CT.muctieu) + '</p><p class="small muted">' + esc(CT.doituong) + '</p></div><div class="reveal card"><h3 class="mb">Phân bổ thời lượng toàn khoá</h3>' + allocBars() + '</div></div></div></section>' +
  '<section class="sec dark"><div class="wrap"><div class="sec-head"><div><div class="eyebrow">Nguyên tắc</div><h2>Sử dụng dữ liệu và bảo đảm an toàn</h2><p>' + esc(CT.nguyentac) + '</p></div><a class="btn orange" href="#phapluat">' + I('scale') + ' Văn bản đã rà soát hiệu lực</a></div>' +
  '<div class="steps5" style="grid-template-columns:repeat(4,1fr)">' + [['database', '#0ea5e9', 'GIẢ LẬP', 'Tình huống, sơ đồ, địa chỉ, tài khoản trong tài liệu đều là giả lập.'], ['lock', '#16a34a', 'CÔ LẬP', 'Quét, giám sát chỉ trong lab host-only 192.168.56.0/24 hoặc phạm vi được cấp phép.'], ['scale', '#f97316', 'ĐỐI CHIẾU', 'Văn bản pháp luật, biểu mẫu phải đối chiếu bản gốc còn hiệu lực trước khi dùng thật.'], ['eye', '#e11d48', 'LÀM SẠCH', 'Không đưa token, cookie, mật khẩu, IP nội bộ thật vào báo cáo.']].map(s => '<div class="step reveal"><div class="ibox" style="background:' + s[1] + '">' + I(s[0] === 'database' ? 'db' : s[0]) + '</div><h3>' + s[2] + '</h3><p>' + s[3] + '</p></div>').join('') + '</div></div></section>';
};
function allocBars(){
  const t = CT.phanbo[CT.phanbo.length - 1]; const items = [['Lý thuyết', t[1], '#2563eb'], ['Trình diễn', t[2], '#7c3aed'], ['Thực hành', t[3], '#16a34a'], ['Đánh giá', t[4], '#f97316'], ['Giải lao', t[5], '#94a3b8']];
  const tot = items.reduce((a, x) => a + parseInt(x[1]), 0);
  return '<div class="tbar" style="max-width:none;background:#e2e8f0">' + items.map(x => '<i style="width:' + parseInt(x[1]) / tot * 100 + '%;background:' + x[2] + '" title="' + x[0] + ' ' + x[1] + '"></i>').join('') + '</div><div class="bars mt">' + items.map(x => '<div class="bar" style="font-family:inherit"><span>' + x[0] + '</span><span><i class="bv" style="display:block;width:' + parseInt(x[1]) / 515 * 100 + '%;background:' + x[2] + '"></i></span><span class="bn">' + x[1] + '</span></div>').join('') + '</div><p class="small muted mt">Tổng 1.440 phút; thời gian đào tạo, đánh giá (không gồm giải lao) 1.350 phút = 22 giờ 30 phút.</p>';
}

/* ================= CHƯƠNG TRÌNH ================= */
P.chuongtrinh = function(v){
  const tbl = (rows, cls) => '<div class="tbl-wrap"><table class="tbl ' + (cls || '') + '"><thead><tr>' + rows[0].map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + rows.slice(1).map(r => '<tr' + (/^TỔNG/.test(r[0]) ? ' class="tot"' : '') + '>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  v.innerHTML = pageHead('Chương trình', 'Chương trình tập huấn an ninh mạng và bảo vệ hệ thống thông tin', esc(D.site.org) + ' · 03 ngày · 06 buổi · 60 học viên. Nội dung trích nguyên văn từ chương trình đã ban hành.') +
  '<div class="wrap" style="padding:28px 20px 56px">' +
  '<section class="lsec"><h2>1. Thông tin chung</h2><p><b>Mục tiêu.</b> ' + esc(CT.muctieu) + '</p><p><b>Đối tượng, phạm vi.</b> ' + esc(CT.doituong) + '</p><p><b>Phương pháp.</b> ' + esc(CT.phuongphap) + '</p><p><b>Nguyên tắc dữ liệu và an toàn.</b> ' + esc(CT.nguyentac) + '</p></section>' +
  '<section class="lsec"><h2>2. Bảng tổng hợp chương trình 03 ngày</h2>' + tbl(CT.tong) + '<h3 class="mt">Phân bổ thời gian và nguyên tắc vận hành</h3>' + tbl(CT.phanbo) + '</section>' +
  '<section class="lsec"><h2>3. Sáu buổi tập huấn</h2><div class="grid g3">' + CT.sess.map(s => '<a class="tile" href="#chuyende-' + s.cd + '"><span class="ibox" style="background:' + COL[s.cd - 1] + '">' + I(D.cdIcons[s.cd - 1]) + '</span><div class="eyebrow">Ngày ' + s.ngay + ' · ' + s.buoi + ' · ' + s.date + '</div><h3>Chuyên đề ' + s.cd + '. ' + esc(s.ten.charAt(0) + s.ten.slice(1).toLowerCase()) + '</h3><p>' + esc(s.muctieu) + '</p><span class="go">Bài giảng ' + I('arrow') + '</span></a>').join('') + '</div></section>' +
  '<section class="lsec"><h2>4. Phương án tổ chức lớp 60 học viên</h2><p>' + esc(CT.chianhom) + '</p>' + tbl(CT.nhom) + '<h3 class="mt">Quy trình quản lý sản phẩm theo buổi</h3><p>' + esc(CT.quanly) + '</p><h3 class="mt">Kịch bản khi hạ tầng trình diễn gặp sự cố</h3>' + tbl(CT.dutphong) + '</section>' +
  '<section class="lsec"><h2>5. Thiết bị, phần mềm và mô hình lab</h2><p>' + esc(CT.thietbi) + '</p>' + tbl(CT.labvm) + '<div class="go-links"><a class="btn small ghost" href="#chuyende-3">' + I('network') + ' Sơ đồ lab host-only (Chuyên đề 3)</a></div></section>' +
  '<section class="lsec"><h2>6. Phương pháp đánh giá</h2><p>' + esc(CT.danhgia) + '</p>' + tbl(CT.rubric) + '<p class="mt">' + esc(CT.cuoikhoa) + '</p><div class="go-links"><a class="btn small" href="#kiemtra">' + I('award') + ' Kiểm tra cuối khoá</a><a class="btn small ghost" href="#bieumau">' + I('form') + ' Biểu mẫu PL-01 … PL-06</a></div></section>' +
  '<section class="lsec"><h2>7. Cơ sở tài liệu và phạm vi vận dụng</h2><p>' + esc(CT.coso) + '</p><a class="btn small ghost" href="#phapluat">' + I('scale') + ' Kết quả rà soát hiệu lực văn bản</a></section></div>';
};

/* ================= CHUYÊN ĐỀ ================= */
function tryHTML(t, cd, i){
  if (!t) return '';
  if (t.type === 'link') return '<div class="go-links"><a class="btn small" href="#' + t.to + '">' + I('play') + ' ' + esc(t.label) + '</a></div>';
  if (t.type === 'cia') return '<div class="trybox" data-try="cia"><b>' + I('sparkle') + ' Thử ngay: lộ, sửa hay mất?</b>' + [['Ảnh chụp danh sách cán bộ dự thi nâng ngạch bị đăng lên mạng', 'C'], ['Kế hoạch đã duyệt bị đổi ngày trong hệ thống', 'I'], ['Máy chủ thư hết dung lượng, không gửi nhận được 3 giờ', 'A']].map((x, k) => '<div class="tfrow" data-a="' + x[1] + '"><span><span class="lt">' + (k + 1) + '.</span>' + esc(x[0]) + '</span><span class="tfbtn"><button>C</button><button>I</button><button>A</button></span></div>').join('') + '</div>';
  if (t.type === 'scenario4') return '<div class="trybox" data-try="sc4"><b>' + I('sparkle') + ' Thử ngay: ghép một kịch bản rủi ro</b><div class="grid g2">' + [['Nguồn đe dọa', ['Nhóm lừa đảo qua thư', 'Người nội bộ sắp nghỉ việc', 'Nhà thầu bảo trì']], ['Điểm yếu', ['chưa bật MFA', 'quyền truy cập thư mục chung quá rộng', 'tài khoản VPN không hết hạn']], ['Tài sản', ['hộp thư công vụ', 'máy chủ tệp dùng chung', 'hệ thống văn bản']], ['Hậu quả', ['làm lộ văn bản (C)', 'văn bản bị sửa (I)', 'hệ thống ngừng (A)']]].map(f => '<div class="field"><label>' + f[0] + '</label><select style="padding:9px;border-radius:10px;border:1.5px solid var(--line)"><option value="">– chọn –</option>' + f[1].map(o => '<option>' + o + '</option>').join('') + '</select></div>').join('') + '</div><div class="fb mid" data-out>Chọn đủ 4 thành phần.</div></div>';
  if (t.type === 'nmap') return '<div class="trybox" data-try="nmap"><b>' + I('sparkle') + ' Thử ngay: đọc kết quả Nmap</b><pre class="demo-box">PORT     STATE  SERVICE VERSION\n22/tcp   open   ssh     OpenSSH 8.9p1 Ubuntu\n80/tcp   closed http\n3000/tcp open   http    Node.js Express framework</pre>' + [['Cổng 80 đang có dịch vụ web chạy.', 0, 'closed = đến được máy nhưng không có dịch vụ lắng nghe.'], ['Có thể kết luận ứng dụng ở cổng 3000 có lỗ hổng.', 0, 'Mới phát hiện dịch vụ; phải kiểm thử có phép mới chứng minh được lỗ hổng.'], ['Phiên bản OpenSSH lấy từ banner có thể không chính xác.', 1, 'Banner có thể bị sửa hoặc bản vá không đổi số phiên bản.']].map((x, k) => '<div class="tfrow" data-tf="' + x[1] + '" data-e="' + esc(x[2]) + '"><span><span class="lt">' + (k + 1) + '.</span>' + esc(x[0]) + '</span><span class="tfbtn"><button data-v="1">Đúng</button><button data-v="0">Sai</button></span></div>').join('') + '</div>';
  return '';
}
function bindTry(root){
  root.addEventListener('click', e => {
    const b = e.target.closest('.tfbtn button'); if (!b) return; const row = b.closest('.tfrow'); if (row.classList.contains('right') || row.classList.contains('wrong')) return;
    let ok; if (row.dataset.a) ok = b.textContent === row.dataset.a; else ok = b.dataset.v === row.dataset.tf;
    b.classList.add('sel'); row.classList.add(ok ? 'right' : 'wrong'); A.SND[ok ? 'ok' : 'no']();
    if (row.dataset.e) row.insertAdjacentHTML('beforeend', '<span class="small" style="grid-column:1/-1">' + row.dataset.e + '</span>');
    if (ok) A.addXP(3);
  });
  root.addEventListener('change', e => { const box = e.target.closest('[data-try=sc4]'); if (!box) return; const s = $$('select', box).map(x => x.value); const out = $('[data-out]', box);
    if (s.every(Boolean)) { out.className = 'fb ok'; out.innerHTML = I('check') + '<div><b>Kịch bản:</b> ' + esc(s[0]) + ' lợi dụng việc ' + esc(s[1]) + ' tác động vào ' + esc(s[2]) + ', ' + esc(s[3]) + '. Bây giờ có thể chấm L và I với luận cứ.</div>'; A.SND.ok(); }
    else { out.className = 'fb mid'; out.textContent = 'Còn thiếu ' + s.filter(x => !x).length + ' thành phần – chưa chấm điểm được.'; } });
}
P.chuyende = function(v, param){
  if (!param) {
    v.innerHTML = pageHead('Chuyên đề', 'Bài giảng 6 chuyên đề', 'Mỗi chuyên đề bám đúng kế hoạch 240 phút của chương trình: lý thuyết có hình động, phần trình diễn, hướng dẫn thực hành, liên kết bài tập và lab, câu hỏi nhanh.') +
      '<section class="sec"><div class="wrap"><div class="grid g3">' + CD.map((c, i) => { const s = CT.sess[i]; const dn = secDone(c.id); return '<a class="tile reveal" href="#chuyende-' + c.id + '"><span class="ibox" style="background:' + COL[i] + '">' + I(D.cdIcons[i]) + '</span><div class="eyebrow">Ngày ' + s.ngay + ' · buổi ' + s.buoi.toLowerCase() + ' · ' + s.date.split(', ')[1] + '</div><h3>Chuyên đề ' + c.id + '. ' + esc(c.short) + '</h3><p>' + esc(s.muctieu) + '</p><div class="progress-bar"><i style="width:' + dn / c.sections.length * 100 + '%"></i></div><span class="go">' + dn + '/' + c.sections.length + ' mục · Mở ' + I('arrow') + '</span></a>'; }).join('') + '</div></div></section>';
    return;
  }
  const n = +param, c = CD[n - 1]; if (!c) return P.chuyende(v);
  const s = CT.sess[n - 1], col = COL[n - 1], pb = CT.phanbo[n];
  const alloc = [['Lý thuyết', pb[1], '#60a5fa'], ['Trình diễn', pb[2], '#a78bfa'], ['Thực hành', pb[3], '#4ade80'], ['Đánh giá', pb[4], '#fb923c'], ['Giải lao', pb[5], '#94a3b8']];
  const games = window.GAMES.filter(g => g.cd === n), lab = window.LABS.find(L => L.buoi === n);
  let h = '<section class="cd-hero" style="--c:' + col + '"><div class="wrap"><div class="crumb">' + backBtn() + '<a href="#home">Trang chủ</a> / <a href="#chuyende">Chuyên đề</a> / Chuyên đề ' + n + '</div><h1>' + esc(s.tieude) + '</h1><div class="meta"><span>' + I('clock') + ' ' + s.date + '</span><span>Buổi ' + s.buoi.toLowerCase() + ' · 240 phút</span><span>' + c.sections.length + ' mục</span></div>' +
    '<div class="tbar">' + alloc.map(a => '<i style="width:' + parseInt(a[1]) / 240 * 100 + '%;background:' + a[2] + '"></i>').join('') + '</div><div class="tbar-l">' + alloc.map(a => '<span style="--c:' + a[2] + '">' + a[0] + ' ' + a[1] + '</span>').join('') + '</div><div class="goal"><b>Mục tiêu đạt được:</b> ' + esc(s.muctieu) + '</div></div></section>';
  h += '<div class="wrap cd-layout"><nav class="cd-side" aria-label="Mục lục chuyên đề"><div class="grp">Nội dung</div><a href="#chuyende-' + n + '" data-jump="kh"><span class="n">' + I('list') + '</span>Kế hoạch 240 phút</a>' + c.sections.map((x, i) => '<a href="#chuyende-' + n + '" data-jump="s' + i + '" class="' + (st.sec[n + '-' + i] ? 'done' : '') + '"><span class="n">' + (i + 1) + '</span>' + esc(x.t) + '</a>').join('') + '<div class="grp">Vận dụng</div><a href="#chuyende-' + n + '" data-jump="th"><span class="n">' + I('puzzle') + '</span>Thực hành, sản phẩm</a><a href="#chuyende-' + n + '" data-jump="qz"><span class="n">' + I('check') + '</span>Câu hỏi nhanh</a></nav><div class="lesson-body">';
  h += '<details class="lsec" id="kh"><summary style="cursor:pointer;font-weight:900;font-size:1.15rem">' + I('list') + ' Kế hoạch hoạt động trong 240 phút (bấm để mở)</summary><div class="tbl-wrap mt"><table class="tbl"><thead><tr><th>STT</th><th>Nội dung / hoạt động</th><th>Kiến thức, kỹ năng cần đạt</th><th>Hình thức</th><th>Phút</th><th>Công cụ / tài liệu</th><th>Mốc phút</th></tr></thead><tbody>' + s.hd.map(r => '<tr' + (r.nd === 'TỔNG THỜI LƯỢNG' ? ' class="tot"' : '') + '><td>' + esc(r.stt) + '</td><td>' + esc(r.nd) + '</td><td>' + esc(r.kn) + '</td><td>' + (r.ht ? htBadge(r.ht) : '') + '</td><td class="num">' + esc(r.phut) + '</td><td>' + esc(r.cc) + '</td><td class="num">' + esc(r.moc) + '</td></tr>').join('') + '</tbody></table></div></details>';
  c.sections.forEach((x, i) => {
    const acts = (x.act || []).map(a => s.hd.find(r => +r.stt === a)).filter(Boolean);
    h += '<section class="lsec" id="s' + i + '" style="--c:' + col + '"><div class="sh"><span class="sn">' + (i + 1) + '</span><div><h2>' + esc(x.t) + '</h2><div class="sm">' + acts.map(r => htBadge(r.ht) + '<span class="badge nghi">HĐ ' + r.stt + ' · ' + r.phut + ' phút · mốc ' + r.moc + '</span>').join('') + '</div>' + (acts[0] ? '<div class="skn">Cần đạt: ' + esc(acts[0].kn) + ' · Công cụ: ' + esc(acts[0].cc) + '</div>' : '') + '</div></div>';
    const viz = x.viz && V.has(x.viz) ? '<div class="viz">' + V.html(x.viz) + '<div class="cap">Hình động – bấm vào thành phần có viền để xem giải thích</div><div class="note info hide vinfo"></div></div>' : '';
    h += '<div class="two"><div>' + '<ul class="pts">' + x.pts.map(p => '<li>' + esc(p) + '</li>').join('') + '</ul>' + (x.code ? '<div class="demo-box">' + x.code + '</div>' : '') + '</div>' + viz + '</div>';
    if (x.terms) h += '<div class="terms">' + x.terms.map(t => '<button class="term"><b>' + esc(t[0]) + '</b><span class="en">' + esc(t[1]) + '</span><p>' + esc(t[2]) + '</p></button>').join('') + '</div>';
    if (x.note) h += '<div class="note ' + x.note.k + '">' + I(x.note.k === 'law' ? 'scale' : 'alert') + '<div>' + esc(x.note.t) + '</div></div>';
    h += tryHTML(x.try, n, i);
    if (x.go) h += '<div class="go-links">' + x.go.map(g => '<a class="btn small ghost" href="' + g[1] + '">' + esc(g[0]) + ' ' + I('arrow') + '</a>').join('') + '</div>';
    if (x.remember) h += '<div class="remember"><span class="ibox">' + I('flag') + '</span><div><b>Ghi nhớ</b><p>' + esc(x.remember) + '</p></div></div>';
    h += '<div class="row end mt"><button class="btn small ' + (st.sec[n + '-' + i] ? 'green' : 'ghost') + '" data-done="' + i + '">' + I('check') + ' ' + (st.sec[n + '-' + i] ? 'Đã học xong' : 'Đánh dấu đã học') + '</button></div></section>';
  });
  h += '<section class="lsec" id="th" style="--c:' + col + '"><div class="sh"><span class="sn">' + I('puzzle') + '</span><div><h2>Thực hành và sản phẩm của buổi</h2></div></div>' +
    '<p><b>Nội dung trình diễn của giảng viên.</b> ' + esc(s.demo) + '</p><p><b>Hướng dẫn tổ chức bài thực hành.</b> ' + esc(s.baith) + '</p>' +
    '<div class="branch"><div class="vp"><b>Nhánh dành cho cán bộ văn phòng</b>' + esc(s.vp) + '</div><div class="it"><b>Nhánh dành cho cán bộ IT</b>' + esc(s.it) + '</div></div>' +
    '<div class="kv"><b>Thiết bị – dữ liệu – biểu mẫu</b><span>' + esc(s.chuanbi) + '</span><b>Sản phẩm phải nộp</b><span>' + esc(s.sanpham) + '</span><b>Tiêu chí đánh giá</b><span>' + esc(s.tieuchi) + '</span>' + (s.luuy ? '<b>Lưu ý</b><span>' + esc(s.luuy) + '</span>' : '') + '</div>' +
    '<div class="grid g3 mt">' + (lab ? '<a class="tile" href="#lab-' + lab.id + '"><span class="ibox" style="background:var(--navy)">' + I('terminal') + '</span><h3>Lab ' + lab.id + ': ' + esc(lab.title) + '</h3><p>' + lab.qs.length + ' câu chấm tự động · Bàn phân tích · xuất Word</p><span class="go">Vào lab ' + I('arrow') + '</span></a>' : '') + games.map(g => '<a class="tile" href="#thuchanh-' + g.id + '">' + (st.prac[g.id] ? '<span class="done-badge">' + st.prac[g.id] + '%</span>' : '') + '<span class="ibox" style="background:' + g.c + '">' + I(g.ic) + '</span><h3>' + esc(g.t) + '</h3><p>' + esc(g.d) + '</p></a>').join('') + '</div></section>';
  h += '<section class="lsec" id="qz"><div class="sh"><span class="sn" style="background:var(--green)">' + I('check') + '</span><div><h2>Câu hỏi nhanh – Chuyên đề ' + n + '</h2><div class="skn">Mỗi câu đúng +10 XP. Kết quả lưu trên máy.</div></div></div><div id="qzs">' + c.quiz.map((q, k) => A.mcqHTML(q, 'cd' + n + '-' + k, k)).join('') + '</div></section>';
  h += '<div class="lesson-nav">' + (n > 1 ? '<a class="btn ghost" href="#chuyende-' + (n - 1) + '">' + I('left') + ' Chuyên đề ' + (n - 1) + '</a>' : '<span></span>') + (n < 6 ? '<a class="btn" href="#chuyende-' + (n + 1) + '">Chuyên đề ' + (n + 1) + ' ' + I('arrow') + '</a>' : '<a class="btn" href="#kiemtra">Kiểm tra cuối khoá ' + I('arrow') + '</a>') + '</div></div></div>';
  v.innerHTML = h;
  V.bind(v); bindTry(v);
  A.bindMCQ($('#qzs', v), c.quiz);
  v.addEventListener('click', e => {
    const j = e.target.closest('[data-jump]'); if (j) { e.preventDefault(); const t = $('#' + j.dataset.jump, v); if (t) { if (t.tagName === 'DETAILS') t.open = true; t.scrollIntoView({ behavior: 'smooth' }); } return; }
    const tm = e.target.closest('.term'); if (tm) { tm.classList.toggle('open'); A.SND.tap(); return; }
    const d = e.target.closest('[data-done]'); if (d) { const k = n + '-' + d.dataset.done; st.sec[k] = !st.sec[k]; A.save(); if (st.sec[k]) A.addXP(5, 'Đã học: mục ' + (+d.dataset.done + 1)); d.className = 'btn small ' + (st.sec[k] ? 'green' : 'ghost'); d.innerHTML = I('check') + ' ' + (st.sec[k] ? 'Đã học xong' : 'Đánh dấu đã học'); const a = $('.cd-side [data-jump="s' + d.dataset.done + '"]', v); if (a) a.classList.toggle('done', !!st.sec[k]); }
  });
};

/* ================= PHÁP LUẬT ================= */
P.phapluat = function(v){
  let flt = 'all';
  const S = LUAT.status;
  v.innerHTML = pageHead('Pháp luật', 'Sổ tra cứu hiệu lực văn bản', 'Văn bản được nêu trong chương trình và các văn bản liên quan – trạng thái hiệu lực rà soát đến ngày ' + LUAT.checked + '. Mỗi mục có nguồn để đối chiếu. Đây là tài liệu học tập; trước khi áp dụng vào hệ thống thật phải đọc toàn văn bản gốc.') +
  '<div class="wrap" style="padding:28px 20px 56px">' +
  '<section class="lsec"><h2>' + I('clock') + ' Dòng thời gian thay đổi pháp luật</h2><div class="ltimeline">' + LUAT.timeline.map(t => '<div class="yr" style="--c:' + t.c + '"><b>' + t.y + '</b>' + esc(t.t) + '</div>').join('') + '</div></section>' +
  '<section class="lsec"><h2>' + I('alert') + ' Kết quả đối chiếu với tài liệu chương trình</h2><ul class="pts">' + LUAT.programNotes.map(x => '<li>' + esc(x) + '</li>').join('') + '</ul></section>' +
  '<div class="lawfilter" id="lf"><button class="on" data-f="all">Tất cả (' + LUAT.items.length + ')</button>' + Object.keys(S).map(k => '<button data-f="' + k + '"><span class="badge ' + S[k].cls + '">' + S[k].t + '</span> ' + LUAT.items.filter(x => x.st === k).length + '</button>').join('') + '</div><div id="lg"></div>' +
  '<section class="lsec mt"><h2>' + I('search') + ' Cách tự tra cứu hiệu lực trong 4 bước</h2><div class="steps5" style="grid-template-columns:repeat(4,1fr)">' + LUAT.how.map((x, i) => '<div class="step"><span class="num">0' + (i + 1) + '</span><h3>' + esc(x[0]) + '</h3><p>' + esc(x[1]) + '</p></div>').join('') + '</div><div class="go-links"><a class="btn small" href="#thuchanh-hieuluc">' + I('play') + ' Luyện: Còn hiệu lực không?</a><a class="btn small ghost" href="#thuchanh-nghidinh">Tình huống nào – văn bản nào?</a><a class="btn small ghost" href="#bieumau-PL-03">Biểu mẫu PL-03</a></div></section>' +
  '<div class="disclaimer mt">' + I('alert') + '<div>Các tóm tắt được biên soạn từ nguồn công khai (cơ sở dữ liệu văn bản, Công báo, báo chí pháp luật). Không trích mức phạt hoặc số điều khi chưa đối chiếu được toàn văn. Văn bản của Đảng (556-QĐ/VPTW) lấy theo bài báo, cần đối chiếu bản gốc nhận qua đường công văn.</div></div></div>';
  function draw(){
    const G = LUAT.groups; let h = '';
    Object.keys(G).forEach(g => { const items = LUAT.items.filter(x => x.g === g && (flt === 'all' || x.st === flt)); if (!items.length) return;
      h += '<h3 class="mt mb" style="margin-top:22px">' + G[g] + '</h3><div class="lawgrid">' + items.map(x => '<article class="lcard reveal in" style="--c:' + S[x.st].c + '"><div class="top"><span class="no">' + esc(x.no) + '</span><span class="badge ' + S[x.st].cls + '">' + S[x.st].t + '</span></div><h3>' + esc(x.name) + '</h3><dl><dt>Ban hành</dt><dd>' + esc(x.ban) + '</dd><dt>Hiệu lực</dt><dd>' + esc(x.hl) + '</dd>' + (x.het ? '<dt>Hết hiệu lực</dt><dd><b style="color:#dc2626">' + esc(x.het) + '</b></dd>' : '') + '</dl><p class="gist">' + esc(x.gist) + '</p>' + (x.note ? '<div class="note ' + (x.st === 'ok' ? 'info' : 'warn') + '" style="margin:8px 0 0">' + I('alert') + '<div>' + esc(x.note) + '</div></div>' : '') + (x.src && x.src.length ? '<div class="src">Nguồn: ' + x.src.map(s => '<a href="' + esc(s[1]) + '" target="_blank" rel="noopener">' + esc(s[0]) + '</a>').join(' · ') + '</div>' : '') + '</article>').join('') + '</div>'; });
    $('#lg', v).innerHTML = h;
  }
  draw();
  $('#lf', v).onclick = e => { const b = e.target.closest('[data-f]'); if (!b) return; flt = b.dataset.f; $$('#lf button', v).forEach(x => x.classList.toggle('on', x === b)); draw(); };
};

/* ================= BIỂU MẪU ================= */
const FORM_INFO = { 'PL-01': 'Phiếu kiểm kê tài sản thông tin', 'PL-02': 'Bảng đăng ký rủi ro (Risk Register)', 'PL-03': 'Ma trận nghĩa vụ và bằng chứng tuân thủ', 'PL-04': 'Phiếu ghi nhận sự kiện an ninh mạng', 'PL-05': 'Danh mục thành phần hồ sơ đề xuất cấp độ', 'PL-06': 'Phiếu diễn tập ứng cứu sự cố' };
P.bieumau = function(v, param){
  const keys = Object.keys(CT.pl);
  v.innerHTML = pageHead('Biểu mẫu', 'Phụ lục biểu mẫu phát cho học viên', 'Điền trực tiếp, thêm dòng, lưu trên máy, xuất Word để nộp theo nhóm. Dòng đầu là ví dụ của chương trình.') +
    '<div class="wrap" style="padding:28px 20px 56px"><div class="row mb"><span class="small"><b>Nhóm:</b></span><select id="fg" style="padding:8px;border-radius:10px;border:1.5px solid var(--line)">' + '<option value="">–</option>' + Array.from({ length: 10 }, (_, i) => 'G' + String(i + 1).padStart(2, '0')).map(g => '<option' + (g === st.grp ? ' selected' : '') + '>' + g + '</option>').join('') + '</select></div>' +
    keys.map(k => { const T = CT.pl[k]; st.forms[k] = st.forms[k] || T.slice(1).map(r => r.slice()); const rows = st.forms[k];
      return '<section class="lsec" id="' + k + '"><div class="row between"><h2>' + k + '. ' + FORM_INFO[k] + '</h2><div class="row"><button class="btn small ghost" data-add="' + k + '">' + I('plus') + ' Thêm dòng</button><button class="btn small" data-doc="' + k + '">' + I('download') + ' Xuất Word</button></div></div><div class="tbl-wrap mt"><table class="tbl"><thead><tr>' + T[0].map(c => '<th>' + esc(c) + '</th>').join('') + '<th></th></tr></thead><tbody>' + rows.map((r, i) => '<tr>' + r.map((c, j) => '<td><textarea data-k="' + k + '" data-r="' + i + '" data-c="' + j + '">' + esc(c) + '</textarea></td>').join('') + '<td><button class="iconbtn" data-del="' + k + '" data-r="' + i + '">' + I('trash') + '</button></td></tr>').join('') + '</tbody></table></div>' + (k === 'PL-02' ? '<p class="small muted mt">' + esc(CT.pl02note) + '</p>' : '') + (k === 'PL-06' ? '<p class="small mt">' + esc(CT.baocao) + '</p>' : '') + '</section>'; }).join('') + '</div>';
  if (param && $('#' + param, v)) setTimeout(() => $('#' + param, v).scrollIntoView({ behavior: 'smooth' }), 100);
  v.addEventListener('input', e => { const t = e.target; if (t.dataset.k) { st.forms[t.dataset.k][+t.dataset.r][+t.dataset.c] = t.value; A.save(); } });
  $('#fg', v).onchange = e => { st.grp = e.target.value; A.save(); };
  v.addEventListener('click', e => {
    const a = e.target.closest('[data-add]'); if (a) { const k = a.dataset.add; st.forms[k].push(CT.pl[k][0].map(() => '')); A.save(); P.bieumau(v, k); return; }
    const d = e.target.closest('[data-del]'); if (d) { st.forms[d.dataset.del].splice(+d.dataset.r, 1); A.save(); P.bieumau(v, d.dataset.del); return; }
    const x = e.target.closest('[data-doc]'); if (x) { const k = x.dataset.doc, T = CT.pl[k]; const html = '<html><head><meta charset="utf-8"><style>body{font-family:"Times New Roman";font-size:13pt}table{border-collapse:collapse;width:100%}td,th{border:1px solid #444;padding:5px;vertical-align:top}th{background:#e8eef8}</style></head><body><p style="text-align:center"><b>TẬP HUẤN AN NINH MẠNG VÀ BẢO VỆ HỆ THỐNG THÔNG TIN</b><br>Văn phòng Tỉnh ủy Lâm Đồng · 17–19/11/2026</p><h2 style="text-align:center">' + k + '. ' + FORM_INFO[k].toUpperCase() + '</h2><p><b>Nhóm:</b> ' + esc(st.grp || '') + '</p><table><tr>' + T[0].map(c => '<th>' + esc(c) + '</th>').join('') + '</tr>' + st.forms[k].map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</table><p style="font-size:10pt;color:#555">Dữ liệu giả lập phục vụ đào tạo.</p></body></html>';
      A.saveFile((st.grp || 'Gxx') + '_' + k + '.doc', new Blob(['﻿' + html], { type: 'application/msword' })); }
  });
};

/* ================= KIỂM TRA CUỐI KHOÁ ================= */
P.kiemtra = function(v){
  const bank = []; CD.forEach(c => c.quiz.forEach((q, k) => bank.push(Object.assign({ cd: c.id, key: c.id + '-' + k }, q))));
  let qs = [], ans = {}, t0 = 0, timer = null; const DUR = 15 * 60;
  function start(){ qs = []; for (let c = 1; c <= 6; c++) qs = qs.concat(A.shuffle(bank.filter(q => q.cd === c)).slice(0, c <= 2 ? 4 : 3)); qs = A.shuffle(qs).slice(0, 20); ans = {}; t0 = Date.now(); run(); }
  function intro(){
    const best = st.exam;
    v.innerHTML = pageHead('Kiểm tra cuối khoá', 'Phiếu trắc nghiệm cuối khoá', 'Theo chương trình: thực hiện trong 15 phút cuối buổi 6, kết hợp rà soát báo cáo diễn tập. Kết quả là minh chứng học tập, không thay thế chứng nhận năng lực kỹ thuật hoặc đánh giá tuân thủ hệ thống thật.') +
      '<div class="game"><div class="gcard gstart"><h2>20 câu · 15 phút</h2><p>Câu hỏi lấy ngẫu nhiên từ cả 6 chuyên đề. Có thể quay lại sửa câu trước khi nộp.</p><div class="row" style="justify-content:center;margin:14px 0"><span class="pill">' + bank.length + ' câu trong ngân hàng</span>' + (best ? '<span class="pill">Lần gần nhất: ' + best.score + '/' + best.total + '</span>' : '') + '</div><div class="field" style="max-width:360px;margin:0 auto;text-align:left"><label style="color:#cbd5f5">Họ và tên</label><input id="nm" value="' + esc(st.name || '') + '" placeholder="Nguyễn Văn A"></div><button class="btn orange" id="go" style="font-size:1.1rem;padding:14px 28px">' + I('play') + ' Bắt đầu</button></div></div>';
    $('#go', v).onclick = () => { st.name = $('#nm', v).value.trim(); A.save(); start(); };
  }
  function run(){
    v.innerHTML = '<div class="exam-bar"><div class="wrap"><span class="tm" id="tm">15:00</span><div class="qnav" id="qn"></div><button class="btn small orange" id="sub">' + I('check') + ' Nộp bài</button></div></div><div class="wrap" style="max-width:860px;padding:20px 20px 60px" id="qq">' + qs.map((q, i) => '<div class="q" id="q' + i + '"><h4><span class="qn">Câu ' + (i + 1) + ' · CĐ' + q.cd + '</span>' + esc(q.q) + '</h4><div class="opts">' + q.o.map((o, j) => '<button class="opt" data-q="' + i + '" data-j="' + j + '"><span class="lt">' + A.L[j] + '</span><span>' + esc(o) + '</span></button>').join('') + '</div></div>').join('') + '</div>';
    const nav = () => { $('#qn', v).innerHTML = qs.map((q, i) => '<a href="#kiemtra" data-g="' + i + '" class="' + (ans[i] != null ? 'a' : '') + '">' + (i + 1) + '</a>').join(''); };
    nav();
    $('#qq', v).onclick = e => { const b = e.target.closest('.opt'); if (!b) return; const i = +b.dataset.q; ans[i] = +b.dataset.j; $$('#q' + i + ' .opt', v).forEach(x => x.classList.toggle('sel', x === b)); A.SND.tap(); nav(); };
    $('#qn', v).onclick = e => { const a = e.target.closest('[data-g]'); if (a) { e.preventDefault(); $('#q' + a.dataset.g, v).scrollIntoView({ behavior: 'smooth', block: 'center' }); } };
    let warned = false; $('#sub', v).onclick = () => { const left = qs.length - Object.keys(ans).length; if (left && !warned) { warned = true; A.toast('Còn ' + left + ' câu chưa trả lời – bấm “Nộp bài” lần nữa để nộp'); $('#sub', v).innerHTML = I('check') + ' Nộp luôn'; return; } finish(); };
    timer = setInterval(() => { const r = DUR - Math.floor((Date.now() - t0) / 1000); const el = $('#tm', v); if (!el) { clearInterval(timer); return; } el.textContent = String(Math.max(0, Math.floor(r / 60))).padStart(2, '0') + ':' + String(Math.max(0, r % 60)).padStart(2, '0'); if (r <= 60) el.style.color = '#e11d48'; if (r <= 0) finish(); }, 500);
  }
  function finish(){
    clearInterval(timer); let sc = 0; const per = {}; qs.forEach((q, i) => { per[q.cd] = per[q.cd] || [0, 0]; per[q.cd][1]++; if (ans[i] === q.a) { sc++; per[q.cd][0]++; } });
    st.exam = { score: sc, total: qs.length, at: Date.now(), per }; A.save(); A.addXP(sc * 5, 'Kiểm tra cuối khoá');
    if (sc / qs.length >= .7) { A.SND.win(); A.confetti(); }
    v.innerHTML = pageHead('Kiểm tra cuối khoá', 'Kết quả: ' + sc + '/' + qs.length, (st.name ? esc(st.name) + ' · ' : '') + 'Thời gian làm bài: ' + Math.round((Date.now() - t0) / 60000) + ' phút') +
      '<div class="wrap" style="padding:24px 20px 56px"><div class="grid g2" style="align-items:start"><div class="card"><h3 class="mb">Kết quả theo chuyên đề</h3><div class="bars">' + Object.keys(per).sort().map(c => '<div class="bar" style="font-family:inherit"><span>CĐ' + c + '. ' + esc(CD[c - 1].short.slice(0, 30)) + '…</span><span><i class="bv" style="display:block;width:' + per[c][0] / per[c][1] * 100 + '%;background:' + COL[c - 1] + '"></i></span><span class="bn">' + per[c][0] + '/' + per[c][1] + '</span></div>').join('') + '</div><div class="row mt"><button class="btn" id="again">' + I('refresh') + ' Làm đề khác</button><a class="btn ghost" href="#xacnhan">' + I('award') + ' Giấy xác nhận</a></div></div>' +
      '<div class="card"><h3>Gợi ý ôn tập</h3><ul class="pts">' + Object.keys(per).filter(c => per[c][0] < per[c][1]).map(c => '<li><a href="#chuyende-' + c + '">Chuyên đề ' + c + ': ' + esc(CD[c - 1].short) + '</a></li>').join('') + '</ul></div></div><h3 class="mt" style="margin-top:24px">Xem lại bài làm</h3>' +
      qs.map((q, i) => '<div class="q"><h4><span class="qn">Câu ' + (i + 1) + '</span>' + esc(q.q) + '</h4><div class="opts">' + q.o.map((o, j) => '<div class="opt' + (j === q.a ? ' right' : j === ans[i] ? ' wrong' : '') + '"><span class="lt">' + A.L[j] + '</span><span>' + esc(o) + '</span></div>').join('') + '</div>' + (q.e ? '<div class="fb ' + (ans[i] === q.a ? 'ok' : 'no') + '">' + I(ans[i] === q.a ? 'check' : 'alert') + '<div>' + esc(q.e) + '</div></div>' : '') + '</div>').join('') + '</div>';
    $('#again', v).onclick = start;
  }
  intro();
  return () => clearInterval(timer);
};

/* ================= CHẾ ĐỘ GIẢNG VIÊN ================= */
P.giangvien = function(v, param){
  let b = +(param || st.pres.cur || 1); if (!(b >= 1 && b <= 6)) b = 1; st.pres.cur = b; A.save();
  const s = CT.sess[b - 1], acts = s.hd.filter(r => r.stt);
  const pr = st.pres['b' + b] = st.pres['b' + b] || { start: 0, grp: {} };
  const link = r => { const nd = r.nd.toLowerCase(); if (r.ht === 'Nghỉ') return ''; if (r.ht === 'TH' || r.ht === 'ĐG') return '#lab-' + b; const sec = CD[b - 1].sections.findIndex(x => (x.act || []).indexOf(+r.stt) >= 0); return sec >= 0 ? '#chuyende-' + b : '#chuyende-' + b; };
  const range = r => (r.moc || '').split(/[–-]/).map(x => parseInt(x));
  v.innerHTML = pageHead('Chế độ giảng viên', 'Điều hành buổi ' + b + ' – Chuyên đề ' + s.cd, esc(s.ten) + ' · ' + s.date + ' · buổi ' + s.buoi.toLowerCase() + '. Mốc phút tính từ đầu buổi, không ấn định giờ bắt đầu thực tế.') +
    '<div class="wrap" style="padding:20px 20px 56px"><div class="tabs">' + CT.sess.map(x => '<button class="' + (x.id === b ? 'on' : '') + '" data-b="' + x.id + '">Buổi ' + x.id + ' · CĐ' + x.cd + '</button>').join('') + '</div>' +
    '<div class="pres"><div><div class="card mb"><b>Mục tiêu:</b> ' + esc(s.muctieu) + '</div><div id="acts">' + acts.map((r, i) => { const rg = range(r); return '<div class="act" data-i="' + i + '" data-a="' + rg[0] + '" data-z="' + rg[1] + '"><span class="mk">' + esc(r.moc) + '</span><span><b>' + esc(r.nd) + '</b><br><span class="small muted">' + htBadge(r.ht) + ' ' + esc(r.phut) + ' phút · ' + esc(r.kn) + '</span></span><span>' + (link(r) ? '<a class="btn small ghost" href="' + link(r) + '">Mở</a>' : '') + '</span></div>'; }).join('') + '</div>' +
    '<div class="card mt"><h3>Theo dõi sản phẩm 10 nhóm</h3><p class="small muted">' + esc(s.sanpham) + '</p><div class="tbl-wrap mt"><table class="tbl grptbl"><thead><tr><th>Nhóm</th><th>Có mặt</th><th>Đang làm</th><th>Đã nộp</th><th>Trình bày</th><th>Ghi chú</th></tr></thead><tbody>' + Array.from({ length: 10 }, (_, i) => { const g = 'G' + String(i + 1).padStart(2, '0'), x = pr.grp[g] || {}; return '<tr><td>' + g + '</td>' + ['co', 'lam', 'nop', 'tb'].map(k => '<td><button data-g="' + g + '" data-k="' + k + '" class="' + (x[k] ? 'y' : '') + '">' + (x[k] ? '✓' : '') + '</button></td>').join('') + '<td><input data-gn="' + g + '" value="' + esc(x.n || '') + '" style="width:100%;border:1px solid var(--line);border-radius:8px;padding:5px"></td></tr>'; }).join('') + '</tbody></table></div></div>' +
    '<div class="card mt"><h3>Kịch bản khi hạ tầng trình diễn gặp sự cố</h3><div class="tbl-wrap mt"><table class="tbl"><thead><tr>' + CT.dutphong[0].map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + CT.dutphong.slice(1).map(r => '<tr>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div></div>' +
    '<div class="card mt"><h3>Rubric đánh giá sản phẩm mỗi nhóm</h3><div class="tbl-wrap mt"><table class="tbl"><thead><tr>' + CT.rubric[0].map(c => '<th>' + esc(c) + '</th>').join('') + '</tr></thead><tbody>' + CT.rubric.slice(1).map(r => '<tr' + (r[0] === 'TỔNG' ? ' class="tot"' : '') + '>' + r.map(c => '<td>' + esc(c) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div></div></div>' +
    '<aside class="bigclock2"><div class="s">Đã trôi qua</div><div class="t" id="el">00:00</div><div class="pb"><i id="pb"></i></div><div class="s">trên 240 phút</div><div class="cur" id="cur">Chưa bắt đầu</div><div class="s" id="nx"></div><div class="row mt" style="justify-content:center"><button class="btn orange" id="st">' + I('play') + ' ' + (pr.start ? 'Đang chạy' : 'Bắt đầu buổi') + '</button><button class="btn ghost-light" id="rs">' + I('refresh') + ' Đặt lại</button></div><div class="row mt" style="justify-content:center"><button class="btn small ghost-light" id="m5">−5 phút</button><button class="btn small ghost-light" id="p5">+5 phút</button></div><p class="s mt">Đồng hồ lưu trên máy, mở lại trang vẫn chạy tiếp.</p></aside></div></div>';
  let tm = null;
  function tick(){
    const el = $('#el', v); if (!el) { clearInterval(tm); return; }
    const sec = pr.start ? Math.floor((Date.now() - pr.start) / 1000) : 0, m = Math.floor(sec / 60);
    el.textContent = String(m).padStart(2, '0') + ':' + String(sec % 60).padStart(2, '0'); $('#pb', v).style.width = Math.min(100, m / 240 * 100) + '%';
    let cur = null; $$('.act', v).forEach(a => { const A0 = +a.dataset.a, Z = +a.dataset.z; const on = pr.start && m >= A0 && m < Z; a.classList.toggle('cur', on); a.classList.toggle('past', pr.start && m >= Z); if (on) cur = a; });
    if (cur) { const r = acts[+cur.dataset.i]; const left = (+cur.dataset.z) * 60 - sec; $('#cur', v).innerHTML = esc(r.nd); $('#nx', v).textContent = 'Còn ' + Math.floor(left / 60) + ' phút ' + (left % 60) + ' giây cho hoạt động này'; if (left === 120) A.toast('Còn 2 phút cho hoạt động hiện tại'); }
    else if (pr.start && m >= 240) { $('#cur', v).textContent = 'Hết 240 phút'; $('#nx', v).textContent = ''; }
  }
  tm = setInterval(tick, 1000); tick();
  v.addEventListener('click', e => {
    const bb = e.target.closest('[data-b]'); if (bb) { location.hash = '#giangvien-' + bb.dataset.b; return; }
    const g = e.target.closest('button[data-g]'); if (g) { pr.grp[g.dataset.g] = pr.grp[g.dataset.g] || {}; const x = pr.grp[g.dataset.g]; x[g.dataset.k] = !x[g.dataset.k]; g.classList.toggle('y', x[g.dataset.k]); g.textContent = x[g.dataset.k] ? '✓' : ''; A.save(); return; }
    const a = e.target.closest('.act'); if (a && !e.target.closest('a') && pr.start) { pr.start = Date.now() - (+a.dataset.a) * 60000; A.save(); tick(); }
  });
  v.addEventListener('input', e => { const t = e.target; if (t.dataset.gn) { pr.grp[t.dataset.gn] = pr.grp[t.dataset.gn] || {}; pr.grp[t.dataset.gn].n = t.value; A.save(); } });
  $('#st', v).onclick = () => { if (!pr.start) { pr.start = Date.now(); A.save(); A.SND.ok(); $('#st', v).innerHTML = I('play') + ' Đang chạy'; tick(); } };
  $('#rs', v).onclick = () => { pr.start = 0; A.save(); $('#st', v).innerHTML = I('play') + ' Bắt đầu buổi'; $('#cur', v).textContent = 'Chưa bắt đầu'; $('#nx', v).textContent = ''; $$('.act', v).forEach(a => a.classList.remove('cur', 'past')); tick(); };
  $('#m5', v).onclick = () => { if (pr.start) { pr.start += 300000; A.save(); tick(); } };
  $('#p5', v).onclick = () => { if (pr.start) { pr.start -= 300000; A.save(); tick(); } };
  return () => clearInterval(tm);
};

/* ================= GIẤY XÁC NHẬN ================= */
P.xacnhan = function(v){
  const req = [
    ['Đọc tối thiểu 24 mục bài giảng (đánh dấu đã học)', () => Object.values(st.sec).filter(Boolean).length >= 24, '#chuyende'],
    ['Hoàn thành tối thiểu 8 bài tập tương tác', () => Object.keys(st.prac).length >= 8, '#thuchanh'],
    ['Chấm phiếu ít nhất 3 bài lab', () => window.LABS.filter(L => st.labAns[L.id] && L.qs.some(q => st.labAns[L.id].ok[q.id])).length >= 3, '#lab'],
    ['Kiểm tra cuối khoá đạt từ 14/20 câu', () => st.exam && st.exam.score >= 14, '#kiemtra']];
  const ok = req.every(r => r[1]());
  v.innerHTML = pageHead('Giấy xác nhận', 'Giấy xác nhận hoàn thành tập huấn', 'Minh chứng học tập cá nhân, không thay thế chứng nhận năng lực kỹ thuật hoặc đánh giá tuân thủ hệ thống thật. Giấy chính thức do Ban tổ chức cấp.') +
    '<div class="wrap cert-layout"><div class="card"><h3 class="mb">Điều kiện</h3><ul class="req">' + req.map(r => '<li class="' + (r[1]() ? 'y' : '') + '">' + I(r[1]() ? 'check' : 'clock') + esc(r[0]) + (r[1]() ? '' : '<a href="' + r[2] + '">Làm</a>') + '</li>').join('') + '</ul><div class="field mt"><label>Họ và tên</label><input id="nm" value="' + esc(st.name || '') + '"></div><div class="field"><label>Đơn vị công tác</label><input id="un" value="' + esc(st.unit || '') + '"></div><button class="btn' + (ok ? '' : ' ghost') + '" id="dl"' + (ok ? '' : ' disabled') + '>' + I('download') + ' Tải ảnh PNG</button>' + (ok ? '' : '<p class="small muted mt">Hoàn thành các điều kiện để tải.</p>') + '</div><div><canvas id="certCanvas" width="1600" height="1130"></canvas></div></div>';
  function draw(){
    const c = $('#certCanvas', v).getContext('2d'), W = 1600, H = 1130;
    c.fillStyle = '#fff'; c.fillRect(0, 0, W, H);
    const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#0b1b3f'); g.addColorStop(1, '#1e3a8a'); c.fillStyle = g; c.fillRect(0, 0, W, 170);
    c.strokeStyle = '#f97316'; c.lineWidth = 8; c.strokeRect(30, 30, W - 60, H - 60); c.strokeStyle = '#cbd5e1'; c.lineWidth = 2; c.strokeRect(50, 200, W - 100, H - 250);
    c.fillStyle = '#fff'; c.textAlign = 'center'; c.font = '800 38px "Be Vietnam Pro", Arial'; c.fillText(D.certificate.org, W / 2, 95); c.font = '500 26px "Be Vietnam Pro", Arial'; c.fillStyle = '#bfdbfe'; c.fillText('Tập huấn An ninh mạng và bảo vệ hệ thống thông tin · 17–19/11/2026', W / 2, 140);
    c.fillStyle = '#0b1b3f'; c.font = '900 64px "Be Vietnam Pro", Arial'; c.fillText('GIẤY XÁC NHẬN', W / 2, 310); c.font = '600 30px "Be Vietnam Pro", Arial'; c.fillStyle = '#475569'; c.fillText('HOÀN THÀNH CHƯƠNG TRÌNH HỌC TƯƠNG TÁC', W / 2, 360);
    c.font = '500 30px "Be Vietnam Pro", Arial'; c.fillText('Xác nhận đồng chí', W / 2, 450); c.fillStyle = '#1d4ed8'; c.font = '900 66px "Be Vietnam Pro", Arial'; c.fillText($('#nm', v).value || 'Họ và tên', W / 2, 540);
    c.fillStyle = '#334155'; c.font = '500 30px "Be Vietnam Pro", Arial'; c.fillText($('#un', v).value || 'Đơn vị công tác', W / 2, 600);
    c.fillText('đã hoàn thành 6 chuyên đề, ' + Object.keys(st.prac).length + ' bài tập tương tác, phiếu lab và kiểm tra cuối khoá' + (st.exam ? ' (' + st.exam.score + '/' + st.exam.total + ' câu)' : '') + '.', W / 2, 680);
    c.font = '500 24px "Be Vietnam Pro", Arial'; c.fillStyle = '#64748b'; c.fillText('Minh chứng học tập – không thay thế chứng nhận năng lực kỹ thuật. Đơn vị biên soạn: ' + D.certificate.editor + '.', W / 2, 760);
    c.textAlign = 'right'; c.fillStyle = '#0b1b3f'; c.font = '600 26px "Be Vietnam Pro", Arial'; c.fillText('Lâm Đồng, ngày ' + new Date().toLocaleDateString('vi-VN'), W - 140, 880);
  }
  draw(); $('#nm', v).oninput = e => { st.name = e.target.value; A.save(); draw(); }; $('#un', v).oninput = e => { st.unit = e.target.value; A.save(); draw(); };
  $('#dl', v).onclick = () => $('#certCanvas', v).toBlob(b => A.saveFile('Xac_nhan_' + (st.name || 'hoc_vien').replace(/\s+/g, '_') + '.png', b));
};
})();
