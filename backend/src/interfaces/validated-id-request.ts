import { CustomRequest } from "./CustomRequest.js";

export interface ValidateIdRequest extends CustomRequest {
      params: {
            id: string;
            [key: string]: string;
      };
}