// UploadImage
export function handleImageUpload(imageElementId, fileInputElementId) {
        const imageElement = document.getElementById(imageElementId);
        const fileInput = document.getElementById(fileInputElementId);

        // Khi người dùng nhấn vào hình ảnh, kích hoạt input file
        imageElement.addEventListener("click", function() {
                fileInput.click(); // Kích hoạt input file
        });

        // Khi có thay đổi từ input file (người dùng chọn file mới)
        fileInput.addEventListener("change", function(event) {
                const file = event.target.files[0];
                if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                                imageElement.src = e.target.result; // Cập nhật hình ảnh với dữ liệu mới từ file được chọn
                        };
                        reader.readAsDataURL(file);
                }
        });
}