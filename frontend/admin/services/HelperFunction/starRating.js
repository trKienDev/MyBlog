export let userRating = 0;

export function initializeRatingFeature(filmElement, intialRating) {
      const ratingContainer = document.querySelector(filmElement);
      ratingContainer.innerHTML = "";
      userRating = intialRating || 1;
      
      for(let i = 1; i <= 5; i++) {
            const star = document.createElement("i");
            star.classList.add("fa", "fa-star");
            star.dataset.rating = i;
            star.style.color = i <= userRating ? "gold" : "black";
            star.style.cursor = "pointer";
            star.addEventListener("mouseover", handleMouseOver);
            star.addEventListener("click", () => handleClick(i));
            ratingContainer.appendChild(star);
      }
}

function handleMouseOver(event) {
      console.log("handleMouseOver");
      const rating = event.target.dataset.rating;
      updateStars(rating);
}

function handleClick(rating) {
      console.log("handleClick");
      userRating = rating;
      updateStars(userRating);
}

function updateStars(rating) {
      console.log("update Stars");
      const stars = document.querySelectorAll(".film-rating i");
      stars.forEach((star, index) => {
            star.style.color = index < rating ? "gold" : "black";
      });
}