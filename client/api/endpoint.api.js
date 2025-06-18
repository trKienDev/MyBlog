export const api_admin = {
      // collection
      getCollections: '/admin/collections', // GET
      // studios
      getStudios: '/admin/studios', // GET
      createStudio: '/admin/studio', // POST
      // tag
      getTagsByFilm: '/admin/tags/film', // GET
      
}
export const api_user = {
      // creators
      getCreators : '/creators', // GET
      getPlaylists: '/playlists', // GET
      // films
      getFilmsByCreatorId : '/films/creator', // GET
      getFilms: '/films', // GET
      getFilmsByStudioId: '/films/studio', // GET
      // tags
      addPlaylistsToVideo: '/video/playlists', // PUT
      getTagsByCreator: '/api/tags/creator', // GET
      getTagsByFilm: '/api/tags/film', // GET
      getTagsByVideo: '/api/tags/video', // GET
      // videos
      getVideoById: '/video', // GET
      getVideosByCreatorId: '/videos/creator', // GET
      increaseVideoViewsByOne: '/video/view', // PUT
      GetPaginatedVideos: '/videos/paginated', // GET
      // studios
      GetStudios: '/studios', // GET
      // code
      GetCodesByStudio: '/api/codes/studio', // GET
}
