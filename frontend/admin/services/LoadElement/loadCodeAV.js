import config3 from '../config.js';

export async function loadCodeAV(codeAVElement) {
        try {
                const response = await fetch(`${config3.domain}${config3.endpoints.codeAVList}`) ;
                if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const codeAVs = await response.json();
                const codeAVSelect = document.getElementById(codeAVElement);
                codeAVSelect.innerHTML = '<option value="" disabled selected>Select code</option>';
                codeAVs.forEach(codeAV => {
                        const option = document.createElement('option');
                        option.value = codeAV._id; 
                        option.textContent = codeAV.codeName; 
                        codeAVSelect.appendChild(option);
                });
        } catch (error) {
                console.error('Error loading codeAV:', error);
        }
}
