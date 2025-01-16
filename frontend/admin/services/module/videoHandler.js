import { confirmSweetAlert, showToastNotification } from "./sweetAlert.js";
import { readTagName } from "./tagHandler.js";

export function handleVideoUpload(divClickId, fileInputId, videoDataList, list_videoAddedInHandleEditFunction) {
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
                        
                        // Lưu video và tag vào videoDataList
                        const videoIndex = videoDataList.length; // Lưu chỉ số vào video
                        videoDataList.push({ file, tag: selectedTag});

                        // Push video vào mảng list_videoAddedInHandleEditFunction
                        if(list_videoAddedInHandleEditFunction) {
                                list_videoAddedInHandleEditFunction.push({ file, tag: selectedTag });
                        }
                        displayVideo(videoUrl, videoIndex, videoListDiv, selectedTag, videoDataList, (indexToRemove) => {
                                console.log("displayVideo: ", videoDataList);
                                removeVideo(indexToRemove, videoDataList);
                                if(list_videoAddedInHandleEditFunction) {
                                        list_videoAddedInHandleEditFunction.splice(indexToRemove, 1);
                                }
                        });
                }
        });
}

export async function displayVideo(videoUrl, index, videoListDiv, videoTagId, videoDataList, removeCallback) {
        const videoBox = document.createElement('div');
        videoBox.className = 'video-box';
        videoBox.dataset.index = index;

        const videoElement = document.createElement('video');
        videoElement.className = 'video-item';
        videoElement.src = videoUrl;
        videoElement.controls = false;
        videoElement.muted = true;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-video_btn';
        deleteButton.style.marginTop = '10px';

        const tagName = await readTagName(videoTagId);
        const tagVideo = document.createElement('div');
        console.log("tagName: ", tagName);
        tagVideo.textContent = tagName;
        tagVideo.className = 'tag-video';

        deleteButton.addEventListener('click', function() {
                confirmSweetAlert('Delete this video ?', () => {
                        removeCallback(index);
                        videoBox.remove();
                        updateVideoIndexes(videoListDiv);
                        showToastNotification("success", "video deleted !");
                });
        });

        videoBox.appendChild(videoElement);
        videoBox.appendChild(deleteButton);
        videoBox.appendChild(tagVideo);
        videoListDiv.appendChild(videoBox);

        videoElement.addEventListener('loadeddata', function() {
                const frameRate = 30;
                const frameNumber = 10;
                videoElement.currentTime = frameNumber / frameRate;

                videoElement.addEventListener('seeked', function() {
                        videoElement.pause();
                        videoElement.style.width = '100%';
                        videoElement.style.height = '255px';
                        videoElement.style.objectFit = 'cover';
                        videoElement.style.borderRadius = '8px';
                });
        });
}

// Hàm hiển thị video
function updateVideoIndexes(videoListDiv) {
        const remainingVideoBoxes = videoListDiv.querySelectorAll('.video-box');
        remainingVideoBoxes.forEach((box, newIndex) => {
                box.dataset.index = newIndex;
        });
}

export function removeVideo(index, videoDataList) {
        console.log("removeVideo: ", videoDataList);
        console.log("index in removeVideo: ", index);
        if(index >= 0 && index < videoDataList.length) {
                videoDataList.splice(index, 1);
                console.log(`Video [${index} is deleted]`);
        } else {
                console.error(`Index ${index} is not valid!`);
        }
}