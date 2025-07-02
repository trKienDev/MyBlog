import { IncomingMessage, ServerResponse } from "http";
import { AnimePlaylistRepository } from "../repositories/anime-playlist.repository.js";
import { sendError, sendResponse } from "../middlewares/response.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import AnimePlaylistService from "../services/anime-playlist.service.js";

const _animePlaylistRepository = new AnimePlaylistRepository();
const _animePlaylistService = new AnimePlaylistService(_animePlaylistRepository);

const getAnimePlaylists = async(request: IncomingMessage, response: ServerResponse) => {
      try {
            const anime_playlists = await _animePlaylistRepository.getAnimePlaylists();
            return sendResponse(response, 200, anime_playlists);
      } catch(error) {
            console.error('Error getting anime playlists: ', error);
            sendError(response, 500, error);
      }
}

const getAnimePlaylistById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const anime_playlist = await _animePlaylistRepository.getAnimePlaylistById(id);
            if(anime_playlist == null) {
                  return sendError(res, 404, 'anime playlist not found');
            } 

            return sendResponse(res, 200, anime_playlist);
      } catch(error) {
            console.error('Error getting anime playlist by id: ', error);
            return sendError(res, 500, error);
      }
}

const createAnimePlaylist = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const created_animePlaylist = await _animePlaylistService.createAnimePlaylist(req);
            sendResponse(res, 200, created_animePlaylist);
      } catch(error) {
            console.error('Error creating new anime playlist: ', error);
            sendError(res, 404, error);
      }
}

const animePlaylist_controller = {
      getAnimePlaylists,
      getAnimePlaylistById,
      createAnimePlaylist,
}
export default animePlaylist_controller;