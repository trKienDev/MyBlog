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

function calculateAgeFromTwoYearStr(year_a, year_b) {
      const formated_yearA = parseInt(year_a.substring(0, 4));
      const formated_yearB = parseInt(year_b.substring(0, 4));
      const age = formated_yearA - formated_yearB;
      return Math.abs(age);
}

const date_utils = {
      getDateFromStr,
      calculateAgeFromBirth,
      calculateAgeFromTwoYearStr,
}
export default date_utils;