const config = {
        domain: 'http://localhost:3000',
        // backendDomain: 'http://localhost:3000',  // Domain của backend
        frontendDomain: 'http://localhost:8081',  // Domain của frontend
        apiVersion: 'v1',
        endpoints: {
                adminPage: '/admin',
                adminPages: 'admin/pages',
                settingPage: '/admin/pages/setting.html', 
                // sidebar page
                sidebarList: '/admin/sidebar/read',
                sidebarCreate: '/admin/sidebar/create',
                sidebarDelete: '/admin/sidebar/delete',
                sidebarUpdate: '/admin/sidebar/update',

                // actress
                actressList: '/admin/actress/read',
                actressCreate: '/admin/actress/create',
                actressUpdate: "/admin/actress/update", 
                actressDelete: '/admin/actress/delete',
        }
}

export default config;  