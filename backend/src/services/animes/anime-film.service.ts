import { CreateAnimeFilmDTO } from "../../dtos/animes/anime-film.dto.js";
import { CustomRequest } from "../../interfaces/CustomRequest.js"
import { iAnimeFilmRepository } from "../../repository/animes/interfaces/ianime-film.repository.js";
import { uploadFile } from "../../utils/file.utils.js";
import { request_utils } from "../../utils/request.utils.js";

export class AnimeFilmService {
      private animeFilm_repository: iAnimeFilmRepository;
      constructor(animeFilmRepository: iAnimeFilmRepository) {
            this.animeFilm_repository = animeFilmRepository;
      }

      async createAnimeFilm(req: CustomRequest): Promise<CreateAnimeFilmDTO> {
            const { name, file_name } = await uploadFile(req, "anime/films");
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


}