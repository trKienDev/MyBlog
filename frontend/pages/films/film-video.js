import config from "../../services/config.js";

document.addEventListener("DOMContentLoaded", () => {
      loadHeader();
      initializeFilmProperties();
});


function initializeFilmProperties() {
      const { film_code, film_id } = getTagFromUrl();
      document.getElementById('film-code').textContent = film_code;
      loadVideosByFilmId(film_id);
}
function loadHeader() {
      fetch("../../layout/header.html")
      .then(response => response.text())
      .then(data => {
            document.getElementById("header").innerHTML = data;

            // Chạy các đoạn script trong file header
            const scripts = document.querySelectorAll('#header script');
            scripts.forEach(oldScript => {
                        const newScript = document.createElement('script');
                        newScript.text = oldScript.text;
                        document.head.appendChild(newScript);
            });
      })
      .catch(error => console.error("Error loading header: ", error));
}
async function loadVideosByFilmId(film_id) {
      const film = await getFilmInfoById(film_id);
      console.log("film: ", film);
}
async function getFilmInfoById(film_id) {
      try {
            const response = await fetch(`${config.domain}${config.endpoints.getFilmById}/${film_id}`)
            if(!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("response: ", response);
            const film = await response.json();
            return film;
      } catch(error) {
            console.error("Error in frontend: ", error);
      }
}

function getTagFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return {
            film_code: params.get('code'),
            film_id: params.get('id')
      }
}