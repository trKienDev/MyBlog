import { IncomingMessage, ServerResponse } from "http";
import { AnimePlaylistRepository } from "../../repository/animes/anime-playlist.repository.js";
import { AnimePlaylistService } from "../../services/animes/anime-playlist.service.js";
import { sendError, sendResponse } from "../../middlewares/response.js";
import { ValidateIdRequest } from "../../interfaces/validated-id-request.js";

const repository = new AnimePlaylistRepository;
const service = new AnimePlaylistService(repository);

const getAnimePlaylists = async(req: IncomingMessage, res: ServerResponse) => {
      try {
            const anime_playlists = await repository.getAnimePlaylists();
            return sendResponse(res, 200, anime_playlists);
      } catch(error) {
            console.error('Error getting anime playlists: ', error);
            sendError(res, 500, error);
      }
}

const getAnimePlaylistById = async(req: ValidateIdRequest, res: ServerResponse) => {
      try {
            const id = req.params?.id;
            const anime_playlist = await repository.getAnimePlaylistById(id);
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
            const created_animePlaylist = await service.createAnimePlaylist(req);
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