import { IncomingMessage } from "http";
import { ICodeRepository } from "../repository/interfaces/icode.repository.js";
import { parseJSON } from "../middlewares/jsonParser.js";
import { CodeDTO } from "../dtos/code.dto.js";

export class CodeService {
      private codeRepo: ICodeRepository;
      constructor(codeRepository: ICodeRepository) {
            this.codeRepo = codeRepository;
      }

      public async CreateCode(req: IncomingMessage) {
            const requiredFileds = ['studio', 'code'];
            const body = await parseJSON(req, requiredFileds);
            const { studio, code } = body;
            
            const data: CodeDTO = { studio_id: studio, code };

            const newCode = await this.codeRepo.CreateCode(data);
            return newCode;
      }
}