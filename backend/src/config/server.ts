import http,  { IncomingMessage, ServerResponse } from 'http';
import { userRoutes } from '../routes/users.route.js';
import { adminRoutes } from '../routes/admin.route.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS' ); // Các phương thức được phép
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Các header được phép
}

// Create server
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
        // Thiết lập CORS cho tất cả các yêu cầu
        setCorsHeaders(res);
        
        // Nếu là yêu cầu OPTIONS (CORS Preflight), trả về ngay lập tức
        if(req.method === 'OPTIONS') {
                res.statusCode = 204; // No Content
                res.end();
                return;
        }
        // Gọi hàm handleRoutes để xử lý các route khác
        userRoutes(req, res);
        adminRoutes(req, res);
});

// Start server
server.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
});


