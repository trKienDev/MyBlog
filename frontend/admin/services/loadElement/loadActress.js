import config3 from '../config.js';

export async function loadActress(actressElement) {
        try {
                const response = await fetch(`${config3.domain}${config3.endpoints.actressList}`) ;
                if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const actresses = await response.json();
                const actressSelect = document.getElementById(actressElement);
                actressSelect.innerHTML = '<option value="" disabled selected>Select actress</option>';
                actresses.forEach(actress => {
                        const option = document.createElement('option');
                        option.value = actress._id; 
                        option.textContent = actress.name; 
                        actressSelect.appendChild(option);
                });
        } catch(error) {
                console.error('Error loading actress:', error);
        }
}