import mongoose, { FilterQuery } from "mongoose";
import { ClipDTO, ClipPaginationDto, CreateClipDTO, FiltersClipPagination } from "../dtos/clip.dto.js";
import Clip, { iClip } from "../models/clips.model.js";
import { iClipRepository } from "./interfaces/iclip.repository.js";
import Record from "../models/record.model.js";
import seedrandom from "seedrandom";

export class ClipRepository implements iClipRepository {
      async FindAll(): Promise<ClipDTO[]> {
            const clips = await Clip.find();
            return clips.map(doc => MappdingDocToDTO(doc));
      }
      public async findRandomizePaginated(page: number, limit: number, filters: FiltersClipPagination, seed: string): Promise<ClipPaginationDto> {
            const filterQueries = this.buildFilterQueries(filters);
            
            const groupedResults = await Clip.aggregate([
                  { $match: filterQueries },
                  { $sort: { createdAt: -1 } },
                  { 
                        $group: {
                              _id: "$record_id",
                              clipsInGroup: { $push: "$$ROOT"}
                        }
                  }
            ]);

            const representativeClips = [];
            for(const group of groupedResults) {
                  const rng = seedrandom(seed + group._id.toString());
                  const randomIndex = Math.floor(rng() * group.clipsInGroup.length);

                  representativeClips.push(group.clipsInGroup[randomIndex]);
            }

            const sortedMasterList = representativeClips.sort((a, b) => a._id.toString().localeCompare(b._id.toString()));
            const total = sortedMasterList.length;
            const skip = (page - 1) * limit;
            const pagedData = sortedMasterList.slice(skip, skip + limit);
            
            return { clips: pagedData, total };
      }
      async Create(data: CreateClipDTO): Promise<ClipDTO> {
            const new_clip = new Clip({
                  name: data.name,
                  file_path: data.file_path,
                  record_id: data.record_id,
                  action_id: data.record_id
            });
            if(data.code_id) new_clip.code_id = new mongoose.Types.ObjectId(data.code_id);
            if(data.creator_id)  new_clip.creator_id = new mongoose.Types.ObjectId(data.creator_id);
            if(data.idol_id) new_clip.idol_id = new mongoose.Types.ObjectId(data.idol_id);
            if(data.tag_ids) new_clip.tag_ids = data.tag_ids.map(id => new mongoose.Types.ObjectId(id));

            const created_clip = await new_clip.save();

            await Record.findByIdAndUpdate(
                  data.record_id, {
                        $push: { clip_ids: created_clip._id },
                  }
            );

            return MappdingDocToDTO(created_clip);
      }
      
      private buildFilterQueries(filters: FiltersClipPagination): FilterQuery<iClip> {
            const filterQueries: FilterQuery<iClip> = {};
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
            if(filters.action_id && mongoose.Types.ObjectId.isValid(filters.action_id)) {
                  filterQueries.action_id = new mongoose.Types.ObjectId(filters.action_id);
            }
            if(filters.album_id && mongoose.Types.ObjectId.isValid(filters.album_id)) {
                  filterQueries.album_id = new mongoose.Types.ObjectId(filters.album_id);
            }
            if(filters.code_id && mongoose.Types.ObjectId.isValid(filters.code_id)) {
                  filterQueries.code_id = new mongoose.Types.ObjectId(filters.code_id);
            }
            if(filters.idol_id && mongoose.Types.ObjectId.isValid(filters.idol_id)) {
                  filterQueries.idol_id = new mongoose.Types.ObjectId(filters.idol_id);
            }

            return filterQueries;
      }
}

function MappdingDocToDTO(doc: iClip): ClipDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            record_id: doc.record_id.toString(),
            action_id: doc.action_id.toString(),
            code_id: doc?.code_id?.toString(),
            studio_id: doc?.studio_id?.toString(),
            creator_id: doc?.creator_id?.toString(),
            idol_id: doc?.idol_id?.toString(),
            ...(doc.tag_ids && doc.tag_ids.length > 0 && {
                  tag_ids: doc.tag_ids.map(id => id.toString())
            }),
            file_path: doc.file_path,
            views: doc.views,
            likes: doc.likes,
            ...(doc.album_ids && doc.album_ids.length > 0 && {
                  album_ids: doc.album_ids.map(id => id.toString())
            })
      }
}