import http,  { IncomingMessage, ServerResponse } from 'http';
import { userRoutes } from '../routes/users.route.js';
import { adminRoutes } from '../routes/admin.route.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from "fs";
import path from "path";

// Load environment variables from ".env" file
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/MyIdol';

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
        .then(() => {
                console.log('Successfull connection');
        })
        .catch((err) => {
                console.error("Fail connection", err);
        })

// CORS headers
const setCorsHeaders = (res: ServerResponse) => {
        res.setHeader('Access-Control-Allow-Origin', '*'); // Cho phép tất cả các nguồn truy cập dữ liệu
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS, PUT' ); // Các phương thức được phép
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Các header được phép
}

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
        // Thiết lập CORS cho tất cả các yêu cầu
        setCorsHeaders(res);
        
        // Kiểm tra xem yêu cầu là OPTIONS không, nếu có thì trả về 200 OK (Khi thực hiện phương thức DELETE với yêu cầu là OPTIONS)
        if (req.method === 'OPTIONS') {
                setCorsHeaders(res); // Thêm header cho CORS
                res.statusCode = 200;
                res.end();
                return;
        }

        // Serve static files from the "upload" directory
        if(req.url?.startsWith('/uploads')) {
                const filePath = path.join(process.cwd(), 'src', 'upload', req.url.replace('/uploads', ''));
                console.log(filePath);
                // Check if the file exist
                fs.stat(filePath, (err, stats) => {
                        if(err || !stats.isFile()) {
                                res.statusCode = 404;
                                res.setHeader('Content-Type', 'text/plain');
                                res.end('File not found');
                                return;
                        }

                        // Read and serve the file
                        fs.readFile(filePath, (readErr, data) => {
                                if(readErr) {
                                        res.statusCode = 500;
                                        res.setHeader('Content-Type', 'text/plain');
                                        res.end('Error reading file');
                                        return;
                                }

                                // Set the content type based on the file extension
                                const ext = path.extname((filePath).toLowerCase());
                                const mimeTypes: { [key: string]: string } = {
                                        '.jpg': 'image/jpeg',
                                        '.jpeg': 'image/jpeg',
                                        '.png': 'image/png',
                                        '.gif': 'image/gif',
                                        '.txt': 'text/plain',
                                        '.html': 'text/html',
                                        '.css': 'text/css',
                                        '.js': 'application/javascript'
                                };

                                res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
                                res.statusCode = 200;
                                res.end(data);
                        });
                });
                return;
        }
        
        if (req.url?.startsWith('/admin')) {
                adminRoutes(req, res);
        } else if (req.url?.startsWith('/')) {
                userRoutes(req, res);
        } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Route Not Found');
        }
});

// Start server
server.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
});


