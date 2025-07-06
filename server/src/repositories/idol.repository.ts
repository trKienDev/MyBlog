import { FilterQuery } from "mongoose";
import { FilterIdolPagination, IdolDTO, IdolsPaginationDTO } from "../dtos/idol.dto.js";
import Idol from "../models/idol.model.js";
import { iIdol } from "../models/interface/iidol.model.js";
import { iIdolRepository } from "./interfaces/iIdol.repository.js";
import seedrandom from "seedrandom";

export class IdolRepository implements iIdolRepository {
      async GetAll(): Promise<IdolDTO[]> {
            const idols_doc = await Idol.find();
            return idols_doc.map(doc => MappingDocToDTO(doc));
      }
      async findRandomizePaginated(page: number, limit: number, filters: FilterIdolPagination, seed: string): Promise<IdolsPaginationDTO> {
            const filterQueries = this.buildFilterQueries(filters);
            
            const allMatchingIdols = await Idol.find(filterQueries).exec();
            const rng = seedrandom(seed);
            const idolsWithRandomKey = allMatchingIdols.map(idolDoc => ({
                  doc: idolDoc,
                  randomSortKey: rng()
            }));

            const shuffledList = idolsWithRandomKey.sort((a, b) => a.randomSortKey - b.randomSortKey);
            const total = shuffledList.length;
            const skip = (page -1 ) * limit;
            const pageOfWrappedData = shuffledList.slice(skip, skip + limit);
            const finalPageData = pageOfWrappedData.map(item => item.doc.toObject());

            return { idols: finalPageData, total };
      }
      public async findById(id: string): Promise<IdolDTO | null> {
            const doc = await Idol.findById(id).exec();
            if(!doc) {
                  return null;
            }
            return MappingDocToDTO(doc);
      }
      async Create(data: IdolDTO): Promise<IdolDTO> {
            console.log('data: ', data);
            const new_idol = new Idol({
                  name: data.name,
                  identifier_name: data.identifier_name,
                  avatar_url: data.avatar_url,
                  region: data?.region ?? "",
            });
            console.log('new idol: ', new_idol);
            const saved_idol = await new_idol.save();
            return MappingDocToDTO(saved_idol);
      }

      async FindByName(name: string): Promise<IdolDTO | null> {
            const idol_doc = await Idol.findOne({ name });
            if(!idol_doc) return null;
            
            return MappingDocToDTO(idol_doc);
      }
      private buildFilterQueries(filters: FilterIdolPagination): FilterQuery<iIdol> {
            const filterQueries: FilterQuery<iIdol> = {};
            if(filters.region) filterQueries.region = filters.region;

            return filterQueries;
      }
}

function MappingDocToDTO(doc: iIdol): IdolDTO {
      return {
            _id: doc._id.toString(),
            name: doc.name,
            identifier_name: doc.identifier_name,
            avatar_url: doc.avatar_url,
            region: doc?.region ?? "",
      }
}