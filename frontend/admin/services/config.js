const config = {
        domain: 'http://localhost:3000',
        // backendDomain: 'http://localhost:3000',  // Domain của backend
        frontendDomain: 'http://localhost:8081',  // Domain của frontend
        apiVersion: 'v1',
        endpoints: {
                adminPage: '/admin',
                adminPages: 'admin/pages',
                sidebarList: '/admin/sidebar',
                sidebarDelete: '/admin/side/delete',
                settingPage: '/admin/pages/setting.html', 
        }
}

export default config;  