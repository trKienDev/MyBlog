import { loadVideoTags } from "../../sections/homepages/videos-tag/videos-tag.js";

document.addEventListener("DOMContentLoaded", () => {
      loadSection('sections/homepages/sidebar/sidebar.html', 'sidebar');
      loadSection('sections/homepages/videos-tag/videos-tag.html', 'videos-tag', loadVideoTags);
});

function loadSection(url, targetId, callback) {
      fetch(url)
      .then(response => {
            if(!response.ok) {
                  throw new Error(`Network response was not OK when fetch ${url}`);
            }
            return response.text();
      })
      .then(data => {
            document.getElementById(targetId).innerHTML = data;
            if(callback && typeof callback === 'function') {
                  callback();
            }
      })
      .catch(error => {
            console.error(`Error loading ${url}: `, error);
      });
}