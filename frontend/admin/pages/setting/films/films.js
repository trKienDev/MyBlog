import config2 from "../../../services/config.js";
import { loadContent } from '../../../services/loadElement/loadDynamicPages.js';
import { loadStudios } from '../../../services/loadElement/loadStudios.js';
import { loadCodeAV } from '../../../services/loadElement/loadCodeAV.js';
import { loadActress } from '../../../services/loadElement/loadActress.js';
import { loadTag } from '../../../services/loadElement/loadTag.js';
import  { loadVideoTag } from '../../../services/loadElement/loadVideoTag.js';

let videoDataList = [];

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
                                handleVideoUpload("video-upload", "video-uploaded");
                                smoothScrolling("video-list");

                                document.getElementById('create-film').addEventListener('submit', function(event) {
                                        event.preventDefault(); 
                                        
                                        const videoForm = new FormData();
                                        
                                        const codeElement = document.getElementById('film-codeAV');
                                        const codeName = codeElement.options[codeElement.selectedIndex].textContent;
                                        const codeNumber = document.getElementById('code-number').value;
                                        const name = codeName + "-" + codeNumber;

                                        const actress = document.getElementById('film-codeAV').value;
                                        
                                        const tagElement = document.getElementById('video-tag');
                                        const tagName = tagElement.options[tagElement.selectedIndex].textContent;
                                        const videoName = name + "_" + tagName;

                                        videoForm.append("name", name);
                                        videoForm.append("actress", actress);
                                        videoForm.append("codeAV", codeElement.value);
                                        videoForm.append("videoname", videoName);
                                        // // Thêm video và tag vào FormData
                                        videoDataList.forEach((item, index) => {
                                                videoForm.append(`video_${index}`, item.file); // Video file
                                                videoForm.append(`video_tag_${index}`, item.tag); // Tag tương ứng
                                        });
                                        
                                        console.log("formData: ", videoForm);
                                        
                                        // Gửi formData qua fetch hoặc XHR
                                        fetch(`${config2.domain}${config2.endpoints.videoCreate}`, {
                                                method: 'POST',
                                                body: videoForm
                                        })
                                        .then(response => response.json())
                                        .then(data => {
                                                console.log('Success:', data);
                                        })
                                        .catch(error => {
                                                console.error('Error:', error.message);
                                        });
                                });
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

function handleVideoUpload(divClickId, fileInputId) {
        document.getElementById(divClickId).addEventListener('click', function() {
                // Kiểm tra xem người dùng đã chọn video tag chưa
                const videoTagSelect = document.getElementById('video-tag');
                const selectedTagIndex = videoTagSelect.selectedIndex;

                // Nếu chưa chọn (index là 0 hoặc không có tag nào được chọn), hiển thị cảnh báo
                if (selectedTagIndex <= 0) {
                        alert('Please select a tag before uploading a video.');
                        return;
                }
                document.getElementById(fileInputId).click();
        });
        document.getElementById('video-uploaded').addEventListener('change', function() {
                const videoListDiv = document.getElementById('video-list');
                const files = this.files;
                const selectedTag = document.getElementById('video-tag').value;

                for (let i = 0; i < files.length; i++) {
                        const file = files[i];
                        const videoUrl = URL.createObjectURL(file);
                        
                        // Thêm video và tag vào danh sách
                        videoDataList.push({ file, tag: selectedTag })

                        const videoBox = document.createElement('div');
                        videoBox.className = 'video-box';

                        // Tạo phần tử video để hiển thị thumbnail của video
                        const videoElement = document.createElement('video');
                        videoElement.className = 'video-item';
                        videoElement.src = videoUrl;
                        videoElement.controls = false; // Không hiển thị thanh điều khiển video
                        videoElement.muted = true; // Tắt tiếng để tránh âm thanh tự động phát
                        videoElement.addEventListener('loadeddata', function() {
                                const frameRate = 30; // Giả định tốc độ khung hình là 30fps
                                const frameNumber = 10; // Chúng ta muốn tạm dừng ở frame thứ 10
                                const timeInSeconds = frameNumber / frameRate; // Tính toán thời gian tương ứng
                                videoElement.currentTime = timeInSeconds; // Đặt thời gian phát của video
                                
                                // Khi video đã cập nhật thời gian phát, chúng ta sẽ tạm dừng
                                videoElement.addEventListener('seeked', function() {
                                        videoElement.pause();
                                        videoElement.style.width = '100%';
                                        videoElement.style.height = '255px';
                                        videoElement.style.objectFit = 'cover'; 
                                        videoElement.style.borderRadius = '8px';
                                });
                        });
                        videoBox.appendChild(videoElement);
                        videoListDiv.appendChild(videoBox);
                }
        });
}

function smoothScrolling(videoListId) {
document.getElementById(videoListId).addEventListener('wheel', function(event) {
        event.preventDefault(); // Ngăn mặc định cuộn nhanh
        const delta = event.deltaY * 0.2; // Điều chỉnh tốc độ cuộn (0.2 để giảm tốc độ)
        this.scrollBy({
                top: delta,
                behavior: 'smooth'
        });
});
}
