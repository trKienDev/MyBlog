import { CreateFilmDTO, updateFilm_dto } from "../dtos/film.dto.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { iFilmRepository } from "../repository/interfaces/ifilm.repository.js";
import { UploadFile } from "../utils/file.utils.js";
import { ExtractParamFromRequest } from "../utils/request.utils.js";

export class FilmService {
      private filmRepository: iFilmRepository;

      constructor(filmRepository: iFilmRepository) {
            this.filmRepository = filmRepository;
      }

      public async CreateFilm(req: CustomRequest): Promise<CreateFilmDTO> {
            const { name, imgName } = await UploadFile(req, "film");
            const existingFilm = await this.filmRepository.FindFilmByName(name);
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

            return await this.filmRepository.CreateFilm(newFilm);
      }      

      public async update_film(req: ValidateIdRequest): Promise<void> {
            const id = req.params.id;2
            let new_thumbnail: string | undefined;
            
      }
}