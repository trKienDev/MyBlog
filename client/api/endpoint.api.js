export const api_admin = {
      // collection
      getCollections: '/admin/collections', // GET
      // studios
      getStudios: '/admin/studios', // GET

      // tag
      getTagsByFilm: '/admin/tags/film', // GET
      
}
export const api_user = {
      // videos
      getVideoById: '/video', // GET
      getVideosByCreatorId: '/videos/creator', // GET
      increaseVideoViewsByOne: '/video/view', // PUT
      // creators
      getCreators : '/creators', // GET
      getPlaylists: '/playlists', // GET
      // tags
      addPlaylistsToVideo: '/video/playlists', // PUT
}

