import config2 from "../../services/config.js";

export function loadFilmList() {
      try {
            fetch(`${config2.domain}${config2.endpoints.filmList}`)
            .then(response => {
                  if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                  }
                  return response.json();
            })
            .then(filmList => {
                  const filmList_container = document.querySelector("#film-management");
                  
                  const filmListElement = document.createElement("div");
                  filmListElement.classList.add("film-list");
                  filmList_container.appendChild(filmListElement);
                  console.log(filmList);
                  filmList.array.forEach(film => {
                        const filmItem = document.createElement("div");
                        filmItem.classList.add('film-item');

                        const Image = document.createElement("img");
                        thumbnail.src = `${config2.domain}/uploads/thumbnail/${film.thumbnail}`;
                        filmImage.classList.add("film-thumbnail");
                        
                        const actress = document.createElement("")
                  });
            });
      } catch(error) {
            console.error("error in frontend: ", error);
      }
}