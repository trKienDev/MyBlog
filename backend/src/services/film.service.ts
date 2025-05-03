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
      
      public async CreateFilm(req: CustomRequest): Promise<CreateFilmDTO> {
            const { name, file_name } = await uploadFile(req, "film");
            const existing_film = await this.film_repository.FindFilmByName(name);
            if (existing_film) {
                  throw new Error('Film with this name has already existed.');
            }

            const thumbnail = file_name;
            const studio = request_utils.extractParamFromRequest(req, "studio_id");
            const code = request_utils.extractParamFromRequest(req, "code_id");
            const tagsParam = request_utils.extractParamFromRequest(req, "tag_ids");
            const collection = request_utils.extractParamFromRequest(req, "collection_id");
            const dateStr = request_utils.extractParamFromRequest(req, "date");
            const date: Date = new Date(dateStr);
            const rating = request_utils.extractParamFromRequest(req, "rating");
            const tagIds: string[] = tagsParam.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            
            const newFilm: CreateFilmDTO = {
                  name: name,
                  code_id: code,
                  studio_id: studio,
                  tag_ids: tagIds,
                  collection_id: collection,
                  date: date,
                  rating: rating? Number(rating): 0,
                  thumbnail: thumbnail,
            };

            return await this.film_repository.CreateFilm(newFilm);
      }      

      public async update_film(req: ValidateIdRequest): Promise<UpdateFilmDTO | null> {
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
            const date: Date = new Date(date_str);
            const rating = request_utils.extractParamFromRequest(req, "rating");
            const tag_ids: string[] = tags_param.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            
            const updateFilm_data: Record<string, any> = { name, studio_id, code_id, collection_id, date, rating, tag_ids };

            if(file_name) {
                  FileService.deleteFile("film", existing_film.thumbnail);
                  updateFilm_data.thumbnail = file_name;
            }

            const updated_film = await this.film_repository.update_film(id, updateFilm_data);
            if(!updated_film) {
                  throw new Error("Error updating film");
            }

            return updated_film;
      }
}