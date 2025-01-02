import config3 from '../config.js';

export async function loadVideoTag(videoTagElement) {
        try {
                const response = await fetch(`${config3.domain}${config3.endpoints.tagVideoList}`) ;
                if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const tags = await response.json();
                const tagSelect = document.getElementById(videoTagElement);
                tagSelect.innerHTML = '<option value="" disabled selected>Select tag</option>';
                tags.forEach(tag => {
                        const option = document.createElement('option');
                        option.value = tag._id; 
                        option.textContent = tag.name; 
                        tagSelect.appendChild(option);
                });
        } catch(error) {
                console.error('Error loading video tags: ', error);
        }
}