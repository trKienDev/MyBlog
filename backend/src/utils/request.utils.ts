import { CustomRequest } from "../interfaces/CustomRequest.js";

export const ExtractIdFromRequest = (req: CustomRequest): string => {
      return (req as any).body.id || "";
}

export const ExtractNameFromRequest = (req: CustomRequest): string => {
      return (req as any).body.name || "";
}