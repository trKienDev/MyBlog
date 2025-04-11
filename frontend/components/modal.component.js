
export function SetupModalHandlers(openButtonId, closeButtonId, modalId, callback) {
      const openButton = document.getElementById(openButtonId);
      const closeButton = document.getElementById(closeButtonId);
      const modal = document.getElementById(modalId);

      if (!openButton || !closeButton || !modal) {
            console.error('Modal elements not found.');
            return;
      }

      openButton.onclick = () => {
            modal.style.display = "block";
      };

      closeButton.onclick = () => {
            modal.style.display = "none";
            if(typeof callback === 'function') {
                  callback();
            }
      }
}

export function ResetModal(formId, imgId, imgInputId, defaultImg) {
      const form = document.getElementById(formId);
      const image = document.getElementById(imgId);
      const imgInput = document.getElementById(imgInputId);

      if(form) form.reset();
      if(image) image.src = defaultImg || "/admin/static/images/studio/studio-upload.png";
      if(imgInput) imgInput.value = "";
}

