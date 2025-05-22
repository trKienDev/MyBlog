import { ServerResponse } from "http";
import { CreateAnimeFilmDTO, UpdateAnimeFilmDTO } from "../../dtos/animes/anime-film.dto.js";
import { CustomRequest } from "../../interfaces/CustomRequest.js"
import { ValidateIdRequest } from "../../interfaces/validated-id-request.js";
import { iAnimeFilmRepository } from "../../repository/animes/interfaces/ianime-film.repository.js";
import { request_utils } from "../../utils/request.utils.js";
import { FileService } from "../../utils/file.service.js";
import file_utils from "../../utils/file.utils.js";

export class AnimeFilmService {
      private animeFilm_repository: iAnimeFilmRepository;
      constructor(animeFilmRepository: iAnimeFilmRepository) {
            this.animeFilm_repository = animeFilmRepository;
      }

      async createAnimeFilm(req: CustomRequest): Promise<CreateAnimeFilmDTO> {
            const { name, file_name } = await file_utils.uploadFile(req, "anime/films");
            const existing_film = await this.animeFilm_repository.findByName(name);
            if(existing_film) {
                  throw new Error('Anime film with this name has already existed');
            }

            const thumbnail = file_name;
            const studio_id = request_utils.extractParamFromRequest(req, "studio_id");
            const series_id = request_utils.extractParamFromRequest(req, "series_id");
            const tag_params = request_utils.extractParamFromRequest(req, "tag_ids");
            const tag_ids: string[] = tag_params.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            const year = request_utils.extractParamFromRequest(req, "year");
            const rating = request_utils.extractParamFromRequest(req, "rating");
            const new_animeFilm: CreateAnimeFilmDTO = {
                  name: name,
                  studio_id: studio_id,
                  series_id: series_id,
                  tag_ids: tag_ids,
                  year: Number(year),
                  rating: rating? Number(rating): 0,
                  thumbnail: thumbnail, 
            };

            return await this.animeFilm_repository.createAnimeFilm(new_animeFilm);
      }

      async updateFilm(req: ValidateIdRequest): Promise<UpdateAnimeFilmDTO | null> {
            const id = req.params?.id;
            const existing_film = await this.animeFilm_repository.findById(id);
            if(!existing_film) throw new Error('Anime film not found');

            const { name, file_name } = await file_utils.uploadFile(req, "anime/films");
            const studio_id = request_utils.extractParamFromRequest(req, "studio_id");
            const series_id = request_utils.extractParamFromRequest(req, "series_id");
            const tag_params = request_utils.extractParamFromRequest(req, "tag_ids");
            const tag_ids: string[] = tag_params.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            const year = request_utils.extractParamFromRequest(req, "year");
            const rating = request_utils.extractParamFromRequest(req, "rating");
            
            const updateAnimeFilm_data: Record<string, any> = { name, studio_id, series_id, tag_ids, year, rating };
            if(file_name) {
                  FileService.deleteFile("anime/films", existing_film.thumbnail);
                  updateAnimeFilm_data.thumbnail = file_name;
            }

            const updated_animeFilm = await this.animeFilm_repository.updateAnimeFilm(id, updateAnimeFilm_data);
            if(!updated_animeFilm) throw new Error('Error updating anime film');

            return updated_animeFilm;
      }


}