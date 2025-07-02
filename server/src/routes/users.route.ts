import album_controller from "../controllers/album.controller.js";
import animeVideo_controller from "../controllers/animes/anime-video.controller.js";
import clip_controller from "../controllers/clip.controller.js";
import code_controller from "../controllers/code.controller.js";
import collection_controller from "../controllers/collection.controller.js";
import { creator_controller } from "../controllers/creator.controller.js";
import feed_controller from "../controllers/feed.controller.js";
import { filmController } from "../controllers/film.controller.js";
import idol_controller from "../controllers/idol.controller.js";
import image_controller from "../controllers/image.controller.js";
import { manga_controller } from "../controllers/manga.controller.js";
import playlist_controller from "../controllers/playlist.controller.js";
import record_controller from "../controllers/record.controller.js";
import short_controller from "../controllers/short.controller.js";
import studio_controller from "../controllers/studio.controller.js";
import tag_controller from "../controllers/tag.controller.js";
import video_controller from "../controllers/video.controller.js";
import { Route } from "../interfaces/Route.js";
import { validated_id } from "../middlewares/validate-id.js";
import { createRouter } from "./routes.js";

const user_routes: Route[] = [
      // homepage-feed
      { method: 'GET', path: '/api/feed/section', handler: feed_controller.GetSectionData },
      
      // albums
      { method: 'GET', path: '/api/albums', handler: album_controller.GetAllAlbums },
      // anime-videos
      { method: 'GET', path: '/api/anime-video/:id', handler: validated_id.validateId(animeVideo_controller.GetAnimeVideoById ) },
      // codes
      { method: 'GET', path: '/api/codes/studio/:id', handler: validated_id.validateId(code_controller.GetCodesByStudio) },
      { method: 'GET', path: '/api/codes', handler: code_controller.GetCodes },
      // collections
      { method: 'GET', path: '/api/collections', handler: collection_controller.getCollections },
      // creators
      { method: 'GET', path: '/creators', handler: creator_controller.GetCreators },
      { method: 'GET', path: '/api/creators/tag/:id', handler: validated_id.validateId( creator_controller.GetCreatorByTagId )},
      // clips
      { method: 'GET', path: '/api/clips', handler: clip_controller.GetClips },
      // films
      { method: 'GET', path: '/films', handler: filmController.getFilms },
      { method: 'GET', path: '/films/creator/:id', handler: validated_id.validateId( filmController.FindFIlmsByCreator )},
      { method: 'GET', path: '/films/tag/:id', handler: validated_id.validateId( filmController.FindFilmsByTagId   )},
      { method: 'GET', path: '/films/studio/:id', handler: validated_id.validateId( filmController.FindFilmsByStudio )},
      { method: 'GET', path: '/films/collection/:id', handler: validated_id.validateId( filmController.GetFilmsByCollection )},

      // idols
      { method: 'GET', path: '/api/idols', handler: idol_controller.GetAllIdols },
      
      // images 
      { method: 'GET', path: '/api/images', handler: image_controller.GetAllImages },

      // mangas
      { method: 'GET', path: '/api/mangas', handler: manga_controller.getMangas },
      { method: 'GET', path: '/api/manga/:id', handler: validated_id.validateId( manga_controller.FindMangaById ) },

      // studios
      { method: 'GET', path: '/studios', handler: studio_controller.GetStudios },

      // tags
      { method: 'GET', path: '/api/tags', handler: tag_controller.GetTags },
      { method: 'GET', path: '/api/tags/creator', handler: tag_controller.getTagsByCreator },
      { method: 'GET', path: '/api/tags/film', handler: tag_controller.GetTagsByFilm },
      { method: 'GET', path: '/api/tags/video', handler: tag_controller.getTagsByVideo },
      { method: 'GET', path: '/api/tags/videos/homepage', handler: tag_controller.GetTagsForVideoHomepage },
      { method: 'GET', path: '/api/tags/images', handler: tag_controller.GetTagsByImage },
      { method: 'GET', path: '/api/tags/action', handler: tag_controller.getTagsByAction },
      { method: 'GET', path: '/api/tags/manga', handler: tag_controller.GetTagsByManga },
      // playlist
      { method: 'GET', path: '/api/playlists', handler: playlist_controller.getPlaylists },
      // shorts
      { method: 'GET', path: '/api/shorts', handler: short_controller.GetAllShorts },
      { method: 'GET', path: '/api/shorts/paginated', handler: short_controller.GetPaginationShorts },
      // records
      { method: 'GET', path: '/api/records', handler: record_controller.GetAllRecords },
      { method: 'GET', path: '/api/record/:id', handler: validated_id.validateId(record_controller.GetRecordById) },
      // video
      { method: 'GET', path: '/video/:id', handler: validated_id.validateId(video_controller.findVideoById)},
      { method: 'GET', path: '/videos/creator/:id', handler: validated_id.validateId(video_controller.findVideosByCreatorId)},
      { method: 'PUT', path: '/video/:id/playlists', handler: validated_id.validateId(video_controller.addPlaylistToVideo )},
      { method: 'PUT', path: '/video/view/:id', handler: validated_id.validateId(video_controller.increaseVideoViewsByOne )},
      { method: 'PUT', path: '/video/:id/like', handler: validated_id.validateId(video_controller.increaseVideoLikeByOne )},
      { method: 'GET', path: '/videos/paginated', handler: video_controller.getVIdeosPaginated },
]

export const handleUserRoutes = createRouter(user_routes);