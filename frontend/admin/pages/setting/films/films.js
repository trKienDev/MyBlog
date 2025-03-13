import config2 from "../../../services/config.js";
import { loadContent } from '../../../services/loadElement/loadDynamicPages.js';
import { loadStudios } from '../../../services/loadElement/loadStudios.js';
import { loadCodeAV } from '../../../services/loadElement/loadCodeAV.js';
import { loadActress } from '../../../services/loadElement/loadActress.js';
import { loadTag } from '../../../services/loadElement/loadTag.js';
import  { loadVideoTag } from '../../../services/loadElement/loadVideoTag.js';
import { loadStory } from "../../../services/loadElement/loadStory.js";
import { errorSweetAlert, confirmSweetAlert, showToastNotification, successSweetAlert } from "../../../services/HelperFunction/sweetAlert.js";
import { initializeRatingFeature, userRating } from "../../../services/HelperFunction/starRating.js";

let videoDataList = [];

export function loadFilm() {
      try {
            fetch(`${config2.domain}${config2.endpoints.filmList}`)
            .then(response => {
                  if (!response.ok) {
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
                        editButton.onclick = () => handleEdit(item, editButton);
                        editCell.appendChild(editButton);
                        editContainer.appendChild(editButton);
                        editCell.appendChild(editContainer);
                        tr.appendChild(editCell);

                        // Code cell
                        const codeCell = document.createElement('td');
                        codeCell.textContent = item.name;
                        tr.appendChild(codeCell);

                        // Thumbnail cell
                        const thumbnailCell = document.createElement('td');
                        const thumbnail = document.createElement('img');
                        thumbnail.src = `${config2.domain}/uploads/thumbnail/${item.thumbnail}`;
                        thumbnail.classList.add('thumbnail-image');

                        // Add hover and click logic for enlarging thumbnail
                        thumbnail.addEventListener('click', (e) => {
                              // Create enlarged image
                              const largeImage = document.createElement('img');
                              largeImage.src = thumbnail.src;
                              largeImage.classList.add('enlarged-thumbnail');
                              largeImage.style.position = 'absolute';
                              largeImage.style.top = `${e.clientY}px`;
                              largeImage.style.left = `${e.clientX}px`;
                              largeImage.style.width = '300px';
                              largeImage.style.height = '500px';
                              largeImage.style.zIndex = '1000';
                              largeImage.style.border = 'none';

                              document.body.appendChild(largeImage);

                              // Remove image on mouseout
                              largeImage.addEventListener('click', () => {
                                    document.body.removeChild(largeImage);
                              });
                        });

                        thumbnailCell.appendChild(thumbnail);
                        tr.appendChild(thumbnailCell);

                        // Actress cell
                        const actressCell = document.createElement('td');
                        const actress = document.createElement('img');
                        const actressImage = item.actress_id?.image;
                        if (actressImage) {
                              actress.src = `${config2.domain}/uploads/actress/avatar/${actressImage}`;
                        } else {
                              actress.src = "/admin/static/images/face/upload-profile.jpg";
                        }
                        actress.classList.add('actress-profile');
                        actressCell.appendChild(actress);
                        tr.appendChild(actressCell);

                        // Studio Cell
                        const studioCell = document.createElement('td');
                        const studio = document.createElement('img');
                        const studioImage = item.studio_id?.image;
                        if (studioImage) {
                              studio.src = `${config2.domain}/uploads/studio/${studioImage}`;
                        } else {
                              studio.src = "/admin/static/images/studio/default_studio.png";
                        }
                        studio.classList.add('studio-logo');
                        studioCell.appendChild(studio);
                        tr.appendChild(studioCell);

                        // Story Cell
                        const storyCell = document.createElement('td');
                        const storyName = item.story_id?.name;
                        if (storyName) {
                              storyCell.textContent = storyName;
                        } else {
                              storyCell.textContent = ".......";
                        }
                        tr.appendChild(storyCell);

                        // Release date
                        const releaseDateCell = document.createElement('td');
                        const releaseDate = new Date(item.release_date);
                        releaseDateCell.textContent = releaseDate.toLocaleDateString('vi-VN');
                        tr.appendChild(releaseDateCell);

                        // Delete button cell
                        const deleteCell = document.createElement('td');
                        const deleteContainer = document.createElement('div');
                        const deleteButton = document.createElement('div');
                        deleteButton.classList.add('btn-delete');
                        deleteButton.innerHTML = `<i class="fa-solid fa-trash" style="color: aliceblue;"></i>`;
                        deleteButton.onclick = () => handleDelete(item._id);
                        deleteCell.appendChild(deleteButton);
                        tr.appendChild(deleteCell);

                        tbody.appendChild(tr);
                  });
            });
      } catch (error) {
            console.error(error.message);
      }
      createFilm(".btn-create");
      searchFilmByCode('search-input');
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
                        loadVideoTag("video-tag");
                        const selectedTagIds = selectTag("film-tag", "tags-selected");
                        handleVideoUpload("video-upload", "video-uploaded");
                        smoothScrolling("video-list");
                        handleThumbnail("thumbnail-upload", "video-thumbnail");

                        const intialRating = 0;
                        initializeRatingFeature(".film-rating", intialRating);

                        document.getElementById('create-film').addEventListener('submit', async function(event) {
                              event.preventDefault(); 
                              
                              // studio
                              const studio = document.getElementById('film-studio').value;
                              
                              // film-code
                              const codeElement = document.getElementById('film-codeAV');
                              const codeName = codeElement.options[codeElement.selectedIndex].textContent;
                              const codeNumber = document.getElementById('code-number').value;
                              const name = codeName + "-" + codeNumber;

                              // actress name
                              const actress = document.getElementById('film-actress').value;
                              
                              // Lấy file từ input video-thumbnail
                              const thumbnailInput = document.getElementById('video-thumbnail');
                              const thumbnailFile = thumbnailInput.files[0]; 
                              if (!thumbnailFile) {
                                    alert("Please upload a thumbnail before submitting!");
                                    return; 
                              }
                              
                              // video tag
                              const tagElement = document.getElementById('video-tag');
                              const tagName = tagElement.options[tagElement.selectedIndex].textContent;
                              const videoName = name + "_" + tagName;

                              // release date
                              const releaseDate = document.getElementById('release_date').value;

                              // story
                              const story = document.getElementById('film-story').value;
                              
                              // --* videoForm *---
                              const videoForm = new FormData();
                              videoForm.append("name", name);
                              videoForm.append("actress", actress);
                              videoForm.append("codeAV", codeElement.value);
                              videoForm.append("videoname", videoName);
                              // Thêm video và tag vào FormData
                              console.log("videoDataList: ", videoDataList);
                              videoDataList.forEach((item, index) => {
                                    videoForm.append(`video_${index}`, item.file); // Video file
                                    videoForm.append(`video_tag_${index}`, item.tag); // Tag tương ứng
                              });
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

                              // --* filmForm *--
                              const filmForm = new FormData(); // Sử dụng FormData để bao gồm file
                              filmForm.append("name", name);
                              filmForm.append("studio", studio);
                              filmForm.append("code", codeElement.value);
                              filmForm.append("actress", actress);
                              filmForm.append("story", story);
                              filmForm.append("tag", selectedTagIds); // Convert mảng tag IDs thành JSON string
                              filmForm.append("releaseDate", releaseDate);
                              filmForm.append("file", thumbnailFile);
                              filmForm.append('videos', videoIds.join(','));
                              filmForm.append("rating", userRating);
                              console.log("film form: ", filmForm);

                              try {
                                    const filmResponse = await fetch(`${config2.domain}${config2.endpoints.filmCreate}`, {
                                          method: 'POST',
                                          body: filmForm
                                    });

                                    if(filmResponse.status === 409) {
                                          errorSweetAlert('This film already exist !');
                                          return;
                                    }

                                    if(filmResponse.status !== 201) {
                                          console.error('Failed to create actress. HTTP Status:', filmResponse.status);
                                          console.error('Error: ', filmResponse);
                                          errorSweetAlert('An error occurred while creating actress. Please try again.');
                                          throw new Error(`HTTP error! Status: ${filmResponse.status}`);
                                    }

                                    const createdFilm = await filmResponse.json();
                                    if(createdFilm._id) {
                                                successSweetAlert('Film created successfully');
                                    } else {
                                                errorSweetAlert("Error in backend");                        
                                                throw new Error('Failed to create film. Invalid response from server.');
                                    }
                              } catch(error) {
                                    console.error('Error creating actress in frontend: ', error.message );
                                    errorSweetAlert("Error in frontend");     
                              } finally {
                                    // Làm sách danh sách videoDataList
                                    videoDataList = [];
                                    console.log("videoDataList reset: ", videoDataList);

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

async function handleEdit(item, btnEditElement) {
      let list_videoAdded = [];
      let list_videoDeleted = [];

      btnEditElement = "." + btnEditElement.className;
      const btnEdit = document.querySelector(btnEditElement);
      if(btnEdit) {
            const url = "/admin/pages/setting/films/createFilm.html";
            loadContent(url, "dynamic-data", async () => {
                  loadStudios("film-studio");
                  loadCodeAV("film-codeAV");
                  loadActress("film-actress");
                  loadTag("film-tag");
                  loadStory("film-story");
                  const selectedTagIds = selectTag("film-tag", "tags-selected");
                  loadVideoTag("video-tag");
                  handleVideoUpload("video-upload", "video-uploaded", list_videoAdded);
                  smoothScrolling("video-list");
                  handleThumbnail("thumbnail-upload", "video-thumbnail");

                  // Cập nhật giao diện cho edit film
                  const createNewFilm_title = document.getElementById("createNewFilm");
                  createNewFilm_title.textContent = "Edit film";
                  const createFilm_btn = document.getElementById("createFilm_btn");
                  createFilm_btn.textContent = "Save";
                  createFilm_btn.classList.add("edit-btn");
                  const headingColorForm = document.getElementById("create-film");
                  headingColorForm.classList.remove("box-border_top");
                  headingColorForm.classList.add("editBox-border_top");

                  // Cập nhật dữ liệu
                  await loadStudios();
                  document.getElementById("film-studio").value = item.studio_id?._id || "";
                  
                  const codeParts = item.name.split('-');
                  const codeWords = codeParts[0];
                  const codeNumbers = codeParts[1];
                  document.getElementById("film-codeAV").value = item.code_id || "";
                  document.getElementById("code-number").value = codeNumbers;
                  
                  const releaseDateInput = document.getElementById("release_date");
                  const releaseDate = new Date(item.release_date).toISOString().split("T")["0"];
                  releaseDateInput.value = releaseDate;

                  
                  document.getElementById("film-story").value = item.story_id?._id || "";

                  document.getElementById("film-actress").value = item.actress_id?._id || "";
                  
                  // Hiển thị thumbnail
                  if(item.thumbnail) {
                        const thumbnailElement = document.getElementById("thumbnail-upload");

                        const imageElement = document.createElement('img');
                        imageElement.className = 'thumbnail-item';
                        imageElement.src = `${config2.domain}/uploads/thumbnail/${item.thumbnail}`;
                        imageElement.style.width = '100%';
                        imageElement.style.height = '100%';
                        imageElement.style.objectFit = 'cover';
                        imageElement.style.borderRadius = '8px';

                        while(thumbnailElement.firstChild) {
                              thumbnailElement.removeChild(thumbnailElement.firstChild);
                        }

                        thumbnailElement.appendChild(imageElement);
                  } 

                  // Hiển thị danh sách tag
                  if(item.tag_id && item.tag_id.length > 0) {
                        const tagsListElement = document.getElementById("tags-selected");
                        const tagSelectElement = document.getElementById("film-tag");
                        const selectedTagIds = [];

                        while(tagsListElement.firstChild) {
                              tagsListElement.removeChild(tagsListElement.firstChild);
                        }

                        item.tag_id.forEach(tagId => {
                              const tagItem = document.createElement("div");
                              tagItem.className = "tag-item";
                              tagItem.dataset.tagId = tagId;

                              const tagOption = Array.from(tagSelectElement.options).find(option => option.value === tagId);
                              if(tagOption) {
                                    tagItem.textContent = tagOption.textContent;
                              } else {
                                    tagItem.textContent = "Unknown tag";
                              }

                              tagItem.addEventListener("click", () => {
                                    tagsListElement.removeChild(tagItem); // Xóa tag khỏi giao diện
                                    const index = selectedTagIds.indexOf(tagId); // Xóa ID khỏi mảng
                                    if(index > -1) {
                                                selectedTagIds.splice(index, 1);
                                    }
                              });

                              selectedTagIds.push(tagId);
                              tagsListElement.appendChild(tagItem);
                        });
                  }

                  // Hiển thị danh sách video
                  if(item.video && item.video.length > 0) {
                        const videoListDiv = document.getElementById("video-list");
                        
                        // Xoá danh sách video cũ trong video-list
                        while (videoListDiv.firstChild) {
                              videoListDiv.removeChild(videoListDiv.firstChild);
                        }

                        // Duyệt qua từng video trong item.video và hiển thị
                        item.video.forEach( async(videoId, index) => {
                              const response = await fetch(`${config2.domain}${config2.endpoints.videoGetById}/${videoId}`);
                              if(!response.ok) {
                                    console.error(`Failed to fetch video details for ID: ${videoId}`);
                                    return;
                              }

                              const videoData = await response.json();
                              const videoUrl = `${config2.domain}/uploads/videos/${videoData.video.filePath}`;
                              
                              displayVideo(videoUrl, index, videoListDiv, (indexToRemove) => {
                                    list_videoDeleted.push(videoData.video); // Lưu ID video vào danh sách xóa
                                    removeVideo(indexToRemove);
                              });
                        });
                  }

                  initializeRatingFeature(".film-rating", item.rating);

                  // User submit form
                  document.getElementById("create-film").addEventListener('submit', async function(event) {
                        event.preventDefault();
                        showLoading();
                        // studio
                        const studio = document.getElementById('film-studio').value;

                        // film-code
                        const codeElement = document.getElementById('film-codeAV');
                        const codeName = codeElement.options[codeElement.selectedIndex].textContent;
                        const codeNumber = document.getElementById('code-number').value;
                        const name = codeName + "-" + codeNumber;

                        // videoname
                        const tagElement = document.getElementById('video-tag');
                        const tagName = tagElement.options[tagElement.selectedIndex].textContent;
                        const videoName = name + "_" + tagName;

                        // actress name
                        const actress = document.getElementById('film-actress').value;

                        // thumbnail
                        const thumbnailInput = document.getElementById('video-thumbnail');
                        const thumbnailFile = thumbnailInput.files[0]; 

                        // story
                        const story = document.getElementById("film-story").value;

                        // release date
                        const releaseDate = document.getElementById('release_date').value;

                        // tag
                        const tagItems = document.querySelectorAll('#tags-selected .tag-item');
                        const dataTagIds = Array.from(tagItems).map(item => item.getAttribute('data-tag-id'));

                        // Add video
                        let list_addedVideoIds = [];
                        if(list_videoAdded.length > 0) {
                              const videoForm = new FormData();
                              videoForm.append("name", name);
                              videoForm.append("actress", actress);
                              videoForm.append("codeAV", codeElement.value);
                              videoForm.append("videoname", videoName);

                              list_videoAdded.forEach((video, index) => {
                                    videoForm.append(`video_${index}`, video.file);
                                    videoForm.append(`video_tag_${index}`, video.tag);
                              });

                              try {
                                    const videoResponse = await fetch(`${config2.domain}${config2.endpoints.videoCreate}`, {
                                          method: 'POST',
                                          body: videoForm
                                    });

                                    if(!videoResponse.ok) {
                                          const errorData = await videoResponse.json();
                                          console.error("Failed to add videos: ", errorData);
                                          throw new Error(errorData.message || "Failed to upload video");
                                    }

                                    const uploadedVideos = await videoResponse.json();
                                    list_addedVideoIds = uploadedVideos.map((video) => video._id);
                              } catch(error) {
                                    console.error("Error while uploading videos: ", error.message);
                                    return;
                              }
                        }

                        // Delete video
                        let list_videoDeletedIds = [];
                        if(list_videoDeleted.length > 0) {
                              try {
                                    const deletePromises = list_videoDeleted.map(videoId => 
                                                fetch(`${config2.domain}${config2.endpoints.videoDelete}/${videoId._id}`, {
                                                      method: 'DELETE'
                                                })
                                    );

                                    const deleteReponses = await Promise.all(deletePromises);

                                    deleteReponses.forEach(async (response, index) => {
                                          if(!response.ok) {
                                                const errorData = (await response).json();
                                                console.error(`Failed to delete video with ID ${list_videoDeleted[index]}: `, errorData);
                                                throw new Error(errorData.message || "Failed to delete video");
                                          }
                                    });

                                    list_videoDeletedIds = list_videoDeleted;
                                    console.log("Delete video successfully");
                              } catch(error) {
                                    console.error("Error while deleting video: ", error.message);
                                    return;
                              }
                        }
                        
                        // update film
                        let currentVideoIds = item.video || [];
                        for(let i = 0; i < currentVideoIds.length; i++) {
                              for(let k = 0; k < list_videoDeletedIds.length; k++) {
                                    if(currentVideoIds[i] == list_videoDeletedIds[k]._id) {
                                          currentVideoIds.splice(i, 1);
                                    }
                              }
                        }
                        
                        if(list_addedVideoIds.length > 0) {
                              for(let i = 0; i < list_addedVideoIds.length; i++) {
                                    currentVideoIds.push(list_addedVideoIds[i]);
                              }
                        }

                        const filmForm = new FormData();
                        filmForm.append("name", name);
                        filmForm.append("studio", studio);
                        filmForm.append("code", codeElement.value);
                        filmForm.append("releaseDate", releaseDate);
                        filmForm.append("actress", actress);
                        filmForm.append("story", story);
                        filmForm.append("tag", dataTagIds);
                        if(thumbnailFile) {
                              filmForm.append("file", thumbnailFile);
                        }
                        filmForm.append("videos", currentVideoIds.join(','));

                        try {
                              const response = await fetch(`${config2.domain}${config2.endpoints.filmUpdate}/${item._id}`, {
                                    method: "PUT",
                                    body: filmForm,
                              });

                              if(!response.ok) {
                                    const errorData = await response.json();
                                    throw new Error(errorData.message || "Failed to update film");
                              }
                              
                              const updatedFilm = await response.json();

                              successSweetAlert("Film updated");

                              videoDataList = [];
                        } catch(error) {
                              console.error("Error upadte fim in frontend: ", error.message);
                              errorSweetAlert('Error in frontend');
                        } finally {
                              videoDataList = [];
                              hideLoading();
                        }
                  });
            });
      }
}

async function handleDelete(filmId) {
      confirmSweetAlert('Delete this film ?', async () => {
            try {
                  const response = await fetch(`${config2.domain}${config2.endpoints.filmDelete}/${filmId}`, {
                              method: 'DELETE',
                  });

                  if(!response.ok) {
                              throw new Error(`HTTP error! Status: ${response.status}`);
                  } 
            } catch (error) {
                  console.error('Error deleting film: ', error);
                  errorSweetAlert("Error in frontend");
            } finally {
                  loadFilm();
                  showToastNotification();
            }
      });

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

function handleVideoUpload(divClickId, fileInputId, list_videoAddedInHandleEditFunction) {
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

                  displayVideo(videoUrl, videoIndex, videoListDiv, (indexToRemove) => {
                              removeVideo(indexToRemove);
                              if(list_videoAddedInHandleEditFunction) {
                                    list_videoAddedInHandleEditFunction.splice(indexToRemove, 1);
                              }
                  });
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

function removeVideo(index) {
      console.log("index in removeVideo: ", index);
      if(index >= 0 && index < videoDataList.length) {
            videoDataList.splice(index, 1);
            console.log(`Video [${index} is deleted]`);
      } else {
            console.error(`Index ${index} is not valid!`);
      }
}

// Hàm hiển thị video
function displayVideo(videoUrl, index, videoListDiv, removeCallback) {
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

      deleteButton.addEventListener('click', function() {
            confirmSweetAlert('Delete this video ?', () => {
                  removeCallback(index);
                  videoBox.remove();
                  updateVideoIndexes(videoListDiv);
                  showToastNotification();
            });
      });

      videoBox.appendChild(videoElement);
      videoBox.appendChild(deleteButton);
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

function updateVideoIndexes(videoListDiv) {
      const remainingVideoBoxes = videoListDiv.querySelectorAll('.video-box');
      remainingVideoBoxes.forEach((box, newIndex) => {
            box.dataset.index = newIndex;
      });
}

function searchFilmByCode(code) {
      const searchInput = document.getElementById(code);
      searchInput.addEventListener('keyup', function() {
            const searchValue = this.value.trim().toLowerCase();  // Không phân biệt hoa thường
            const rows = document.querySelectorAll('#films-table tbody tr');

            rows.forEach(row => {
                  const nameCell = row.querySelector('td:nth-child(2)');  // Lấy trực tiếp ô tên
                  if (nameCell) {
                              const name = nameCell.innerText.trim().toLowerCase();
                              row.style.display = name.includes(searchValue) ? '' : 'none';
                  }
            });
      });
}

function showLoading() {
      document.getElementById("loading-overlay").style.display = "flex";
}
function hideLoading() {
      document.getElementById("loading-overlay").style.display = "none";
}
