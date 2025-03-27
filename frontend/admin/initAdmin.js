import { handleElementActiveState } from "../utils/activeState.js";

function initAdmin() {
      handleElementActiveState(".sidebar-item");
}

document.addEventListener('DOMContentLoaded', initAdmin);

