import { CreateFilmDTO, FilmDTO, FilmsPaginationDto, FilterFilmPagination, UpdateFilmDTO } from "../../dtos/film.dto.js";

export interface iFilmRepository {
      findAll(): Promise<FilmDTO[]>;
      findNewest(): Promise<FilmDTO[]>;
      findPaginated(page: number, limit: number, filters: FilterFilmPagination): Promise<FilmsPaginationDto>;
      findRandomizedPaginated(page: number, limit: number, filters: FilterFilmPagination, seed: string): Promise<FilmsPaginationDto>;
      findByStudioAndCode(studio_id: string, code_id: string): Promise<FilmDTO[] | null>;
      findByTagId(tag_id: string): Promise<FilmDTO[]>;
      findByName(name: string): Promise<FilmDTO | null>;
      findById(id: string): Promise<FilmDTO | null>;
      findByCreatorId(creator_id: string): Promise<FilmDTO[]>;
      findByStudioId(studio_id: string): Promise<FilmDTO[]>;
      findByCollectionId(collection_id: string): Promise<FilmDTO[]>
      create(data: Partial<CreateFilmDTO>): Promise<Partial<CreateFilmDTO>>;
      update(id: string, data: Partial<UpdateFilmDTO>): Promise<UpdateFilmDTO | null>;
      updateCollectionId(film_id: string, collection_id: string): Promise<FilmDTO | null>;
}