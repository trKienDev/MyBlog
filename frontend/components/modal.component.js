
export function SetupModalHandlers(openButtonId, closeButtonId, modalId, callback) {
      const openButton = document.getElementById(openButtonId);
      const closeButton = document.getElementById(closeButtonId);

      if (!openButton || !closeButton) {
            console.error('Modal elements not found.');
            return;
      }

      openButton.onclick = () => {
            open_modal(modalId);
      };

      closeButton.onclick = () => {
            closeModal(modalId);
            if(typeof callback === 'function') {
                  callback();
            }
      }
}

export function open_modal(modalId) {
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

export function change_modalTitle(modal_id, submitBtn_selector, remove_class, add_class, title) {
      const modal = document.getElementById(modal_id),
      h2_el = modal.querySelector('h2');
      const submit_btn = modal.querySelector(submitBtn_selector);
      submit_btn.classList.remove(remove_class);
      submit_btn.classList.add(add_class);
      h2_el.innerText = title;
}
