import { AnimeFilmDTO, CreateAnimeFilmDTO, UpdateAnimeFilmDTO } from "../../../dtos/animes/anime-film.dto";

export interface iAnimeFilmRepository {
      getAnimeFilms(): Promise<AnimeFilmDTO[] | null>;
      findById(id: string): Promise<AnimeFilmDTO | null>;
      findByName(name: string): Promise<AnimeFilmDTO | null>;
      createAnimeFilm(data: CreateAnimeFilmDTO): Promise<CreateAnimeFilmDTO>;
      updateAnimeFilm(id: string, data: Partial<UpdateAnimeFilmDTO>): Promise<UpdateAnimeFilmDTO | null>;
}