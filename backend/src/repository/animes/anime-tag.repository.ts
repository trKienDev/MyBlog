import { AnimeTagDTO } from "../../dtos/animes/anime-tag.dto.js";
import AnimeTag, { IAnimeTag } from "../../models/animes/anime-tag.model.js";
import { iAnimeTagRepository } from "./interfaces/ianime-tag.repository.js";

export class AnimeTagRepository implements iAnimeTagRepository {
      async getAnimeTags(): Promise<AnimeTagDTO[]> {
            const anime_tags = await AnimeTag.find();
            return anime_tags.map(tag => mappingDocToDTO(tag));
      }

      async getAnimeTagById(id: string): Promise<AnimeTagDTO | null> {
            const anime_tag = await AnimeTag.findById(id);
            return anime_tag ? mappingDocToDTO(anime_tag) : null;
      }

      async getAnimeTagByAction(): Promise<AnimeTagDTO[]> {
            const tags_action = await AnimeTag.find({ kind: 'action' });
            return tags_action.map(tag => mappingDocToDTO(tag));
      }

      async getAnimeTagsByFilm(): Promise<AnimeTagDTO[]> {
            const animeFilm_tag = await AnimeTag.find({ kind: 'film'});
            return animeFilm_tag.map(tag => mappingDocToDTO(tag));
      }
      
      async getAnimeVideoTags(): Promise<AnimeTagDTO[]> {
            const exclude_kinds = ['film', 'action'];
            const anime_tags = await AnimeTag.find({ kind: { $nin: exclude_kinds }});

            return anime_tags.map(tag => mappingDocToDTO(tag));
      }

      async createAnimeTag(data: AnimeTagDTO): Promise<AnimeTagDTO> {
            const anime_tag = new AnimeTag(data);
            const saved_animeTag = await anime_tag.save();
            return mappingDocToDTO(saved_animeTag);
      }
}

function mappingDocToDTO(doc: IAnimeTag): AnimeTagDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            kind: doc.kind,
      }
}