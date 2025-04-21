import { CreateFilmDTO, FilmDTO, updateFilm_dto } from "../../dtos/film.dto.js";

export interface iFilmRepository {
      FindFilmByName(name: string): Promise<FilmDTO | null>;
      GetFilms(): Promise<FilmDTO[] | null>;
      CreateFilm(data: CreateFilmDTO): Promise<CreateFilmDTO>;
      update_film(id: string, data: Partial<updateFilm_dto>): Promise<updateFilm_dto>;
}