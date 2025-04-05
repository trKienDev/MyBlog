export function waitForUploadOrSubmit(thumbnailImgId, thumbnailUploadId, submitBtnId) {
      return new Promise((resolve) => {
            const thumbnailImage = document.getElementById(thumbnailImgId);
            const thumbnailUpload = document.getElementById(thumbnailUploadId);
            const submitBtn = document.getElementById(submitBtnId);

            const onUpload = () => {
                  if(thumbnailUpload.files.length > 0) {
                        const file = thumbnailUpload.files[0];
                        cleanup();
                        resolve({ type: 'upload', file });
                  }
            };

            const onSubmit = () => {
                  cleanup();
                  resolve({ type: 'submit' });
            }

            function cleanup() {
                  thumbnailUpload.removeEventListener('change', onUpload);
                  submitBtn.removeEventListener('click', onSubmit);
            }

            thumbnailImage.addEventListener('click', () => {
                  thumbnailUpload.click();
            });

            thumbnailUpload.addEventListener('change', onUpload);
            submitBtn.addEventListener('click', onSubmit);
      });
}



