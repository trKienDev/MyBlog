import { IncomingMessage, request, ServerResponse } from "http";
import { AlbumRepository } from "../repositories/album.repository.js";
import { AlbumService } from "../services/album.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";

const _albumRepository = new AlbumRepository();
const _albumService = new AlbumService(_albumRepository);

const GetAllAlbums = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const albums = await _albumRepository.FindAll();
            return sendResponse(response, 200, albums);
      } catch(error) {
            console.error('Error getting all albums: ', error);
            return sendError(response, 500, error);
      }
}

const CreateAlbum = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const created_album = await _albumService.CreateAlbum(request);
            return sendResponse(response, 200, created_album);
      } catch(error) {
            console.error('Error creating album: ', error);
            return sendError(response, 500, error);
      }
}

const album_controller = {
      GetAllAlbums,
      CreateAlbum,
}
export default album_controller;