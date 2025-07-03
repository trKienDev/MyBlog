import { AnimeVideoDTO, CreateAnimeVideoDTO, FilterAnimeVideoPagination, UpdateAnimeVideoDTO } from "../dtos/anime-video.dto.js";
import { CustomRequest } from "../interfaces/CustomRequest.js";
import { ValidateIdRequest } from "../interfaces/validated-id-request";
import { iAnimeVideo } from "../models/anime-video.model.js";
import { iAnimeVideoRepository } from "../repositories/interfaces/ianime-video.repository.js";
import { FileService } from "../utils/file.service.js";
import file_utils from "../utils/file.utils.js";
import { request_utils } from "../utils/request.utils.js";

export class AnimeVideoService {
      private _animeVideoRepository: iAnimeVideoRepository;
      constructor(animeVideoRepository: iAnimeVideoRepository) {
            this._animeVideoRepository = animeVideoRepository;
      }

      async GetUniqueAnimeVideosPagination(page: number, limit: number, filters: FilterAnimeVideoPagination) {
            const { animeVideos, total } = await this._animeVideoRepository.GetUniqueAnimeVideosPagination(page, limit, filters);
            const uniqueVideosPagination = animeVideos.map(doc => MappingDocToDTO(doc));
            return {
                  videos: uniqueVideosPagination,
                  pagination: {
                        page: page,
                        limit: limit,
                        total: total
                  }
            }
      }

      async createAnimeVideo(request: CustomRequest): Promise<CreateAnimeVideoDTO | null> {
            const { file_name } = await file_utils.uploadFile(request, "anime/videos");

            let video_name = request_utils.extractParamFromRequest(request, "name");
            
            const existing_video = await this._animeVideoRepository.findAnimeVideoByName(video_name);
            if(existing_video) {
                  video_name = existing_video.name + '_2';
            }

            const video_film = request_utils.extractParamFromRequest(request, "film_id");
            const tag_ids = request_utils.extractParamFromRequest(request, "tag_ids");
            const video_playlist = request_utils.extractParamFromRequest(request, "playlist_id");
            const video_tags: string[] = tag_ids.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

            const new_video: CreateAnimeVideoDTO = {
                  name: video_name,
                  film_id: video_film,
                  playlist_id: video_playlist,
                  tag_ids: video_tags,
                  file_path: file_name,
            };

            return await this._animeVideoRepository.createAnimeVideo(new_video);
      }

      async updateAnimeVideo(request: ValidateIdRequest): Promise<UpdateAnimeVideoDTO | null> {
            const id = request.params?.id;
            const existing_video = await this._animeVideoRepository.findAnimeVideoById(id);
            if(!existing_video) {
                  throw new Error('Video not found!');
            }

            const { file_name } = await file_utils.uploadFile(request, "anime/videos");
            const video_name = request_utils.extractParamFromRequest(request, "name");
            const playlist_id = request_utils.extractParamFromRequest(request, "playlist_id");
            const film_id = request_utils.extractParamFromRequest(request, "film_id");
            const tagId_array = request_utils.extractParamFromRequest(request, "tag_ids");
            const tag_ids: string[] = tagId_array.split(',').map((s) => s.trim()).filter((s) => s.length > 0);

            const updatedVideo_data: Record<string, any> = { video_name, playlist_id, film_id, tag_ids};
            
            if(file_name) { 
                  FileService.deleteFile("videos", existing_video.file_path);
                  updatedVideo_data.file_path = file_name;
            }

            const updated_video = await this._animeVideoRepository.updateAnimeVideo(id, updatedVideo_data);
            if(!updated_video) throw new Error("Error updating video");

            return updated_video;
      }
}

function MappingDocToDTO(doc: iAnimeVideo): AnimeVideoDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            film_id: doc.film_id.toString(),
            playlist_id: doc?.playlist_id?.toString(),
            tag_ids: doc?.tag_ids?.map(id => id.toString()),
            file_path: doc.file_path,
            views: doc.views,
      }
}