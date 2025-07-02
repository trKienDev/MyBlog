import { IncomingMessage, ServerResponse } from "http";
import { PlaylistService } from "../services/playlist.service.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { PlaylistRepository } from "../repositories/playlist.repository.js";

const _playlistRepository = new PlaylistRepository();
const _playlistService = new PlaylistService(_playlistRepository);

const getPlaylists = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const playlists = await _playlistRepository.getPlaylists();
            return sendResponse(response, 200, playlists);
      } catch(error) {
            console.error('Error getting playlist: ', error);
            return sendError(response, 500, error);
      }
}

const findTagById = async(request: ValidateIdRequest, response: ServerResponse) => {
      try {
            const id = request.params?.id;
            const playlist = await _playlistRepository.findById(id);
            
            if(playlist == null) {
                  return sendError(response, 404, 'playlist not found');
            }

            return sendResponse(response, 200, playlist);
      } catch(error) {
            console.error('Error finding tag by id: ', error);
            return sendError(response, 500, error);
      }
}

const createPlaylist = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const created_playlist = await _playlistService.createPlaylist(request);
            sendResponse(response, 200, created_playlist);
      } catch(error) {
            console.error('error in createPlaylist - playlist.controller: ', error);
            return sendError(response, 500, error);
      }
}

const playlist_controller = {
      getPlaylists,
      findTagById,
      createPlaylist,
};
export default playlist_controller;
