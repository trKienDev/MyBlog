import { IncomingMessage, ServerResponse } from "http";
import * as path from 'path';
import * as fs from 'fs';

// Controller để xử lý route / About
export const getAdminPage = (req: IncomingMessage, res: ServerResponse) => {
        const aboutData = {
                title : "Admin",
        };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(aboutData));
};







