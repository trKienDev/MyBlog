import { fetchAPI } from "../../../services/apiService.js";
import config from "../config.js";

export async function readTagName(tagId) {
        try {
                const response = await fetchAPI(`${config.endpoints.tagReadName}/${tagId}`);

                const tag = await response.json();
                return tag ? tag.name : 'Unknown tag';
        } catch(error) {
                console.error('Error fetching tag name: ', error.message);
                return 'Unknown tag';
        }
}

export function selectTag(selectTagId, tagListId) { // hàm selectTag vừa có nhiệm vụ hiển thị tag đã chọn ra "TagList" mà còn lấy danh sách tag đã chọn để thêm vào field tag của filmData
        const tagSelect = document.getElementById(selectTagId);
        const tagsList = document.getElementById(tagListId);
        const selectedTagIds = []; // Mảng lưu trữ ID của các tag được chọn
    
        tagSelect.addEventListener('change', () => {
                const selectedOption = tagSelect.options[tagSelect.selectedIndex];
                const selectedTagName = selectedOption.textContent; // Tên tag
                const selectedTagId = selectedOption.value; // ID của tag (value của option)
        
                // Kiểm tra nếu tag đã được thêm rồi thì không thêm lại
                if (Array.from(tagsList.children).some(tag => tag.dataset.tagId === selectedTagId)) {
                        return;
                }
        
                // Tạo một ô tag hiển thị
                const tagItem = document.createElement('div');
                tagItem.className = 'tag-item';
                tagItem.innerText = selectedTagName;
                tagItem.dataset.tagId = selectedTagId; // Lưu ID vào thuộc tính data
        
                // Xử lý sự kiện click vào tag để xoá
                tagItem.addEventListener('click', () => {
                        tagsList.removeChild(tagItem); // Xoá tag khỏi danh sách hiển thị
                        const index = selectedTagIds.indexOf(selectedTagId); // Xoá ID khỏi mảng
                        if (index > -1) {
                                selectedTagIds.splice(index, 1);
                        }
                });
        
                selectedTagIds.push(selectedTagId);  // Thêm ID vào mảng
        
                tagsList.appendChild(tagItem); // Thêm tag vào container
        
                tagSelect.selectedIndex = 0; // Reset select về trạng thái mặc định
        });
    
        // Hàm trả về danh sách ID để dùng khi submit
        return selectedTagIds;
}