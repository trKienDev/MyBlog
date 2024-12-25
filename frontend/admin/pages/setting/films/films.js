import config2 from "../../../services/config.js";
import { loadContent } from '../../../services/loadElement/loadDynamicPages.js';
import { loadStudios } from '../../../services/loadElement/loadStudios.js';
import { loadCodeAV } from '../../../services/loadElement/loadCodeAV.js';
import { loadActress } from '../../../services/loadElement/loadActress.js';
import { loadTag } from '../../../services/loadElement/loadTag.js';
import  { loadVideoTag } from '../../../services/loadElement/loadVideoTag.js';
import { setupModalHandlers } from "../../../services/HelperFunction/modal.js";
import { loadStory } from "../../../services/loadElement/loadStory.js";

let videoDataList = [];

export function loadFilm() {
        try {
                fetch(`${config2.domain}${config2.endpoints.filmList}`)
                .then(response => {
                        if(!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                }) 
                .then(filmList => {
                        const tbody = document.querySelector("#films-table tbody");
                        tbody.innerHTML = '';

                        filmList.forEach(item => {
                                const tr = document.createElement('tr');
                                tr.setAttribute('data-id', item._id);

                                // Edit button cell
                                const editCell = document.createElement('td');
                                const editContainer = document.createElement('div');
                                editContainer.classList.add('edit-container');
                                editContainer.style.width = '100%';
                                editContainer.style.display = 'flex';
                                editContainer.style.justifyContent = 'center';
                                const editButton = document.createElement('div');
                                editButton.classList.add('btn-edit');
                                editButton.innerHTML = `<i class="fa-solid fa-eye" style="color: aliceblue;"></i>`;
                                editButton.onclick = () => handleEdit(item);
                                editCell.appendChild(editButton);
                                editContainer.appendChild(editButton);
                                editCell.appendChild(editContainer);
                                tr.appendChild(editCell);

                                // Code cell
                                const codeCell = document.createElement('td');
                                codeCell.textContent = item.code;
                                tr.appendChild(codeCell);

                                // Thumbnail cell
                                const thumbnailCell = document.createElement('td');
                                const thumbnail = document.createElement('img');
                                thumbnail.src = `${config2.domain}/uploads/`
                        })
                })
        } catch(error) {
                console.log(error.message);
        }
        createFilm(".btn-create")
        
}

function createFilm(btnCreateElement) {
        const btnCreate = document.querySelector(btnCreateElement); 
        if (btnCreate) {
                btnCreate.addEventListener("click", function () {
                        const url = "/admin/pages/setting/films/createFilm.html"; 
                        loadContent(url, "dynamic-data", () => {
                                loadStudios("film-studio");
                                loadCodeAV("film-codeAV");
                                loadActress("film-actress");
                                loadTag("film-tag");
                                loadStory("film-story")
                                loadVideoTag("video-tag")
                                const selectedTagIds = selectTag("film-tag", "tags-selected");
                                handleVideoUpload("video-upload", "video-uploaded");
                                smoothScrolling("video-list");
                                handleThumbnail("thumbnail-upload", "video-thumbnail");
                                setupModalHandlers("openModalButton", "closeModalButton", "storyModal");

                                document.getElementById('create-film').addEventListener('submit', async function(event) {
                                        event.preventDefault(); 
                                        
                                        // studio
                                        const studio = document.getElementById('film-codeAV').value;
                                        
                                        // film-code
                                        const codeElement = document.getElementById('film-codeAV');
                                        const codeName = codeElement.options[codeElement.selectedIndex].textContent;
                                        const codeNumber = document.getElementById('code-number').value;
                                        const name = codeName + "-" + codeNumber;

                                        // actress name
                                        const actress = document.getElementById('film-actress').value;
                                        
                                        // Lấy file từ input video-thumbnail
                                        const thumbnailInput = document.getElementById('video-thumbnail');
                                        const thumbnailFile = thumbnailInput.files[0]; // Lấy file từ input
                                        if (!thumbnailFile) {
                                                alert("Please upload a thumbnail before submitting!");
                                                return; // Nếu không có file thì dừng
                                        }
                                        
                                        // video tag
                                        const tagElement = document.getElementById('video-tag');
                                        const tagName = tagElement.options[tagElement.selectedIndex].textContent;
                                        const videoName = name + "_" + tagName;

                                        // release date
                                        const releaseDate = document.getElementById('release_date').value; // release date

                                        // story
                                        const story = document.getElementById('film-story').value;

                                        // --* videoForm *---
                                        const videoForm = new FormData();
                                        videoForm.append("name", name);
                                        videoForm.append("actress", actress);
                                        videoForm.append("codeAV", codeElement.value);
                                        videoForm.append("videoname", videoName);
                                        // Thêm video và tag vào FormData
                                        videoDataList.forEach((item, index) => {
                                                videoForm.append(`video_${index}`, item.file); // Video file
                                                videoForm.append(`video_tag_${index}`, item.tag); // Tag tương ứng
                                        });
                                        console.log("videoForm: ", videoForm);
                                        // Gửi formData qua fetch hoặc XHR
                                        const videoResponse = await fetch(`${config2.domain}${config2.endpoints.videoCreate}`, {
                                                method: 'POST',
                                                body: videoForm
                                        });
                                        const videoData = await videoResponse.json();
                                        if (!videoResponse.ok) {
                                                throw new Error(videoData.message || "Failed to create videos.");
                                        }
                                        const videoIds = videoData.map((video) => video._id);
                                        // --* actressForm *--
                                        const filmForm = new FormData(); // Sử dụng FormData để bao gồm file
                                        filmForm.append("name", name);
                                        filmForm.append("studio", studio);
                                        filmForm.append("code", name);
                                        filmForm.append("actress", actress);
                                        filmForm.append("story", story);
                                        filmForm.append("tag", selectedTagIds); // Convert mảng tag IDs thành JSON string
                                        filmForm.append("releaseDate", releaseDate);
                                        filmForm.append("file", thumbnailFile);
                                        filmForm.append('videos', videoIds.join(','));
                                        console.log("film data: ", filmForm);

                                        try {
                                                const filmResponse = await fetch(`${config2.domain}${config2.endpoints.filmCreate}`, {
                                                        method: 'POST',
                                                        body: filmForm
                                                });
                                                console.log(filmResponse);
                                                if(filmResponse.status === 409) {
                                                        const result = await filmResponse.json();
                                                        Swal.fire({
                                                                title: 'Error!',
                                                                text: 'This film already exists!',
                                                                icon: 'error',
                                                                confirmButtonText: 'OK',
                                                        });
                                                        return;
                                                }

                                                if(filmResponse.status !== 201) {
                                                        console.error('Failed to create actress. HTTP Status:', filmResponse.status);
                                                        console.error('Error: ', filmResponse);
                                                        Swal.fire({
                                                                title: 'Error!',
                                                                text: 'An error occurred while creating actress. Please try again.',
                                                                icon: 'error',
                                                                confirmButtonText: 'OK',
                                                        });
                                                        throw new Error(`HTTP error! Status: ${response.status}`);
                                                }

                                                const createdFilm = await filmResponse.json();
                                                if(createdFilm._id) {
                                                        Swal.fire({
                                                                title: 'Success!',
                                                                text: 'Actress created successfully!',
                                                                icon: 'success',
                                                                confirmButtonTest: 'OK'
                                                        });
                                                } else {
                                                        Swal.fire({
                                                                title: 'Error!',
                                                                text: 'Failed to create actress. Please try again.',
                                                                icon: 'error',
                                                                confirmButtonText: 'OK'
                                                        });                            
                                                        throw new Error('Failed to create actress. Invalid response from server.');
                                                }
                                        } catch(error) {
                                                console.error('Error creating actress in frontend: ', error.message );
                                                Swal.fire({
                                                        title: 'Error!',
                                                        text: 'An error occurred while creating actress. Please try again.',
                                                        icon: 'error',
                                                        confirmButtonText: 'OK'
                                                });      
                                        } finally {
                                                const formElement = document.getElementById('create-film');
                                                if (formElement) {
                                                        formElement.reset(); // Reset the HTML form fields
                                                }

                                                const thumbnailElements = document.getElementsByClassName("thumbnail-item");
                                                while (thumbnailElements.length > 0) {
                                                        thumbnailElements[0].remove();
                                                }
                                                
                                                const tagsSelectedDiv = document.getElementById("tags-selected");
                                                if(tagsSelectedDiv) {
                                                        while (tagsSelectedDiv.firstChild) {
                                                                tagsSelectedDiv.removeChild(tagsSelectedDiv.firstChild);
                                                        }
                                                }

                                                const videoListDiv = document.getElementById("video-list");
                                                if(videoListDiv) {
                                                        while(videoListDiv) {
                                                                videoListDiv.removeChild(videoListDiv.firstChild);
                                                        }
                                                }
                                        }
                                });
                        });
                });
        }
}

function selectTag(selectTagId, tagListId) { // hàm selectTag vừa có nhiệm vụ hiển thị tag đã chọn ra "TagList" mà còn lấy danh sách tag đã chọn để thêm vào field tag của filmData
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

function handleThumbnail(thumbnailUploadId, videoThumbnailId) {
        const thumbnailElement = document.getElementById(thumbnailUploadId);
        const fileInput = document.getElementById(videoThumbnailId);

        thumbnailElement.addEventListener("click", function() {
                fileInput.click(); // Kích hoạt input file
        });

        fileInput.addEventListener("change", function(event) {
                const file = event.target.files[0];
                if (file) {
                        const reader = new FileReader();
                        reader.onload = function(e) {
                                const imageElement = document.createElement('img');
                                imageElement.className = 'thumbnail-item';
                                imageElement.src = e.target.result; 
                                thumbnailElement.appendChild(imageElement);
                        };
                        reader.readAsDataURL(file);
                }
        });
}
