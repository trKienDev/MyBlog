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

      async createAnimeFilm(request: CustomRequest): Promise<CreateAnimeFilmDTO> {
            const { file_name } = await file_utils.uploadFile(request, "anime/films");
            const name = request_utils.extractParamFromRequest(request, "name");

            const existing_film = await this.animeFilm_repository.findByName(name);
            if(existing_film) {
                  throw new Error('Anime film with this name has already existed');
            }
            
            const thumbnail = file_name;
            const studio_id = request_utils.extractParamFromRequest(request, "studio_id");
            const series_id = request_utils.extractParamFromRequest(request, "series_id");
            const tag_params = request_utils.extractParamFromRequest(request, "tag_ids");
            const tag_ids: string[] = tag_params.split(',').map((string) => string.trim()).filter((string) => string.length > 0);
            const year = request_utils.extractParamFromRequest(request, "year");
            const rating = request_utils.extractParamFromRequest(request, "rating");

            const new_animeFilm: CreateAnimeFilmDTO = {
                  name: name,
                  studio_id: studio_id,
                  tag_ids: tag_ids,
                  year: Number(year),
                  rating: rating? Number(rating): 0,
                  thumbnail: thumbnail, 
            };

            if(series_id) {
                  new_animeFilm.series_id = series_id
            }

            return await this.animeFilm_repository.createAnimeFilm(new_animeFilm);
      }

      async updateFilm(request: ValidateIdRequest): Promise<UpdateAnimeFilmDTO | null> {
            const id = request.params?.id;
            const existing_film = await this.animeFilm_repository.findById(id);
            if(!existing_film) throw new Error('Anime film not found');

            const { file_name } = await file_utils.uploadFile(request, "anime/films");
            const name = await request_utils.extractParamFromRequest(request, "name");
            const studio_id = request_utils.extractParamFromRequest(request, "studio_id");
            const series_id = request_utils.extractParamFromRequest(request, "series_id");
            const tag_params = request_utils.extractParamFromRequest(request, "tag_ids");
            const tag_ids: string[] = tag_params.split(',').map((string) => string.trim()).filter((string) => string.length > 0);
            const year = request_utils.extractParamFromRequest(request, "year");
            const rating = request_utils.extractParamFromRequest(request, "rating");
            
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