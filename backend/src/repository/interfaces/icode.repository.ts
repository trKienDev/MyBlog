import { CodeDTO } from "../../dtos/code.dto";

export interface ICodeRepository {
      CreateCode(data: CodeDTO): Promise<CodeDTO>;
}