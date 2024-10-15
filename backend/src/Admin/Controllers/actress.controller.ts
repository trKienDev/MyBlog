import { IncomingMessage, ServerResponse } from "http";
import ActressModel from "../models/actress.model";

// create actress
export const createActress = async (req: IncomingMessage, res: ServerResponse) => {
        let bodyJSON = '';
        // listen for the 'data' event to collect chunks of the request body
        req.on('data', chunk => {
                bodyJSON += chunk.toString(); // Append data chunk
        });
        // When the request is finished (end event), parse the body and process it
        req.on('end', async() => {
                try {
                        const { name, birth, image, skin, studio, body, breast } = JSON.parse(bodyJSON);

                        const newActress = new ActressModel({ name, birth, image, skin, studio, body, breast });
                        await newActress.save();

                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify(newActress));
                } catch (error) {
                        res.statusCode = 201;
                        res.setHeader('Content-Type', 'application/json');
                        res.end(JSON.stringify({ message: 'Error creating actress', error }));
                }
        });
}