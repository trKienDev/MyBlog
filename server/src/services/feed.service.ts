import { iAnimeFilmRepository } from "../repositories/interfaces/ianime-film.repository.js";
import { iAnimeVideoRepository } from "../repositories/interfaces/ianime-video.repository.js";
import { iCreatorRepository } from "../repositories/interfaces/icreator.repository.js";
import { iFilmRepository } from "../repositories/interfaces/ifilm.repository.js";
import { iImageRepository } from "../repositories/interfaces/iimage.repository.js";
import { iMangaRepository } from "../repositories/interfaces/imanga.repository.js";
import { iVideoRepository } from "../repositories/interfaces/ivideo.repository.js";

export class FeedService {
      private _videoRepository: iVideoRepository;
      private _filmRepository: iFilmRepository;
      private _imageRepository: iImageRepository;
      private _creatorRepository: iCreatorRepository;
      private _animeVideoRepository: iAnimeVideoRepository;
      private _animeFilmRepository: iAnimeFilmRepository;
      private _mangaRepository: iMangaRepository;
      constructor(
            videoRepository: iVideoRepository,
            filmRepository: iFilmRepository,
            imageRepository: iImageRepository,
            creatorRepository: iCreatorRepository,
            animeVideoRepository: iAnimeVideoRepository,
            animeFilmRepository: iAnimeFilmRepository,
            mangaRepository: iMangaRepository,
      ) {
            this._videoRepository = videoRepository;
            this._filmRepository = filmRepository;
            this._imageRepository = imageRepository;
            this._creatorRepository = creatorRepository;
            this._animeVideoRepository = animeVideoRepository;
            this._animeFilmRepository = animeFilmRepository;
            this._mangaRepository = mangaRepository;
      }

      public async getSectionData(type: string, page: number, limit: number, seed: string): Promise<any> {
            let data;
            let pagination;

            switch(type) {
                  case 'videos': 
                        const videosHomepageFeeds = await this._videoRepository.getHomepageFeedsVideosPagination(page, limit = 4, {}, seed);
                        data = videosHomepageFeeds.videos;
                        pagination = { page: page, limit: limit, total: videosHomepageFeeds.total }
                        break;
                  case 'films':
                        const filmsHomepageFeeds = await this._filmRepository.findRandomizedPaginated(page, limit = 8, {}, seed);
                        data = filmsHomepageFeeds.films;
                        pagination = { page: page, limit: limit, total: filmsHomepageFeeds.total }
                        break;
                  case 'anime_videos': 
                        const animeVideosHomepageFeeds = await this._animeVideoRepository.findRandomizePaginated(page, limit = 4, {}, seed);
                        data = animeVideosHomepageFeeds.animeVideos;
                        pagination = { page: page, limit: limit, total: animeVideosHomepageFeeds.total }
                        break;
                  case 'anime_films':
                        const animeFilmsHomepageFeeds = await this._animeFilmRepository.findRandomizePaginated(page, limit = 8, {}, seed);
                        data = animeFilmsHomepageFeeds.animeFilms;
                        pagination = { page: page, limit: limit, total: animeFilmsHomepageFeeds.total }
                        break;
                  case 'mangas': 
                        const mangasHomepageFeeds = await this._mangaRepository.findRandomizePaginated(page, limit = 8, {}, seed);
                        data = mangasHomepageFeeds.mangas;
                        pagination = { page: page, limit: limit, total: mangasHomepageFeeds.total }
                        break;
                  case 'images': 
                        const imagesHomepageFeeds = await this._imageRepository.findRandomizePaginated(page, limit = 8, {}, seed);
                        data = imagesHomepageFeeds.images;
                        pagination = { page: page, limit: limit, total: imagesHomepageFeeds.total }
                        break;
                  default: // Nếu type ko hỗ trợ --> trả về section rỗng
                        return {
                              title: `Unsupported type: ${type}`,
                              data: [],
                              total: 0
                        };
            }

            return { 
                  type,
                  title: `More ${type}`,
                  data: data || [],
                  pagination
            }
      }
}