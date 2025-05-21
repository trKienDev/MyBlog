import { IncomingMessage, ServerResponse } from "http";
import { MangaTagRepository } from "../../repository/mangas/manga-tag.repository.js";
import { MangaTagService } from "../../services/mangas/manga-tag.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";

const repository = new MangaTagRepository();
const service = new MangaTagService(repository);

const getMangaTags = async(request: IncomingMessage, response: ServerResponse) => {
      try { 
            const manga_tags = await repository.getMangaTags();
            return sendResponse(response, 200, manga_tags);
      } catch(error) {
            console.error('Error getting manga tags: ', error);
            sendError(response, 500, error);
      }
}

const createMangaTag = async(request: IncomingMessage, response: ServerResponse) => {
      try { 
            const created_mangaTag = await service.createMangaTag(request)
            return sendResponse(response, 200, created_mangaTag);
      } catch(error) {
            console.error('Error creating manga tag', error);
            return sendError(response, 500, error);
      }
}

const mangaTag_controller = {
      getMangaTags,
      createMangaTag,
}
export default mangaTag_controller;