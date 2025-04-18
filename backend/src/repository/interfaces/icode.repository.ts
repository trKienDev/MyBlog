import { CodeDTO } from "../../dtos/code.dto";

export interface iCodeRepository {
      GetCodes(): Promise<CodeDTO[]>;
      GetCodeById(code_id: string): Promise<CodeDTO | null>;
      getCodesByStudio(studioId: string): Promise<CodeDTO[]>;
      CreateCode(data: CodeDTO): Promise<CodeDTO>;
}