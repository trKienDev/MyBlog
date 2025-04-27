import { CustomRequest } from '../interfaces/CustomRequest';
import { ServerResponse } from 'http';
import { ValidateIdRequest } from '../interfaces/validated-id-request';
import { sendError } from './response.js';

export const ValidateId = ( handler: (req: ValidateIdRequest, res: ServerResponse) => Promise<void> | void ) => {
      return async (req: CustomRequest, res: ServerResponse) => {
            const { id } = req.params || {};
            if (!id) {
                  return sendError(res, 400, new Error('request missing id.'));
            }

            const reqWithId = req as ValidateIdRequest;
            reqWithId.params.id = id;
      
            return handler(reqWithId, res);
      };
};


export const ValidateIds = (paramNames: string[], handler: (req: CustomRequest, res: ServerResponse) => Promise<void> | void) => {
      return async (req: CustomRequest, res: ServerResponse) => {
            const missingParams = paramNames.filter(param => !req.params?.[param]);
            
            if (missingParams.length > 0) {
                  return sendError(res, 400, new Error(`Missing params: ${missingParams.join(', ')}`));
            }

            return handler(req, res);
      };
};
  