## Phân tích & Vấn đề
1. Lặp lại mã (Don't Repeat Yourself - DRY): Hầu hết các hàm đều có chung cấu trúc: try...catch, gọi fetch, kiểm tra response.ok, phân tích json và trả về một đối tượng { success, data/error }. Khi cần thay đổi logic xử lý lỗi (ví dụ: thay đổi cách showToast hoạt động), bạn sẽ phải sửa ở 6 nơi khác nhau.

2. Lỗi tiềm ẩn: Việc sao chép và dán mã có thể dẫn đến lỗi. Ví dụ:

    Trong hàm createJson, bạn đã viết header: { ... } nhưng thuộc tính đúng phải là headers: { ... } (số nhiều). Đây là một lỗi có thể khiến request gửi đi không đúng định dạng JSON.

    Trong hàm updateJson, bạn dùng app_configs.SERVER trong khi các hàm khác dùng api_configs.server. Sự không nhất quán này có thể gây lỗi kết nối.

3. Khó mở rộng: Nếu bạn muốn thêm một phương thức mới (ví dụ PATCH) hoặc một kiểu Content-Type khác, bạn sẽ lại phải sao chép và tạo một hàm gần như tương tự.

