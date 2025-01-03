import { errorSweetAlert, showToastNotification } from '../admin/services/module/sweetAlert.js';
import config from '../admin/services/config.js';
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
        console.error('Error fetching homepage data: ', error);1
});

export function buildUrl(endpoint) {
        return `${config.domain}${endpoint}`;
}

export async function fetchAPI(endpoint, options = {}) {
        const url = buildUrl(endpoint);
        const response = await fetch(url, options);

        if(!response.ok) {
                const errorData = await response.json();
                showToastNotification("fail", "fail to read tag name");
                throw new Error(errorData.message || `HTTP error: ${response.status }`);
        }

        return response;
} 

export async function postAPI(endpoint, body) {
        const defaultHeaders = body instanceof FormData ? {} : { 'Content-Type': 'application/json' };

        return fetchAPI(endpoint, {
                method: "POST",
                header: {
                        defaultHeaders,
                },
                body: body instanceof FormData ? body : JSON.stringify(body),
        });
}


export async function putAPI(endpoint, body) {
        const defaultHeaders = body instanceof FormData ? {} : { 'Content-Type': 'application/json' };

        return fetchAPI(endpoint, {
                method: "PUT",
                header: {
                        defaultHeaders,
                },
                body: body instanceof FormData ? body : JSON.stringify(body),
        });
}

export async function deleteAPI(endpoint) {
        return fetchAPI(endpoint, {
                method: "DELETE",
        });
}