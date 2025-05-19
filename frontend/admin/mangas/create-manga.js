import sort_utils from "../../utils/sort.utils.js";

export function initCreateMangaAdmin() {
      uploadMangaImages();
}

function uploadMangaImages() {
      const createManga_section = document.getElementById('create-manga');
      const updloadImage_list = createManga_section.querySelector('.upload-images_list');
      const uploadImages_btn = document.getElementById('upload-images_btn');
      const uploadFile_input = document.getElementById('upload-images');
      uploadImages_btn.addEventListener('click', () => {
            uploadFile_input.click();
      });

      uploadFile_input.addEventListener('change', (event) => {
            const files = event.target.files;
            if(files && files.length > 0) {
                  const initial_array = Array.from(files);
                  const sorted_array = sort_utils.sortArrayByName(initial_array);

                  sorted_array.forEach(file => { 
                        const image_frame = createImageFrame(file);
                        updloadImage_list.appendChild(image_frame);
                  });
            }
      });
}

function createImageFrame(file) {
      const image_frame = document.createElement('div');
      image_frame.classList.add('image-frame');

      const manga_image = document.createElement('img');
      manga_image.classList.add('manga-image');

      manga_image.src = URL.createObjectURL(file);
      manga_image.onload = () => {
            URL.revokeObjectURL(manga_image.src); 
      }

      image_frame.appendChild(manga_image);
      return image_frame;
}