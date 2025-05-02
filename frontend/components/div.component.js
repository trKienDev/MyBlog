function createDiv({icss_class, idiv_id, idiv_name}) {
      const div = document.createElement('div');
      div.classList.add(icss_class);
      
      if(idiv_id) {
            div.id = idiv_id;
      }
      if(idiv_name) {
            div.innerText = idiv_name;
      }

      return div;
}

const div_component = {
      createDiv,
};
export default div_component;