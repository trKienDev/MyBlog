export function createTrWithId(id) {
      const tr = document.createElement('tr');
      tr.setAttribute('data-id', id);
      return tr;
}

// Edit Cell
export function CreateEditButtonCell(editContainerClass, item, handleEditCallback) {
      const editCell = document.createElement('td');

      const editContainer = document.createElement('div');
      editContainer.classList.add(editContainerClass);

      const edit_button = document.createElement('button');
      edit_button.classList.add('btn');
      edit_button.classList.add('btn-edit');
      edit_button.setAttribute('type', 'button');
      edit_button.setAttribute('aria-label', `update ${item.name || item._id}`);
      edit_button.setAttribute('title', 'update');

      edit_button.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
      
      if(typeof handleEditCallback === 'function') {
            edit_button.onclick = () => handleEditCallback(item);
      }

      editCell.appendChild(edit_button);
      editContainer.appendChild(edit_button);
      editCell.appendChild(editContainer);

      return editCell;
}

// Delete cell
export function CreateDeleteButtonCell(itemId, deleteClass, handleDeleteCallback) {
      const deleteCell = document.createElement('td');
      const deleteButton = document.createElement('div');
      deleteButton.classList.add(deleteClass);
      deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
      deleteButton.onclick = () => handleDeleteCallback(itemId);
      deleteCell.appendChild(deleteButton);

      return deleteCell;
}

// Name cell
export function CreateTdTextCell(name) {
      const codeCell = document.createElement('td');
      codeCell.textContent = name || '';

      return codeCell;
}

// Image cell
export function CreateImageCell(imgSrc, imgClass) {
      const imageCell = document.createElement('td');
      const image = document.createElement('img');
      image.src = imgSrc;
      image.classList.add(imgClass);
      imageCell.appendChild(image);

      return imageCell;
}

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

