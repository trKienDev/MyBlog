import { CreateFilmDTO, FilmDTO } from "../../dtos/film.dto.js";

export interface iFilmRepository {
      CreateFilm(data: CreateFilmDTO): Promise<CreateFilmDTO>;
      FindFilmByName(name: string): Promise<FilmDTO | null>
}