# Giáo trình tương tác – An ninh mạng và bảo vệ hệ thống thông tin

Tập huấn cho Văn phòng Tỉnh ủy Lâm Đồng, 17–19/11/2026 (3 ngày, 6 buổi, 6 chuyên đề). Biên soạn: SaigonLab.
HTML, CSS, JavaScript thuần – không cần máy chủ, không cần Internet (phông chữ sẽ dùng phông mặc định nếu không có mạng).

## Mở giáo trình

- Bấm đúp `index.html`. Chạy được trên Chrome, Edge, Firefox; trên điện thoại khi đưa lên mạng.
- Đưa lên mạng (GitHub Pages hoặc máy chủ nội bộ): tải toàn bộ thư mục này lên, `index.html` ở gốc.

## Các mục

| Mục | Địa chỉ | Nội dung |
|---|---|---|
| Trang chủ | `#home` | Lịch 3 ngày, lối tắt, phân bổ thời lượng, nguyên tắc dữ liệu |
| Chương trình | `#chuongtrinh` | Trích nguyên văn chương trình: bảng tổng hợp, phân bổ, tổ chức lớp, thiết bị, đánh giá |
| Chuyên đề | `#chuyende-1` … `#chuyende-6` | Kế hoạch 240 phút, từng mục lý thuyết/trình diễn có hình động, thuật ngữ, “Thử ngay”, ghi nhớ, phần thực hành và sản phẩm, câu hỏi nhanh |
| Thực hành | `#thuchanh` | 22 bài tương tác: soi bất thường (thư, sơ đồ mạng, phòng làm việc, trang đăng nhập giả, HTTP, bảng phân quyền), phân loại, sắp xếp, ma trận rủi ro 5×5, mô phỏng tường lửa, đề xuất cấp độ, diễn tập phân nhánh |
| Phòng lab | `#lab-1` … `#lab-6` | 6 tình huống trên bộ dữ liệu giả lập 7 ngày, Bàn phân tích, phiếu ghi nhận chấm tự động, xuất Word tên Gxx_BuoiY |
| Lab mở rộng AI | `#lab-7` | Huấn luyện mô hình nhẹ phát hiện thư lừa đảo ngay trên trình duyệt: chọn đặc trưng, trọng số, ma trận nhầm lẫn, kéo ngưỡng, vòng “né tránh”; xuất Word Gxx_LabMoRong |
| Lab dự phòng máy ảo | `#lab-8` | Kali – pfSense – SRV-LAB: kiểm thử tường lửa ALLOW/DENY, quét qua tường lửa, Suricata giám sát trực tiếp, hoàn nguyên snapshot; xuất Word Gxx_LabMayAo |
| Cẩm nang thực hành | `#camnang` | Hiểu bộ dữ liệu, Bàn phân tích, lệnh cơ bản, phương pháp và bốn cái bẫy, danh sách lab, chuẩn bị máy ảo Lab 8, bảng tra nhanh, xử lý sự cố; nút In |
| Cài Ubuntu WSL | `#moitruong` | Sơ đồ mạng Cơ quan Mẫu và thiết bị ghi từng tệp; 5 bước: kiểm tra máy, cài Ubuntu, **nút tải gói dữ liệu**, dán một khối lệnh (giải nén thành `~/lab`, cài công cụ, kiểm tra), làm lab; bảng sự cố |
| Bàn phân tích | `#banphantich` | Lọc, đếm, vẽ theo thời gian, đếm theo cửa sổ, cộng khối lượng trên 20 tệp dữ liệu (17 tệp nhật ký + 3 tệp thư cho Lab AI) |
| Pháp luật | `#phapluat` | Sổ tra cứu hiệu lực văn bản, rà soát đến 10/11/2026, có nguồn |
| Biểu mẫu | `#bieumau` | PL-01 … PL-06 điền được, xuất Word |
| Kiểm tra | `#kiemtra` | 20 câu ngẫu nhiên, 15 phút, kết quả theo chuyên đề |
| Giảng viên | `#giangvien-1` … `#giangvien-6` | Đồng hồ theo mốc phút, hoạt động hiện tại, theo dõi 10 nhóm, dự phòng, rubric |
| Xác nhận | `#xacnhan` | Giấy xác nhận hoàn thành (PNG) |

## Hướng dẫn thực hành

- Học viên: **Phòng lab → Cẩm nang thực hành** (`#camnang`) ngay trong giáo trình; gợi ý “Bạn sẽ thấy / Cẩn thận” của từng bước nằm sẵn trong trang lab. Bản in của cẩm nang: `03_GIANG_VIEN_So_tay_dap_an/Cam_nang_thuc_hanh_HOC_VIEN_ban_in.html`.
- Giảng viên: `03_GIANG_VIEN_So_tay_dap_an/So_tay_GIANG_VIEN.html` (lưu hành nội bộ).
- Gói dữ liệu lab (`Goi_du_lieu_LAB_ANM_LamDong.zip`, nút **Tải gói dữ liệu**) chỉ gồm `dulieu/` (20 tệp) và `congcu/` (công cụ mà khối lệnh cài đặt và Lab 3, 4, 7 cần).

## Sửa nội dung

- Nội dung chuyên đề: `js/data-cd.js`. Bài tập: `js/data-games.js`. Văn bản pháp luật: `js/data-luat.js`.
- Chương trình (trích nguyên văn): `js/data-ct.js` – sinh từ tệp Word chương trình.
- Bài lab và đáp án: sửa trong `congcu/make_lab.py` ở gói giảng viên rồi chạy lại; tệp `lab/labdef.js` chỉ chứa mã băm của đáp án.

## Lưu ý

- Thư mục `taive/` chứa gói dữ liệu cho nút **Tải gói dữ liệu** – khi đưa giáo trình lên máy chủ phải chép cả thư mục này.

- Tiến độ, bài làm chỉ lưu trong trình duyệt của máy đang dùng (localStorage), không gửi đi đâu.
- Trạng thái hiệu lực văn bản rà soát đến 10/11/2026. Trước khi áp dụng vào hệ thống thật phải đối chiếu toàn văn bản gốc.
- Mọi tình huống, tên miền, địa chỉ, tài khoản là giả lập.

## Môi trường thực hành (cập nhật 13/11/2026)

- Nhánh văn phòng: trình duyệt + Bàn phân tích. Nhánh IT: **Ubuntu trên WSL** ngay trên máy Windows của học viên, dữ liệu ở `~/lab/dulieu` – không cần máy ảo, không cần Kali.
- Phần chương trình đặt trên máy ảo được làm tương đương trên WSL: máy web giả lập ở 127.0.0.1:3000 (Lab 3), Suricata thật đọc tệp bắt gói giả lập với quy tắc marker (Lab 4), kiểm tra mã băm SHA-512 thay cho hoàn nguyên snapshot (Lab 4). Làm thật trên máy ảo ở Lab 8 (dự phòng).
- Bảng đối chiếu từng yêu cầu của chương trình với bước lab: **Phụ lục M** của `So_tay_GIANG_VIEN.html`.
- Tổng cộng **79 câu chấm tự động**: Lab 1: 8, Lab 2: 7, Lab 3: 11, Lab 4: 20, Lab 5: 6, Lab 6: 10, Lab 7 (AI): 11, Lab 8 (máy ảo): 6.
- Chuẩn bị phòng học: Phụ lục L của sổ tay giảng viên (gửi hướng dẫn WSL trước 2–3 ngày; cài hàng loạt bằng bản Ubuntu mẫu khi máy không có Internet; chuẩn bị máy ảo cho Lab 8).
