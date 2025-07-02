import { title } from "process";
import Film from "../models/film.model.js";
import Video from "../models/video.model.js";
import { iFeedRepository } from "./interfaces/ifeed.repository.js";
import { iFilmRepository } from "./interfaces/ifilm.repository.js";
import { iVideoRepository } from "./interfaces/ivideo.repository.js";

export class FeedRepository implements iFeedRepository {
      private readonly _videoRepository: iVideoRepository;
      private readonly _filmRepository: iFilmRepository;

      constructor(
            videoRepository: iVideoRepository,
            filmRepository: iFilmRepository,
      ) {
            this._videoRepository = videoRepository;
            this._filmRepository = filmRepository;
      }

      private GetSectionBlueprints() {
            return {
                  'videos': {
                        title: 'Latest videos',
                        fetchData: () => this._videoRepository.GetLatestVideos()
                  },
                  'films': {
                        title: 'Latest films',
                        fetchData: () => this._filmRepository.GetLatestFilms()
                  }
            }
      }


      /**
       * Lấy dữ liệu cho nhiều section cùng lúc một cách song song
       * @param types - Mảng các loại section cần lấy, ví dụ: ['videos', 'films']
      */
      public async FetchSectionsData(media_types: string[]): Promise<any[]> {
            const blueprints = this.GetSectionBlueprints();
            console.log('media type in repository: ', media_types);
            // Tạo 1 mảng các promise truy vấn CSDL
            const data_promises = media_types.map(media_type => {
                  const blueprint = blueprints[media_type as keyof typeof blueprints];
                  if(!blueprint) {
                        // trả về promises rỗng nếu loại section ko được định nghĩa
                        return Promise.resolve({ media_type, title: `Unknown type: ${media_type}`, data: []});
                  }
                  return blueprint.fetchData().then(data => ({
                        media_type,
                        title: blueprint.title,
                        data // Dữ liệu thô từ CSDL
                  }));
            });   

            // Thực thi tất cả promise song song
            return Promise.all(data_promises);
      }
}