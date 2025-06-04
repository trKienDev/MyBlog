function getSelectedCodeOption(filmCode_id) {
      let codeSelection_element = document.getElementById(filmCode_id);
      const selectedCode_index = codeSelection_element.selectedIndex;
      const selectedCode_option = codeSelection_element.options[selectedCode_index];
      return selectedCode_option;
}

const film_helper = {
      getSelectedCodeOption,
}
export default film_helper;