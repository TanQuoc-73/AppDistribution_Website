# Hướng Dẫn Thuyết Trình Demo Kiểm Thử Tự Động (Katalon Studio)

Tài liệu này cung cấp kịch bản và cấu trúc chi tiết để trình bày phần demo Kiểm thử Tự động (Automation Testing) hiệu quả và chuyên nghiệp.

## 1. Mục Tiêu Buổi Demo
- Cho thấy giá trị của việc áp dụng kiểm thử tự động vào quy trình phát triển.
- Trình bày kiến trúc các Test Suite đã được xây dựng.
- Minh họa cách công cụ tự động hóa các thao tác lặp đi lặp lại và bắt các lỗi tiềm ẩn.

## 2. Chuẩn Bị Trước Khi Demo
- Mở sẵn **Katalon Studio** và load project `AppDistribution_Website/KatalonProject`.
- Mở sẵn giao diện một vài Test Suite chính (ví dụ: `PurchaseSuite.ts`, `SmokeTests.ts`).
- Chọn ra **1-2 Test Case chạy ổn định nhất** (Happy Path) và **1 Test Case bắt lỗi/Edge Case** (như `PreventDuplicateOrderTest`) để demo trực tiếp.
- **Mẹo:** Nên ghi hình sẵn một đoạn video lúc test chạy mượt nhất để đề phòng mạng chậm hoặc môi trường lỗi đột xuất lúc thuyết trình thật (Live Demo rủi ro Time-out cao).

---

## 3. Kịch Bản Thuyết Trình Chi Tiết

### Phút 1 - 2: Đặt Vấn Đề & Giới Thiệu
> "Xin chào mọi người. Hôm nay mình sẽ demo về tích hợp Kiểm thử Tự động (Automated Testing) vào dự án AppDistribution."
> 
> "Thông thường, mỗi khi chúng ta thêm tính năng mới, việc kiểm tra lại toàn bộ mảng cũ (Regression) tốn rất nhiều thời gian test tay và dễ sót lỗi. Để giải quyết việc này, team đã xây dựng một bộ Automation Test sử dụng **Katalon Studio**."
>
> "Mục tiêu là đảm bảo chất lượng cho các luồng cốt lõi: Đăng nhập, Mua hàng, Phân quyền người dùng, Dashboard Quản trị hoàn toàn tự động."

### Phút 3 - 5: Tổng Quan Cấu Trúc Các Test Suite
*(Chiếu màn hình danh sách Test Suites trong folder `KatalonProject/Test Suites`)*

> "Hệ thống test không phải là một cục lộn xộn mà được chia thành 7 cụm chuyên biệt:"
- **SmokeTests:** Quét thử sức khỏe hệ thống siêu nhanh sau khi deploy bản cập nhật.
- **PurchaseSuite & ProductSuite:** Đảm bảo luồng duyệt tìm sản phẩm và thanh toán không bị nghẽn tiền.
- **UserFeaturesSuite & AuthenticationTests:** Chăm sóc trải nghiệm cá nhân hóa của người dùng (Kho ứng dụng sở hữu, lịch sử).
- **AdminSuite:** Bảo vệ hệ thống quản lý an toàn.
- **RegressionTests:** Chạy định kỳ tổng thể mọi thứ trong team.

### Phút 5 - 10: Live Demo (Kiểm Thử Thực Tế)
*(Chọn và chạy 2 kịch bản đã chuẩn bị)*

**Kịch bản 1: Luồng Mua Hàng Chuẩn (Purchase Flow / Happy Path)**
> "Bây giờ mình sẽ chạy thử quá trình một người dùng duyệt web, tìm game và thanh toán."
*(Bấm `Run` test case trên Katalon, để Chrome tự động bật lên gõ chữ và click)*
> "Như mọi người thấy ở màn hình, bot tự động: Tìm ứng dụng -> Bỏ vào giỏ hàng -> Áp mã giảm giá -> Bấm thanh toán. Giao dịch được xử lý và ghi nhận vào Database cực nhanh mà không cần bàn tay con người động vào màn hình."

**Kịch bản 2: Bắt Lỗi Góc / Cố Tình Phá Hệ Thống (Edge Case)**
*(Mở file `PreventDuplicateOrderTest.groovy` bạn đang xem)*
> "Automation Test không chỉ test thứ thành công, nó còn phải bắt các thao tác sai. Ví dụ: Một user **đã mua** app A. Giờ họ cố tình tìm app A trên Store và bấm nút Mua lần nữa."
*(Chạy Script)* 
> "Script này sẽ giả lập việc đó. Nó sẽ tìm và _Verify_ (Xác minh) rằng Web đã vô hiệu hóa nút 'Thêm vào giỏ', hoặc báo lỗi thông minh chặn hành vi mua trùng. Kết quả Step này trả về Pass xanh, nghĩa là tính năng chặn mua lặp đã hoạt động đúng thiết kế."

### Phút 10 - 12: Báo Cáo, Tích Hợp & Kết Luận
*(Mở file Report HTML của Katalon hoặc màn hình Log Result)*

> "Mỗi khi chạy xong cả ngàn Test Steps, Katalon sẽ trả về một báo cáo rõ rệt. Bao nhiêu Pass, bao nhiêu Fail. Đặc biệt nếu Fail, công cụ tự động **chụp màn hình** ngay giây phút trang web bị lỗi."
>
> "Hiệu quả rõ rệt nhất là tiết kiệm nhân lực cho việc kiểm thử các luồng cũ. Giúp team tự tin code và Deploy nhanh hơn."

## 4. Q&A (Hỏi Đáp)
- Chuẩn bị sẵn tâm lý giải thích tại sao chọn Katalon (Dễ viết script dựa trên Record & Playback, tích hợp CI/CD tự động chạy hàng ngày, báo cáo đẹp,...).
- Có thể được hỏi về "Test dữ liệu từ đâu?" -> Giải thích sử dụng Data-Driven Testing (CSV/Excel) hoặc Global Variables.
