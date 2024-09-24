import config from './config.js';

// HomePage
fetch(`${config.domain}${config.endpoints.homePage}`)
        .then(response => {
                if(!response.ok) {
                        throw new Error(`HTTP errror! Status: ${ response.status }`);
                }
                return response.json();
        })
        .then(data => {
                // Render data nhận được từ API vào trang HTML
                document.getElementById('homepage-title').innerText = data.title;
                document.getElementById('homepage-desc').innerText = data.description;
                document.getElementById('homepage-content').innerText = data.content;
        })
        .catch(error => {
                console.error('Error fetching homepage data: ', error);

        });

