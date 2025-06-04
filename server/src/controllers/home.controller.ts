import { IncomingMessage, ServerResponse } from "http";
import * as path from 'path';
import * as fs from 'fs';

// Controller để xử lý route / About
export const getHomePage = (req: IncomingMessage, res: ServerResponse) => {
        const homepageData = {
                title : "Homepage",
                description : "This is homepage of website",
                content : "Welcome to homepage",
        };
        
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(homepageData));
};