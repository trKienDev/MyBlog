import { fetchAPI } from "../../../../services/apiService.js";
import config2 from "../../../services/config.js";
import { errorSweetAlert, successSweetAlert } from "../../../services/module/sweetAlert.js";

export async function loadTagsTable() {
        try {
                const tagResponse = await fetchAPI(config2.endpoints.tagList);
                const tagList = await tagResponse.json();

                const tbody = document.querySelector('#tags-table tbody');
                tbody.innerHTML = ''; 
                
                tagList.forEach(item => {
                        const row = document.createElement('tr');
                        row.setAttribute('data-id', item._id);

                        const tdCheckbox = document.createElement('td');
                        tdCheckbox.classList.add('td_checkbox');
                        tdCheckbox.innerHTML = `
                        <span>
                                <input type="checkbox" id="checkbox${item.id}">
                                <label for="checkbox${item.id}"></label>
                        </span>`;

                        const tdName = document.createElement('td');
                        tdName.classList.add('td_name', 'editable-name');
                        tdName.innerHTML = `<span contenteditable="true">${item.name}</span>`;

                        const tdKind = document.createElement('td');
                        tdKind.classList.add('td_kind', 'editable-kind');
                        tdKind.innerHTML = `<span contenteditable="true">${item.kind}</span>`;

                        const tdAction = document.createElement('td');
                        tdAction.classList.add('td_action');
                        tdAction.innerHTML = `
                                                        <div class="btn btn-del">
                                                                <a href="#" data-id="${item._id}">
                                                                        <i class="fa-solid fa-trash"></i>
                                                                </a>
                                                        </div>`;

                        row.appendChild(tdCheckbox);
                        row.appendChild(tdName);
                        row.appendChild(tdKind);
                        row.appendChild(tdAction);
                        tbody.appendChild(row);

                        const deleteButton = tdAction.querySelector('.btn-del a');
                        deleteButton.addEventListener('click', function(event) {
                                event.preventDefault(); 
                                const itemId = deleteButton.getAttribute('data-id'); 
                                deleteSidebarItem(itemId);
                        });
                });

                document.getElementById('tags-form').addEventListener('submit', function(event) {
                        event.preventDefault();
                        const name = document.getElementById('tags-name').value;
                        const kind = document.getElementById('tags-kind').value;
                        createTags(name, kind);
                });

                document.getElementById('btn-save').addEventListener('click', function() { 
                        updateTag();
                });
        } catch(error) {
                console.error("Error fetching data: ", error.message);
        }
}

async function createTags(name, kind) {
        const requestData = {
                name: name,
                kind: kind
        };

        document.getElementById('tags-name').value = '';
        document.getElementById('tags-kind').value = '';
        console.log(requestData);
        try {
                const response = await fetch(`${config2.domain}${config2.endpoints.tagCreate}`, {
                        method: 'POST',
                        headers: {
                                'Content-Type' : 'application/json'
                        },
                        body: JSON.stringify(requestData)
                });

                if ( response.ok ) {
                        Swal.fire ({
                                title : 'Success !' ,
                                text : 'New tag is successfully added !',
                                icon : 'Success',
                                confirmButtonText : 'OK',
                                confirmButtonColor: '#28a745',
                        }).then(( result ) => {
                                if ( result.isConfirmed ) {
                                        loadTagsTable();
                                }
                        });
                } else {
                        errorSweetAlert("Error in backend");
                        const errorData = await response.json();
                        alert(`Error creating tag: ${errorData.message}`);
                } 
        } catch(error) {
                alert(`Network error: ${error.message}`);
        }            
}

function updateTag() {
        const flag = true;
        const rows = document.querySelectorAll('tbody tr');
        const checkedRows = [];

        rows.forEach( row => {
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox && checkbox.checked) {
                        checkedRows.push(row);
                }
        });
        
        if (checkedRows.length === 0) {
                Swal.fire({
                        icon: 'warning',
                        title: 'No Tags Selected',
                        text: 'You must check the box to update a tag!',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#ffc107',
                });
                return;
        }

        const updateTags = [];

        checkedRows.forEach(row => {
                const id = row.getAttribute('data-id');
                const name = row.querySelector('.editable-name').textContent.trim();
                const kind = row.querySelector('.editable-kind').textContent.trim();
                updateTags.push({ id, name, kind });
        });

        updateTags.forEach(item => {
                fetch(`${config2.domain}${config2.endpoints.tagUpdate}/${item.id}`, {
                        method: 'PUT',
                        headers: {
                                'Content-Type' : 'application/json',
                        },
                        body : JSON.stringify({
                                name: item.name,
                                kind: item.kind
                        })
                })
                .then(response => {
                        if(response.status === 200) {
                                successSweetAlert("Tag updated");
                        } else if (response.status === 404) {
                                errorSweetAlert("Tag not found!");
                        } else if (response.status === 500) {
                                errorSweetAlert("Error in backend");      
                        }
                })
                .catch(error => {
                        flag = false;
                        console.error('Error updating sidebar items: ', error);
                        errorSweetAlert("Error in frontend");
                });
        });

        if (flag === true) {
                loadTagsTable();
        }
}

function deleteSidebarItem(id) {
        const apiUrl = `${config2.domain}${config2.endpoints.tagDelete}/${id}`;

        fetch(apiUrl, {
                method: 'DELETE', 
                headers: {
                        'Content-Type': 'application/json' 
                }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
                const row = document.querySelector(`tr[data-id="${id}"]`);
                if (row) {
                        row.remove(); 
                }
                Swal.fire({
                        title: 'Deleted!',
                        text: 'Sidebar item deleted successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#28a745',
                })
                .then((result) => {
                        if (result.isConfirmed) {
                                loadTagsTable();
                        }
                });
        })
        .catch(error => {
                errorSweetAlert("Error in frontend");
                console.error("Error deleting sidebar item:", error);
        });
}