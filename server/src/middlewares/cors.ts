import { ServerResponse } from "http";

export function setCorsHeaders(res: ServerResponse) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS, PUT');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}