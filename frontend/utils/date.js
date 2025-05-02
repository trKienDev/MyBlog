function getDateFromStr(dateStr) {
      const day = String(dateStr.getDate()).padStart(2, '0');  
      const month = String(dateStr.getMonth() + 1).padStart(2, '0');  
      const year = dateStr.getFullYear();
      return `${day}-${month}-${year}`;
}

const date_utils = {
      getDateFromStr,
}
export default date_utils;