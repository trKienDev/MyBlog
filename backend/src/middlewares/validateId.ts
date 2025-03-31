import { CustomRequest } from '../interfaces/CustomRequest';
import { ServerResponse } from 'http';
import { ValidateIdRequest } from '../interfaces/ValidatedIdRequest';
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
