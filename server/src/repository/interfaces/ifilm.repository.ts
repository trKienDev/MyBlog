import { CreateFilmDTO, FilmDTO, UpdateFilmDTO } from "../../dtos/film.dto.js";

export interface iFilmRepository {
      getFilms(): Promise<FilmDTO[] | null>;
      findFilmsByStudioAndCode(studio_id: string, code_id: string): Promise<FilmDTO[] | null>;
      FindFilmsByTagId(tag_id: string): Promise<FilmDTO[] | null>;
      findByName(name: string): Promise<FilmDTO | null>;
      findById(id: string): Promise<FilmDTO | null>;
      FindByCreatorId(creator_id: string): Promise<FilmDTO[]>;
      FindByStudioId(studio_id: string): Promise<FilmDTO[]>;
      FindByCollectionId(collection_id: string): Promise<FilmDTO[]>
      createFilm(data: Partial<CreateFilmDTO>): Promise<Partial<CreateFilmDTO>>;
      updateFilm(id: string, data: Partial<UpdateFilmDTO>): Promise<UpdateFilmDTO | null>;
      UpdateCollectionsToFilm(film_id: string, collection_id: string): Promise<FilmDTO | null>;
}