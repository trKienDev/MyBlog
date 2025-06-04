import { showToast } from "./toast-notification.js";

function sortArrayByName(iarray) {
      if (!Array.isArray(iarray)) {
            console.error("Đầu vào cho sortFilesByName phải là một mảng.");
            showToast("Đầu vào cho sortFilesByName phải là một mảng.", 'error');
            return []; 
      }

      return iarray.slice().sort((element_a, element_b) => {
            const name_a = element_a.name.toLowerCase();
            const name_b = element_b.name.toLowerCase();

            if (name_a < name_b) {
                  return -1;
            }
            if (name_a > name_b) {
                  return 1; 
            }
            return 0;
      });
}

const sort_utils = {
      sortArrayByName,
}
export default sort_utils;