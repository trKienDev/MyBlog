import { api_admin, api_user } from "../../api/endpoint.api.js";
import fetch_api from "../../api/fetch.api.js";
import selectSearch_component from "../../components/select-search.component.js";
import css_selectors from "../../selectors/css.selectors.js";
import id_selectors from "../../selectors/element-id.selector.js";
import file_utils from "../../utils/file.utils.js";
import sort_utils from "../../utils/sort.utils.js";
import string_utils from "../../utils/string.utils.js";
import tags_utils from "../../utils/tags.utils.js";
import { showToast } from "../../utils/toast-notification.js";
import video_utils from "../../utils/video.utils.js";

let activeShortUrls = [];
let uploadedShorts = [];

export function AdminShortController() {
      selectSearch_component.initSelectSearch('short-idol', api_user.getAllIdols, 'name');
      selectSearch_component.initSelectSearch('short-tag', api_user.getTagsByImages, 'name');
      tags_utils.displaySelectedTag(id_selectors.container.selected_tag, css_selectors.tags.selected_tag, 'short-tag');
      AwaitUploadShort();

      const form_btn = document.getElementById('short-form_submit');
      form_btn.addEventListener('click', async(event) => {
            createShort(event);
      });
}

function AwaitUploadShort() {
      const uploadedShortsDiv = document.getElementById('uploaded-shorts');
      const uploadShortsBtn = document.getElementById('upload-shorts-btn');
      const uploadShortsInput = document.getElementById('shorts-input');
      
      uploadShortsBtn.addEventListener('click', () => {
            uploadShortsInput.click();
      });
      uploadShortsInput.addEventListener('change', (event) => {
            const files = event.target.files;
            if(files && files.length > 0) {
                  // --- BƯỚC 1: Dọn dẹp các URL và video cũ ---
                  // Giải phóng tất cả các URL đã tạo ở lần tải lên trước
                  activeShortUrls.forEach(url => URL.revokeObjectURL(url));
                  // Xóa hết các URL đã lưu
                  activeShortUrls = [];
                  // Xóa tất cả các video đã hiển thị trên giao diện
                  uploadedShortsDiv.innerHTML = ''; 

                  // --- BƯỚC 2: Xử lý các file mới ---
                  const initialArray = Array.from(files);
                  const sortedArray = sort_utils.sortArrayByName(initialArray);
                  sortedArray.forEach(file => {
                        const shortFrame = createShortFrame(file);
                        shortFrame.classList.add('short-frame');
                        uploadedShortsDiv.appendChild(shortFrame);
                  });
                  uploadedShorts = sortedArray;
            }
      });
}
function createShortFrame(file) {
      const videoDom = document.createElement('video');
      const sourceDom = document.createElement('source');
      const shortUrl = URL.createObjectURL(file);
      // --- BƯỚC 3: Lưu trữ URL để dọn dẹp sau này ---
      activeShortUrls.push(shortUrl);
      sourceDom.src = shortUrl;
      sourceDom.type = file.type;
      videoDom.appendChild(sourceDom);
      video_utils.hoverMouseToPlayVideo(videoDom);
      return videoDom;
}

async function createShort(event) {
      event.preventDefault();
      const idol_id = selectSearch_component.getSelectedOptionValue('short-idol', 'id');
      const idol_name = selectSearch_component.getSelectedOptionValue('short-idol', 'text');
      const idolIdentifierName = string_utils.RemoveAccents(idol_name);
      const tag_ids = tags_utils.getSelectedTags(id_selectors.container.selected_tag, css_selectors.tags.selected_tag);

      if(activeShortUrls.length === 0) {
            showToast('Please upload short before submitting', 'warning');
            return;
      }
      
      let count = 0;
      uploadedShorts.forEach(async (file) => {
            count = count + 1;
            const renamedFile = file_utils.renameUploadedFile(file, idolIdentifierName + `_short[${count}]`);
            const form_data = new FormData();
            form_data.append("idol_id", idol_id);
            form_data.append("tag_ids", tag_ids);
            form_data.append("file", renamedFile);
            console.log('form data: ', form_data);

            try {
                  const result = await fetch_api.createForm(api_admin.createShort, form_data);
                  if(result.success === false) {
                        throw new Error(result.error);
                  }

                  showToast('Short created', 'success');
                  ResetShortPreview();
            } catch(error) {
                  console.error('Error creating short: ', error.message);
                  showToast(error.message, 'error');
            }
      });

}
function ResetShortPreview() {
      const uploadedShortsDom = document.getElementById('uploaded-shorts');
      uploadedShortsDom.innerHTML = '';
}