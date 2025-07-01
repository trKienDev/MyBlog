import { IncomingMessage } from "http";
import { iAlbumRepository } from "../repository/interfaces/ialbum.repository.js";
import { parseJSON } from "../middlewares/json-parser.js";

export class AlbumService {
      private _albumRepository: iAlbumRepository;
      constructor(albumRepository: iAlbumRepository) {
            this._albumRepository = albumRepository;
      }

      async CreateAlbum(request: IncomingMessage) {
            const required_param = ['name'];
            const body = await parseJSON(request, required_param);
            const { name } = body;
            if(!name) throw new Error('param name not found!');

            const created_album = await this._albumRepository.Create(name);
            return created_album;
      }
}