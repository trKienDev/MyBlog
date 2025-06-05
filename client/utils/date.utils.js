function getDateFromStr(dateStr) {
      const day = String(dateStr.getDate()).padStart(2, '0');  
      const month = String(dateStr.getMonth() + 1).padStart(2, '0');  
      const year = dateStr.getFullYear();
      return `${day}-${month}-${year}`;
}

function calculateAgeFromBirth(birth) {
      const current_year = new Date().getFullYear();
      const current_age = current_year - birth;
      return current_age;
}

const date_utils = {
      getDateFromStr,
      calculateAgeFromBirth,
}
export default date_utils;