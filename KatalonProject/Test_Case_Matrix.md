# THỐNG KÊ KỊCH BẢN KIỂM THỬ (TEST CASES) TOÀN DIỆN - APP DISTRIBUTION

Tài liệu này tổng hợp **toàn bộ các kịch bản kiểm thử**, bao gồm 2 nhóm chính:
1. **[AUTO] Cấp độ Tự Động Hóa (Katalon Studio):** Các test case cốt lõi đã có Script chạy hàng ngày để chống hồi quy.
2. **[MANUAL] Cấp độ Kiểm Thử Thủ Công:** Rất nhiều kịch bản bắt lỗi chuyên sâu (Edge cases), UI/UX, Hiệu năng, Bảo mật mà tool tự động khó quét ra hoặc chưa được viết.

*(Lưu ý: Bảng tuân thủ cấu trúc của file Excel QA)*

---

### MODULE 1: TÀI KHOẢN & XÁC THỰC (AUTHENTICATION)

| STT | Loại | Test Case ID | Tên Test Case | Điều Kiện Tiên Quyết | Kết Quả Mong Đợi |
|:---:|:---|:---|:---|:---|:---|
| 1 | `[AUTO]` | AUTH-01 | Đăng nhập thành công với tài khoản hợp lệ | Email & Pass đúng | Đăng nhập thành công, chuyển hướng trang chủ. |
| 2 | `[AUTO]` | AUTH-02 | Đăng nhập thất bại (Sai pass hoặc email) | Email đúng/sai, Pass đúng/sai | Thông báo lỗi không chính xác. |
| 3 | `[AUTO]` | AUTH-03 | Đăng ký thành công tài khoản mới | Email chưa tồn tại | Đăng ký thành công, thông báo gửi mail (nếu có). |
| 4 | `[AUTO]` | AUTH-04 | Bắt lỗi Đăng ký với Email đã tồn tại | Email đã có trong DB | Báo lỗi Email đã được sử dụng. |
| 5 | `[AUTO]` | AUTH-05 | Đăng xuất khỏi hệ thống an toàn | Đang Login | Session bị clear, quay về Guest. |
| 6 | **`[MANUAL]`** | MA-AUTH-01 | Đăng nhập đồng thời trên nhiều thiết bị | 1 TK đăng nhập ở 2 Chrome khác nhau | Xử lý theo Rule (Chặn cái thứ 2 hoặc cho song song). |
| 7 | **`[MANUAL]`** | MA-AUTH-02 | Gửi Submit liên tục ở nút Đăng ký (Spam Click) | Form đăng ký rỗng hoặc đầy | Nút Submit bị disable (Loading) chống spam gọi API nhiều lần. |
| 8 | **`[MANUAL]`** | MA-AUTH-03 | Quên mật khẩu: Nhập Email rác/Invalid Format | Ở trang Forgot Password | Chặn ngay tại Frontend, báo Invalid Email Format. |
| 9 | **`[MANUAL]`** | MA-AUTH-04 | Hết hạn phiên đăng nhập (Session Timeout) | User Login thành công, để treo máy > 24h | F5 trang web, bị văng ra trang Login, bắt yêu cầu đăng nhập lại do Cookie hết hạn. |
| 10 | **`[MANUAL]`** | MA-AUTH-05 | Kiểm thử SQL Injection cơ bản ở Form | Ô Username nhập: `' OR 1=1 --` | Login thất bại, chối bỏ ký tự đặc biệt, không sập Server. |

---

### MODULE 2: KHÁM PHÁ & TÌM KIẾM SẢN PHẨM (PRODUCT DISCOVERY)

