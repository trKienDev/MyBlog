import { CreateFilmDTO, FilmDTO, UpdateFilmDTO } from "../../dtos/film.dto.js";

export interface iFilmRepository {
      getFilms(): Promise<FilmDTO[] | null>;
      findFilmsByStudioAndCode(studio_id: string, code_id: string): Promise<FilmDTO[] | null>;
      findByName(name: string): Promise<FilmDTO | null>;
      findById(id: string): Promise<FilmDTO | null>;
      createFilm(data: CreateFilmDTO): Promise<CreateFilmDTO>;
      updateFilm(id: string, data: Partial<UpdateFilmDTO>): Promise<UpdateFilmDTO | null>;
}