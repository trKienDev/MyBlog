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
                  filmList.forEach(film => {
                        const filmItem = document.createElement("div");
                        filmItem.classList.add('film-item');

                        const image = document.createElement("img");
                        image.src = `${config2.domain}/uploads/thumbnail/${film.thumbnail}`;
                        image.classList.add("film-thumbnail");
                        filmItem.appendChild(image);

                        const filmInfo = document.createElement("div");
                        filmInfo.classList.add("film-z`info");
                        const filmCode = document.createElement("div");
                        filmCode.classList.add("film-code");
                        const filmCodeSpan = document.createElement("span");
                        filmCodeSpan.classList.add("code");
                        filmCodeSpan.textContent = film.name;
                        filmCode.appendChild(filmCodeSpan);
                        filmInfo.appendChild(filmCode);

                        filmItem.appendChild(filmInfo);
                        filmListElement.appendChild(filmItem);
                  });

                  filmList_container.appendChild(filmListElement);
            });
      } catch(error) {
            console.error("error in frontend: ", error);
      }
}