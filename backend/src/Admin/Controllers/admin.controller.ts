import { IncomingMessage, ServerResponse } from "http";
import { CustomRequest } from "../../interfaces/CustomRequest.js";

// Controller để xử lý route / About
export const getAdminPage = (req: CustomRequest, res: ServerResponse) => {
        const adminData = {
                title : "Admin",
        };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(adminData));
};







