/* =========================================================
   NỘI DUNG 6 CHUYÊN ĐỀ (phần lý thuyết + trình diễn)
   act: số thứ tự hoạt động trong bảng kế hoạch 240 phút của chương trình
   ========================================================= */
window.CD = [
/* ===================== CHUYÊN ĐỀ 1 ===================== */
{ id: 1, short: 'Tổng quan về an ninh mạng',
  sections: [
  { t: 'Khái niệm an ninh mạng, an toàn thông tin, không gian mạng; bộ ba CIA', act: [1], viz: 'cia',
    pts: [
      'Luật An ninh mạng 2025 (Luật 116/2025/QH15) thống nhất một khái niệm “an ninh mạng” bao trùm cả nội dung “an toàn thông tin mạng” của luật năm 2015: sự ổn định, an ninh, an toàn của không gian mạng; bảo vệ hệ thống thông tin và bảo đảm thông tin, dữ liệu, hoạt động trên không gian mạng.',
      'Luật lần đầu ghi nhận “an ninh dữ liệu” là một khái niệm pháp lý riêng (khoản 3 Điều 2).',
      'Ba thuộc tính cần bảo vệ của mọi thông tin: Bí mật (Confidentiality) – không bị LỘ; Toàn vẹn (Integrity) – không bị SỬA trái phép; Sẵn sàng (Availability) – không bị MẤT hoặc GIÁN ĐOẠN khi cần dùng.',
      'Ví dụ hệ thống văn bản điều hành: văn bản dự thảo bị gửi nhầm ra ngoài là mất Bí mật; số, ngày văn bản bị sửa là mất Toàn vẹn; máy chủ bị mã hoá trước giờ họp là mất Sẵn sàng.'],
    terms: [['Không gian mạng', 'cyberspace', 'Mạng lưới kết nối hạ tầng công nghệ thông tin gồm mạng viễn thông, Internet, mạng máy tính, hệ thống thông tin, cơ sở dữ liệu – nơi con người thực hiện hoạt động không bị giới hạn bởi không gian, thời gian.'],
            ['Hệ thống thông tin', 'information system', 'Tập hợp phần cứng, phần mềm, cơ sở dữ liệu và quy trình để thu thập, xử lý, lưu trữ, truyền đưa thông tin. Ví dụ: hệ thống quản lý văn bản, thư điện tử, cổng thông tin.'],
            ['Bí mật – Toàn vẹn – Sẵn sàng', 'CIA triad', 'Ba thuộc tính dùng để mô tả mọi tác động: lộ (C), sửa (I), mất/gián đoạn (A).']],
    try: { type: 'cia' },
    remember: 'Mỗi sự cố hãy hỏi: thông tin bị LỘ, bị SỬA hay bị MẤT? Câu trả lời cho biết thuộc tính nào bị ảnh hưởng.' },
  { t: 'Tài sản, lỗ hổng, tác nhân đe dọa, kịch bản rủi ro', act: [2], viz: 'riskchain',
    pts: [
      'Tài sản: thứ có giá trị cần bảo vệ – máy chủ, phần mềm, dữ liệu, tài khoản, con người, quy trình.',
      'Điểm yếu/lỗ hổng: điều kiện tạo cơ hội bị khai thác – chưa bật xác thực đa yếu tố, phần mềm chưa vá, mật khẩu dùng chung, quy tắc tường lửa mở rộng.',
      'Tác nhân đe dọa: ai/cái gì có thể gây hại – tội phạm mạng, người nội bộ, nhà cung cấp, thiên tai, lỗi vận hành.',
      'Kịch bản rủi ro đầy đủ có 4 thành phần: TÀI SẢN – NGUỒN ĐE DỌA – ĐIỀU KIỆN (điểm yếu) – HẬU QUẢ. Thiếu một thành phần thì chưa chấm điểm được.',
      'Phân biệt: điểm yếu (chưa xảy ra gì) ≠ sự kiện (có dấu hiệu, chưa kết luận) ≠ sự cố đã xác nhận (có bằng chứng tác động).'],
    terms: [['Sự kiện an ninh', 'security event', 'Một hiện tượng quan sát được (ví dụ một lần đăng nhập sai). Chưa phải sự cố.'],
            ['Sự cố an ninh mạng', 'incident', 'Sự kiện đã được xác minh là gây hoặc đe dọa gây ảnh hưởng đến C, I hoặc A.'],
            ['Chủ sở hữu tài sản', 'asset owner', 'Người/đơn vị chịu trách nhiệm quyết định về tài sản: ai được dùng, rủi ro nào chấp nhận.']],
    try: { type: 'scenario4' },
    remember: 'Viết kịch bản rủi ro theo mẫu: “[Nguồn đe dọa] lợi dụng [điểm yếu] tác động vào [tài sản], gây [hậu quả C/I/A]”.' },
  { t: 'Phishing, mã độc tống tiền dạng dịch vụ (RaaS), tấn công chuỗi cung ứng, deepfake', act: [3], viz: 'threats',
    pts: [
      'Phishing (thư/tin nhắn lừa đảo): giả danh cấp trên, cơ quan cấp trên, ngân hàng; tạo khẩn cấp; dẫn tới trang đăng nhập giả hoặc tệp đính kèm độc. Dấu hiệu: tên miền na ná (cqrnau thay cqmau), SPF/DKIM thất bại, “Reply-To” khác người gửi, tệp .html/.docm/.zip.',
      'RaaS (Ransomware-as-a-Service): nhóm phát triển cho thuê mã độc tống tiền, kẻ “thuê” chỉ cần vào được mạng. Thường kết hợp đánh cắp dữ liệu trước rồi mới mã hoá (tống tiền kép).',
      'Tấn công chuỗi cung ứng: đi vào qua nhà cung cấp – tài khoản VPN nhà thầu, bản cập nhật phần mềm, thư viện mã nguồn. OWASP 2025 đã đưa “Lỗi chuỗi cung ứng phần mềm” thành mục A03.',
      'Deepfake: giả giọng nói, hình ảnh, video của lãnh đạo để yêu cầu chuyển tiền, cung cấp tài liệu. Luật An ninh mạng 2025 nghiêm cấm sử dụng trí tuệ nhân tạo hoặc công nghệ mới để giả mạo video, hình ảnh, giọng nói của người khác trái quy định (điểm g khoản 2 Điều 7).',
      'Biện pháp nhận diện chung: kiểm tra qua kênh thứ hai (gọi lại số đã biết), không đăng nhập từ liên kết trong thư, báo ngay cho bộ phận CNTT kể cả khi đã lỡ bấm.'],
    try: { type: 'link', to: 'thuchanh-soithu', label: 'Trò chơi: Soi thư giả mạo' },
    remember: 'Đã lỡ bấm hoặc nhập mật khẩu: báo ngay, đổi mật khẩu từ máy khác, không tự xoá thư (thư là bằng chứng).' },
  { t: 'NIST CSF 2.0; ISO/IEC 27001:2022; MITRE ATT&CK', act: [4], viz: 'csf',
    pts: [
      'NIST CSF 2.0 (2024) – khung quản trị rủi ro, 06 chức năng: QUẢN TRỊ (Govern) ở trung tâm, bao quanh là NHẬN DIỆN – BẢO VỆ – PHÁT HIỆN – ỨNG PHÓ – KHÔI PHỤC. Trả lời câu hỏi “cơ quan đang làm được đến đâu”.',
      'ISO/IEC 27001:2022 – tiêu chuẩn hệ thống quản lý an toàn thông tin (ISMS), có thể chứng nhận. Phụ lục A có 93 biện pháp kiểm soát trong 4 nhóm: tổ chức (37), con người (8), vật lý (14), công nghệ (34).',
      'MITRE ATT&CK – kho kiến thức về chiến thuật (mục tiêu của kẻ tấn công) và kỹ thuật (cách làm), dựa trên quan sát thực tế. Dùng để gắn nhãn sự kiện và kiểm tra hệ thống giám sát đã phát hiện được những kỹ thuật nào.',
      'Ba công cụ khác vai trò: CSF = bản đồ quản trị; ISO 27001 = hệ thống quản lý có thể đánh giá, chứng nhận; ATT&CK = từ điển kỹ thuật tấn công. Không thay thế nghĩa vụ pháp lý trong nước.'],
    try: { type: 'link', to: 'thuchanh-csf', label: 'Trò chơi: Ghép việc vào 6 chức năng CSF' },
    remember: 'CSF trả lời “làm gì”, ISO 27001 trả lời “quản lý thế nào”, ATT&CK trả lời “kẻ tấn công làm ra sao”.' },
  { t: 'Giới thiệu đánh giá rủi ro; thang L, I và bằng chứng', act: [5], viz: 'matrix',
    pts: [
      'Khả năng xảy ra (L, 1–5) và tác động (I, 1–5) được chấm theo thang đã thống nhất trước, có mô tả từng mức.',
      'Quy ước của bài học: R = L × I (1–25), xếp mức Thấp (1–4), Trung bình (5–9), Cao (10–16), Rất cao (20–25). Đây chỉ là quy ước giảng dạy, KHÔNG phải công thức bắt buộc của NIST SP 800-30.',
      'Mỗi điểm số phải có luận cứ và bằng chứng: “L=4 vì 7/30 hộp thư đã nhận thư giả trong tuần và chưa bật xác thực đa yếu tố”.',
      'Giới hạn của điểm số: hai người có thể chấm khác nhau; điểm không cộng được giữa các kịch bản; rủi ro thấp nhưng tác động thảm khốc vẫn cần xử lý.',
      'Kết quả phải dẫn đến quyết định: giảm thiểu, chuyển giao, tránh hoặc chấp nhận – có người chịu trách nhiệm và cách kiểm chứng.'],
    try: { type: 'link', to: 'thuchanh-matran', label: 'Trò chơi: Đặt rủi ro lên ma trận 5×5' },
    remember: 'Điểm không có luận cứ là điểm cảm tính. Luôn ghi “vì sao” bên cạnh L và I.' },
  { t: 'Trình diễn: phân tích email lừa đảo', act: [7], demo: true, viz: 'emaildemo',
    pts: ['Giảng viên mở hai tệp thu_hop_le.eml và thu_gia_mao.eml (trong gói dữ liệu lab) cạnh nhau, chỉ ra: Received (máy chủ gửi thật), Authentication-Results (SPF/DKIM), From và Reply-To, tên miền, tệp đính kèm, lời lẽ khẩn cấp.',
          'Đối chiếu với nhật ký thư mail.log: có bao nhiêu hộp thư nhận cùng thư giả, vào lúc nào.'],
    go: [['Trò chơi: Soi thư giả mạo', '#thuchanh-soithu'], ['Lab 1 – bước 3', '#lab-1']] },
  { t: 'Trình diễn: kiến trúc cơ quan và luồng dữ liệu', act: [8], demo: true, viz: 'netmap',
    pts: ['Đi từ sơ đồ mạng giả lập: vùng Internet – tường lửa biên – vùng máy chủ (10.20.1.0/24) – vùng văn phòng (10.20.10.0/24) – vùng CNTT (10.20.20.0/24) – máy chủ sao lưu.',
          'Xác định ranh giới và tài sản trọng yếu: hệ thống văn bản, máy chủ tệp, thư điện tử, máy chủ xác thực, sao lưu.',
          'Chỉ ra luồng dữ liệu đi qua ranh giới tin cậy – nơi cần kiểm soát và ghi nhật ký.'],
    go: [['Trò chơi: Soi sơ đồ mạng', '#thuchanh-soimang'], ['Lab 1', '#lab-1']] }
  ],
  quiz: [
    { q: 'Văn bản dự thảo của cơ quan bị gửi nhầm vào nhóm Zalo có người ngoài. Thuộc tính nào bị ảnh hưởng trực tiếp?', o: ['Bí mật (Confidentiality)', 'Toàn vẹn (Integrity)', 'Sẵn sàng (Availability)', 'Không thuộc tính nào'], a: 0, e: 'Thông tin bị LỘ cho người không có quyền là mất tính bí mật.' },
    { q: 'Câu nào là một kịch bản rủi ro ĐỦ thành phần?', o: ['Máy chủ tệp có rủi ro cao', 'Chưa bật MFA cho thư điện tử', 'Kẻ lừa đảo lợi dụng việc chưa bật MFA để chiếm hộp thư công vụ, làm lộ văn bản đến', 'Phishing là nguy cơ phổ biến'], a: 2, e: 'Có đủ nguồn đe dọa – điều kiện – tài sản – hậu quả.' },
    { q: 'Theo chương trình, công thức R = L × I là:', o: ['Công thức bắt buộc của NIST SP 800-30', 'Quy ước giảng dạy, cần kèm luận cứ', 'Quy định tại Nghị định 331/2026', 'Yêu cầu của ISO/IEC 27001'], a: 1, e: 'Chỉ là quy ước của bài học; NIST SP 800-30 không bắt buộc công thức này.' },
    { q: 'Khung nào là “từ điển” chiến thuật, kỹ thuật tấn công dựa trên quan sát thực tế?', o: ['NIST CSF 2.0', 'ISO/IEC 27001:2022', 'MITRE ATT&CK', 'OWASP Top 10'], a: 2, e: 'ATT&CK mô tả cách kẻ tấn công hành động.' },
    { q: 'Chức năng nào nằm ở trung tâm NIST CSF 2.0?', o: ['Phát hiện (Detect)', 'Quản trị (Govern)', 'Bảo vệ (Protect)', 'Khôi phục (Recover)'], a: 1, e: 'CSF 2.0 bổ sung Govern và đặt ở trung tâm.' },
    { q: 'Dấu hiệu nào KHÔNG đủ để kết luận một thư là giả mạo?', o: ['SPF = fail', 'Tên miền người gửi khác một ký tự', 'Thư có tệp đính kèm PDF', 'Reply-To trỏ tới hộp thư lạ'], a: 2, e: 'Tệp PDF tự nó không phải dấu hiệu giả mạo; cần kết hợp nhiều dấu hiệu.' }
  ] },

/* ===================== CHUYÊN ĐỀ 2 ===================== */
{ id: 2, short: 'Các quy định pháp luật về an ninh mạng trong thời kỳ mới',
  sections: [
  { t: 'Luật An ninh mạng số 116/2025/QH15, phạm vi nghĩa vụ', act: [1], viz: 'lawmap',
    pts: [
      'Thông qua ngày 10/12/2025, có hiệu lực từ 01/7/2026; 08 chương, 45 điều.',
      'Thay thế đồng thời Luật An toàn thông tin mạng 2015 và Luật An ninh mạng 2018 (Điều 44) – mọi quy chế nội bộ còn ghi căn cứ hai luật này cần cập nhật.',
      'Hệ thống thông tin được phân loại theo cấp độ (Điều 8); chủ quản hệ thống thông tin có trách nhiệm xác định cấp độ và áp dụng biện pháp tương ứng.',
      'Chương VII quy định trách nhiệm của cơ quan, tổ chức, cá nhân về an ninh mạng; Chương VIII: hiệu lực và chuyển tiếp.',
      'Nhóm hành vi bị nghiêm cấm (Điều 7), trong đó có sử dụng trí tuệ nhân tạo hoặc công nghệ mới để giả mạo video, hình ảnh, giọng nói của người khác trái quy định.'],
    note: { k: 'law', t: 'Khi trích dẫn trong hồ sơ thật: ghi số hiệu đầy đủ, số Điều/khoản đã đọc trong toàn văn, ngày tra cứu, nguồn tra cứu.' },
    try: { type: 'link', to: 'phapluat', label: 'Mở sổ tra cứu hiệu lực văn bản' } },
  { t: 'Nhóm Nghị định 327, 330, 331, 332, 333/2026/NĐ-CP', act: [2], viz: 'decrees',
    pts: [
      'Gói 07 nghị định ban hành ngày 19/8/2026 (327–333). Các nghị định 327, 329–333 có hiệu lực ngay ngày 19/8/2026; Nghị định 328 (tin giả) có hiệu lực 05/10/2026.',
      'NĐ 327: phòng ngừa, xử lý thông tin và hành vi xâm phạm an ninh quốc gia, trật tự an toàn xã hội trên không gian mạng (chi tiết Điều 14 Luật).',
      'NĐ 330: xử phạt vi phạm hành chính trong lĩnh vực an ninh mạng và bảo vệ dữ liệu cá nhân – có hiệu lực ngay, không có thời gian chuyển tiếp.',
      'NĐ 331: bảo vệ an ninh mạng đối với hệ thống thông tin – tiêu chí cấp độ 1–5, thẩm quyền, hồ sơ, biện pháp theo cấp độ. Đây là văn bản dùng cho Chuyên đề 5.',
      'NĐ 332: kinh doanh sản phẩm, dịch vụ an ninh mạng – kiểm tra khi thuê nhà cung cấp dịch vụ giám sát, kiểm tra, ứng cứu.',
      'NĐ 333: chi tiết và biện pháp thi hành Luật – thẩm định, kiểm tra, giám sát, ứng phó, khắc phục sự cố; tập huấn kỹ năng chuyên sâu.'],
    try: { type: 'link', to: 'thuchanh-nghidinh', label: 'Trò chơi: Ghép tình huống với đúng nghị định' } },
  { t: 'Hệ thống 5 cấp độ; chủ quản – đơn vị vận hành – chủ dữ liệu', act: [3], viz: 'levels',
    pts: [
      'Tóm tắt tiêu chí theo Nghị định 331/2026 (Điều 11–15): Cấp 1 – hệ thống nội bộ chỉ xử lý thông tin công cộng; Cấp 2 – hệ thống nội bộ có thông tin riêng, thông tin cá nhân (không có bí mật nhà nước), hệ thống phục vụ người dân ở mức nhỏ, hạ tầng của một cơ quan; Cấp 3 – xử lý bí mật nhà nước hoặc phục vụ quốc phòng, an ninh ở mức tổn hại an ninh quốc gia, thủ tục hành chính, dữ liệu cá nhân quy mô lớn, hạ tầng dùng chung cấp bộ, ngành, tỉnh; Cấp 4, 5 – mức tổn hại nghiêm trọng, đặc biệt nghiêm trọng.',
      'Chủ quản hệ thống thông tin: cơ quan có thẩm quyền quản lý, chịu trách nhiệm cao nhất. Đơn vị vận hành: được giao vận hành (có thể là nhà cung cấp). Chủ quản dữ liệu: quyết định về dữ liệu trong hệ thống.',
      'Nguyên tắc của buổi học: KHÔNG tự suy cấp độ theo tên hệ thống hay số lượng máy chủ – phải đối chiếu loại thông tin, đối tượng phục vụ, phạm vi ảnh hưởng với điều khoản gốc.'],
    note: { k: 'warn', t: 'Phần tóm tắt tiêu chí ở trên dùng cho học tập. Khi lập hồ sơ thật phải đọc nguyên văn Điều 11–16 Nghị định 331/2026/NĐ-CP.' },
    try: { type: 'link', to: 'thuchanh-capdo', label: 'Trò chơi: Đề xuất cấp độ cho 8 hệ thống' } },
  { t: 'Dữ liệu cá nhân, bằng chứng tuân thủ và vi phạm', act: [4], viz: 'datalife',
    pts: [
      'Căn cứ: Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và Nghị định 356/2025/NĐ-CP (cùng hiệu lực 01/01/2026, thay Nghị định 13/2023).',
      'Dữ liệu cá nhân cơ bản (Điều 3 NĐ 356): họ tên, ngày sinh, giới tính, nơi cư trú, quan hệ gia đình (bổ sung quan hệ vợ, chồng)…',
      'Dữ liệu cá nhân nhạy cảm (Điều 4 NĐ 356): nguồn gốc chủng tộc, dân tộc; quan điểm chính trị, tôn giáo, tín ngưỡng; đời sống riêng tư, bí mật cá nhân, gia đình; tình trạng sức khoẻ; lịch sử hoạt động trên không gian mạng… – phải phân quyền giới hạn truy cập và biện pháp bảo mật chặt chẽ.',
      'Vòng đời dữ liệu: thu thập – lưu trữ – sử dụng – chia sẻ – xoá/huỷ. Mỗi khâu cần bằng chứng: căn cứ xử lý, danh sách người có quyền, nhật ký truy cập, hợp đồng với bên xử lý, biên bản huỷ.',
      'Vi phạm bị xử phạt theo Nghị định 330/2026/NĐ-CP. Theo nguyên tắc của chương trình, không nêu mức phạt khi chưa đối chiếu điều khoản gốc.'],
    try: { type: 'link', to: 'thuchanh-dlcn', label: 'Trò chơi: Phân loại dữ liệu cá nhân' } },
  { t: 'Quy định chuyển tiếp và hồ sơ đã phê duyệt', act: [5], viz: 'transition',
    pts: [
      'Điều 39 Nghị định 331/2026: hệ thống đang đầu tư, xây dựng trước 01/7/2026 hoàn thành thẩm định, phê duyệt cấp độ theo Nghị định 85/2016 trong 06 tháng kể từ ngày Luật 2025 có hiệu lực; trong 12 tháng phải bảo đảm điều kiện, biện pháp tương ứng cấp độ.',
      'Điều 25 Nghị định 331/2026: khi phải xác định lại cấp độ cho phù hợp thực tế thì làm theo trình tự xác định lần đầu.',
      'Nghị định 333/2026: khi thẩm định an ninh mạng, cơ quan có thẩm quyền kế thừa nội dung đã kết luận trong kết quả xác định cấp độ, không thẩm định lại trừ khi có thay đổi ảnh hưởng đến cấp độ.',
      'Với cơ quan Đảng: theo báo chí, Quy định 556-QĐ/VPTW (06/9/2026) yêu cầu hệ thống đã được xác định cấp độ trước đây rà soát, bổ sung theo điều khoản chuyển tiếp của Nghị định 331/2026; hoàn thành danh mục, phân loại trong 06 tháng, hoàn thiện hồ sơ trong 12 tháng (cần đối chiếu bản gốc).'],
    note: { k: 'law', t: 'Mẫu đối chiếu cũ – mới: [Căn cứ cũ] → [Căn cứ mới] → [Điều chuyển tiếp áp dụng] → [Việc phải làm, hạn] → [Người chịu trách nhiệm].' } },
  { t: 'Trình diễn: tra cứu số hiệu, hiệu lực, điều khoản', act: [7], demo: true, viz: 'lookup',
    pts: ['Trên vbpl.moj.gov.vn hoặc congbao.chinhphu.vn: gõ số hiệu đầy đủ → mở thuộc tính → ghi ngày ban hành, ngày hiệu lực, tình trạng → mở toàn văn, đọc điều “Hiệu lực thi hành” và “Chuyển tiếp”.',
          'Khi không có Internet: dùng bản PDF đã tải trước; ghi rõ “không xác nhận hiệu lực trực tuyến”.'],
    go: [['Sổ tra cứu hiệu lực', '#phapluat'], ['Trò chơi: Còn hiệu lực không?', '#thuchanh-hieuluc']] },
  { t: 'Trình diễn: ma trận nghĩa vụ – bằng chứng', act: [8], demo: true, viz: 'matrixdemo',
    pts: ['Làm mẫu một hàng PL-03: Căn cứ cụ thể → Nghĩa vụ cần kiểm chứng → Bằng chứng yêu cầu → Trạng thái (Đủ / Thiếu / Cần xác minh) → Người phụ trách.',
          'Không kết luận “đạt” khi thiếu chứng cứ; không dùng số điều hoặc mức phạt chưa kiểm chứng.'],
    go: [['Lab 2 – Ma trận tuân thủ', '#lab-2'], ['Biểu mẫu PL-03', '#bieumau-PL-03']] }
  ],
  quiz: [
    { q: 'Luật An ninh mạng 116/2025/QH15 có hiệu lực từ ngày nào?', o: ['01/01/2026', '01/07/2026', '19/08/2026', '10/12/2025'], a: 1, e: 'Thông qua 10/12/2025, hiệu lực 01/7/2026.' },
    { q: 'Văn bản nào quy định tiêu chí xác định cấp độ 1–5 của hệ thống thông tin hiện nay?', o: ['Nghị định 85/2016/NĐ-CP', 'Nghị định 331/2026/NĐ-CP', 'Nghị định 330/2026/NĐ-CP', 'Nghị định 13/2023/NĐ-CP'], a: 1, e: 'NĐ 331/2026, Điều 11–15.' },
    { q: 'Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân hiện nay:', o: ['Còn hiệu lực song song', 'Đã bị thay thế bởi Nghị định 356/2025/NĐ-CP từ 01/01/2026', 'Được sửa đổi bởi Nghị định 330/2026', 'Hết hiệu lực từ 01/07/2026'], a: 1, e: 'NĐ 356/2025 thay thế NĐ 13/2023.' },
    { q: 'Theo chương trình, khi chưa xác minh được bằng chứng, ô trạng thái trong ma trận tuân thủ ghi:', o: ['Đạt', 'Không đạt', 'Cần xác minh', 'Bỏ trống'], a: 2, e: 'Phân biệt “đủ/thiếu/cần xác minh”; không kết luận khi thiếu dữ liệu.' },
    { q: 'Thông tin nào là dữ liệu cá nhân NHẠY CẢM theo Nghị định 356/2025?', o: ['Họ và tên', 'Ngày sinh', 'Tình trạng sức khoẻ', 'Giới tính'], a: 2, e: 'Tình trạng sức khoẻ thuộc danh mục nhạy cảm (Điều 4).' },
    { q: 'Nghị định nào quy định xử phạt vi phạm hành chính về an ninh mạng và bảo vệ dữ liệu cá nhân?', o: ['327/2026/NĐ-CP', '330/2026/NĐ-CP', '332/2026/NĐ-CP', '333/2026/NĐ-CP'], a: 1, e: 'NĐ 330/2026, hiệu lực 19/8/2026.' }
  ] },

/* ===================== CHUYÊN ĐỀ 3 ===================== */
{ id: 3, short: 'Các kỹ thuật tấn công, khai thác của tin tặc',
  sections: [
  { t: 'Cyber Kill Chain; ATT&CK và bằng chứng phát hiện', act: [1], viz: 'killchain',
    pts: [
      'Cyber Kill Chain (Lockheed Martin) – 7 giai đoạn: Trinh sát → Vũ khí hoá → Phát tán → Khai thác → Cài đặt → Điều khiển (C2) → Hành động trên mục tiêu. Chặn được càng sớm, thiệt hại càng nhỏ.',
      'ATT&CK chi tiết hơn: chiến thuật (mục tiêu) và kỹ thuật (cách làm), có mã định danh, ví dụ T1566 Phishing, T1110 Brute Force, T1078 Valid Accounts, T1021.001 Remote Desktop Protocol, T1105 Ingress Tool Transfer, T1136 Create Account, T1070.001 Clear Windows Event Logs, T1041 Exfiltration Over C2 Channel.',
      'Mỗi kỹ thuật cần một nguồn bằng chứng phát hiện: T1110 → nhật ký Windows 4625; T1021.001 → nhật ký tường lửa cổng 3389 + 4624 LogonType 10; T1070.001 → sự kiện 1102.'],
    try: { type: 'link', to: 'thuchanh-killchain', label: 'Trò chơi: Sắp xếp chuỗi tấn công' } },
  { t: 'OSINT, rà quét cổng và định danh dịch vụ', act: [2], viz: 'portscan',
    pts: [
      'OSINT: thu thập thông tin công khai – tên miền, địa chỉ thư công vụ trên cổng thông tin, mạng xã hội cán bộ, tài liệu đính kèm có siêu dữ liệu. Phòng vệ: rà soát những gì cơ quan đang công khai.',
      'Rà quét cổng (Nmap): trạng thái open (có dịch vụ lắng nghe), closed (đến được nhưng không có dịch vụ), filtered (bị chặn, không phản hồi).',
      'Định danh dịch vụ (-sV) dựa trên banner và phản hồi – có thể sai hoặc bị giả. Kết luận đúng: “phát hiện dịch vụ” ≠ “có lỗ hổng” (service detected ≠ vulnerable).',
      'Chỉ quét trong phạm vi được cấp phép: dải lab 192.168.56.0/24, mạng host-only, có snapshot.'],
    try: { type: 'nmap' } },
  { t: 'Phishing, mật khẩu, OWASP Top 10:2025, SQLi/XSS', act: [3], viz: 'owasp',
    pts: [
      'Tấn công mật khẩu: dò mật khẩu (brute force), rải mật khẩu (password spraying – một mật khẩu thử trên nhiều tài khoản), nhồi thông tin đăng nhập đã lộ (credential stuffing).',
      'OWASP Top 10:2025: A01 Kiểm soát truy cập bị phá vỡ (gộp cả SSRF) · A02 Cấu hình sai bảo mật · A03 Lỗi chuỗi cung ứng phần mềm (mới) · A04 Lỗi mật mã · A05 Chèn mã (Injection) · A06 Thiết kế không an toàn · A07 Lỗi xác thực · A08 Lỗi toàn vẹn phần mềm, dữ liệu · A09 Lỗi ghi nhật ký và cảnh báo · A10 Xử lý sai tình huống ngoại lệ (mới).',
      'SQL injection: dữ liệu người dùng bị ghép thẳng vào câu truy vấn. Phòng vệ: truy vấn tham số hoá, quyền CSDL tối thiểu, WAF như lớp bổ sung.',
      'XSS: mã script được chèn và chạy trong trình duyệt người khác. Phòng vệ: mã hoá đầu ra theo ngữ cảnh, Content-Security-Policy, cookie HttpOnly.',
      'Đọc HTTP: phương thức (GET/POST), mã trạng thái (200 thành công, 302 chuyển hướng, 403 bị chặn, 404 không có, 500 lỗi máy chủ), tiêu đề (Host, User-Agent, Cookie, X-Frame-Options), thân.'],
    try: { type: 'link', to: 'thuchanh-http', label: 'Trò chơi: Giải phẫu một yêu cầu HTTP' } },
  { t: 'Leo thang quyền, di chuyển ngang, đánh cắp/mã hoá', act: [4], viz: 'lateral',
    pts: [
      'Leo thang quyền: từ tài khoản thường lên quản trị – lợi dụng lỗi chưa vá, dịch vụ cấu hình sai, mật khẩu quản trị dùng chung. Dấu hiệu: tạo tài khoản mới (4720), thêm vào nhóm Administrators (4732).',
      'Di chuyển ngang: dùng tài khoản đã chiếm để đăng nhập máy khác (RDP, SMB). Dấu hiệu: một tài khoản đăng nhập nhiều máy bất thường, ngoài giờ.',
      'Đánh cắp dữ liệu: khối lượng gửi ra Internet lớn bất thường tới đích lạ (netflow). Mã hoá: nhiều tệp đổi nội dung trong thời gian ngắn (FIM), xoá bản sao lưu.',
      'Che dấu vết: xoá nhật ký (sự kiện 1102). Điểm chặn: MFA, quyền tối thiểu, phân vùng mạng, đẩy nhật ký về SIEM ngay (xoá ở máy vẫn còn bản ở SIEM).'] },
  { t: 'Trình diễn: kết nối và giới hạn phạm vi lab', act: [6], demo: true, viz: 'labnet',
    pts: ['Kiểm tra máy Kali (192.168.56.10) chỉ có card host-only; không có đường sang mạng thật; tạo snapshot trước khi làm.', 'Lệnh minh hoạ: ip addr; ip route; ping -c 2 192.168.56.20; ping -c 2 8.8.8.8 (phải thất bại).', 'Học viên không dùng máy ảo: làm trên Ubuntu WSL với máy web giả lập ở 127.0.0.1 (Lab 3 bước 1); phòng học có máy ảo làm thật ở Lab 8.'],
    code: '$ ip route\n<span class="g">192.168.56.0/24 dev eth0 proto kernel scope link src 192.168.56.10</span>\n$ ping -c 2 8.8.8.8\n<span class="r">ping: connect: Network is unreachable</span>   <span class="c"># đúng: lab không ra Internet</span>' },
  { t: 'Trình diễn: Nmap giới hạn cổng và phân tích đầu ra', act: [7], demo: true, viz: 'nmapdemo',
    pts: ['nmap -sV -p 22,80,443,3000 -oA lab_web 192.168.56.20 – chỉ 4 cổng, một địa chỉ.', 'Đọc kết quả: cổng, trạng thái, dịch vụ, phiên bản; giải thích độ tin cậy của phiên bản.', 'Học viên đọc bản ghi sẵn nmap_192.168.56.20.txt trên Ubuntu WSL; quét thật qua tường lửa ở Lab 8.'],
    go: [['Lab 3 – bước 2', '#lab-3'], ['Lab 8 – máy ảo', '#lab-8']] },
  { t: 'Trình diễn: HTTP qua ZAP/Burp trong Juice Shop', act: [8], demo: true, viz: 'httpdemo',
    pts: ['Đặt trình duyệt lab đi qua proxy ZAP/Burp; mở Juice Shop cổng 3000; quan sát một GET hợp lệ.', 'Đọc method, status, header, cookie; làm sạch token trước khi đưa vào báo cáo.'],
    go: [['Trò chơi: Giải phẫu HTTP', '#thuchanh-http']] }
  ],
  quiz: [
    { q: 'Nmap báo “3000/tcp open http Node.js Express”. Kết luận nào ĐÚNG?', o: ['Máy có lỗ hổng nghiêm trọng', 'Có một dịch vụ web đang lắng nghe ở cổng 3000; chưa đủ căn cứ kết luận lỗ hổng', 'Máy đã bị xâm nhập', 'Cổng 3000 bị tường lửa chặn'], a: 1, e: 'Service detected ≠ vulnerable.' },
    { q: 'Một địa chỉ thử MỘT mật khẩu trên rất nhiều tài khoản khác nhau. Đây là:', o: ['Brute force', 'Password spraying', 'Credential stuffing', 'SQL injection'], a: 1, e: 'Rải mật khẩu để tránh khoá tài khoản.' },
    { q: 'Mã trạng thái HTTP 403 với yêu cầu chứa “OR 1=1” cho thấy:', o: ['Tấn công SQLi thành công', 'Yêu cầu bị chặn (ví dụ bởi WAF); là dấu hiệu thử tấn công', 'Trang không tồn tại', 'Máy chủ lỗi'], a: 1, e: '403 = bị từ chối; phân biệt thử nghiệm với khai thác thành công.' },
    { q: 'Sự kiện Windows nào cho thấy nhật ký bảo mật bị xoá?', o: ['4624', '4625', '4720', '1102'], a: 3, e: '1102 – The audit log was cleared.' },
    { q: 'Mục MỚI trong OWASP Top 10:2025 là:', o: ['Injection', 'Lỗi chuỗi cung ứng phần mềm', 'Cấu hình sai bảo mật', 'Kiểm soát truy cập bị phá vỡ'], a: 1, e: 'A03 Software Supply Chain Failures và A10 Mishandling of Exceptional Conditions là hai mục mới.' },
    { q: 'Giai đoạn đầu tiên của Cyber Kill Chain là:', o: ['Phát tán', 'Trinh sát', 'Khai thác', 'Điều khiển C2'], a: 1, e: 'Reconnaissance – thu thập thông tin mục tiêu.' }
  ] },

/* ===================== CHUYÊN ĐỀ 4 ===================== */
{ id: 4, short: 'Vận dụng kiến thức xây dựng giải pháp phòng thủ cho hệ thống',
  sections: [
  { t: 'Defense in Depth, Zero Trust và phân vùng mạng', act: [1], viz: 'layers',
    pts: [
      'Phòng thủ nhiều lớp: con người – chính sách – vùng biên – mạng nội bộ – máy chủ/máy trạm – ứng dụng – dữ liệu. Một lớp thủng, lớp sau vẫn chặn.',
      'Zero Trust (NIST SP 800-207): không tin mặc định theo vị trí mạng; xác thực, phân quyền mỗi lần truy cập, theo danh tính và tình trạng thiết bị.',
      'Phân vùng (VLAN/DMZ): tách vùng Internet – DMZ (cổng thông tin) – vùng máy chủ – vùng người dùng – vùng quản trị – vùng sao lưu. Chỉ cho phép luồng cần thiết.',
      'Câu hỏi khi thiết kế: luồng nào cần CHO PHÉP? Mọi luồng còn lại CHẶN (chặn mặc định).'] },
  { t: 'Firewall, IDS, IPS và WAF; kiểm soát luồng', act: [2], viz: 'idsips',
    pts: [
      'Tường lửa: cho phép/chặn theo nguồn, đích, cổng, giao thức; quy tắc xét từ trên xuống, khớp quy tắc đầu tiên.',
      'IDS (ví dụ Suricata ở chế độ giám sát) nhận bản sao lưu lượng (SPAN/TAP) – chỉ PHÁT HIỆN, cảnh báo; không chặn.',
      'IPS đặt nối tiếp (inline) trên đường đi – có thể CHẶN; sai một quy tắc có thể làm gián đoạn dịch vụ.',
      'WAF bảo vệ ứng dụng web ở tầng HTTP (SQLi, XSS…); không thay cho sửa lỗi trong mã nguồn.',
      'Không nhầm IDS với IPS inline: cảnh báo “allowed” trong EVE nghĩa là lưu lượng vẫn đi qua.'],
    try: { type: 'link', to: 'thuchanh-camdat', label: 'Trò chơi: Đặt cảm biến đúng vị trí' } },
  { t: 'MFA, quyền tối thiểu, RBAC và CIS Benchmarks', act: [3], viz: 'rbac',
    pts: [
      'Xác thực đa yếu tố (MFA) cho thư điện tử, VPN, tài khoản quản trị là biện pháp chặn hiệu quả nhất trước mật khẩu bị lộ.',
      'Quyền tối thiểu: chỉ cấp quyền cần cho công việc; tài khoản quản trị tách khỏi tài khoản dùng hằng ngày.',
      'RBAC: cấp quyền theo vai trò (Văn thư, Chuyên viên, Lãnh đạo, Quản trị), không cấp cho từng người lẻ tẻ; thu hồi ngay khi nghỉ việc, nghỉ hưu, chuyển công tác.',
      'CIS Benchmarks: bộ khuyến nghị cấu hình an toàn cho hệ điều hành, phần mềm – dùng làm chuẩn so sánh khi tăng cường cấu hình.'],
    try: { type: 'link', to: 'thuchanh-phanquyen', label: 'Trò chơi: Rà soát ma trận phân quyền' } },
  { t: 'Quản lý lỗ hổng, bản vá, EDR và sao lưu', act: [4], viz: 'backup',
    pts: [
      'Chu trình lỗ hổng: kiểm kê → quét/nhận cảnh báo (CVE) → đánh giá mức ảnh hưởng thực tế → vá hoặc biện pháp bù trừ → kiểm tra lại.',
      'EDR: giám sát hành vi trên máy trạm, máy chủ (tiến trình, kết nối, tệp), cho phép cô lập máy từ xa.',
      'Sao lưu 3-2-1: 3 bản, 2 loại phương tiện, 1 bản ở nơi khác; có bản không ghi đè được (offline/bất biến).',
      'Backup job thành công ≠ khôi phục được. Phải có biên bản thử khôi phục (restore test), đo RTO (thời gian khôi phục) và RPO (lượng dữ liệu chấp nhận mất).'] },
  { t: 'Wazuh SIEM, Suricata IDS và đường đi của dữ liệu sự kiện', act: [5], viz: 'pipeline',
    pts: [
      'Suricata ghi cảnh báo vào eve.json (định dạng JSON mỗi dòng một sự kiện: timestamp, src_ip, dest_ip, alert.signature_id…).',
      'Wazuh agent đọc tệp (localfile, log_format json) → gửi về manager → decoder tách trường → rule gán mức → indexer lưu → dashboard hiển thị.',
      'Điều kiện để thấy sự kiện trên dashboard: cảm biến thấy lưu lượng; quy tắc khớp; agent có quyền đọc tệp; agent kết nối manager; rule không bị lọc; đúng khoảng thời gian, múi giờ.',
      'Không thấy cảnh báo ≠ không có tấn công. Phải kiểm từng đoạn của đường đi.'],
    try: { type: 'link', to: 'lab-4', label: 'Lab 4 – Xây dựng tuyến phát hiện' } },
  { t: 'Trình diễn: kiểm tra firewall và truy cập liên vùng', act: [7], demo: true, viz: 'fwdemo',
    pts: ['Thử một luồng phải CHO PHÉP và một luồng phải CHẶN – chứng minh cả hai.', 'Lệnh minh hoạ trên máy lab: sudo ufw status numbered; nc -zv 192.168.56.20 3000 (thành công); nc -zv 192.168.56.20 22 từ vùng không được phép (bị chặn).', 'Học viên: kiểm thử ALLOW/DENY trên dữ liệu fw.log (Lab 4 bước 3) và trò chơi Mô phỏng tường lửa; làm thật với pfSense ở Lab 8.'],
    go: [['Trò chơi: Mô phỏng tường lửa', '#thuchanh-tuonglua'], ['Lab 8 – pfSense', '#lab-8']] },
  { t: 'Trình diễn: Suricata rule và cảnh báo EVE JSON', act: [8], demo: true, viz: 'evedemo',
    code: '<span class="c"># quy tắc đánh dấu của lab</span>\nalert http any any -> $HOME_NET any (msg:"LAB-MARKER kiem thu quy tac"; content:"/lab-marker-test"; http_uri; sid:1000001; rev:1;)\n\n$ sudo suricata -T -c /etc/suricata/suricata.yaml   <span class="c"># kiểm tra cú pháp</span>\n$ curl -s http://192.168.56.20/lab-marker-test\n$ tail -n1 /var/log/suricata/eve.json | jq \'{timestamp,src_ip,dest_ip,sid:.alert.signature_id}\'',
    pts: ['Nhận diện SID, timestamp, nguồn/đích trong một dòng EVE.', 'Học viên chạy Suricata thật trên Ubuntu WSL: đọc tệp bắt gói giả lập với quy tắc marker (Lab 4 bước 6); giám sát trực tiếp trên dây mạng ở Lab 8.'] },
  { t: 'Trình diễn: Wazuh dashboard và log Windows', act: [9], demo: true, viz: 'wazuhdemo',
    pts: ['Tìm sự kiện của agent Windows (.50), sự kiện 4625, và sự kiện Suricata đã đẩy về.', 'Giải thích: quyền đọc tệp EVE, cấu hình localfile, decoder, trường hợp không có lưu lượng qua cảm biến, dương tính giả.'] }
  ],
  quiz: [
    { q: 'Cảm biến nhận bản sao lưu lượng qua cổng SPAN, chỉ cảnh báo, không chặn. Đó là:', o: ['IPS', 'IDS', 'WAF', 'Tường lửa'], a: 1, e: 'IDS thụ động; IPS mới đặt inline để chặn.' },
    { q: 'Sao lưu chạy thành công mỗi đêm. Bằng chứng nào còn THIẾU để khẳng định khôi phục được?', o: ['Nhật ký job', 'Biên bản thử khôi phục có đo thời gian', 'Dung lượng ổ đĩa', 'Tên máy chủ sao lưu'], a: 1, e: 'Backup job ≠ restore test.' },
    { q: 'Tường lửa xét quy tắc theo thứ tự nào?', o: ['Ngẫu nhiên', 'Từ trên xuống, khớp quy tắc đầu tiên', 'Quy tắc chặn trước, cho phép sau', 'Quy tắc mới nhất trước'], a: 1, e: 'First match – thứ tự quy tắc rất quan trọng.' },
    { q: 'Suricata có cảnh báo nhưng không thấy trên Wazuh. Điều nào KHÔNG phải nguyên nhân hợp lý?', o: ['Agent không có quyền đọc eve.json', 'Chưa khai báo localfile', 'Sai khoảng thời gian trên dashboard', 'Máy chủ web đang chạy Juice Shop'], a: 3, e: 'Phải kiểm từng đoạn: tệp – agent – manager – rule – dashboard.' },
    { q: 'Biện pháp nào chặn hiệu quả nhất khi mật khẩu thư công vụ đã bị lộ?', o: ['Đổi hình nền', 'Xác thực đa yếu tố (MFA)', 'Tăng dung lượng hộp thư', 'Cài thêm trình duyệt'], a: 1, e: 'MFA khiến mật khẩu lộ chưa đủ để đăng nhập.' },
    { q: 'Theo nguyên tắc quyền tối thiểu, tài khoản của người đã nghỉ hưu phải:', o: ['Giữ nguyên để tra cứu', 'Thu hồi ngay, lưu bằng chứng thu hồi', 'Chuyển cho người mới dùng chung', 'Đổi mật khẩu mặc định'], a: 1, e: 'Tài khoản không chủ là điểm vào phổ biến.' }
  ] },

/* ===================== CHUYÊN ĐỀ 5 ===================== */
{ id: 5, short: 'Xây dựng kế hoạch và lập hồ sơ đề xuất cấp độ hệ thống thông tin',
  sections: [
  { t: 'Mục tiêu, phạm vi hệ thống và mô hình ranh giới', act: [1], viz: 'boundary',
    pts: [
      'Một hồ sơ cấp độ bắt đầu bằng câu hỏi: hệ thống phục vụ nghiệp vụ gì, ai dùng, xử lý loại thông tin gì?',
      'Ranh giới hệ thống: liệt kê thành phần THUỘC hệ thống (web, API, CSDL, máy chủ tệp đính kèm, IAM, sao lưu) và thành phần PHỤ THUỘC dùng chung (thư điện tử, AD, mạng truyền số liệu chuyên dùng).',
      'Ranh giới tin cậy (trust boundary): điểm dữ liệu đi từ vùng tin cậy thấp sang cao – Internet → reverse proxy; người dùng → API; ứng dụng → CSDL; nhà thầu qua VPN.',
      'Sơ đồ hiện trạng (as-is) phải đúng thực tế, không vẽ theo mong muốn.'],
    try: { type: 'link', to: 'lab-5', label: 'Lab 5 – vẽ ranh giới trên sơ đồ' } },
  { t: 'Tiêu chí 5 cấp độ và đánh giá tác động CIA', act: [2], viz: 'levels',
    pts: [
      'Đối chiếu theo 3 câu hỏi: (1) loại thông tin xử lý: công cộng / riêng, cá nhân / bí mật nhà nước; (2) đối tượng phục vụ: nội bộ / người dân, doanh nghiệp / liên ngành, toàn quốc; (3) mức tổn hại khi bị phá hoại.',
      'Tóm tắt NĐ 331/2026: Cấp 1 – nội bộ, chỉ thông tin công cộng; Cấp 2 – nội bộ có thông tin riêng, cá nhân, không có bí mật nhà nước; Cấp 3 – xử lý bí mật nhà nước ở mức tổn hại an ninh quốc gia, thủ tục hành chính, dữ liệu cá nhân quy mô lớn, hạ tầng dùng chung cấp tỉnh; Cấp 4 – tổn hại nghiêm trọng, hệ thống quốc gia vận hành 24/7; Cấp 5 – tổn hại đặc biệt nghiêm trọng, mặc định là hệ thống quan trọng về an ninh quốc gia.',
      'Tác động CIA mô tả bằng hậu quả nghiệp vụ: “gián đoạn 4 giờ làm chậm phát hành văn bản chỉ đạo”, không chỉ ghi “Cao”.',
      'Không gán cấp độ khi chưa đối chiếu điều khoản; ghi rõ khoản, điểm nào được áp dụng.'],
    note: { k: 'warn', t: 'Sản phẩm của buổi học là hồ sơ minh hoạ. Cấp độ chính thức, thẩm quyền thẩm định và phê duyệt xác định theo văn bản áp dụng sau khi rà soát điều khoản.' },
    try: { type: 'link', to: 'thuchanh-capdo', label: 'Trò chơi: Đề xuất cấp độ' } },
  { t: 'Thành phần hồ sơ và thuyết minh căn cứ', act: [3], viz: 'dossier',
    pts: [
      'Theo NĐ 331/2026 (Điều 21) hồ sơ đề xuất cấp độ gồm: mô tả tổng quan hệ thống; tài liệu thiết kế; thuyết minh căn cứ đề xuất cấp độ; thuyết minh phương án bảo đảm an ninh mạng; ý kiến chuyên môn của đơn vị chuyên trách (với cấp 4, 5).',
      'Trong bài thực hành dùng 6 thành phần HS-01…HS-06 (PL-05): Tổng quan và ranh giới · Kiến trúc as-is · Thuyết minh cấp độ · Phương án bảo đảm an ninh mạng · Quy trình log, sao lưu, ứng cứu · Biên bản rà soát và tồn tại.',
      'Thuyết minh căn cứ = loại thông tin + loại hệ thống + điều khoản đối chiếu + kết luận đề xuất. Mỗi ý có bằng chứng.'] },
  { t: 'Yêu cầu quản lý/kỹ thuật; chứng cứ kiểm tra', act: [4], viz: 'controls',
    pts: [
      'Điều 30 NĐ 331/2026: bảo đảm an ninh mạng theo cấp độ thực hiện theo yêu cầu cơ bản tại nghị định và tiêu chuẩn quốc gia về yêu cầu cơ bản đối với hệ thống thông tin (tra số hiệu tiêu chuẩn hiện hành).',
      'Nhóm quản lý: chính sách, tổ chức, nhân sự, quản lý thiết kế – xây dựng, vận hành, quản lý thay đổi, sự cố.',
      'Nhóm kỹ thuật: thiết kế mạng, kiểm soát truy cập, xác thực, nhật ký, phòng chống mã độc, sao lưu, bảo vệ dữ liệu.',
      'Ma trận Yêu cầu → Biện pháp → Bằng chứng: ví dụ “Nhật ký tập trung” → “Wazuh thu log 5 máy chủ” → “ảnh dashboard + cấu hình agent + thời gian lưu 90 ngày”.'] },
  { t: 'Thẩm định, phê duyệt, chuyển tiếp và thay đổi', act: [5], viz: 'approval',
    pts: [
      'Tóm tắt thẩm quyền (Điều 18 NĐ 331/2026): Cấp 1–2 – đơn vị chuyên trách an ninh mạng của chủ quản thẩm định và phê duyệt; Cấp 3 – đơn vị chuyên trách thẩm định, chủ quản phê duyệt; Cấp 4–5 – Bộ Công an chủ trì thẩm định (Bộ Quốc phòng, Ban Cơ yếu Chính phủ với hệ thống thuộc phạm vi quản lý).',
      'Thời hạn tóm tắt: phản hồi hồ sơ chưa hợp lệ tối đa 05 ngày làm việc; thẩm định tối đa 15 ngày (cấp 3), 25 ngày (cấp 4, 5); phê duyệt tối đa 07 ngày làm việc.',
      'Khi hệ thống thay đổi làm ảnh hưởng cấp độ: xác định lại theo trình tự như lần đầu (Điều 25).',
      'Chỗ phải xác minh thẩm quyền cụ thể: hệ thống của cơ quan Đảng (đối chiếu thêm quy định của Văn phòng Trung ương Đảng).'] },
  { t: 'Trình diễn: mô tả kiến trúc hệ thống văn bản', act: [7], demo: true, viz: 'archvb',
    pts: ['Kiến trúc giả lập: người dùng → VPN/Internet → reverse proxy → web → API → CSDL; IAM (AD); máy chủ tệp đính kèm; sao lưu; nhà thầu bảo trì qua VPN.', 'Đánh dấu ranh giới tin cậy và luồng dữ liệu.'] },
  { t: 'Trình diễn: checklist và biểu mẫu hồ sơ', act: [8], demo: true, viz: 'checklist',
    pts: ['Đi qua HS-01…HS-06: nội dung bắt buộc của từng phần và lỗi thường gặp.'],
    go: [['Biểu mẫu PL-05', '#bieumau-PL-05'], ['Lab 5', '#lab-5']] }
  ],
  quiz: [
    { q: 'Hệ thống nội bộ, xử lý thông tin riêng và thông tin cá nhân của cán bộ, không có bí mật nhà nước – theo tóm tắt NĐ 331/2026, mức nào phù hợp để ĐỀ XUẤT ban đầu?', o: ['Cấp 1', 'Cấp 2', 'Cấp 4', 'Cấp 5'], a: 1, e: 'Cấp 2 – vẫn phải đối chiếu điều khoản gốc trước khi kết luận.' },
    { q: 'Thành phần nào KHÔNG thuộc hồ sơ đề xuất cấp độ theo Điều 21 NĐ 331/2026 (tóm tắt)?', o: ['Mô tả tổng quan hệ thống', 'Thuyết minh căn cứ đề xuất cấp độ', 'Thuyết minh phương án bảo đảm an ninh mạng', 'Bảng chấm công của đơn vị vận hành'], a: 3, e: '' },
    { q: 'Với hệ thống đề xuất cấp độ 3, ai phê duyệt?', o: ['Bộ Công an', 'Chủ quản hệ thống thông tin', 'Nhà thầu', 'Đơn vị vận hành'], a: 1, e: 'Cấp 3: đơn vị chuyên trách thẩm định, chủ quản phê duyệt.' },
    { q: '“Trust boundary” trong sơ đồ hiện trạng là:', o: ['Tường bao trụ sở', 'Điểm dữ liệu đi qua giữa hai vùng có mức tin cậy khác nhau', 'Danh sách người dùng tin cậy', 'Giới hạn dung lượng ổ đĩa'], a: 1, e: '' },
    { q: 'Ghi “Tác động: Cao” cho tính Sẵn sàng. Cần bổ sung gì để thành luận cứ?', o: ['Không cần gì', 'Hậu quả nghiệp vụ cụ thể và thời gian chịu đựng được', 'Số máy chủ', 'Tên nhà cung cấp'], a: 1, e: '' },
    { q: 'Hệ thống thay đổi làm ảnh hưởng tới cấp độ thì:', o: ['Giữ nguyên hồ sơ cũ', 'Xác định lại theo trình tự như lần đầu', 'Chỉ báo cáo miệng', 'Chờ đến kỳ kiểm tra'], a: 1, e: 'Điều 25 NĐ 331/2026.' }
  ] },

/* ===================== CHUYÊN ĐỀ 6 ===================== */
{ id: 6, short: 'Xây dựng quy trình ứng cứu sự cố an ninh mạng',
  sections: [
  { t: 'NIST SP 800-61r3 và quan hệ với NIST CSF 2.0', act: [1], viz: 'ir',
    pts: [
      'NIST SP 800-61 Rev.3 (04/2025) thay Rev.2: tổ chức hoạt động ứng phó sự cố theo các chức năng của CSF 2.0 – Quản trị, Nhận diện, Bảo vệ (chuẩn bị, cải tiến) và Phát hiện, Ứng phó, Khôi phục (xử lý sự cố).',
      'Các bước Chuẩn bị – Phát hiện – Ngăn chặn – Loại bỏ – Khôi phục – Rút kinh nghiệm dùng trong buổi học là CHECKLIST TÁC NGHIỆP giảng dạy, không phải cấu trúc chính thức của Rev.3.',
      'Trong nước: các biện pháp ứng phó, khắc phục sự cố an ninh mạng được quy định tại Luật An ninh mạng 2025 và Nghị định 333/2026/NĐ-CP – phương án ứng cứu của cơ quan cần rà soát căn cứ (nhiều phương án cũ còn dẫn Quyết định 05/2017/QĐ-TTg).'] },
  { t: 'Tổ chức đội ứng cứu; mức nghiêm trọng (SEV); trách nhiệm RACI', act: [2], viz: 'raci',
    pts: [
      'Vai trò tối thiểu: Chỉ huy sự cố (quyết định), Phân tích (SOC/IT), Kỹ thuật hệ thống, Chủ hệ thống (nghiệp vụ), Pháp chế – báo cáo, Truyền thông nội bộ.',
      'Thang SEV giả lập của khoá học: SEV-1 Nghiêm trọng (hệ thống trọng yếu bị chiếm quyền quản trị, ngừng hoạt động, hoặc xác nhận có dữ liệu bị gửi ra ngoài) · SEV-2 Cao (tài khoản bị chiếm, có dấu hiệu lan rộng) · SEV-3 Trung bình (một máy bị ảnh hưởng, đã khoanh vùng) · SEV-4 Thấp (dấu hiệu đơn lẻ, chưa ảnh hưởng).',
      'RACI: R – người làm; A – người chịu trách nhiệm cuối và phê duyệt (chỉ một); C – được hỏi ý kiến; I – được thông báo.'],
    try: { type: 'link', to: 'thuchanh-raci', label: 'Trò chơi: Ai làm gì khi có sự cố' } },
  { t: 'Tiếp nhận, phân loại, log, bằng chứng, cô lập, khôi phục', act: [3], viz: 'evidence',
    pts: [
      'Tiếp nhận: mở phiếu (ticket) ngay, ghi giờ và nguồn giờ (múi giờ).',
      'Phân loại (triage): chỉ dấu (indicator) ≠ sự cố đã xác nhận. Tách DỮ KIỆN (thấy trong log) và GIẢ THUYẾT (cần xác minh).',
      'Bằng chứng: sao nguyên trạng, tính SHA-256, ghi chuỗi bàn giao (chain of custody: ai, lúc nào, làm gì, lưu ở đâu). Không mở, sửa trên bản gốc.',
      'Cô lập (containment): ngắt mạng có kiểm soát, khoá tài khoản, chặn địa chỉ – mỗi quyết định có người phê duyệt và đánh giá ảnh hưởng nghiệp vụ.',
      'Khôi phục: từ bản sao lưu sạch đã kiểm tra; theo dõi tăng cường sau khôi phục; kiểm tra lại (retest).'],
    code: '$ sha256sum SRV-VB01_security.evtx > SRV-VB01_security.evtx.sha256\n$ cat SRV-VB01_security.evtx.sha256\n<span class="y">9f2c…e41a</span>  SRV-VB01_security.evtx' },
  { t: '5 playbook: ransomware, phishing, chiếm tài khoản, tấn công web, lộ lọt dữ liệu', act: [4], viz: 'playbooks',
    pts: [
      'Chọn playbook theo TÍN HIỆU, không theo cảm giác: nhiều tệp đổi đuôi + ghi chú đòi tiền → ransomware; thư giả + người dùng bấm → phishing; đăng nhập lạ thành công → chiếm tài khoản; 4xx/5xx bất thường trên web → tấn công web; khối lượng lớn ra ngoài → lộ lọt.',
      'Mỗi playbook gồm: tín hiệu nhận biết · nguồn log cần xem · việc làm ngay trong 15 phút đầu · ai quyết định · khi nào báo cáo · cách khôi phục và kiểm tra lại.'],
    try: { type: 'link', to: 'thuchanh-playbook', label: 'Trò chơi: Chọn đúng playbook' } },
  { t: 'Trình diễn: tương quan log Windows, Suricata, Wazuh', act: [6], demo: true, viz: 'correl',
    pts: ['Theo chuỗi log giả lập: 09:10 nhiều 4625; 09:13 có 4624; 09:18 Wazuh FIM phát hiện thay đổi tệp; 09:20 Suricata có HTTP alert.', 'Câu hỏi then chốt: cảnh báo 09:20 có cùng máy, cùng tài khoản với chuỗi 09:10–09:18 không? Không tự kết luận ransomware khi chưa có bằng chứng độc lập.'],
    go: [['Lab 6 – Diễn tập', '#lab-6']] },
  { t: 'Trình diễn: phân loại mức độ và dựng dòng thời gian', act: [7], demo: true, viz: 'timelinedemo',
    pts: ['Dựng timeline thống nhất múi giờ; mỗi mốc ghi nguồn; tô màu dữ kiện/giả thuyết.'] },
  { t: 'Trình diễn: quyết định ngăn chặn và lưu bằng chứng', act: [8], demo: true, viz: 'containdemo',
    pts: ['So sánh phương án: ngắt mạng ngay – khoá tài khoản – chặn IP – theo dõi thêm. Nêu rủi ro mỗi phương án và người phê duyệt.'] }
  ],
  quiz: [
    { q: 'Theo chương trình, các bước chuẩn bị – phát hiện – ngăn chặn – loại bỏ – khôi phục – rút kinh nghiệm là:', o: ['Cấu trúc chính thức của NIST SP 800-61r3', 'Checklist tác nghiệp dùng trong giảng dạy', 'Quy định của Nghị định 331/2026', 'Các chức năng của CSF 2.0'], a: 1, e: 'Rev.3 tổ chức theo CSF 2.0.' },
    { q: '09:20 có cảnh báo Suricata từ máy 10.20.20.12 (máy IT chạy thử quy tắc). Chuỗi tấn công ở SRV-VB01. Kết luận đúng:', o: ['Cảnh báo 09:20 chứng minh ransomware', 'Cảnh báo 09:20 trùng thời gian nhưng khác nguồn – cần xác minh, nhiều khả năng là marker kiểm thử', 'Bỏ qua mọi cảnh báo', 'Cô lập máy 10.20.20.12 trước tiên'], a: 1, e: 'Tương quan theo máy, tài khoản, không chỉ theo giờ.' },
    { q: 'Trong RACI, chữ A là:', o: ['Người thực hiện', 'Người chịu trách nhiệm cuối cùng, phê duyệt', 'Người được hỏi ý kiến', 'Người được thông báo'], a: 1, e: 'Accountable – chỉ một người.' },
    { q: 'Tại sao phải tính SHA-256 khi thu bằng chứng?', o: ['Để nén tệp', 'Để chứng minh bằng chứng không bị thay đổi sau khi thu', 'Để mã hoá tệp', 'Để đổi tên tệp'], a: 1, e: '' },
    { q: 'Tín hiệu: khối lượng 2 GB gửi từ máy chủ văn bản tới địa chỉ Internet lạ trong 18 phút. Playbook phù hợp:', o: ['Ransomware', 'Lộ lọt dữ liệu', 'Tấn công web', 'Phishing'], a: 1, e: '' },
    { q: 'Quyết định ngắt mạng máy chủ văn bản trong giờ làm việc cần:', o: ['IT tự làm ngay không báo ai', 'Người có thẩm quyền phê duyệt, có đánh giá ảnh hưởng nghiệp vụ', 'Chờ hết tuần', 'Hỏi ý kiến nhà thầu'], a: 1, e: '' }
  ] }
];
