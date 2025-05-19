import { showToast } from "./toast-notification.js";

function sortArrayByName(iarray) {
    if (!Array.isArray(iarray)) {
        console.error("Đầu vào cho sortFilesByName phải là một mảng.");
        showToast("Đầu vào cho sortFilesByName phải là một mảng.", 'error');
        return []; 
    }

    // Sử dụng slice() để tạo một bản sao nông của mảng trước khi sắp xếp
    // Điều này tránh việc thay đổi mảng gốc nếu nó được truyền từ nơi khác
    return iarray.slice().sort((element_a, element_b) => {
        // Lấy tên tệp (đã chuyển thành chữ thường để so sánh không phân biệt hoa thường)
        const name_a = element_a.name.toLowerCase();
        const name_b = element_b.name.toLowerCase();

        if (name_a < name_b) {
            return -1; // element_a đứng trước element_b
        }
        if (name_a > name_b) {
            return 1;  // element_a đứng sau element_b
        }
        return 0; // Tên tệp giống nhau
    });
}

const sort_utils = {
      sortArrayByName,
}
export default sort_utils;