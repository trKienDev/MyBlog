const api_configs = {
      server: 'http://localhost:3000',
      client: 'http://localhost:8081',  // Domain của frontend
      apiVersion: 'v1',
      endpoints: {
            // pages
            adminPage: '/admin',
            adminPages: 'admin/pages',
            adminCreatorPage: '/admin/creators/creator.html',
            adminStudioPage: '/admin/studios/studio.html',
            adminTagPage: '/admin/tags/tag.html',
            adminCodePage: '/admin/codes/code.html',
            adminFilmPage: '/admin/films/film.html',
            adminCollectionPage: '/admin/collections/collection.html',
            adminVideoPage: '/admin/videos/video.html',
            adminCreateVideoPage: '/admin/videos/create-video.html',
            adminEditVideoPage: '/admin/videos/edit-video.html',
            adminPlaylistPage: '/admin/playlists/playlist.html',
            // section
            tagsSection: '/sections/tags/tags.section.html',
            // creator
            getCreators: '/admin/creators', // GET
            getCreatorById: '/admin/creator', // GET
            createCreator: '/admin/creator', // POST
            updateCreator: '/admin/creator', // PUT
            deleteCreator: '/admin/creator',
            // studio
            getStudios: '/admin/studios', // GET
            getStudioById: '/admin/studio', // GET
            createStudio: '/admin/studio', // POST
            updateStudio: '/admin/studio', // PUT
            deleteStudio: '/admin/studio', // DELETE
            // tag
            getTags: '/admin/tags', // GET
            getTagById: '/admin/tag', // GET
            getFilmTags: '/admin/tags/film', // GET
            getTagsByAction: '/admin/tags/action', // GET
            getTagsByVideo: '/admin/tags/video', // GET
            createTag: '/admin/tag', // POST
            //code
            getCodes: '/admin/codes', // GET
            getCode_byId: '/admin/code', // GET
            getCodesByStudio: '/admin/codes/studio', // GET
            createCode: '/admin/code', // POST
            // collection
            getCollection_byId: '/admin/collection', // GET
            getCollections: '/admin/collections', // GET
            createCollection: '/admin/collection', // POST
            // film
            getFilms: '/admin/films', // GET
            findFilmById: '/admin/film', // GET
            findFilmsByStudioCode: '/admin/films/studio-code', // GET
            createFilm: '/admin/film', // POST
            update_film: '/admin/film', // PUT
            // video
            getVideos: '/admin/videos', // GET
            createVideo: '/admin/video', // POST
            updateVideo: '/admin/video', // PUT
            // playlist
            getPlaylists: '/admin/playlists', // GET
            getPlaylistById: '/admin/playlist', // GET
            createPlaylist: '/admin/playlist', // POST



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

export default api_configs;  