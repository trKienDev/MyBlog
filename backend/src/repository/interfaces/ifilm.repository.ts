import { ServerResponse } from "http";
import { CreateFilmDTO, FilmDTO, updateFilm_dto } from "../../dtos/film.dto.js";

export interface iFilmRepository {
      GetFilms(): Promise<FilmDTO[] | null>;
      findFilmsByStudioAndCode(studio_id: string, code_id: string): Promise<FilmDTO[] | null>;
      FindFilmByName(name: string): Promise<FilmDTO | null>;
      getFilm_byId(id: string): Promise<FilmDTO | null>;
      CreateFilm(data: CreateFilmDTO): Promise<CreateFilmDTO>;
      update_film(id: string, data: Partial<updateFilm_dto>): Promise<updateFilm_dto>;
}