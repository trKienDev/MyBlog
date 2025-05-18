export function initCreateMangaAdmin() {
      uploadMangaImages();
}

function uploadMangaImages() {
      const uploadImages_btn = document.getElementById('upload-images_btn');
      const uploadFile_input = document.getElementById('upload-images');
      uploadImages_btn.addEventListener('click', () => {
            uploadFile_input.click();
      });

      uploadFile_input.addEventListener('change', (event) => {
            const files = event.target.files;
            if(files.length > 0) {
                  console.log('files:' , files);
            }
      });
}