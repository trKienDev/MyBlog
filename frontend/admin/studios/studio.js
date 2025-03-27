import { SetupModalHandlers }  from "../../dom/setupPopupModal.js"; 
import { HandleImageUpload } from "../../dom/imageUI.js";
import { ErrorSweetAlert, SuccessSweetAlert } from "../../utils/sweetAlert.js";
import apiConfig from "../../services/apiConfig.js";

export function InitStudioAdmin() {
      SetupModalHandlers("openModalButton", "closeModalButton", "studio-modal");
      HandleImageUpload("profile-image", "image-upload"); 
      LoadStudios();
      CreateNewStudio("studio-form", "studio-modal");
}

function LoadStudios() {
      fetch(`${apiConfig.server}${apiConfig.endpoints.getAllStudios}`)
        .then(response => {
                if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json(); // Chuyển đổi phản hồi sang JSON
        })
        .then(studioList => {
                const tbody = document.querySelector('#studio-table tbody');
                tbody.innerHTML = ''; // Xóa nội dung cũ (nếu có)

                studioList.forEach(item => {
                        const tr = document.createElement('tr');
                        tr.setAttribute('data-id', item._id);

                        // Edit button cell
                        const editCell = document.createElement('td');
                        const editContainer = document.createElement('div');
                        editContainer.classList.add('edit-container');
                        editContainer.style.width = '100%';
                        editContainer.style.display = 'flex';
                        editContainer.style.justifyContent = 'center';
                        const editButton = document.createElement('div');
                        editButton.classList.add('btn-edit');
                        editButton.innerHTML = `<i class="fa-solid fa-pen" style="color: aliceblue;"></i>`;
                        editButton.onclick = () => handleEdit(item); // Function to handle edit action
                        editContainer.appendChild(editButton);
                        editCell.appendChild(editContainer);
                        tr.appendChild(editCell);

                        // Name cell
                        const nameCell = document.createElement('td');
                        nameCell.textContent = item.name;
                        tr.appendChild(nameCell);

                        // Image cell
                        const imageCell = document.createElement('td');
                        const image = document.createElement('img');
                        image.src = `${apiConfig.server}/uploads/studio/${item.image}` || '/admin/static/images/face/profile-default.jpg';
                        image.classList.add('profile');
                        imageCell.appendChild(image);
                        tr.appendChild(imageCell);

                        // Delete button cell
                        const deleteCell = document.createElement('td');
                        const deleteButton = document.createElement('div');
                        deleteButton.classList.add('btn-delete');
                        deleteButton.innerHTML = `<i class="fa-solid fa-trash" style="color: aliceblue;"></i>`;
                        deleteButton.onclick = () => handleDelete(item._id); // Function to handle delete action
                        deleteCell.appendChild(deleteButton);
                        tr.appendChild(deleteCell);

                        // Append the row to the table body
                        tbody.appendChild(tr);
                });
        })
        .catch(error => {
                console.error('Error fetching studio data: ', error);
        });
}

async function CreateNewStudio(formId, modalId) {
      const form = document.getElementById(formId);
      const modal = document.getElementById(modalId);
      const imgInput = document.getElementById("image-upload");
      const profileImg = document.getElementById("profile-image");
      const submitBtn = form.querySelector('button[type="submit"]');

      form.onsubmit = async (event) => {
            event.preventDefault(); 
            submitBtn.disabled = true;

            const formData = new FormData(form);
            try {
                  const response = await fetch(`${apiConfig.server}${apiConfig.endpoints.createStudio}`, {
                        method: 'POST',
                        body: formData
                  });

                  if (!response.ok) {
                        ErrorSweetAlert("Error in backend");
                        throw new Error(`HTTP error! Status: ${response.status}`);
                  }

                  let result;
                  try {
                        result = await response.json();
                  } catch {
                        errorSweetAlert("Invalid response format");
                        return;
                  }

                  if (result._id) {
                        SuccessSweetAlert("studio created");
                        //IloadStudioTable(); 
                  } else {
                        ErrorSweetAlert("Error in backend");
                        throw new Error('Failed to create studio. Invalid response from server.');
                  }
            } catch (error) {
                  console.error('Error creating studio in frontend: ', error.message);
                  ErrorSweetAlert("Error in frontend");
            } finally {
                  submitBtn.disabled = false;
                  form.reset();
                  if (imgInput) imgInput.value = "";
                  if (profileImg) profileImg.src = "/admin/static/images/studio/default_studio.png";
                  modal.style.display = "none";
            }
      };
}