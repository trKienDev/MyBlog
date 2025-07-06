import { request, ServerResponse } from "http";
import { sendError, sendResponse } from "../middlewares/response.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { VideoRepository } from "../repositories/video.repository.js";
import { FilmRepository } from "../repositories/film.repository.js";
import { ImageRepository } from "../repositories/image.repository.js";
import { CreatorRepository } from "../repositories/creator.repository.js";
import { FeedService } from "../services/feed.service.js";
import { AnimeVideoRepository } from "../repositories/anime-video.repository.js";
import { AnimeFilmRepository } from "../repositories/anime-film.repository.js";
import { MangaRepository } from "../repositories/manga.repository.js";
import { ShortRepository } from "../repositories/short.repository.js";
import { IdolRepository } from "../repositories/idol.repository.js";
import { ClipRepository } from "../repositories/clip.repository.js";


const _videoRepository = new VideoRepository();
const _filmRepository = new FilmRepository();
const _imageRepository = new ImageRepository();
const _creatorRepository = new CreatorRepository();
const _animeVideoRepository = new AnimeVideoRepository();
const _animeFilmRepository = new AnimeFilmRepository();
const _mangaRepository = new MangaRepository();
const _shortRepository = new ShortRepository();
const _idolRepository = new IdolRepository();
const _clipRepository = new ClipRepository();

const _feedService = new FeedService(
      _videoRepository, _filmRepository, _imageRepository,  _creatorRepository, _animeVideoRepository,
      _animeFilmRepository, _mangaRepository, _shortRepository, _idolRepository, _clipRepository
);

const getSectionData = async(request: CustomRequest, response: ServerResponse) => {
      try {
            const type = request.query?.type as string;
            const page = parseInt(request.query?.page as string) || 1;
            const limit = parseInt(request.query?.limit as string) || 10;
            const seed = request.query?.seed as string; // Lấy seed hoặc dùng giá trị mặc định
            if(!type) {
                  return sendError(response, 400, new Error('Missing "type" query parameters'));
            }
            const sectionData = await _feedService.getSectionData(type, page, limit, seed);

            return sendResponse(response, 200, sectionData);
      } catch(error) {
            console.error('Error getting section data: ', error);
            return sendError(response, 500, error as Error);
      }
}

const feed_controller = {
      getSectionData
}
export default feed_controller;

