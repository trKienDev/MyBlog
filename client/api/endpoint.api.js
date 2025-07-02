export const api_admin = {
      // collection
      getCollections: '/admin/collections', // GET
      // idol
      createIdol: '/admin/idol', // POST
      // images
      createImage: '/admin/image', // POST
      // studios
      getStudios: '/admin/studios', // GET
      createStudio: '/admin/studio', // POST
      // short
      createShort: '/admin/short', // POST
      // tag
      getTagsByFilm: '/admin/tags/film', // GET
      createTag: '/admin/tag', // POST
      // record
      createRecord: '/admin/record', // POST
      // clip 
      createClip: '/admin/clip', // POST
      // albums
      createAlbum: '/admin/album', // POST
}
export const api_user = {
      // albums
      getAllAlbums: '/api/albums', // GET
      // anime videos
      GetAnimeVideoById: '/api/anime-video/', // GET
      // creators
      getCreators : '/creators', // GET
      getCreatorsByTagId: '/api/creators/tag', // GET
      // code
      GetCodesByStudio: '/api/codes/studio', // GET
      getCodes: '/api/codes', // GET
      // collections
      getCollections: '/api/collections', // GET
      // clips 
      getAllClips: '/api/clips', // GET
      // films
      getFilmsByCreatorId : '/films/creator', // GET
      getFilms: '/films', // GET
      getFilmsByStudioId: '/films/studio', // GET
      getFilmsByTagId: '/films/tag', // GET
      getFilmsByCollection: '/films/collection', // GET
      // idols
      getAllIdols: '/api/idols', // GET
      // images
      getAllImages: '/api/images', // GET  
      // mangas
      getAllMangas: '/api/mangas', // GET
      findMangaById: '/api/manga', // GET
      //playlist
      getPlaylists: '/api/playlists', // GET
      // shorts
      getAllShorts: '/api/shorts', // GET 
      GetPaginatedShort: '/api/shorts/paginated', // GET
      // records
      getAllRecords: '/api/records', // GET
      getRecordById: '/api/record', // GET
      // studios
      GetStudios: '/studios', // GET
      // tags
      getAllTags: '/api/tags', // GET
      addPlaylistsToVideo: '/video/playlists', // PUT
      getTagsByCreator: '/api/tags/creator', // GET
      getTagsByFilm: '/api/tags/film', // GET
      getTagsByVideo: '/api/tags/video', // GET
      getTagsByVideoHomepage: '/api/tags/videos/homepage', // GET
      getTagsByImages: '/api/tags/images', // GET
      getTagsByAction: '/api/tags/action', // GET
      getTagsByManga: '/api/tags/manga', // GET
      // videos
      getVideoById: '/video', // GET
      getVideosByCreatorId: '/videos/creator', // GET
      increaseVideoViewsByOne: '/video/view', // PUT
      GetPaginatedVideos: '/videos/paginated', // GET
      // homepage feeds
      fetchHomepageFeeds: '/api/homepage-feeds', // GET
      fetchSectionData: '/api/feed/section', // GET
}
