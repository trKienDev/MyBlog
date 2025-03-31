import { rejects } from "assert";
import { IncomingMessage } from "http";

export interface CustomRequest extends IncomingMessage {
      body?: any;
}

/**
 * Middleware parse JSON linh động.
 * @param req - Request nhận vào.
 * @param requiredFields - Mảng các tên trường bắt buộc có trong JSON (tùy chọn).
 * @returns Promise trả về dữ liệu JSON đã parse.
 */

export const parseJSON = (req: IncomingMessage, requiredFields?: string[]): Promise<any> => {
      return new Promise((resolve, reject) => {
            let body = '';

            req.on('data', (chunk) => {
                  body += chunk.toString();
            });

            req.on('end', () => {
                  try {
                        const parsed = body ? JSON.parse(body) : {};

                        if(requiredFields && requiredFields.length > 0) {
                              for(const field of requiredFields) {
                                    if(!parsed.hasOwnProperty(field)) {
                                          return reject(new Error(`Missing required field: ${field}`));
                                    }
                              }
                        }

                        (req as CustomRequest).body = parsed;
                        resolve(parsed);
                  } catch(error: any) {
                        reject(new Error('Invalid JSON: ' + error.message));
                  }
            });

            req.on('error', (err) => {
                  reject(err);
            })
      });
}