| STT | Loại | Test Case ID | Tên Test Case | Điều Kiện Tiên Quyết | Kết Quả Mong Đợi |
|:---:|:---|:---|:---|:---|:---|
| 11 | `[AUTO]` | PROD-01 | Phân trang: Duyệt sản phẩm Store theo danh mục | Web có danh mục Action/RPG | Các App ở đúng danh mục tương ứng hiển thị. |
| 12 | `[AUTO]` | PROD-02 | Tìm kiếm trả về kết quả chính xác | Gõ key "Aurora" | Grid hiển thị Product chứa chữ Aurora. |
| 13 | `[AUTO]` | PROD-03 | Tìm kiếm trả về rỗng (Empty State) | Gõ "xyz123" | Báo "No apps found" trên màn hình. |
| 14 | `[AUTO]` | PROD-04 | Xem chi tiết sản phẩm | Nhấp App bất kỳ | Mở trang Detail, hiện đủ Tên, Giá, Ảnh, Mô tả. |
| 15 | **`[MANUAL]`** | MA-PROD-01 | Tìm kiếm với ký tự Non-ASCII/Unicode/Emoji | Gõ "🌟" hoặc Tiếng Việt có dấu | Hệ thống không chết, hiển thị No results hoặc kết quả đúng. |
| 16 | **`[MANUAL]`** | MA-PROD-02 | Tốc độ tải ảnh lazy load (Chống lag màn hình) | Ở trang Store kéo chuột nhanh xuống dưới | Các ảnh app ở dưới load dần (Placeholder) thay vì giật lag web. |
| 17 | **`[MANUAL]`** | MA-PROD-03 | Bóp băng thông giả lập 3G (Network Throttling) | Mở DevTool Chrome chỉnh 3G | Các thành phần Text load lên trước hiện UI đầy đủ rồi Ảnh vào theo dường truyền. |
| 18 | **`[MANUAL]`** | MA-PROD-04 | Thử nghiệm hiển thị với App tên quá DÀI (UI Break) | Tiêu đề tên dài > 100 char | Thẻ bài (Card) tự cắt chữ thành dấu ba chấm `...`, không bị tràn box / bể component UI. |
| 19 | **`[MANUAL]`** | MA-PROD-05 | Lọc sản phẩm (Price: Low to High) | Bấm Sort Giá Thấp->Cao | Danh sách Grid xếp lại đúng giá theo logic API. |

---

### MODULE 3: GIỎ HÀNG & MUA SẮM (CART & PURCHASE)

| STT | Loại | Test Case ID | Tên Test Case | Điều Kiện Tiên Quyết | Kết Quả Mong Đợi |
|:---:|:---|:---|:---|:---|:---|
| 20 | `[AUTO]` | CART-01 | Thêm ứng dụng vào giỏ hàng | App chưa sở hữu | Hiện thông báo Added, số lượng giỏ tăng. |
| 21 | `[AUTO]` | CART-02 | Xóa từ giỏ hàng hoặc Cập nhật số lượng | Đang ở xem giỏ | Ứng dụng biến mất khỏi danh sách. |
| 22 | `[AUTO]` | PUR-01 | Checkout thành công luồng bình thường | Điền đủ P.T Thanh toán | Hiện Success, Game bay vào Thư Viện tải. |
| 23 | `[AUTO]` | PUR-02 | Áp dụng mã giảm giá (Coupon) | Nhập Coupon CODE10 | Tổng giá Checkout tụt 10%. |
| 24 | `[AUTO]` | PUR-03 | Chống mua trùng (Duplicate Prevent) | Đã Mua / Đã add giỏ | Nút đỏ mờ, không cho cộng thêm vào cart lặp. |
| 25 | **`[MANUAL]`** | MA-PUR-01 | Hack số lượng âm (-) qua Postman API | Gửi Request POST add số lượng `-1` | Server backend Validation bắt lỗi 400 Bad Request, chối từ lệnh âm. |
| 26 | **`[MANUAL]`** | MA-PUR-02 | Thanh toán cạnh tranh (Race Condition 2 Tab) | Mở 2 Tab Chrome có cùng giỏ hàng. Tab A checkout, Tab B checkout 1 lúc | Tab A báo Success, Tab B báo Lỗi (Sản phẩm đã thanh toán) không bị trừ tiền 2 lần. |
| 27 | **`[MANUAL]`** | MA-PUR-03 | Tắt ngang trình duyệt lúc đang tải cổng thanh toán | Nhấn Pay -> Tắt ngay Web | Đơn đặt bị rơi vào trạng thái Pending/Cancelled, tiền không nhúc nhích. |
| 28 | **`[MANUAL]`** | MA-PUR-04 | Nhập Coupon rác / Hết hạn sử dụng | Mã "HELLO" hoặc hết date | Báo Invalid hoặc Expired coupon đỏ lòm. |
| 29 | **`[MANUAL]`** | MA-PUR-05 | Thêm quá sức chứa giỏ hàng (Giới hạn List) | Add 100 app vào giỏ | Test xem UI list dọc giỏ hàng có thanh cuộn (Scrollbar) hay bị tràn ra khỏi màn hình. |

---

### MODULE 4: TÍNH NĂNG CÁ NHÂN (USER DASHBOARD)

