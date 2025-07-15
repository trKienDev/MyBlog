import { CreateFilmDTO, FilmDTO, FilmsPaginationDto, FilterFilmPagination, UpdateFilmDTO } from "../dtos/film.dto.js";
import { UploadFiles } from "../enums.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request.js";
import { parseJSON } from "../middlewares/json-parser.js";
import { iFilmRepository } from "../repositories/interfaces/ifilm.repository.js";
import { FileService } from "../utils/file.service.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";

export class FilmService {
      private _filmRepository: iFilmRepository;
      constructor(filmRepository: iFilmRepository) {
            this._filmRepository = filmRepository;
      }

      async getRandomizedPaginatedFilms(page: number, limit: number, filters: FilterFilmPagination ,seed: string) {
            const randomizePaginatedFilms = await this._filmRepository.findRandomizedPaginated(page, limit, filters, seed);
            return {
                  films: randomizePaginatedFilms.films,
                  pagination: {
                        page: page,
                        limit: limit,
                        total: randomizePaginatedFilms.total
                  }
            }
      }
      
      async createFilm(request: CustomRequest): Promise<Partial<CreateFilmDTO>> {
            const { file_name } = await file_utils.uploadFile(request, UploadFiles.FILMS);
            const name = request_utils.extractParamFromRequest(request, "name");
            const existing_film = await this._filmRepository.findByName(name);
            if (existing_film) {
                  throw new Error('Film with this name has already existed.');
            }

            const thumbnail = file_name;
            const description = request_utils.extractParamFromRequest(request, "description");
            const studio = request_utils.extractParamFromRequest(request, "studio_id");
            const code = request_utils.extractParamFromRequest(request, "code_id");
            const tag_params = request_utils.extractParamFromRequest(request, "tag_ids");
            const date_str = request_utils.extractParamFromRequest(request, "date");
            const date: Date = new Date(date_str);
            const rating = request_utils.extractParamFromRequest(request, "rating");
            const tag_ids: string[] = tag_params.split(',').map((string) => string.trim()).filter((string) => string.length > 0);
            
            console.log('date: ', date);

            const new_film: Partial<CreateFilmDTO> = {
                  name: name,
                  description: description,
                  code_id: code,
                  studio_id: studio,
                  tag_ids: tag_ids,
                  date: date,
                  rating: rating? Number(rating): 0,
                  thumbnail: thumbnail,
            };

            let collection_value: string | null | undefined = request_utils.extractParamFromRequest(request, "collection_id");

            if (typeof collection_value === 'string') {
                  const lower_collection_value = collection_value.toLowerCase();
                  if (lower_collection_value === 'null' || lower_collection_value === 'undefined' || collection_value.trim() === '') {
                        collection_value = null; 
                  }
            }

            if(collection_value !== null) {
                  new_film.collection_id = collection_value;
            }

            return await this._filmRepository.create(new_film);
      }      

      async updateFilm(request: ValidateIdRequest): Promise<UpdateFilmDTO | null> {
            const id = request.params?.id;
            const existing_film = await this._filmRepository.findById(id);
            
            if(!existing_film) {
                  throw new Error('Film not found');
            }

            const { file_name } = await file_utils.uploadFile(request, UploadFiles.FILMS);
            const name = request_utils.extractParamFromRequest(request, "name");
            const studio_id = request_utils.extractParamFromRequest(request, "studio_id");
            const code_id = request_utils.extractParamFromRequest(request, "code_id");
            const tags_param = request_utils.extractParamFromRequest(request, "tag_ids");
            const collection_id = request_utils.extractParamFromRequest(request, "collection_id");
            const date_str = request_utils.extractParamFromRequest(request, "date");
            const rating = request_utils.extractParamFromRequest(request, "rating");
            const tag_ids: string[] = tags_param.split(',').map((string) => string.trim()).filter((string) => string.length > 0);
            
            const updateFilm_data: Record<string, any> = { name, studio_id, code_id, collection_id, rating, tag_ids };

            if (date_str != null && date_str !== "") {
                  updateFilm_data.date = new Date(date_str);
            } else {
                  updateFilm_data.date = "";
            }

            if(file_name) {
                  FileService.deleteFile(UploadFiles.FILMS, existing_film.thumbnail);
                  updateFilm_data.thumbnail = file_name;
            }

            const updated_film = await this._filmRepository.update(id, updateFilm_data);
            if(!updated_film) {
                  throw new Error("Error updating film");
            }

            return updated_film;
      }

      async UpdateFilmCollections(request: ValidateIdRequest): Promise<FilmDTO | null> {
            console.log('run UpdateFilmCollections in service');
            const film_id = request.params?.id;
            const required_fields = ['collection_ids'];
            const existing_film = await this._filmRepository.findById(film_id);

            if(!existing_film) {
                  throw new Error('Film not found');
            }

            const body = await parseJSON(request, required_fields);
            const { collection_ids } = body;

            if(!collection_ids) {
                  throw new Error('Missing required information');
            }

            const addingFilmCollections = await this._filmRepository.updateCollectionId(film_id, collection_ids);
            return addingFilmCollections;
      }
}