import { CreateFilmDTO, FilmDTO, updateFilm_dto } from "../dtos/film.dto.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { iFilmRepository } from "../repository/interfaces/ifilm.repository.js";
import { UploadFile } from "../utils/file.utils.js";
import { ExtractParamFromRequest } from "../utils/request.utils.js";
import { FileService } from "../utils/file.service.js";

export class FilmService {
      private film_repository: iFilmRepository;

      constructor(filmRepository: iFilmRepository) {
            this.film_repository = filmRepository;
      }

      public async CreateFilm(req: CustomRequest): Promise<CreateFilmDTO> {
            const { name, imgName } = await UploadFile(req, "film");
            const existingFilm = await this.film_repository.FindFilmByName(name);
            if (existingFilm) {
                  throw new Error('Film with this name has already existed.');
            }

            const thumbnail = imgName;
            const studio = ExtractParamFromRequest(req, "studio_id");
            const code = ExtractParamFromRequest(req, "code_id");
            const tagsParam = ExtractParamFromRequest(req, "tag_ids");
            const collection = ExtractParamFromRequest(req, "collection_id");
            const dateStr = ExtractParamFromRequest(req, "date");
            const date: Date = new Date(dateStr);
            const rating = ExtractParamFromRequest(req, "rating");
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

      public async update_film(req: ValidateIdRequest): Promise<updateFilm_dto | null> {
            const id = req.params?.id;
            const existing_film = await this.film_repository.getFilm_byId(id);
            
            if(!existing_film) {
                  throw new Error('Film not found');
            }

            const { name, imgName } = await UploadFile(req, "film");
            const studio_id = ExtractParamFromRequest(req, "studio_id");
            const code_id = ExtractParamFromRequest(req, "code_id");
            const tags_param = ExtractParamFromRequest(req, "tag_ids");
            const collection_id = ExtractParamFromRequest(req, "collection_id");
            const date_str = ExtractParamFromRequest(req, "date");
            const date: Date = new Date(date_str);
            const rating = ExtractParamFromRequest(req, "rating");
            const tag_ids: string[] = tags_param.split(',').map((s) => s.trim()).filter((s) => s.length > 0);
            
            const updateFilm_data: Record<string, any> = { name, studio_id, code_id, collection_id, date, rating, tag_ids };

            if(imgName) {
                  FileService.DeleteFile("film", existing_film.thumbnail);
                  updateFilm_data.thumbnail = imgName;
            }

            const updated_film = await this.film_repository.update_film(id, updateFilm_data);
            if(!updated_film) {
                  throw new Error("Error updating film");
            }

            return updated_film;
      }
}