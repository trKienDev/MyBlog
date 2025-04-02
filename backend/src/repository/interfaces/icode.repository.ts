import { CodeDTO } from "../../dtos/code.dto";

export interface iCodeRepository {
      GetCodes(): Promise<CodeDTO[]>;
      getCodesByStudio(studioId: string): Promise<CodeDTO[]>;
      CreateCode(data: CodeDTO): Promise<CodeDTO>;
}