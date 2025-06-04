import image_utils from "../utils/image.utils.js";

function initModal(openButtonId, closeButtonId, modalId, callback) {
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

function openModal(modal_id) {
      const modal = document.getElementById(modal_id);
      modal.style.display = 'block';
}

function closeModal(modal_id) {
      const modal = document.getElementById(modal_id);
      modal.style.display = 'none';
}

function resetModal(id_form, id_img, id_imgInput, default_img) {
      const form = document.getElementById(id_form);
      if(form) form.reset();

      image_utils.resetImageElementValue(id_img, id_imgInput, default_img);
}

function changeTitle(modal_id, submitBtn_selector, remove_class, add_class, title) {
      const modal = document.getElementById(modal_id),
      h2_el = modal.querySelector('h2');
      const submit_btn = modal.querySelector(submitBtn_selector);
      submit_btn.classList.remove(remove_class);
      submit_btn.classList.add(add_class);
      h2_el.innerText = title;
}

const modal_component = {
      initModal,
      openModal,
      closeModal, 
      resetModal,
      changeTitle,
};

export default modal_component;