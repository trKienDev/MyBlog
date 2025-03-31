import apiConfig from "../../api/api.config.js";
import { ErrorSweetAlert, SuccessSweetAlert } from "../../utils/sweetAlert.js";

export function initTagAdmin() {
      CreateNewTag();
}

async function CreateNewTag() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const name = document.getElementById('name').value;
            const kind = document.getElementById('kind').value;
            const data = {
                  name: name,
                  kind: kind,
            };
            
            try {
                  const response = await fetch(`${apiConfig.server}${apiConfig.endpoints.createTag}`, {
                        method: 'POST',
                        header: {
                              'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                  });

                  const result = await response.json();
                  if(result._id) {
                        SuccessSweetAlert("tag created");
                  } else {
                        ErrorSweetAlert("failed to create tag");
                  }
            } catch(error) {
                  console.error('Error creating tag: ', error.message);
                  ErrorSweetAlert("Failed to create tag");
            }
      })
};

