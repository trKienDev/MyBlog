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
      // tag
      getTagsByFilm: '/admin/tags/film', // GET
      
}
export const api_user = {
      // creators
      getCreators : '/creators', // GET
      getCreatorsByTagId: '/api/creators/tag', // GET
      // code
      GetCodesByStudio: '/api/codes/studio', // GET
      // collections
      getCollections: '/api/collections', // GET
      // films
      getFilmsByCreatorId : '/films/creator', // GET
      getFilms: '/films', // GET
      getFilmsByStudioId: '/films/studio', // GET
      getFilmsByTagId: '/films/tag', // GET
      getFilmsByCollection: '/films/collection', // GET  
      //playlist
      getPlaylists: '/api/playlists', // GET
      // tags
      addPlaylistsToVideo: '/video/playlists', // PUT
      getTagsByCreator: '/api/tags/creator', // GET
      getTagsByFilm: '/api/tags/film', // GET
      getTagsByVideo: '/api/tags/video', // GET
      getTagsByVideoHomepage: '/api/tags/videos/homepage', // GET
      getTagsByImages: '/api/tags/images', // GET
      // videos
      getVideoById: '/video', // GET
      getVideosByCreatorId: '/videos/creator', // GET
      increaseVideoViewsByOne: '/video/view', // PUT
      GetPaginatedVideos: '/videos/paginated', // GET
      // studios
      GetStudios: '/studios', // GET
      // idols
      getAllIdols: '/api/idols', // GET
}
