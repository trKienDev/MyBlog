export function waitForUploadOrSubmit(thumbnailImg_id, thumbnailUpload_id, submitBtn_id) {
      return new Promise((resolve) => {
            const thumbnail_image = document.getElementById(thumbnailImg_id);
            const thumbnail_upload = document.getElementById(thumbnailUpload_id);
            const submit_button = document.getElementById(submitBtn_id);

            const onUpload = () => {
                  if(thumbnail_upload.files.length > 0) {
                        const file = thumbnail_upload.files[0];
                        cleanup();
                        resolve({ type: 'upload', file });
                  }
            };

            const onSubmit = () => {
                  cleanup();
                  resolve({ type: 'submit' });
            }

            function cleanup() {
                  thumbnail_upload.removeEventListener('change', onUpload);
                  submit_button.removeEventListener('click', onSubmit);
            }

            thumbnail_image.addEventListener('click', () => {
                  thumbnail_upload.click();
            });

            thumbnail_upload.addEventListener('change', onUpload);
            submit_button.addEventListener('click', onSubmit);
      });
}

async function uploadThumbnail(thumbnailImg_id, thumbnailUpload_id, submitBtn_id) {
      while(true) {
            const result = await waitForUploadOrSubmit(thumbnailImg_id, thumbnailUpload_id, submitBtn_id);
            if(result.type === 'upload') {
                  document.getElementById('thumbnail-image').src = URL.createObjectURL(result.file);
            } else if(result.type === 'submit') {
                  break;
            }
      }
}

const thumbnail_component = {
      uploadThumbnail,
}
export default thumbnail_component;