import { rejects } from "assert";
import { IncomingMessage } from "http";

export interface CustomRequest extends IncomingMessage {
      body?: any;
}

/**
 * Middleware parse JSON linh động.
 * @param req - Request nhận vào.
 * @param required_fields - Mảng các tên trường bắt buộc có trong JSON (tùy chọn).
 * @returns Promise trả về dữ liệu JSON đã parse.
 */

export const parseJSON = (req: IncomingMessage, required_fields?: string[]): Promise<any> => {
      return new Promise((resolve, reject) => {
            try {

                  let body = '';
                  req.on('data', (chunk) => {
                        body += chunk.toString();
                  });

                  req.on('end', () => {
                        try {
                              const parsed = body ? JSON.parse(body) : {};
                              if(required_fields && required_fields.length > 0) {
                                    for(const field of required_fields) {
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
            } catch(error) {
                  console.error('Error in parseJSON: ', error);
            }
      });
}