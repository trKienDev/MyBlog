const config = {
        domain: 'http://localhost:3000',
        // backendDomain: 'http://localhost:3000',  // Domain của backend
        frontendDomain: 'http://localhost:8081',  // Domain của frontend
        apiVersion: 'v1',
        endpoints: {
                // tag
                tagList: '/admin/tags/read',
                getFilmByTagId: '/film/tag',
        }
}

export default config;  