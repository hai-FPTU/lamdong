/* =========================================================
   ĐỊNH TUYẾN & KHUNG TRANG
   ========================================================= */
(function(){
const A = window.APP, st = A.st, $ = A.$, $$ = A.$$, I = window.ICON, P = window.PAGES;
const NAV = [
  { r: 'home', t: 'Trang chủ', ic: 'home', tab: 1 },
  { r: 'chuongtrinh', t: 'Chương trình', ic: 'list' },
  { r: 'chuyende', t: 'Chuyên đề', ic: 'cap', tab: 1 },
  { r: 'thuchanh', t: 'Thực hành', ic: 'puzzle', tab: 1 },
  { r: 'lab', t: 'Phòng lab', ic: 'terminal', tab: 1 },
  { r: 'phapluat', t: 'Pháp luật', ic: 'scale', tab: 1 },
  { r: 'bieumau', t: 'Biểu mẫu', ic: 'form' },
  { r: 'kiemtra', t: 'Kiểm tra', ic: 'award' }
];
const EXTRA = [{ r: 'banphantich', t: 'Bàn phân tích nhật ký', ic: 'chart' }, { r: 'moitruong', t: 'Tải dữ liệu lab · cài Ubuntu WSL', ic: 'download' }, { r: 'camnang', t: 'Cẩm nang thực hành', ic: 'book' }, { r: 'giangvien', t: 'Chế độ giảng viên', ic: 'presenter' }, { r: 'xacnhan', t: 'Giấy xác nhận', ic: 'badge' }];
const SD = window.DATA.site;
$$('.binary').forEach(b => { let s = ''; for (let i = 0; i < 400; i++) s += Math.random() > .5 ? '1' : '0'; b.innerHTML = '<span>' + s + s + '</span>'; });
const link = n => '<a href="#' + n.r + '" data-r="' + n.r + '">' + I(n.ic) + '<span>' + n.t + '</span></a>';
$('#nav').innerHTML = NAV.map(link).join('');
$('#drawerNav').innerHTML = NAV.concat(EXTRA).map(link).join('');
$('#tabbar').innerHTML = NAV.filter(n => n.tab).map(link).join('');
$('#footLinks').innerHTML = NAV.concat(EXTRA).map(n => '<li><a href="#' + n.r + '">' + n.t + '</a></li>').join('');
const drawer = $('#drawer');
$('#menuBtn').innerHTML = I('menu');
$$('[data-close]', drawer).forEach(b => { if (b.tagName === 'BUTTON') b.innerHTML = I('x'); b.onclick = closeDrawer; });
$('#menuBtn').onclick = () => { drawer.hidden = false; $('#menuBtn').setAttribute('aria-expanded', 'true'); const f = $('#drawerNav a', drawer); f && f.focus(); };
function closeDrawer(){ drawer.hidden = true; $('#menuBtn').setAttribute('aria-expanded', 'false'); }
drawer.addEventListener('click', e => { if (e.target.closest('#drawerNav a')) closeDrawer(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !drawer.hidden) closeDrawer(); });
function sndUI(){ const b = $('#sndBtn'); b.innerHTML = I(st.snd ? 'volume' : 'mute'); b.setAttribute('aria-pressed', st.snd); }
$('#sndBtn').onclick = () => { st.snd = !st.snd; A.save(); sndUI(); A.toast(st.snd ? 'Đã bật âm thanh' : 'Đã tắt âm thanh'); };
const FONTS = ['', 'big', 'huge'];
function fontUI(){ document.documentElement.classList.remove('big', 'huge'); if (FONTS[st.font]) document.documentElement.classList.add(FONTS[st.font]); $('#fontBtn').innerHTML = I('text'); }
$('#fontBtn').onclick = () => { st.font = (st.font + 1) % 3; A.save(); fontUI(); A.toast(['Cỡ chữ thường', 'Cỡ chữ lớn', 'Cỡ chữ rất lớn'][st.font]); };
sndUI(); fontUI();
const ROUTES = ['home', 'chuongtrinh', 'chuyende', 'thuchanh', 'lab', 'banphantich', 'phapluat', 'bieumau', 'kiemtra', 'giangvien', 'xacnhan', 'moitruong', 'camnang'];
let cleanup = null;
/* Lịch sử điều hướng trong giáo trình: quay lại trang trước đúng vị trí đang đọc */
const LABAREA = ['lab', 'banphantich', 'camnang', 'moitruong'];
const NAVSTACK = [], SCROLL = {}; let curHash = null;
try { history.scrollRestoration = 'manual'; } catch(e) {}
A.navBack = () => { if (NAVSTACK.length > 1) history.back(); else location.hash = '#lab'; };
A.canBack = () => NAVSTACK.length > 1; A._nav = { NAVSTACK, SCROLL };
function parse(){
  const h = (location.hash || '#home').replace(/^#\/?/, '');
  const k = h.indexOf('-');
  const route = k < 0 ? h : h.slice(0, k), param = k < 0 ? undefined : h.slice(k + 1);
  return { route: ROUTES.includes(route) ? route : 'home', param };
}
function render(){
  const { route, param } = parse();
  const h = location.hash || '#home';
  if (curHash !== null) SCROLL[curHash] = window.scrollY;
  let back = false;
  if (NAVSTACK.length > 1 && NAVSTACK[NAVSTACK.length - 2] === h) { NAVSTACK.pop(); back = true; }
  else if (NAVSTACK[NAVSTACK.length - 1] !== h) NAVSTACK.push(h);
  curHash = h;
  if (typeof cleanup === 'function') { try { cleanup(); } catch(e) {} }
  cleanup = null; A.TTS.stop();
  const old = document.querySelector('.cmenu'); if (old) old.remove();
  const main = $('#view');
  const page = document.createElement('div'); page.className = 'page';
  main.innerHTML = ''; main.appendChild(page);
  try { cleanup = P[route](page, param); } catch(e) { console.error(e); page.innerHTML = '<div class="wrap" style="padding:40px 20px"><div class="note warn">Không mở được trang: ' + A.esc(e.message) + '</div></div>'; }
  if (LABAREA.includes(route) && window.LABNAV) page.insertAdjacentHTML('afterbegin', window.LABNAV(route, param));
  const navR = LABAREA.includes(route) ? 'lab' : route;
  $$('#nav a, #tabbar a').forEach(a => a.classList.toggle('on', a.dataset.r === navR));
  $$('#drawerNav a').forEach(a => a.classList.toggle('on', a.dataset.r === route));
  const n = NAV.concat(EXTRA).find(x => x.r === route);
  document.title = (route === 'home' ? SD.h1a : (n ? n.t : '') + ' – ' + SD.name) + ' | Tỉnh ủy Lâm Đồng';
  window.scrollTo(0, 0);
  if (back && SCROLL[h]) { const y = SCROLL[h]; [60, 250, 600].forEach(t => setTimeout(() => { if (location.hash === h || (!location.hash && h === '#home')) window.scrollTo(0, y); }, t)); }
  A.reveal(page);
  main.focus({ preventScroll: true });
}
window.addEventListener('hashchange', render);
render();
})();
