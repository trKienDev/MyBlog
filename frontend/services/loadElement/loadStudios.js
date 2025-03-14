import adminApiConfig3 from "../../admin/adminApiConfig";

export async function loadStudios(studioElement) {
        try {
                const response = await fetch(`${adminApiConfig3.backendDomain}${adminApiConfig3.endpoints.studioList}`) ;
                if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                }
                
                const studios = await response.json();
                const studioSelect = document.getElementById(studioElement);
                studioSelect.innerHTML = '<option value="" disabled selected>Select studio</option>';
                studios.forEach(studio => {
                        const option = document.createElement('option');
                        option.value = studio._id; 
                        option.textContent = studio.name; 
                        studioSelect.appendChild(option);

                });

        } catch (error) {
                console.error('Error loading studios:', error);
        }
}
