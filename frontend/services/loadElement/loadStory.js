import config3 from '../config.js';

export async function loadStory(storyElement) {
        try {
                const response = await fetch(`${config3.domain}${config3.endpoints.storyList}`) ;
                if(!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const stories = await response.json();
                const storySelect = document.getElementById(storyElement);
                storySelect.innerHTML = '<option value="" disabled selected>Select story</option>';
                stories.forEach(story => {
                        const option = document.createElement('option');
                        option.value = story._id;
                        option.textContent = story.name;
                        storySelect.appendChild(option);
                });
        } catch(error) {
                console.error('Error loading stories: ', story);
        }
}