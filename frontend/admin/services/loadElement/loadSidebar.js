import config from '../config.js';

// Function to fetch and render sidebar items
export function RenderSidebar() {
    fetch(`${config.domain}${config.endpoints.sidebarList}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parse response as JSON
        })
        .then(sidebarItems => {
            // Get the sidebar list container
            const menuList = document.getElementById('sidebar-list');

            // Clear any existing items
            menuList.innerHTML = '';

            // Loop through the sidebar items and create DOM elements
            sidebarItems.forEach(item => {
                const menuItem = document.createElement('a');
                menuItem.classList.add('sidebar-item');
                menuItem.href = item.name; // Set the href to the item's name (or URL)

                const menuItemIcon = document.createElement('div');
                menuItemIcon.classList.add('sidebar-item-icon');

                const iconElement = document.createElement('i');
                iconElement.className = item.icon; // Assign the icon class from the API
                menuItemIcon.appendChild(iconElement); // Add the icon to the icon container

                const menuItemName = document.createElement('div');
                menuItemName.classList.add('sidebar-item-name');

                const nameElement = document.createElement('span');
                nameElement.textContent = item.name; // Set the item's name
                menuItemName.appendChild(nameElement); // Add the name to the name container

                // Append the icon and name containers to the main menu item
                menuItem.appendChild(menuItemIcon);
                menuItem.appendChild(menuItemName);

                // Append the entire menu item to the sidebar list
                menuList.appendChild(menuItem);
            });
        })
        .catch(error => {
            console.error('Error fetching sidebar items:', error);
        });
}

// Call the function to fetch and render the sidebar items
RenderSidebar();
