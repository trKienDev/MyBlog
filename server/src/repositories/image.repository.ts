import mongoose, { FilterQuery } from "mongoose";
import { FilterImagesPagination, ImageDTO, ImagesPaginationDTO } from "../dtos/image.dto.js";
import Image from "../models/image.model.js";
import { iImageRepository } from "./interfaces/iimage.repository.js";
import { iImage } from "../models/interface/iimage.model.js";
import { FilterMangaPagination, MangasPaginationDTO } from "../dtos/manga.dto.js";
import Manga from "../models/manga.model.js";
import seedrandom from "seedrandom";

export class ImageRepository implements iImageRepository {
      async GetAll(): Promise<ImageDTO[]> {
            const images = await Image.find();
            return images.map(doc => MappingDocToDTO(doc));
      }
      async GetImagesPagination(page: number, limit: number, filters: FilterImagesPagination): Promise<ImagesPaginationDTO> {
            const skip = (page - 1) * limit;
            const filterQueries: any = {};
            

            const [ images, total ] = await Promise.all([
                  Image.find(filterQueries).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
                  Image.countDocuments(filterQueries).exec()
            ]);

            return { images, total };
      }
      async findRandomizePaginated(page: number, limit: number, filters: FilterMangaPagination, seed: string): Promise<ImagesPaginationDTO> {
            const filterQueries = this.buildFilterQueris(filters);
            const groupedResults = await Image.aggregate([
                  { $match: filterQueries }, // Bỏ filterQuery đi vì đã có filters
                  { $sort: { createdAt: -1 } }, // Sắp xếp trước để $first có ý nghĩa hơn
                  {
                        $group: {
                              _id: "$idol_id", // Gom nhóm theo film_id
                              imagesInGroup: { $push: "$$ROOT" } // Lấy TẤT CẢ video trong nhóm
                        }
                  }
            ]);

            const representativeImages = [];
            for (const group of groupedResults) {
                  // Tạo một bộ sinh số ngẫu nhiên riêng cho mỗi phim, dựa trên seed từ client và film_id
                  // Điều này đảm bảo tính ngẫu nhiên giữa các phim nhưng nhất quán cho cùng một phim
                  const rng = seedrandom(seed + group._id.toString());
                  const randomIndex = Math.floor(rng() * group.imagesInGroup.length);
                  
                  representativeImages.push(group.imagesInGroup[randomIndex]);
            }

            const sortedMasterList = representativeImages.sort((a, b) => a._id.toString().localeCompare(b._id.toString()));
            const total = sortedMasterList.length;
            const skip = (page - 1) * limit;
            const pageData = sortedMasterList.slice(skip, skip + limit);

            return { images: pageData, total };
      }
      async Create(data: Partial<ImageDTO>): Promise<Partial<ImageDTO>> {
            const new_image = new Image({
                  idol_id: (data && data.idol_id) ? new mongoose.Types.ObjectId(data.idol_id) : null,
                  tag_ids: data.tag_ids?.map(id => new mongoose.Types.ObjectId(id)),
                  image_url: data.image_url,
                  width: data.width,
                  height: data.height,
            });
            const saved_image = await new_image.save();

            return MappingDocToDTO(saved_image);
      }

      private buildFilterQueris(filters: FilterImagesPagination): FilterQuery<iImage> {
            const filterQueries: FilterQuery<iImage> = {};
            if(filters.gallery_id && mongoose.Types.ObjectId.isValid(filters.gallery_id)) {
                  filterQueries.gallery_id = new mongoose.Types.ObjectId(filters.gallery_id);
            }
            if(filters.idol_id && mongoose.Types.ObjectId.isValid(filters.idol_id)) {
                  filterQueries.idol_id = new mongoose.Types.ObjectId(filters.idol_id);
            }
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
            
            return filterQueries;
      }
}

function MappingDocToDTO(doc: iImage): ImageDTO {
      return {
            _id: doc._id.toString(),
            image_url: doc.image_url,
            width: doc.width,
            height: doc.height,
            idol_id: doc?.idol_id?.toString(),
            tag_ids: doc.tag_ids?.map(id => id.toString()) ?? [],
            gallery_ids: doc.gallery_ids?.map(id => id.toString()) ?? [],
            likes: doc.likes,
      }
}