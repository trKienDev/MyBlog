import mongoose from "mongoose";
import { AlbumDTO } from "../dtos/album.dto.js";
import Album, { iAlbum } from "../models/album.model.js";
import { iAlbumRepository } from "./interfaces/ialbum.repository.js";

export class AlbumRepository implements iAlbumRepository {
      async FindAll(): Promise<AlbumDTO[]> {
            const albums = await Album.find();
            return albums.map(album => mappingDocToDTO(album));
      }
      async Create(data: string): Promise<AlbumDTO> {
            const new_album = new Album({ name: data });
            const created_album = await new_album.save();
            return mappingDocToDTO(created_album);
      }
}

function mappingDocToDTO(doc: iAlbum): AlbumDTO {
      return {
            _id: doc._id,
            name: doc.name,
            clip_ids: doc.clip_ids,
      }
}