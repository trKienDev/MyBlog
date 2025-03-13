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
      // render film-videos here
      console.log("film: ", film);
      const filmVideos_div = document.getElementById("film-videos");
      loadVideoList(film, filmVideos_div);

      // load thumbnail
      const filmInfo_div = document.getElementById("film-info");
      
      const filmThumbnailWrapper = document.createElement("div");
      filmThumbnailWrapper.classList.add("film-thumbnail-wrapper");
      const image = document.createElement("img");
      image.classList.add("film-thumbnail");
      image.src = `${config.domain}/uploads/thumbnail/${film.thumbnail}`;
      filmThumbnailWrapper.appendChild(image);
      filmInfo_div.appendChild(filmThumbnailWrapper);
}

async function loadVideoList(film, filmVideos_div) {
      const videos = film.video;
      // run async request in one time
      const promises = videos.map(video => renderVideoList(video, filmVideos_div));
      // Wait for all renderVideoList runtime finishes
      const videoContainers = await Promise.all(promises);
      
      videoContainers.forEach(videoContainers => {
            filmVideos_div.appendChild(videoContainers);
      });
      return filmVideos_div;
}

async function renderVideoList(video, filmVideos_div) {
      try {
            const response = await fetch(`${config.domain}${config.endpoints.videoGetById}/${video}`);
            if(!response.ok) {
                  console.error(`Failed to fetch video details for ID: ${video}`);
                  return;
            }

            const videoData = await response.json();
            const videoUrl = `${config.domain}/uploads/videos/${videoData.video.filePath}`;
            
            const videoContainer = document.createElement("div");
            videoContainer.classList.add("video-container");

            const videoItem = document.createElement("video");
            videoItem.classList.add("video-item");
            videoItem.src = videoUrl;
            videoItem.controls = false;
            videoItem.muted = true;

            videoItem.addEventListener('mouseenter', () =>{
                  videoItem.play();
            });
            videoItem.addEventListener('mouseleave', () => {
                  videoItem.pause();
            });

            videoItem.addEventListener('loadeddata', function() {
                  const frameRate = 30;
                  const frameNumber = 10;
                  videoItem.currentTime = frameNumber / frameRate;

                  videoItem.addEventListener('seeked', function() {
                        videoItem.pause();
                  });
            });
            videoContainer.appendChild(videoItem);
            return videoContainer;
      } catch(error) {
            console.error("Error in frontend: ", error);
      }
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