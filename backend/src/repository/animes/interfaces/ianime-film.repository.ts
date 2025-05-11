import { AnimeFilmDTO, CreateAnimeFilmDTO } from "../../../dtos/animes/anime-film.dto";

export interface iAnimeFilmRepository {
      getAnimeFilms(): Promise<AnimeFilmDTO[] | null>;
      findByName(name: string): Promise<AnimeFilmDTO | null>;
      createAnimeFilm(data: CreateAnimeFilmDTO): Promise<CreateAnimeFilmDTO>;
}