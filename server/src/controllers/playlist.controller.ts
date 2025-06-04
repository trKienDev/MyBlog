import { IncomingMessage, ServerResponse } from "http";
import { PlayLIstRepository } from "../repository/playlist.repository.js";
import { PlaylistService } from "../services/playlist.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";

const playlist_repository = new PlayLIstRepository();
const playlist_service = new PlaylistService(playlist_repository);

const getPlaylists = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const playlists = await playlist_repository.getPlaylists();
            return sendResponse(res, 200, playlists);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const findTagById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const playlist = await playlist_repository.findById(id);
            
            if(playlist == null) {
                  return sendError(res, 404, 'playlist not found');
            }

            return sendResponse(res, 200, playlist);
      } catch(error) {
            return sendError(res, 500, error);
      }
}

const createPlaylist = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const created_playlist = await playlist_service.createPlaylist(req);
            sendResponse(res, 200, created_playlist);
      } catch(error) {
            console.error('error in createPlaylist - playlist.controller: ', error);
            return sendError(res, 500, error);
      }
}

const playlist_controller = {
      getPlaylists,
      findTagById,
      createPlaylist,
};
export default playlist_controller;
