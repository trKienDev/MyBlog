import { CustomRequest } from "../interfaces/CustomRequest.js";

export const ExtractIdFromRequest = (req: CustomRequest): string => {
      return (req as any).body.id || "";
}

export const ExtractNameFromRequest = (req: CustomRequest): string => {
      return (req as any).body.name || "";
}

export const extractParamFromRequest = (req: CustomRequest, param: string): string => {
      return (req as any).body[param] || "";
}

export const request_utils = {
      extractParamFromRequest,
}