const config = {
        domain: 'http://localhost:3000',
        // backendDomain: 'http://localhost:3000',  // Domain của backend
        frontendDomain: 'http://localhost:8081',  // Domain của frontend
        apiVersion: 'v1',
        endpoints: {
                // pages
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
                // studio
                studioList: '/admin/studio/read',
                studioCreate: '/admin/studio/create',
                studioUpdate: '/admin/studio/update',
                studioDelete: '/admin/studio/delete',
                //codeAV
                codeAVList: '/admin/codeAV/read',
                codeAVCreate: '/admin/codeAV/create',
                codeAVUpdate: '/admin/codeAV/update',
                codeAVDelete: '/admin/codeAV/delete',
                // tags
                tagList: '/admin/tags/read',
                tagVideoList: '/admin/tags/video_read',
                tagCreate: '/admin/tags/create',
                tagUpdate: '/admin/tags/update',
                tagDelete: '/admin/tags/delete',
                // video
                videoCreate: '/admin/video/create',
                // film
                filmCreate: '/admin/film/create',
        }
}

export default config;  