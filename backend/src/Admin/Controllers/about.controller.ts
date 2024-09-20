import { IncomingMessage, ServerResponse } from "http";
import * as path from 'path';
import * as fs from 'fs';

// Controller để xử lý route / About
export const getAboutPage = (req: IncomingMessage, res: ServerResponse) => {
        const aboutData = {
                title : "About Us",
                description : "This is about our website",
                content : "Welcome to our page. We are happy to share with you about us!",
        };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(aboutData));
};

