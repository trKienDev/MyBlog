import { iCreatorRepository } from "../repositories/interfaces/icreator.repository.js";
import { iFilmRepository } from "../repositories/interfaces/ifilm.repository.js";
import { iImageRepository } from "../repositories/interfaces/iimage.repository.js";
import { iVideoRepository } from "../repositories/interfaces/ivideo.repository.js";

export class FeedService {
      private _videoRepository: iVideoRepository;
      private _filmRepository: iFilmRepository;
      private _imageRepository: iImageRepository;
      private _creatorRepository: iCreatorRepository;
      constructor(
            videoRepository: iVideoRepository,
            filmRepository: iFilmRepository,
            imageRepository: iImageRepository,
            creatorRepository: iCreatorRepository,
      ) {
            this._videoRepository = videoRepository;
            this._filmRepository = filmRepository;
            this._imageRepository = imageRepository;
            this._creatorRepository = creatorRepository;
      }

      public async GetSectionData(type: string, page: number, limit: number): Promise<any> {
            let data;
            let pagination;

            switch(type) {
                  case 'videos': 
                        const paginationVideos = await this._videoRepository.GetVideosPagination(page, limit = 4, {});
                        data = paginationVideos.videos;
                        pagination = {
                              page: page,
                              limit: limit,
                              total: paginationVideos.total
                        }
                        break;
                  case 'films': 
                        const paginationFilms = await this._filmRepository.GetFilmsPagination(page, limit = 8, {});
                        data = paginationFilms.films;
                        pagination = {
                              page: page,
                              limit: limit,
                              total: paginationFilms.total
                        }
                        break;
                  case 'images':
                        const paginationImages = await this._imageRepository.GetImagesPagination(page, limit, {});
                        data = paginationImages.images;
                        pagination = {
                              page: page,
                              limit: limit,
                              total: paginationImages.total
                        }
                        break;
                  case 'creators':
                        const paginationCreators = await this._creatorRepository.GetCreatorsPagination(page, limit, {});
                        data = paginationCreators.creators;
                        pagination = {
                              page: page,
                              limit: limit,
                              total: paginationCreators.total
                        }
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