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
      // tags
      addPlaylistsToVideo: '/video/playlists', // PUT
      getTagsByCreator: '/tags/creator', // GET
      // videos
      getVideoById: '/video', // GET
      getVideosByCreatorId: '/videos/creator', // GET
      increaseVideoViewsByOne: '/video/view', // PUT
}
