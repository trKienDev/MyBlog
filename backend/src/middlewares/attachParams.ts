import { parse } from "url";
import { CustomRequest } from "../interfaces/CustomRequest.js"
import { ServerResponse } from "http";

export const attachParams = (req: CustomRequest, res: ServerResponse, next: Function) => {
        const urlParts = parse(req.url || "", true);
        const pathParts = (urlParts.pathname || "").split("/");
        req.params = {
                id: pathParts[pathParts.length - 1],
        };
        next();
};