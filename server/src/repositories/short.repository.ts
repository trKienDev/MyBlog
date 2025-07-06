import mongoose, { FilterQuery } from "mongoose";
import { CreateShortDTO, FiltersShortPagination, ShortDTO, ShortPaginationDto } from "../dtos/short.dto.js";
import Short from "../models/short.model.js";
import { iShortRepository } from "./interfaces/ishort.repository.js";
import { iShort } from "../models/interface/ishort.model.js";

export class ShortRepository implements iShortRepository {
      async GetAll(): Promise<ShortDTO[]> {
            const shorts = await Short.find();
            return shorts.map(doc => MappingDocToDTO(doc));
      }
      async GetPaginatedShorts(page: number, limit: number, filters: FiltersShortPagination): Promise<ShortPaginationDto> {
            const skip = (page - 1) * limit;
            const filter_query = this.buildFilterQueries(filters);
            const [ shorts, total ] = await Promise.all([
                  Short.find(filter_query)
                        .sort({ createdAt: -1 })
                        .skip(skip)
                        .limit(limit)
                        .exec(),
                  Short.countDocuments(filter_query).exec()
            ]);

            return { shorts, total };
      }
      public async findRandomizePaginated(page: number, limit: number, filters: FiltersShortPagination, seed: string): Promise<ShortPaginationDto> {
            const skip = (page - 1) * limit;
            const filterQueries = this.buildFilterQueries(filters);
            const results = await Short.aggregate([
                  { $match: filterQueries},
                  { $sort: { createdAt: -1 }},
                  {
                        $group: {
                              _id: "$idol_id",
                              documentData: { $first: "$$ROOT"}
                        }
                  },
                  { $replaceRoot: { newRoot: "$documentData" }},
                  
                  // Giai đoạn 5: Sắp xếp lại kết quả cuối cùng (tùy chọn)
                  { $sort: { createdAt: -1 } },

                  // Giai đoạn 6: Xử lý phân trang và đếm tổng số
                  { $facet: {
                              // Nhánh 1: Lấy dữ liệu đã phân trang
                              shorts: [
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
            const shorts = results[0].shorts;
            const total = results[0].totalCount.length > 0 ? results[0].totalCount[0].total : 0;
            return { shorts, total };
      }
      async Create(data: CreateShortDTO): Promise<ShortDTO> {
            const new_short = new Short({
                  idol_id: (data.idol_id) ? new mongoose.Types.ObjectId(data.idol_id) : null,
                  tag_ids: (data.tag_ids) ? data.tag_ids?.map(id => new mongoose.Types.ObjectId(id)) : null,
                  file_path: data.file_path,
            });

            const created_short = await new_short.save();
            return MappingDocToDTO(created_short);
      }
      private buildFilterQueries(filters: FiltersShortPagination): FilterQuery<iShort> {
            const filterQueries: FilterQuery<iShort> = {};

            if (filters.tag_ids && filters.tag_ids.length > 0) {
                  // Chuyển đổi mỗi chuỗi ID trong mảng thành ObjectId,
                  // đồng thời lọc ra những ID không hợp lệ.
                  const objectIdArray = filters.tag_ids
                        .filter(id => mongoose.Types.ObjectId.isValid(id)) // Chỉ giữ lại các id string hợp lệ
                        .map(id => new mongoose.Types.ObjectId(id));     // Chuyển đổi chúng thành ObjectId

                  // Chỉ thêm vào query nếu có ít nhất một id hợp lệ
                  if (objectIdArray.length > 0) {
                        filterQueries.tag_ids = { $in: objectIdArray };
                  }
            }
            if (filters.idol_id && mongoose.Types.ObjectId.isValid(filters.idol_id)) {
                  filterQueries.idol_id = new mongoose.Types.ObjectId(filters.idol_id);
            }

            return filterQueries;
      }
}

function MappingDocToDTO(doc: iShort): ShortDTO {
      return {
            _id: doc._id.toString(),
            idol_id: doc?.idol_id?.toString(),
            tag_ids: doc.tag_ids?.map(id => id.toString()) ?? [],
            file_path: doc.file_path,
            views: doc.views,
            likes: doc.likes,
      }
}