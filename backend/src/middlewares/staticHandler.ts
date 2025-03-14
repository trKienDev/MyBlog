import fs from 'fs';
import path from 'path';
import { IncomingMessage, ServerResponse } from 'http';

export function handleStaticFiles(req: IncomingMessage, res: ServerResponse): boolean {
      // Kiểm tra nếu url bắt đầu bằng /uploads
      if (!req.url?.startsWith('/uploads')) {
            return false; // Không xử lý, để router khác làm
      }

      // Tạo đường dẫn tuyệt đối đến file cần trả về
      const filePath = path.join(process.cwd(), '..', '..', 'uploads', req.url.replace('/uploads', ''));
      // Lưu ý: Cân nhắc lại đường dẫn cho phù hợp, tránh xung đột

      // Kiểm tra file
      try {
            const stats = fs.statSync(filePath);
            if (!stats.isFile()) {
                  res.statusCode = 404;
                  res.end('File not found');
                  return true;
            }
      } catch (err) {
            res.statusCode = 404;
            res.end('File not found');
            return true;
      }

      // Đọc file
      fs.readFile(filePath, (readErr, data) => {
            if (readErr) {
                  res.statusCode = 500;
                  res.end('Error reading file');
            return;
            }
            
            // Xác định Content-Type
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes: { [key: string]: string } = {
                  '.jpg': 'image/jpeg',
                  '.jpeg': 'image/jpeg',
                  '.png': 'image/png',
                  '.gif': 'image/gif',
                  '.txt': 'text/plain',
                  '.html': 'text/html',
                  '.css': 'text/css',
                  '.js': 'application/javascript',
            };

            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
            res.statusCode = 200;
            res.end(data);
      });

      return true;
}
