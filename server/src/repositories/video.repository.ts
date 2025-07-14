import mongoose, { FilterQuery } from "mongoose";
import Video from "../models/video.model.js";
import { iVideoRepository } from "./interfaces/ivideo.repository.js";
import { iVideo } from "../models/interface/ivideo.model.js";
import { CreateVideoDTO, FilterVideoPagination, UpdateVideoDTO, VideoDTO, VideosPaginationDto } from "../dtos/video.dto.js";
import Film from "../models/film.model.js";
import seedrandom from "seedrandom";
import array_utils from "../utils/array.utils.js";

export class VideoRepository implements iVideoRepository {
      public async getVideos(): Promise<VideoDTO[]> {
            const videos = await Video.find();
            return videos.map(doc => mappingDocToDTO(doc));
      }
      public async getLatestVideos(): Promise<VideoDTO[]> {
            const latest_videos = await Video.find().sort({ createdAt: -1 })
                                                      .limit(4).exec();

            return latest_videos.map(doc => mappingDocToDTO(doc));
      }
      public async getVideosPagination(page: number, limit: number, filters: FilterVideoPagination): Promise<VideosPaginationDto> {
            const skip = (page - 1) * limit;
            const filterQueries = this.buildFilterQueries(filters);

            const [ videos, total ] = await Promise.all([
                  Video.find(filterQueries)
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .exec(),
                  Video.countDocuments(filterQueries).exec()
            ]);
            
            return { videos, total };
      }
      public async getUniqueRandomVideosPagination(page: number, limit: number, filters: FilterVideoPagination): Promise<VideosPaginationDto> {
            const skip = (page - 1) * limit;

            // 1. Xây dựng bộ lọc (đã sửa lỗi logic)
            const filterQueries = this.buildFilterQueries(filters);

            // 2. Sử dụng Aggregation Pipeline
            const results = await Video.aggregate([
                  // Giai đoạn 1: Lọc các video khớp với điều kiện
                  { $match: filterQueries },

                  // Giai đoạn 2: Lấy video ngẫu nhiên
                  { $addFields: { randomSortKey: { $rand: {} } } },

                  // Giai đoạn 3: Sắp xếp theo trường ngẫu nhiên
                  { $sort: { randomSortKey: 1 } },

                  // Giai đoạn 4: Gom nhóm theo film_id và lấy video đầu tiên (mới nhất)
                  {
                        $group: {
                              _id: "$film_id", // Gom nhóm theo trường film_id
                              documentData: { $first: "$$ROOT" } // Lấy toàn bộ document đầu tiên của mỗi nhóm
                        }
                  },

                  // Giai đoạn 5: Đưa document video về làm gốc
                  { $replaceRoot: { newRoot: "$documentData" }},

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

            const videos = results[0].videos;
            // Lấy tổng số, nếu không có kết quả thì mặc định là 0
            const total = results[0].totalCount.length > 0 ? results[0].totalCount[0].total : 0;

            return { videos, total };
      }
      public async getHomepageFeedsVideosPagination(page: number, limit: number, filters: FilterVideoPagination, seed: string): Promise<VideosPaginationDto> {
            const filterQueries = this.buildFilterQueries(filters);
            // BƯỚC 1: LẤY TẤT CẢ VIDEO ỨNG CỬ VIÊN TỪ DB
            // Pipeline này chỉ lọc và gom nhóm, không chọn ngẫu nhiên
            const groupedResults = await Video.aggregate([
                  { $match: filterQueries }, // Bỏ filterQuery đi vì đã có filters
                  { $sort: { createdAt: -1 } }, // Sắp xếp trước để $first có ý nghĩa hơn
                  {
                        $group: {
                              _id: "$film_id", // Gom nhóm theo film_id
                              videosInGroup: { $push: "$$ROOT" } // Lấy TẤT CẢ video trong nhóm
                        }
                  }, {
                        $sort: { _id: 1 }
                  }
            ]);

            // BƯỚC 2: DÙNG SEED ĐỂ CHỌN ĐẠI DIỆN TRONG CODE NODE.JS
            const representativeVideos = [];
            for (const group of groupedResults) {
                  // Tạo một bộ sinh số ngẫu nhiên riêng cho mỗi phim, dựa trên seed từ client và film_id
                  // Điều này đảm bảo tính ngẫu nhiên giữa các phim nhưng nhất quán cho cùng một phim
                  const rng = seedrandom(seed + group._id.toString());
                  const randomIndex = Math.floor(rng() * group.videosInGroup.length);
                  
                  representativeVideos.push(group.videosInGroup[randomIndex]);
            }

            // BƯỚC 3: SẮP XẾP VÀ PHÂN TRANG DANH SÁCH CUỐI CÙNG
            // Sắp xếp "chồng bài" cuối cùng theo quy tắc cố định (_id)
            const shuffledMasterList = array_utils.seedShuffle(representativeVideos, seed);
            // Đếm tổng số
            const total = shuffledMasterList.length;

            // Cắt lát dữ liệu để phân trang
            const skip = (page - 1) * limit;
            const pageData = shuffledMasterList.slice(skip, skip + limit);

            return { videos: pageData, total };
      }

      public async findById(id: string): Promise<VideoDTO | null> {
            const video = await Video.findById(id);
            return video ? mappingDocToDTO(video) : null;
      }
      public async findByName(name: string): Promise<VideoDTO | null> {
            return await Video.findOne({ name });      
      }
      public async findByCreatorId(creator_id: string): Promise<VideoDTO[]> {
            if (!mongoose.Types.ObjectId.isValid(creator_id)) {
                  console.warn("Invalid creator_id format");
                  throw new Error('invalid creator_id');
            }

            const videos = await Video.find({ creator_id: new mongoose.Types.ObjectId(creator_id) });
            return videos.map(doc => mappingDocToDTO(doc));
      }

      public async createVideo(data: CreateVideoDTO): Promise<CreateVideoDTO> {
            const new_video = new Video({
                  name: data.name,
                  action_id: new mongoose.Types.ObjectId(data.action_id),
                  film_id: new mongoose.Types.ObjectId(data.film_id),
                  code_id: new mongoose.Types.ObjectId(data.code_id),
                  studio_id: new mongoose.Types.ObjectId(data.studio_id),
                  creator_id: new mongoose.Types.ObjectId(data.creator_id),
                  file_path: data.file_path,
                  tag_ids: data.tag_ids.map(id => new mongoose.Types.ObjectId(id)), 
            });
            const created_video = await new_video.save();

            await Film.findByIdAndUpdate(
                  data.film_id,
                  { 
                        $push: { video_ids: created_video._id },
                        $addToSet: { creator_ids: created_video.creator_id },
                  },
            );

            return mappingDocToCreateDTO(created_video);            
      }

      public async updateVideo(id: string, data: Partial<UpdateVideoDTO>): Promise<UpdateVideoDTO | null> {
            const update_fields: Record<string, any> = {};
            if (data.name) update_fields.name = data.name;
            if (data.action_id) update_fields.action_id = new mongoose.Types.ObjectId(data.action_id);
            if (data.creator_id) update_fields.creator_id = new mongoose.Types.ObjectId(data.creator_id);
            if (data.studio_id) update_fields.studio_id = new mongoose.Types.ObjectId(data.studio_id);
            if (data.film_id) update_fields.film_id = new mongoose.Types.ObjectId(data.film_id);
            if (data.code_id) update_fields.code_id = new mongoose.Types.ObjectId(data.code_id);
            if (data.tag_ids) update_fields.tag_ids = data.tag_ids.map(id => new mongoose.Types.ObjectId(id));
            if (data.file_path) update_fields.file_path   = data.file_path;

            const updated_doc = await Video.findByIdAndUpdate(
                  id,
                  { $set: update_fields },
                  { new: true }         
            );

            return updated_doc ? mappingDocToDTO(updated_doc) : null;
      }

      public async addPlaylistsToVideo(video_id: string, playlistIds_toAdd: string[]): Promise<VideoDTO | null> {
            const updated_video = await Video.findByIdAndUpdate(
                  video_id,
                  { $set: { playlist_ids: playlistIds_toAdd }}, 
                  {
                        new: true,
                        runValidators: true
                  }
            ).exec();

            return updated_video ? mappingDocToDTO(updated_video) : null;
      }

      public async increaseVideoViewsByOne(video_id: string): Promise<VideoDTO | null> {
            const updated_video = await Video.findByIdAndUpdate(
                  video_id,
                  { $inc: {views: 1 }},
                  { new: true }
            ).exec();

            return updated_video ? mappingDocToDTO(updated_video) : null;
      }

      public async increaseVideoLikeByOne(video_id: string): Promise<VideoDTO | null> {
            const updated_video = await Video.findByIdAndUpdate(
                  video_id,
                  { $inc: { likes: 1 }},
                  { new: true }
            ).exec();

            return updated_video ? mappingDocToDTO(updated_video) : null;
      }

      private buildFilterQueries(filters: FilterVideoPagination): FilterQuery<iVideo> {
            const filterQueries: FilterQuery<iVideo> = {};
            if(filters.action_id && mongoose.Types.ObjectId.isValid(filters.action_id)) {
                  filterQueries.action_id = new mongoose.Types.ObjectId(filters.action_id);
            }
            if (filters.creator_id && mongoose.Types.ObjectId.isValid(filters.creator_id)) {
                  filterQueries.creator_id = new mongoose.Types.ObjectId(filters.creator_id);
            }
            if (filters.studio_id && mongoose.Types.ObjectId.isValid(filters.studio_id)) {
                  filterQueries.studio_id = new mongoose.Types.ObjectId(filters.studio_id);
            }
            if (filters.code_id && mongoose.Types.ObjectId.isValid(filters.code_id)) {
                  filterQueries.code_id = new mongoose.Types.ObjectId(filters.code_id);
            }
            // Sửa lỗi: Dùng $in cho các trường mảng
            if (filters.tag_id && mongoose.Types.ObjectId.isValid(filters.tag_id)) {
                  filterQueries.tag_ids = { $in: [new mongoose.Types.ObjectId(filters.tag_id)] };
            }
            if (filters.playlist_ids && mongoose.Types.ObjectId.isValid(filters.playlist_ids)) {
                  filterQueries.playlist_ids = { $in: [new mongoose.Types.ObjectId(filters.playlist_ids)] };
            }

            return filterQueries;
      }
}

function mappingDocToCreateDTO(doc: iVideo): CreateVideoDTO {
      return {
            _id: doc._id,
            name: doc.name,
            action_id: doc.action_id.toString(),
            creator_id: doc.creator_id?.toString() ?? "",
            studio_id: doc.studio_id?.toString() ?? "",
            film_id: doc.film_id.toString(),
            code_id: doc.code_id.toString(),
            tag_ids: doc.tag_ids.map(id => id.toString()),
            file_path: doc.file_path,
      }
}

function mappingDocToDTO(doc: iVideo): VideoDTO {
      return {
            _id: doc._id,
            name: doc.name,
            action_id: doc.action_id.toString(),
            creator_id: doc.creator_id?.toString() ?? "",
            film_id: doc.film_id.toString(),
            code_id: doc.code_id.toString(),
            studio_id: doc.studio_id.toString(),
            playlist_ids: doc.playlist_ids?.map(id => id.toString()),
            tag_ids: doc.tag_ids.map(id => id.toString()),
            file_path: doc.file_path,
            views: doc.views,
            likes: doc.likes,
      }
}

