# **Environment**
**1. gulp**
Sử dụng một công cụ tự động hóa tác vụ, và lệnh này có thể khởi động các tác vụ như biên dịch, gộp file, hoặc khởi chạy máy chủ phát triển tùy theo cách mà các nhiệm vụ trong tệp gulpfile.js được định nghĩa.
**2. Webpack-dev-server**
một máy chủ phát triển đi kèm với Webpack, giúp tự động tải lại trang khi bạn thay đổi mã nguồn.
**3. Dependencies**
- "commitlint/cli" : Một công cụ dòng lệnh dùng để kiểm tra tin nhắn commit, đảm bảo chúng tuân thủ theo một chuẩn nhất định.
- "commitlint/config-angular" : Định nghĩa kiểu cho Node.js trong TypeScript, giúp TypeScript hiểu môi trường Node.js.
- "types/pixi.js" : Định nghĩa kiểu cho thư viện Pixi.js (một engine render 2D), có thể dùng cho việc xử lý đồ họa.
- "browserify" : Công cụ dùng để đóng gói các tệp JavaScript để sử dụng trong trình duyệt, xử lý các lệnh require kiểu Node.js.
- "commitlint" : Một gói khác liên quan đến Commitlint, giúp đảm bảo các commit tuân thủ định dạng quy định
- "gulp" : Một công cụ tự động hóa tác vụ, dùng để tự động hóa các công việc phát triển như nén tệp, kiểm thử, v.v.
- "gulp-autoprefixer" : Plugin Gulp để tự động thêm các tiền tố vendor vào CSS, giúp tương thích với nhiều trình duyệt.
- "gulp-concat " : Plugin Gulp dùng để nối các tệp lại với nhau, như gộp nhiều tệp CSS hoặc JavaScript thành một
- "gulp-connect" : Plugin Gulp để khởi động một máy chủ web cục bộ với khả năng tự động tải lại khi có thay đổi.
- "gulp-minify-css" : Plugin Gulp để nén các tệp CSS, giảm kích thước cho sản phẩm cuối cùng.
- "gulp-rename" : Plugin Gulp để đổi tên tệp, hữu ích khi cần tạo phiên bản hoặc tổ chức các tệp sau khi build.
- "gulp-sourcemaps" : Tạo source maps, giúp việc gỡ lỗi dễ dàng hơn bằng cách liên kết mã nén với mã nguồn gốc.
- "gulp-useref" : Plugin Gulp để phân tích các khối build trong tệp HTML và tự động nối các tệp được tham chiếu.
- "husky" : Công cụ để thiết lập Git hooks, cho phép thực thi các tác vụ như kiểm tra mã hoặc chạy kiểm thử trước khi commit.
- "prettier" : Công cụ định dạng mã, dùng để duy trì phong cách mã thống nhất trong toàn bộ dự án.
- "tsify" : Plugin cho Browserify, dùng để biên dịch mã TypeScript trong quá trình đóng gói.
- "typescript" : Bộ biên dịch chính của TypeScript, chuyển đổi mã TypeScript sang JavaScript.
- "vinyl-buffer" : Chuyển đổi các tệp stream thành buffer (tệp đệm), thường dùng trong Gulp để quản lý các stream tệp.
- "vinyl-source-stream" : Chuyển đổi các stream văn bản thành vinyl stream (định dạng mà Gulp có thể hiểu), để sử dụng trong quy trình Gulp.

# **File**
- "gulpfile.js": cấu hình Gulp.
- "webpack.config.js" cấu hình Webpack cho bundling.