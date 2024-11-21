import config2 from "../../../services/config.js";
import { loadContent } from '../../../services/loadElement/loadDynamicPages.js';
import { loadStudios } from '../../../services/loadElement/loadStudios.js';
import { loadCodeAV } from '../../../services/loadElement/loadCodeAV.js';
import { loadActress } from '../../../services/loadElement/loadActress.js';
import { loadTag } from '../../../services/loadElement/loadTag.js';
import  { loadVideoTag } from '../../../services/loadElement/loadVideoTag.js';

export function loadFilm() {
        const btnCreate = document.querySelector(".btn-create"); 
        if (btnCreate) {
                btnCreate.addEventListener("click", function () {
                        const url = "/admin/pages/setting/films/createFilm.html"; 
                        loadContent(url, "dynamic-data", () => {
                                loadStudios("film-studio");
                                loadCodeAV("film-codeAV");
                                loadActress("film-actress");
                                loadTag("film-tag");
                                loadVideoTag("video-tag")
                                selectTag("film-tag", "tags-selected");
                        });
                });
        }
}

function selectTag(selectTagId, tagListId) {
        const tagSelect = document.getElementById(selectTagId);
        const tagsList = document.getElementById(tagListId);

        tagSelect.addEventListener('change', () => {
                const selectedOption = tagSelect.options[tagSelect.selectedIndex]; // Lấy option được chọn
                const selectedTagName = selectedOption.textContent; // Lấy tên tag (nội dung hiển thị)
        
                // Kiểm tra nếu tag đã được thêm rồi thì không thêm lại
                if (Array.from(tagsList.children).some(tag => tag.innerText === selectedTagName)) {
                        return;
                }

                // Tạo một ô tag
                const tagItem = document.createElement('div');
                tagItem.className = 'tag-item';
                tagItem.innerText = selectedTagName;

                // Xử lý sự kiện click vào tag để xoá
                tagItem.addEventListener('click', () => {
                        tagsList.removeChild(tagItem); // Xoá tag khỏi danh sách
                });

                // Thêm tag vào container
                tagsList.appendChild(tagItem);

                // Reset select về trạng thái mặc định
                tagSelect.selectedIndex = 0;
        });
}

