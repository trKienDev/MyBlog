import { CustomRequest } from '../interfaces/CustomRequest';
import { ServerResponse } from 'http';
import { ValidateIdRequest } from '../interfaces/validated-id-request';
import { sendError } from './response.js';

const validateId = ( handler: (req: ValidateIdRequest, res: ServerResponse) => Promise<void> | void ) => {
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


const validateIds = (paramNames: string[], handler: (req: CustomRequest, res: ServerResponse) => Promise<void> | void) => {
      return async (req: CustomRequest, res: ServerResponse) => {
            const missingParams = paramNames.filter(param => !req.params?.[param]);
            
            if (missingParams.length > 0) {
                  return sendError(res, 400, new Error(`Missing params: ${missingParams.join(', ')}`));
            }

            return handler(req, res);
      };
};

export const validated_id = {
      validateId,
      validateIds,
}
  