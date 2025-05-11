import { CreateFilmDTO, FilmDTO, UpdateFilmDTO } from "../dtos/film.dto.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { iFilmRepository } from "../repository/interfaces/ifilm.repository.js";
import { FileService } from "../utils/file.service.js";
import { uploadFile } from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";

export class FilmService {
      private film_repository: iFilmRepository;

      constructor(filmRepository: iFilmRepository) {
            this.film_repository = filmRepository;
      }
      
      async createFilm(req: CustomRequest): Promise<CreateFilmDTO> {
            const { name, file_name } = await uploadFile(req, "film");
            const existing_film = await this.film_repository.findByName(name);
            if (existing_film) {
                  throw new Error('Film with this name has already existed.');
            }

            const thumbnail = file_name;
            const studio = request_utils.extractParamFromRequest(req, "studio_id");
            const code = request_utils.extractParamFromRequest(req, "code_id");
            const tag_params = request_utils.extractParamFromRequest(req, "tag_ids");
            const collection = request_utils.extractParamFromRequest(req, "collection_id");
            const date_str = request_utils.extractParamFromRequest(req, "date");
            const date: Date = new Date(date_str);
            const rating = request_utils.extractParamFromRequest(req, "rating");
            const tag_ids: string[] = tag_params.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            
            const new_film: CreateFilmDTO = {
                  name: name,
                  code_id: code,
                  studio_id: studio,
                  tag_ids: tag_ids,
                  collection_id: collection,
                  date: date,
                  rating: rating? Number(rating): 0,
                  thumbnail: thumbnail,
            };

            return await this.film_repository.createFilm(new_film);
      }      

      async updateFilm(req: ValidateIdRequest): Promise<UpdateFilmDTO | null> {
            const id = req.params?.id;
            const existing_film = await this.film_repository.findById(id);
            
            if(!existing_film) {
                  throw new Error('Film not found');
            }

            const { name, file_name } = await uploadFile(req, "film");
            const studio_id = request_utils.extractParamFromRequest(req, "studio_id");
            const code_id = request_utils.extractParamFromRequest(req, "code_id");
            const tags_param = request_utils.extractParamFromRequest(req, "tag_ids");
            const collection_id = request_utils.extractParamFromRequest(req, "collection_id");
            const date_str = request_utils.extractParamFromRequest(req, "date");
            const rating = request_utils.extractParamFromRequest(req, "rating");
            const tag_ids: string[] = tags_param.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            
            const updateFilm_data: Record<string, any> = { name, studio_id, code_id, collection_id, rating, tag_ids };

            if (date_str != null && date_str !== "") {
                  updateFilm_data.date = new Date(date_str);
            } else {
                  updateFilm_data.date = "";
            }

            if(file_name) {
                  FileService.deleteFile("film", existing_film.thumbnail);
                  updateFilm_data.thumbnail = file_name;
            }

            const updated_film = await this.film_repository.updateFilm(id, updateFilm_data);
            if(!updated_film) {
                  throw new Error("Error updating film");
            }

            return updated_film;
      }
}