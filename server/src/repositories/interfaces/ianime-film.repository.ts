import { AnimeFilmDTO, AnimeFilmsPaginationDTO, CreateAnimeFilmDTO, FilterAnimeFilmsPagination, UpdateAnimeFilmDTO } from "../../dtos/anime-film.dto.js";

export interface iAnimeFilmRepository {
      getAnimeFilms(): Promise<AnimeFilmDTO[] | null>;
      findById(id: string): Promise<AnimeFilmDTO | null>;
      findByName(name: string): Promise<AnimeFilmDTO | null>;
      findRandomizePaginated(page: number, limit: number, filters: FilterAnimeFilmsPagination, seed: string): Promise<AnimeFilmsPaginationDTO>
      createAnimeFilm(data: CreateAnimeFilmDTO): Promise<CreateAnimeFilmDTO>;
      updateAnimeFilm(id: string, data: Partial<UpdateAnimeFilmDTO>): Promise<UpdateAnimeFilmDTO | null>;
}