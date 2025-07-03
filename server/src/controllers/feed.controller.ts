import { request, ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { VideoRepository } from "../repositories/video.repository.js";
import { FilmRepository } from "../repositories/film.repository.js";
import { ImageRepository } from "../repositories/image.repository.js";
import { CreatorRepository } from "../repositories/creator.repository.js";
import { FeedService } from "../services/feed.service.js";
import { AnimeVideoRepository } from "../repositories/anime-video.repository.js";


const _videoRepository = new VideoRepository();
const _filmRepository = new FilmRepository();
const _imageRepository = new ImageRepository();
const _creatorRepository = new CreatorRepository();
const _animeVideoRepository = new AnimeVideoRepository();
const _feedService = new FeedService(
      _videoRepository, _filmRepository, _imageRepository,  _creatorRepository, _animeVideoRepository
);

const GetSectionData = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const type = request.query?.type as string;
            const page = parseInt(request.query?.page as string) || 1;
            const limit = parseInt(request.query?.limit as string) || 10;

            if(!type) {
                  return sendError(response, 400, new Error('Missing "type" query parameters'));
            }
            const sectionData = await _feedService.GetSectionData(type, page, limit);

            return sendResponse(response, 200, sectionData);
      } catch(error) {
            console.error('Error getting section data: ', error);
            return sendError(response, 500, error as Error);
      }
}

const feed_controller = {
      GetSectionData
}
export default feed_controller;

