import string_utils from "./string.utils.js";

function renameUploadedFile(original_file, new_name) {
      new_name = string_utils.removeSpaces(new_name);
      const orignal_filename = string_utils.removeSpaces(original_file.name);
      const name_file = orignal_filename.lastIndexOf('.');

      const extension = (name_file === -1) ? '' : orignal_filename.substring(name_file); 
      const new_filename = new_name + extension;

      const renamed_file = new File([original_file], new_filename, {
            type: original_file.type,
            lastModified: original_file.lastModified,
      });

      return renamed_file;
}

const file_utils = {
      renameUploadedFile,
}
export default file_utils;