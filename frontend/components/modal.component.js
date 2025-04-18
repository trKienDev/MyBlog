
export function SetupModalHandlers(openButtonId, closeButtonId, modalId, callback) {
      const openButton = document.getElementById(openButtonId);
      const closeButton = document.getElementById(closeButtonId);

      if (!openButton || !closeButton) {
            console.error('Modal elements not found.');
            return;
      }

      openButton.onclick = () => {
            openModal(modalId);
      };

      closeButton.onclick = () => {
            closeModal(modalId);
            if(typeof callback === 'function') {
                  callback();
            }
      }
}

export function openModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.style.display = 'block';
}

export function closeModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.style.display = 'none';
}

export function ResetModal(formId, imgId, imgInputId, defaultImg) {
      const form = document.getElementById(formId);
      const image = document.getElementById(imgId);
      const imgInput = document.getElementById(imgInputId);

      if(form) form.reset();
      if(image) image.src = defaultImg || "/admin/static/images/studio/studio-upload.png";
      if(imgInput) imgInput.value = "";
}

export function CloseModal(modalId) {
      const modal = document.getElementById(modalId);
      modal.style.display = 'none';
}
