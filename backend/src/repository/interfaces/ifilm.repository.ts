import { CreateFilmDTO, FilmDTO, UpdateFilmDTO } from "../../dtos/film.dto.js";

export interface iFilmRepository {
      GetFilms(): Promise<FilmDTO[] | null>;
      findFilmsByStudioAndCode(studio_id: string, code_id: string): Promise<FilmDTO[] | null>;
      FindFilmByName(name: string): Promise<FilmDTO | null>;
      findById(id: string): Promise<FilmDTO | null>;
      CreateFilm(data: CreateFilmDTO): Promise<CreateFilmDTO>;
      update_film(id: string, data: Partial<UpdateFilmDTO>): Promise<UpdateFilmDTO>;
}