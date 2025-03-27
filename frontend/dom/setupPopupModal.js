import { InitDropdownElement } from "../components/customDropdown.js";

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

      InitDropdownElement
}