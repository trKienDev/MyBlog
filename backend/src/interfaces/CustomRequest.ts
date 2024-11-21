// Khai báo interface tùy chỉnh cho req 
// Vì bạn không sử dụng express, req là một instance của IncomingMessage. 
// Chúng ta cần mở rộng kiểu của nó để thêm các thuộc tính file và body.

// --> Sử dụng cho hàm handleUpload trong HelperFunction/uploadFile.ts
import { IncomingMessage } from "http";
import { ParsedUrlQuery } from "querystring";

export interface CustomRequest extends IncomingMessage {
    file?: {
        filename: string;
        path: string;
        mimetype: string;
    };
    files?: {
        [fieldname: string]: {
            filename: string;
            path: string;
            mimetype: string;
        }[];
    };
    body: Record<string, any> | ParsedUrlQuery;
}
