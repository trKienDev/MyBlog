function createStarsRating(element_id, stars_number) {
      const container_element = document.getElementById(element_id);
      for(let i = 0; i < stars_number; i++) {
            const star_span = document.createElement('a');
            star_span.classList.add('fa', 'fa-star', 'star-yellow');
            container_element.appendChild(star_span);
      }

      return container_element;
}

const stars_component = {
      createStarsRating,
}
export default stars_component;