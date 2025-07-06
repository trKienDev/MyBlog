import mongoose, { FilterQuery } from "mongoose";
import { CreatorDTO, CreatorsPaginationDTO, FilterCreatorsPagination } from "../dtos/creator.dto.js";
import Creator from "../models/creator.model.js";
import { ICreator } from "../models/interface/icreator.model.js";
import { iCreatorRepository } from "./interfaces/icreator.repository.js";
import seedrandom from "seedrandom";

export class CreatorRepository implements iCreatorRepository {
      public async GetCreators(): Promise<CreatorDTO[] | null> {
            const creators = await Creator.find();
            return creators.map(doc => MappingDocToDTO(doc));
      }
      async findRandomizePaginated(page: number, limit: number, filters: FilterCreatorsPagination, seed: string): Promise<CreatorsPaginationDTO> {
            const filterQueries = this.buildFilterQueries(filters);

            const allMatchingCreators = await Creator.find(filterQueries).exec();
            const rng = seedrandom(seed);
            const creatorsWithRandomKey = allMatchingCreators.map(creatorDoc => ({
                  doc: creatorDoc,
                  randomSortKey: rng()
            }));

            const shuffledList = creatorsWithRandomKey.sort((a, b) => a.randomSortKey - b.randomSortKey);
            const total = shuffledList.length;
            const skip = (page -1 ) * limit;
            const pageOfWrappedData = shuffledList.slice(skip, skip + limit);
            const finalPageData = pageOfWrappedData.map(item => item.doc.toObject());

            return { creators: finalPageData, total };
      }

      public async findById(id: string): Promise<CreatorDTO | null> {
            const doc = await Creator.findById(id).exec();
            if(!doc) {
                  return null;
            }
            return MappingDocToDTO(doc);
      }
      public async FindByNameAndBirth(name: string, birth: Date): Promise<CreatorDTO | null> {
            const doc = await Creator.findOne({ name, birth });
            if(!doc) {
                  return null;
            }
            return MappingDocToDTO(doc);
      }
      async FindByTagId(tag_id: string): Promise<CreatorDTO[]> {
            if(!mongoose.Types.ObjectId.isValid(tag_id)) {
                  console.warn("Invalid tag_id format");
                  throw new Error('invalid tag id');
            }

            const creators = await Creator.find({ tag_ids: new mongoose.Types.ObjectId(tag_id)});
            return creators.map(doc => MappingDocToDTO(doc));
      }
      public async Create(data: CreatorDTO): Promise<CreatorDTO> {
            const new_creator = new Creator({
                  name: data.name,
                  identifier_name: data.identifier_name,
                  birth: data.birth,
                  image: data.image,
                  active: data.active,
                  views: data.views,
                  tag_ids: data.tag_ids?.map(id => new mongoose.Types.ObjectId(id)),
            });

            const saved_creator = await new_creator.save();

            return MappingDocToDTO(saved_creator);
      }
      public async UpdateCreator(id: string, data: Partial<CreatorDTO>): Promise<CreatorDTO> {
            const updatedDoc = await Creator.findByIdAndUpdate(id, data, { new: true, runValidators: true }).exec();
            if(!updatedDoc) {
                  throw new Error('Error updating creator');
            }
            return MappingDocToDTO(updatedDoc);
      }
      public async Delete(id: string): Promise<CreatorDTO> {
            const deletedDoc = await Creator.findByIdAndDelete(id).exec();
            if(!deletedDoc) {
                  throw new Error("server: delete creator failed");                  
            }
            return MappingDocToDTO(deletedDoc);
      }

      private buildFilterQueries(filters: FilterCreatorsPagination): FilterQuery<ICreator> {
           const filterQueries: FilterQuery<ICreator> = {}; 
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
            if (filters.studio_id && mongoose.Types.ObjectId.isValid(filters.studio_id)) {
                  filterQueries.studio_id = new mongoose.Types.ObjectId(filters.studio_id);
            }
            if (filters.film_id && mongoose.Types.ObjectId.isValid(filters.film_id)) {
                  filterQueries.film_id = new mongoose.Types.ObjectId(filters.film_id);
            }

            return filterQueries;
      }
}

function MappingDocToDTO(doc: ICreator): CreatorDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            identifier_name: doc.identifier_name,
            birth: doc.birth,
            image: doc.image,
            active: doc.active,
            views: doc.views,
            tag_ids: doc.tag_ids?.map(id => id.toString()),
      }
}