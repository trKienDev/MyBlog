import { IncomingMessage, ServerResponse } from "http";
import ActressModel from "../models/actress.model.js";

// create 
export const createActress = async ( req: IncomingMessage , res: ServerResponse ) => {
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

// read
export const getActress = async ( req: IncomingMessage , res: ServerResponse ) => {
        try {
                // Truy vấn tất cả các actress từ CSDL
                const actress = await ActressModel.find();
                res.statusCode = 200;
                res.setHeader ( 'Content-Type' , 'application/json' );
                res.end ( JSON.stringify( actress ));
        }
        catch ( error ) {
                res.statusCode = 500;
                res.setHeader ( 'Content-Type' , 'application/json' );
                res.end ( JSON.stringify( { message : 'Error fetching actresses.' , error } ));
        } 
}

// update
export const updateActress = async ( req: IncomingMessage , res: ServerResponse ) => {
        const urlPath = req.url?.split('/');
        const actressID = urlPath?.[ urlPath.length - 1 ]; // Lấy ID từ URL
        
        if ( !actressID ) {
                res.statusCode = 400;
                res.setHeader ( 'Content-Type' , 'application/json' );
                return res.end ( JSON.stringify ({ message : 'Unable to get actress ID !' }));
        }
        
        let bodyJSON = '';
        req.on ( 'data' , chunk => {
                bodyJSON += chunk.toString();
        });
        req.on ( 'end' , async () => {
                try {
                        const updateData = JSON.parse ( bodyJSON );
                        const updatedActress = await ActressModel.findByIdAndUpdate( actressID , updateData , { new : true, runValidators : true });

                        if ( !updateActress ) {
                                res.statusCode = 404;
                                res.setHeader ( 'Content-Type' , 'application/json' );
                                return res.end(JSON.stringify({ message: 'Actress not found.' }));
                        }

                        res.statusCode = 200;
                        res.setHeader ( 'Content-Type' , 'application/json' );
                        return res.end(JSON.stringify( updatedActress));
                } 
                catch ( error ) {
                        res.statusCode = 500;
                        res.setHeader ( 'Content-Type' , 'application/json' );
                        return res.end ( JSON.stringify( { message : 'Error updating actress.', error }) );
                }
        } )
}

// delete
export const deleteActress = async ( req: IncomingMessage , res: ServerResponse ) => {
        // get ID actress from URL 
        const urlPath = req.url?.split('/');
        const actressID = urlPath?.[urlPath.length - 1];

        if ( !actressID ) {
                res.statusCode = 400;
                res.setHeader ( 'Content-Type' , 'application/json' );
                return res.end ( JSON.stringify ({ message : 'unable to get ID of actress' }));
        }

        try {
                // Find and delete 
                const actressDel = await ActressModel.findByIdAndDelete(actressID);
                
                if ( !actressDel ) {
                        res.statusCode = 404; 
                        res.setHeader ( 'Content-Type' , 'application/json' );
                        return res.end ( JSON.stringify ({ message : 'actress not found !' }));
                }

                res.statusCode = 200;
                res.setHeader ( 'Content-Type' , 'application/json' );
                return res.end ( JSON.stringify ({ message : 'actress deleted successfully. ' , actress: actressDel }));
        } 
        catch (error) {
                res.statusCode = 500;
                res.setHeader ( 'Content-Type' , 'application/json' );
                return res.end ( JSON.stringify ({ message : 'Error deleting actress' , error }));
        }
}

