import { iAnimeVideoRepository } from "../repositories/interfaces/ianime-video.repository.js";
import { iCreatorRepository } from "../repositories/interfaces/icreator.repository.js";
import { iFilmRepository } from "../repositories/interfaces/ifilm.repository.js";
import { iImageRepository } from "../repositories/interfaces/iimage.repository.js";
import { iVideoRepository } from "../repositories/interfaces/ivideo.repository.js";

export class FeedService {
      private _videoRepository: iVideoRepository;
      private _filmRepository: iFilmRepository;
      private _imageRepository: iImageRepository;
      private _creatorRepository: iCreatorRepository;
      private _animeVideoRepository: iAnimeVideoRepository;
      constructor(
            videoRepository: iVideoRepository,
            filmRepository: iFilmRepository,
            imageRepository: iImageRepository,
            creatorRepository: iCreatorRepository,
            animeVideoRepository: iAnimeVideoRepository,
      ) {
            this._videoRepository = videoRepository;
            this._filmRepository = filmRepository;
            this._imageRepository = imageRepository;
            this._creatorRepository = creatorRepository;
            this._animeVideoRepository = animeVideoRepository;
      }

      public async getSectionData(type: string, page: number, limit: number, seed: string): Promise<any> {
            let data;
            let pagination;

            switch(type) {
                  case 'videos': 
                        const homepageFeedsVideos = await this._videoRepository.getHomepageFeedsVideosPagination(page, limit = 4, {}, seed);
                        data = homepageFeedsVideos.videos;
                        pagination = { page: page, limit: limit, total: homepageFeedsVideos.total }
                        break;
                  case 'films':
                        const homepageFeedsFilms = await this._filmRepository.findRandomizedPaginated(page, limit = 8, {}, seed);
                        data = homepageFeedsFilms.films;
                        pagination = { page: page, limit: limit, total: homepageFeedsFilms.total }
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