import mongoose from "mongoose";
import { AnimeVideoDTO, AnimeVideosPaginationDTO, CreateAnimeVideoDTO, FilterAnimeVideoPagination, UpdateAnimeVideoDTO } from "../dtos/anime-video.dto.js";
import AnimeVideo, { iAnimeVideo } from "../models/anime-video.model.js";
import { iAnimeVideoRepository } from "./interfaces/ianime-video.repository.js";
import AnimeFilm from "../models/anime-film.model.js";

export class AnimeVideoRepository implements iAnimeVideoRepository {
      async getAnimeVideos(): Promise<AnimeVideoDTO[]> {
            const anime_videos = await AnimeVideo.find();
            return anime_videos.map(doc => mappingDocToDTO(doc));
      }
      async GetAnimeVideosPagination(page: number, limit: number, filters: FilterAnimeVideoPagination): Promise<AnimeVideosPaginationDTO> {
            const skip = (page - 1) * limit;
            const filterQueries: any = {};
            if(filters.tag_id && mongoose.Types.ObjectId.isValid(filters.tag_id)) {
                  filterQueries.tag_ids = new mongoose.Types.ObjectId(filters.tag_id);
            }

            const [animeVideos, total] = await Promise.all([
                  AnimeVideo.find(filterQueries).sort({createdAt: -1}).skip(skip).limit(limit).exec(),
                  AnimeVideo.countDocuments(filterQueries).exec()
            ]);

            return { animeVideos, total };
      }
      async GetUniqueAnimeVideosPagination(page: number, limit: number, filters: FilterAnimeVideoPagination): Promise<AnimeVideosPaginationDTO> {
            const skip = (page - 1) * limit;
            const filterQuery: any = {};
            if(filters.tag_id && mongoose.Types.ObjectId.isValid(filters.tag_id)) {
                  filterQuery.tag_ids = new mongoose.Types.ObjectId(filters.tag_id);
            }

            const results = await AnimeVideo.aggregate([
                  // Giai đoạn 1: Lọc các video khớp với điều kiện
                  { $match: filterQuery },

                  // Giai đoạn 2: Sắp xếp để video mới nhất lên đầu mỗi nhóm
                  { $sort: { createdAt: -1 } },

                  // Giai đoạn 3: Gom nhóm theo film_id và lấy video đầu tiên (mới nhất)
                  {
                        $group: {
                              _id: "$film_id", // Gom nhóm theo trường film_id
                              documentData: { $first: "$$ROOT" } // Lấy toàn bộ document đầu tiên của mỗi nhóm
                        }
                  },

                  // Giai đoạn 4: Đưa document video về làm gốc
                  { $replaceRoot: { newRoot: "$documentData" }},
                  
                  // Giai đoạn 5: Sắp xếp lại kết quả cuối cùng (tùy chọn)
                  { $sort: { createdAt: -1 } },

                  // Giai đoạn 6: Xử lý phân trang và đếm tổng số
                  { $facet: {
                              // Nhánh 1: Lấy dữ liệu đã phân trang
                              videos: [
                                    { $skip: skip },
                                    { $limit: limit }
                              ],
                              // Nhánh 2: Đếm tổng số document sau khi gom nhóm
                              totalCount: [
                                    { $count: 'total' }
                              ]
                        }
                  }
            ]);

            const animeVideos = results[0].videos;
            // Lấy tổng số, nếu không có kết quả thì mặc định là 0
            const total = results[0].totalCount.length > 0 ? results[0].totalCount[0].total : 0;

            return { animeVideos, total };
      }

      async findAnimeVideoById(id: string): Promise<AnimeVideoDTO | null> {
            const anime_video = await AnimeVideo.findById(id);
            return anime_video ? mappingDocToDTO(anime_video) : null;
      }

      async findAnimeVideoByName(name: string): Promise<AnimeVideoDTO | null> {
            return await AnimeVideo.findOne({ name });
      }

      async createAnimeVideo(data: CreateAnimeVideoDTO): Promise<CreateAnimeVideoDTO> {
            const new_video = new AnimeVideo({
                  name: data.name,
                  film_id: new mongoose.Types.ObjectId(data.film_id),
                  ...(data.playlist_id && { playlist_id: new mongoose.Types.ObjectId(data.playlist_id)}),
                  file_path: data.file_path,
            });
            if(data.tag_ids) {
                  new_video.tag_ids = data.tag_ids.map(id => new mongoose.Types.ObjectId(id));
            }
            
            const created_video = await new_video.save();
            
            await AnimeFilm.findByIdAndUpdate(
                  data.film_id,
                  { $push: {video_ids: created_video._id}}
            );

            return mappingDocToCreateDTO(created_video);
      }

      async updateAnimeVideo(id: string, data: Partial<UpdateAnimeVideoDTO>): Promise<UpdateAnimeVideoDTO | null> {
            const update_fields: Record<string, any> = {};
            if (data.name) update_fields.name = data.name;
            if (data.film_id) update_fields.film_id = new mongoose.Types.ObjectId(data.film_id);
            if (data.playlist_id) update_fields.playlist_id = new mongoose.Types.ObjectId(data.playlist_id);
            if (data.tag_ids) update_fields.tag_ids = data.tag_ids.map(id => new mongoose.Types.ObjectId(id));
            if (data.file_path) update_fields.file_path   = data.file_path;

            const updated_doc = await AnimeVideo.findByIdAndUpdate(
                  id,
                  { $set: update_fields },
                  { new: true }         
            );

            return updated_doc ? mappingDocToCreateDTO(updated_doc) : null;
      }
}

function mappingDocToCreateDTO(doc: iAnimeVideo): CreateAnimeVideoDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            film_id: doc.film_id.toString(),
            playlist_id: doc.playlist_id?.toString() ?? "",
            tag_ids: doc?.tag_ids?.map(id => id.toString()),
            file_path: doc.file_path,
      }
}

function mappingDocToDTO(doc: iAnimeVideo): AnimeVideoDTO {
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