| STT | Loại | Test Case ID | Tên Test Case | Điều Kiện Tiên Quyết | Kết Quả Mong Đợi |
|:---:|:---|:---|:---|:---|:---|
| 30 | `[AUTO]` | USR-01 | Truy cập thư viện (Library) xem app đã mua | Có 2 app trong lịch sử | Show đủ 2 thẻ, có nút Download hiện rõ ràng. |
| 31 | `[AUTO]` | USR-02 | Viết đánh giá sản phẩm thành công | Mua sản phẩm X | Form Review mở -> Push -> Lên comment ngay ở top. |
| 32 | `[AUTO]` | USR-03 | Ngăn chặn Viết đánh giá khi chưa trả tiền | Không có X | Báo lỗi hoặc không show form. |
| 33 | `[AUTO]` | USR-04 | Cập nhật Profile (Avatar, Bio) | Trong trang Profile | Thông tin mới Header cập nhật qua State/Context FE. |
| 34 | **`[MANUAL]`** | MA-USR-01 | Tải file độc (Avatar > 20MB hoặc file `.pdf`) | Avatar Upload File | FE/BE đều chặn lại, báo "Chỉ nhận dạng ảnh < 5MB". |
| 35 | **`[MANUAL]`** | MA-USR-02 | Review có chứa mã chạy Script (XSS Attack) | Comment text `<script>alert('Hack')</script>` | Sanitized text an toàn. Biểu thị nguyên chữ đó chứ ko nhảy hộp Pop-up hack trên máy user khác đoc. |
| 36 | **`[MANUAL]`** | MA-USR-03 | Quản lý Link Download File .exe trực tiếp | Copy link down đưa cho máy khách | Máy ẩn danh Request get link bị Server từ chối ngắt down. |
| 37 | **`[MANUAL]`** | MA-USR-04 | Lịch sử mua (Order History) giao diện hẹp | Vào điện thoại check | Các cột hóa đơn dài phải bẻ thành List Card hoặc có Scroll dọc, không bóp nhéo chữ. |

---

### MODULE 5: BẢNG ĐIỀU KHIỂN QUẢN TRỊ (ADMIN PANEL)

| STT | Loại | Test Case ID | Tên Test Case | Điều Kiện Tiên Quyết | Kết Quả Mong Đợi |
|:---:|:---|:---|:---|:---|:---|
| 38 | `[AUTO]` | ADM-01 | Tạo / Sửa một sản phẩm lên Store | Dashboard Products | Thông báo Saved, Store User nhìn thấy lập tức. |
| 39 | `[AUTO]` | ADM-02 | Bổ sung File Version (exe) cho sản phẩm | Có App A | File upload bay vào Cloud/Storage, gắn Ver Link. |
| 40 | `[AUTO]` | ADM-03 | Đình chỉ/Khóa tài khoản User (Ban/Suspend) | Dashboard Users | Nạn nhân tạch Auth ngay khi F5, trạng thái Block. |
| 41 | `[AUTO]` | ADM-04 | Xử lý lệnh Hoàn Tiền (Refund) | Có đơn Refund đợi | Đổi Status -> Approve -> Mất quyền thư viện User X. |
| 42 | **`[MANUAL]`** | MA-ADM-01 | Rủi ro xoá App đang có người dùng chơi | Xóa Product ID=1 đang có 100 User sở hữu | Phải có cơ chế khóa mềm (Soft Delete/Hide). Xóa hẳn có thể làm sập App DB vì bị chéo Foreign Key. |
| 43 | **`[MANUAL]`** | MA-ADM-02 | Phân quyền truy cập 403 API trực tiếp | Postman chạy API Delete User bằng token thường | Trả 403 Forbidden cứng từ Guard Backend. |
| 44 | **`[MANUAL]`** | MA-ADM-03 | Upload nhầm file dung lượng vô cức (>10GB) | Admin Add Version file 20GB ISO | Server có chặn được limit body parser, hay bị sập RAM Nginx? (Giới hạn Payload size BE). |
| 45 | **`[MANUAL]`** | MA-ADM-04 | Tính năng lọc & Search của Admin Table lớn | Bảng User có 1,000 người | Thao tác nhập tên tìm kiếm nhảy mượt (Debounce 500ms), không gọi 100 API đi rác. |

---
**Tổng hợp kết luận QC:**
- Bộ này được thiết kế để kết hợp giữa Sức mạnh của **Automation (Test nhanh các luồng Regression Happy Path)** và Sự tinh tế của con người qua **Manual Testing (Để càn quét các lỗ hổng UI, UX và API mà BOT khó quét)**. 
- Chỉ khi pass cả 2 bảng này dự án mới coi như đạt chuẩn ISO ra mắt.
