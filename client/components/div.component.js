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

function createVideoInfoDiv(video_name, css_class, div_container) {
      const video_info = document.createElement('div');
      video_info.classList.add(css_class);
      video_info.appendChild(video_name);
      video_info.appendChild(div_container);

      return video_info;
}

const div_component = {
      createDiv,
      createVideoInfoDiv,
};
export default div_component;