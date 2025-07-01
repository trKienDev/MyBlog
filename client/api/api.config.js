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
            adminAnimePage: '/admin/animes/anime.html',
            adminAnimeStudiosPage: '/admin/animes/anime-studios/anime-studio.html',
            adminAnimeSeriesPage: '/admin/animes/anime-series/anime-series.html',
            adminAnimeTagsPage: '/admin/animes/anime-tags/anime-tag.html',
            adminAnimeFilmsPage: '/admin/animes/anime-films/anime-film.html',
            adminAnimeVideosPage: '/admin/animes/anime-videos/anime-video.html',
            adminAnimeCreateVideosPage: '/admin/animes/anime-videos/create-anime-video.html',
            adminAnimeEditVIdeoPage: '/admin/animes/anime-videos/edit-anime-video.html',
            adminAnimePlaylistPage: '/admin/animes/anime-playlists/anime-playlist.html',
            adminMangaPage: '/admin/mangas/manga.html',
            adminCreateMangaPage: '/admin/mangas/create-manga.html',
            adminCreateMangaTagPage: '/admin/mangas/create-manga-tags.html',

            // section
            tagsSection: '/sections/tags/tags.section.html',
            newVideosSection: '/sections/pagination-videos/pagination-videos.section.html',

            // pages
            playVideoPage: '/pages/play_video/play-video.page.html',

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
            getCodeById: '/admin/code', // GET
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
            updateFilm: '/admin/film', // PUT
            // video
            getVideos: '/admin/videos', // GET
            createVideo: '/admin/video', // POST
            updateVideo: '/admin/video', // PUT
            // playlist
            getPlaylists: '/admin/playlists', // GET
            getPlaylistById: '/admin/playlist', // GET
            createPlaylist: '/admin/playlist', // POST

            // anime-studio
            getAnimeStudioById: '/admin/anime-studio', // GET
            getAnimeStudios: '/admin/anime-studios', // GET
            createAnimeStudio: '/admin/anime-studio', // POST
            // anime-series
            getAnimeSeriesById: '/admin/anime-series', // GET
            getAnimeSeries: '/admin/anime-series', // GET
            createAnimeSeries: '/admin/anime-series', // POST
            // anime-tags
            getAnimeTags: '/admin/anime-tags', // GET
            getAnimeTagById: '/admin/anime-tag', // GET
            getAnimeTagsByFilm: '/admin/anime-tags/film', // GET'
            getAnimeTagsByAction: '/admin/anime-tags/action', // GET
            getAnimeVideoTags: '/admin/anime-tags/video', // GET
            createAnimeTag: '/admin/anime-tag', // POST
            // anime-films
            getAnimeFilms: '/admin/anime-films', // GET
            getAnimeFilmById: '/admin/anime-film', // GET
            createAnimeFilm: '/admin/anime-film', // POST
            updateAnimeFilm: '/admin/anime-film', // PUT
            // anime-playlist
            getAnimePlaylists: '/admin/anime-playlists', // GET
            getAnimePlaylistById: '/admin/anime-playlist', // GET
            createAnimePlaylist: '/admin/anime-playlist', // POST 
            // anime-video
            getAnimeVideos: '/admin/anime-videos', // GET
            createAnimeVideo: '/admin/anime-video', // POST
            updateAnimeVideo: '/admin/anime-video', // PUT

            // manga
            getMangas: '/admin/mangas', // GET
            initializeManga: '/admin/manga', // POST
            addImgsToInitializedManga: '/admin/manga/images', // PUT
            // manga-tag
            getMangaTags: '/admin/manga-tags', // GET
            createMangaTag: '/admin/manga-tag', // POST
      }
}

export default api_configs;  