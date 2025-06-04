function getTableTbody(table_id) {
      const tbody = document.querySelector(`#${table_id} tbody`);
      return tbody;
}

const table_utils = {
      getTableTbody,
}
export default table_utils;