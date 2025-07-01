import mongoose from "mongoose";
import { ClipDTO, CreateClipDTO } from "../dtos/clip.dto.js";
import Clip, { iClip } from "../models/clips.model.js";
import { iClipRepository } from "./interfaces/iclip.repository.js";
import Record from "../models/record.model.js";

export class ClipRepository implements iClipRepository {
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