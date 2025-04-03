const apiConfig = {
      server: 'http://localhost:3000',
      client: 'http://localhost:8081',  // Domain của frontend
      apiVersion: 'v1',
      endpoints: {
            // pages
            adminPage: '/admin',
            adminPages: 'admin/pages',
            settingPage: '/admin/pages/setting.html', 
            filmPage: '/admin/pages/films/films.html', 
            adminCreatorPage: '/admin/creators/creator.html',
            adminStudioPage: '/admin/studios/studio.html',
            adminTagPage: '/admin/tags/tag.html',
            adminCodePage: '/admin/codes/code.html',
            adminFilmPage: '/admin/films/film.html',
            
            // creator
            getCreators: '/admin/creators', // GET
            createCreator: '/admin/creator', // POST
            updateCreator: '/admin/creator', // PUT
            deleteCreator: '/admin/creator',
            
            // studio
            getStudios: '/admin/studios', // GET
            createStudio: '/admin/studio', // POST
            updateStudio: '/admin/studio', // PUT
            deleteStudio: '/admin/studio', // DELETE
            
            // tag
            getTags: '/admin/tags', // GET
            getFilmTags: '/admin/tags/film', // GET
            createTag: '/admin/tag', // POST
            
            //code
            getCodes: '/admin/codes', // GET
            getCodesByStudio: '/admin/codes/studio', // GET
            createCode: '/admin/code', // POST
            
            // collection
            createCollection: '/admin/collection', // POST
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
            videoGetById: '/admin/video/get_video_by_id',
            videoUpdate: '/admin/video/update',
            videoDelete: '/admin/video/delete',
            // film
            filmCreate: '/admin/film/create',
            filmList: '/admin/film/read',
            filmUpdate: '/admin/film/update',
            filmDelete: '/admin/film/delete',
            // story
            storyCreate: '/admin/story/create',
            storyGet: '/admin/story/get',
            storyList: '/admin/story/read',
            storyUpdate: '/admin/story/update',
            storyDelete: '/admin/story/delete',
            tagList: '/admin/tags/read',
            getFilmByTagId: '/film/tag',
            getFilmById: '/film/id',
            videoGetById: '/admin/video/get_video_by_id',
      }
}

export default apiConfig;  