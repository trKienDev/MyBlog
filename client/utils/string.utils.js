function replaceSpacesWithUnderscore(string) {
      return string.replace(/\s+/g, '_');
}
function removeSpaces(string) {
      return string.replace(/\s/g, ''); 
}

function RemoveAccents(string) {
      return string.toLowerCase() // 1. Chuyển thành chữ thường
                  .normalize('NFD') // 2. Tách ký tự và dấu
                  .replace(/[\u0300-\u036f]/g, '') // 3. Xóa bỏ các dấu
                  .replace(/\s/g, ''); // 4. Xóa bỏ khoảng trắng
}

const string_utils = {
      removeSpaces,
      replaceSpacesWithUnderscore,
      RemoveAccents,
}
export default string_utils;