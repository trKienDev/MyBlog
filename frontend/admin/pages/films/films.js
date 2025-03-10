import config2 from "../../services/config.js";
import { getValueFromId } from "../../services/HelperFunction/fetchAPI.js";

export async function loadFilmList() {
      try {
            const response = await fetch(`${config2.domain}${config2.endpoints.filmList}`);
            if(!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const filmList = await response.json();
            const filmList_container = document.querySelector("#film-management");
            const filmListElement = document.createElement("div");
            filmListElement.classList.add("film-list");
            filmList_container.appendChild(filmListElement);

            for(const film of filmList) {
                  console.log("film: ", film);      
                  const storyDetail = await getValueFromId(film.story_id._id, "storyGet", "detail");

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
                  infoIcon.addEventListener("mouseover", async () => {
                        let infoContainer = filmThumbnailWrapper.querySelector(".film-info-popup");
                        if(!infoContainer) {
                              infoContainer = await createInfoDiv(film);
                              infoIcon.appendChild(infoContainer);
                        }
                  });
                  infoIcon.addEventListener("mouseleave", () => {
                        let infoContainer = filmThumbnailWrapper.querySelector(".film-info-popup");
                        if(infoContainer) {
                              console.log("remove");
                              infoContainer.remove();
                        }
                  });


                  filmThumbnailWrapper.appendChild(infoIcon);

                  filmThumbnailWrapper.appendChild(filmInfo);
                  filmItem.appendChild(filmThumbnailWrapper);

                  filmListElement.appendChild(filmItem);
            }

            filmList_container.appendChild(filmListElement);
      } catch(error) {
            console.error("error in frontend: ", error);
      }
}

async function createInfoDiv(film) {
      try {
            const infoContainer = document.createElement("div");
            infoContainer.classList.add("film-info-popup");
            
            const codeContainer = document.createElement("div");
            codeContainer.classList.add("info-code");
            const codeSpan = document.createElement("span");
            codeSpan.textContent = film.name ?? "untitled film";
            codeContainer.appendChild(codeSpan);
            infoContainer.appendChild(codeContainer);

            const studioContainer = document.createElement("div");
            studioContainer.classList.add("info-studio");
            const studioSpan = document.createElement("span");
            const studioName = film.studio_id._id ? await getValueFromId(film.studio_id._id, "studioGet", "name") : "unknown studio";
            studioSpan.textContent = `studio: ${studioName}`;
            studioContainer.appendChild(studioSpan);
            infoContainer.appendChild(studioContainer);

            const actressContainer = document.createElement("div");
            actressContainer.classList.add("info-actress");
            const actressSpan = document.createElement("span");
            const actressName = film.actress_id._id ? await getValueFromId(film.actress_id._id, "actressGet", "name") : "unknown actress";
            actressSpan.textContent = `actress: ${actressName}`;
            actressContainer.appendChild(actressSpan);
            infoContainer.appendChild(actressContainer);

            const storyContainer = document.createElement("div");
            storyContainer.classList.add("info-story");
            const storySpan = document.createElement("span");
            const storyDetail = await getValueFromId(film.story_id._id, "storyGet", "detail");
            storySpan.textContent = `story: ${storyDetail}`;
            storyContainer.appendChild(storySpan);
            infoContainer.appendChild(storyContainer);

            const releaseDateContainer = document.createElement("div");
            releaseDateContainer.classList.add("info-release_date");
            const releaseDateSpan = document.createElement("span");
            const releaseDate = film.release_date ? new Date(film.release_date).toISOString().split("T")[0] : "Unknown release date";
            releaseDateSpan.textContent = releaseDate;
            releaseDateContainer.appendChild(releaseDateSpan);
            infoContainer.appendChild(releaseDateContainer);

            const videos = film.video.length;
            const videosContainer = document.createElement("div");
            videosContainer.classList.add("info-videos");
            const videosSpan = document.createElement("span");
            videosSpan.textContent = `videos: ${videos}`;
            videosContainer.appendChild(videosSpan);
            infoContainer.appendChild(videosContainer);

            return infoContainer;
      } catch(error) {
            console.error("Error in createInfoDiv: ", error);
            return;
      }
}

