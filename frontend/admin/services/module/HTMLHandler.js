// Edit Cell
export function createEditButtonCell(editContainerClass, item, handleEditCallback) {
        const editCell = document.createElement('td');

        const editContainer = document.createElement('div');
        editContainer.classList.add(editContainerClass);
        editContainer.style.width = '100%';
        editContainer.style.display = 'flex';
        editContainer.style.justifyContent = 'center';
        
        const editButton = document.createElement('div');
        editButton.classList.add('btn-edit');
        editButton.innerHTML = `<i class="fa-solid fa-pen" style="color: aliceblue;"></i>`;
        editButton.onclick = () => handleEditCallback(item, editButton);
        
        editCell.appendChild(editButton);
        editContainer.appendChild(editButton);
        editCell.appendChild(editContainer);
        
        return editCell;
}

export function createDeleteButtonCell(itemId, deleteClass, handleDeleteCallback) {
        const deleteCell = document.createElement('td');
        deleteCell.style.display = 'flex';
        deleteCell.style.justifyContent = 'center';
        const deleteContainer = document.createElement('div');
        const deleteButton = document.createElement('div');
        deleteButton.classList.add(deleteClass);
        deleteButton.innerHTML = `<i class="fa-solid fa-trash" style="color: aliceblue;"></i>`;
        deleteButton.onclick = () => handleDeleteCallback(itemId);
        deleteCell.appendChild(deleteButton);
        
        return deleteCell;
}

// Name cell
export function createTdTextCell(name) {
        const codeCell = document.createElement('td');
        codeCell.textContent = name;

        return codeCell;
}

// Image cell
export function createImageCell(imgSrc, imgClass) {
        const imageCell = document.createElement('td');
        const image = document.createElement('img');
        image.src = imgSrc;
        image.classList.add(imgClass);
        imageCell.appendChild(image);

        return imageCell;
}

// Date Cell

// Helper function
export function clickToDisplayLargeImg(image, imgClass, imgWidth, imgHeight) {
        image.addEventListener('click', (e) => {
                e.stopPropagation();

                const existedImg = '.' + imgClass;
                // Kiểm tra xem largeImage đã tồn tại chưa
                if(document.querySelector(existedImg)) {
                        return;
                }

                const largeImage = document.createElement('img');
                largeImage.src = image.src;
                largeImage.classList.add(imgClass);
                largeImage.style.position = 'absolute';
                largeImage.style.top = `${e.clientY}px`;
                largeImage.style.left = `${e.clientX}px`;
                largeImage.style.width = imgWidth;
                largeImage.style.height = imgHeight;
                largeImage.style.zIndex = '1000';
                largeImage.style.border = 'none';

                document.body.appendChild(largeImage);

                // Add event listener to document for closing the enlarged image
                const closeLargeImage = () => {
                        if(document.body.contains(largeImage)) {
                                document.body.removeChild(largeImage);
                        }
                        document.removeEventListener('click', closeLargeImage);
                };

                // Delay adding the event listener to avoid immediate execution from the current click
                setTimeout(() => {
                        document.addEventListener('click', closeLargeImage);
                }, 0);
        });
}