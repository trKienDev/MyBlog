import { SelectStudios } from "../../components/studio.component.js";
import { ErrorSweetAlert, SuccessSweetAlert } from "../../utils/sweetAlert.js";
import * as fetchAPI from "../../api/fetch.api.js";
import apiConfig from "../../api/api.config.js";

export function initCodeAdmin() {
      SelectStudios("studio");
      SelectStudios("form-studio");
      CreateNewCode();
}

async function CreateNewCode() {
      document.getElementById('form').addEventListener('submit', async(event) => {
            event.preventDefault();
            const studioSelection = document.getElementById('form-studio');
            const studio = studioSelection.value;
            const codeInput = document.getElementById('form-code');
            const code = codeInput.value;

            const data = { studio: studio, code: code };
            try {
                  const createdCode = await fetchAPI.CreateItemJson(`${apiConfig.endpoints.createCode}`, data);
                  if(createdCode._id) {
                        SuccessSweetAlert("code created");
                  } else {
                        ErrorSweetAlert("failed to create code");
                  }
            } catch(error) {
                  console.error('Error creating code: ', error.message);
                  ErrorSweetAlert("Failed to create code");
            }
      });
}