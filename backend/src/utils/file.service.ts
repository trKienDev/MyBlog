import fs from "fs";
import path from "path";

const getUploadPath = (folder: string) => {
      return path.join(process.cwd(), "..", "..", "uploads", folder);
};

export class FileService {
      public static async DeleteFile(folder: string, file: string): Promise<void> {
            const folderPath = getUploadPath(folder);
            const filePath = path.join(folderPath, file);

            if(fs.existsSync(filePath)) {
                  fs.unlinkSync(filePath);
            }
      }
}