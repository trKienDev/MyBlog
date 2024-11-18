// open / close modal form
export function setupModalHandlers(openButtonId, closeButtonId, modalId) {
        const openButton = document.getElementById(openButtonId);
        const closeButton = document.getElementById(closeButtonId);
        const modal = document.getElementById(modalId);

        if (!openButton || !closeButton || !modal) {
                console.error('Modal elements not found.');
                return;
        }

        // Mở modal khi nhấn nút "Create"
        openButton.onclick = () => {
                modal.style.display = "block";
        };

        // Đóng modal khi nhấn nút "Close"
        closeButton.onclick = () => {
                modal.style.display = "none";
        }
}