import ClientPages from "../constants/client-pages.constant.js";
import { CollectionInforPageController } from "../pages/collection_info/collection-info.page.js";
import { creatorInforController } from "../pages/creator_info/creator-info.page.js";
import { MangaInforPageController } from "../pages/manga_info/manga-infor.page.js";
import { PlaylistInforPageController } from "../pages/playlist_info/playlist-info.page.js";
import { playVideoPageController } from "../pages/playvideo/play-video.page.js";
import { StudioInforController } from "../pages/studios_info/studio-info.page.js";
import { TagInforController } from "../pages/tag_info/tag-infor.page.js";

export const router_config = {
      'video': (id) => ({
            endpoint: ClientPages.PLAYVIDEO, 
            media_id: id,           
            url: `/watch?video=${id}`,
            state: { page: 'watch', videoId: id },
            title: `Watching ${id}`,
            callback: playVideoPageController,
      }),
      'creator': (id) => ({
            endpoint: ClientPages.CREATORINFO, 
            media_id: id,           
            url: `/info?creator=${id}`,
            state: { page: 'infor', creatorId: id },
            title: `Looking ${id}`,
            callback: creatorInforController,
      }),
      'studio': (id) => ({
            endpoint: ClientPages.STUDIOINFO,
            media_id: id,
            url: `/info?studio=${id}`,
            state: { page: 'infor', studioId: id },
            title: `Looking ${id}`,
            callback: StudioInforController,
      }),
      'tag': (id) => ({
            endpoint: ClientPages.TAGINFO,
            media_id: id,
            url: `/info?tag=${id}`,
            state: { page: 'infor', tagId: id },
            title: `Looking ${id}`,
            callback: TagInforController,
      }),
      'collection': (id) => ({
            endpoint: ClientPages.COLLECTIONINFO,
            media_id: id,
            url: `/info?collection=${id}`,
            state: { page: 'infor', collectionId: id },
            title: `Looking ${id}`,
            callback: CollectionInforPageController,
      }),
      'playlist': (id) => ({
            endpoint: ClientPages.PLAYLISTINFO,
            media_id: id,
            url: `/info?playlist=${id}`,
            state: { page: 'infor', playlistId: id },
            title: `Looking ${id}`,
            callback: PlaylistInforPageController,
      }),
      'manga': (id) => ({
            endpoint: ClientPages.MANGAINFO,
            media_id: id,
            url: `/info?manga=${id}`,
            state: { page: 'infor', mangaId: id },
            title: `Looking ${id}`,
            callback: MangaInforPageController,
      }),
}