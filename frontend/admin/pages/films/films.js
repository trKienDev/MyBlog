import config2 from "../../services/config.js";
import { getValueFromId } from "../../services/HelperFunction/fetchAPI.js";

export async function loadFilmList() {
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
                  filmList.forEach(film => {
                        console.log("film: ", film);      

                        const storyDetail = getStoryDetail(film.story_id._id);
                        console.log("story detail: ", storyDetail);
                        const filmItem = document.createElement("div");
                        filmItem.classList.add('film-item');

                        const filmThumbnailWrapper = document.createElement("div");
                        filmThumbnailWrapper.classList.add("film-thumbnail-wrapper");

                        const image = document.createElement("img");
                        image.src = `${config2.domain}/uploads/thumbnail/${film.thumbnail}`;
                        image.classList.add("film-thumbnail");
                        filmThumbnailWrapper.appendChild(image);
                        filmItem.appendChild(filmThumbnailWrapper);

                        const filmInfo = document.createElement("div");
                        filmInfo.classList.add("film-info");

                        const filmCodeDiv = document.createElement("div");
                        filmCodeDiv.classList.add("film-code");
                        const filmCodeSpan = document.createElement("span");
                        filmCodeSpan.classList.add("code");
                        filmCodeSpan.textContent = film.name;
                        filmCodeDiv.appendChild(filmCodeSpan);
                        filmInfo.appendChild(filmCodeDiv);
                        
                        const ratingContainer = document.createElement("div");
                        ratingContainer.classList.add("film-rating");
                        const filmRating = film.rating || 1;
                        for(let i = 1; i <= filmRating; i++) {
                              const star = document.createElement("i"); 
                              star.classList.add("fa", "fa-star");
                              star.style.color = "gold";
                              ratingContainer.appendChild(star);
                        }
                        if (filmRating > 0) {
                              filmInfo.appendChild(ratingContainer);
                        }
                        filmInfo.appendChild(ratingContainer);

                        const infoIcon = document.createElement("i");
                        infoIcon.classList.add("fa-solid", "fa-circle-info", "film-info-icon");
                        infoIcon.addEventListener("mouseover", () => {
                              console.log(`info film: ${film.name}`);
                        });
                        filmThumbnailWrapper.appendChild(infoIcon);

                        filmThumbnailWrapper.appendChild(filmInfo);
                        filmItem.appendChild(filmThumbnailWrapper);

                        filmListElement.appendChild(filmItem);
                  });

                  filmList_container.appendChild(filmListElement);
            });
      } catch(error) {
            console.error("error in frontend: ", error);
      }
}

async function getActressName(actressId) {
      try {
            const response = await fetch(`${config2.domain}${config2.endpoints.actressGet}/${actressId}`) ;

            if(!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const actressName = await response.json();
            return actressName.name;
      } catch (error) {
            console.error("error in getActressName - film.js: ", error);
      }
}

async function getStudioName(studioId) {
      try {
            const response = await fetch(`${config2.domain}${config2.endpoints.studioGet}/${studioId}`) ;
            if(!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const studioName = await response.json();
            return studioName.name;
      } catch(error) {
            console.error("error in getStudioName - film.js: ", error);
      }
}

async function getStoryDetail(storyId) {
      try {
            console.log("story id:", storyId);
            const response = await fetch(`${config2.domain}${config2.endpoints.storyGet}/${storyId}`) ;
            if(!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const storyDetail = await response.json();
            return storyDetail.detail;
      } catch(error) {  
            console.error("error in getStoryname - film.js: ", error);
      }
}