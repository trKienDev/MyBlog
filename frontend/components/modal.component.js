
export function SetupModalHandlers(openButtonId, closeButtonId, modalId) {
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
      }
}

export function ResetModal({ form, image, imgInput, modal, defaultImg}) {
      if(form) form.reset();
      if(image)  image.src = defaultImg || "/admin/static/images/studio/studio-upload.png";
      if(imgInput) imgInput.value = "";
      if(modal) modal.style.display = "none";
}

