import config from "../../services/config.js";
import { getValueFromId } from "../../admin/services/HelperFunction/fetchAPI.js";

document.addEventListener("DOMContentLoaded", function() {
      initializeTagProperties();
      loadHeader();
});

function getTagFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return {
            tag_name: params.get('tag'),
            tag_id: params.get('id')
      }
}

async function loadFilmsByTag(tag_id) {
      try {
            const response = await fetch(`${config.domain}${config.endpoints.getFilmByTagId}/${tag_id}`);
            if(!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const films = await response.json();
            renderFilms(films);
      } catch(error) {
            console.error("error in frontend: ", error);
      }
}

function renderFilms(films) {
      const container = document.getElementById("films-container");
      container.innerHTML = '';

      if(films.length === 0) {
            const notFound_p = document.createElement('p');
            notFound_p.classList = "not-found-alert";
            notFound_p.textContent = "not found any film related to this tag!";
            container.appendChild(notFound_p);
            return;
      }

      const filmList_div = document.createElement('div');
      filmList_div.classList.add("film-list");

      films.forEach(film => {
            console.log("films: ", film);
            const filmItem_div = createFilmItem(film);
            filmList_div.appendChild(filmItem_div);
      });

      container.appendChild(filmList_div);
}

function initializeTagProperties() {
      const { tag_name, tag_id } = getTagFromUrl();
      document.getElementById('tag-name').textContent = tag_name;
      loadFilmsByTag(tag_id);
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

function createFilmItem(film) {
      const filmItem_link = document.createElement("a");
      filmItem_link.href = `/pages/films/film-video.html?id=${film._id}&code=${film.name}`;
      filmItem_link.classList.add("film-item");
      const filmItem_div = document.createElement("div");

      const filmThumbnailWrapper = document.createElement("div");
      filmThumbnailWrapper.classList.add("film-thumbnail-wrapper");
      const image = document.createElement("img");
      image.src = `${config.domain}/uploads/thumbnail/${film.thumbnail}`;
      image.classList.add("film-thumbnail");
      filmThumbnailWrapper.appendChild(image);
      filmItem_div.appendChild(filmThumbnailWrapper);

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
                  infoContainer.remove();
            }
      });

      filmThumbnailWrapper.appendChild(infoIcon);
      filmThumbnailWrapper.appendChild(filmInfo);
      filmItem_div.appendChild(filmThumbnailWrapper);
      filmItem_link.appendChild(filmItem_div);
      return filmItem_link;
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
            const studioName = film.studio_id ? await getValueFromId(film.studio_id, "studioGet", "name") : "unknown studio";
            studioSpan.textContent = `studio: ${studioName}`;
            studioContainer.appendChild(studioSpan);
            infoContainer.appendChild(studioContainer);

            const actressContainer = document.createElement("div");
            actressContainer.classList.add("info-actress");
            const actressSpan = document.createElement("span");
            const actressName = film.actress_id ? await getValueFromId(film.actress_id, "actressGet", "name") : "unknown actress";
            actressSpan.textContent = `actress: ${actressName}`;
            actressContainer.appendChild(actressSpan);
            infoContainer.appendChild(actressContainer);

            const storyContainer = document.createElement("div");
            storyContainer.classList.add("info-story");
            const storySpan = document.createElement("span");
            const storyDetail = await getValueFromId(film.story_id, "storyGet", "detail");
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
