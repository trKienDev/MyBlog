import { IncomingMessage, ServerResponse } from "http";
import { CustomRequest } from "./CustomRequest";

export interface Route {
      method: string;
      path: string;
      handler: (req: CustomRequest, res: ServerResponse) => void;
}