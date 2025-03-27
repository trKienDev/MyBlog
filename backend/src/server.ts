import http, { IncomingMessage, ServerResponse } from "http";
import { connectDB } from "./config/db.js";
import { setCorsHeaders } from "./middlewares/cors.js";
import { handleStaticFiles } from "./middlewares/staticHandler.js";
import { handleRoutes } from "./routes/routes.js";
import { PORT } from "./config/config.js";
import { CustomRequest } from "./interfaces/CustomRequest.js";

async function main() {
      await connectDB();

      const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
            setCorsHeaders(res);

            if(req.method === 'OPTIONS') {
                  res.statusCode = 200;
                  res.end();
                  return;
            }

            const isStatic = handleStaticFiles(req, res);
            if(isStatic) {
                  return;
            }
            
            const customReq = req as CustomRequest;
            handleRoutes(customReq, res);
      });

      server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
      });
}

main().catch(err => {
      console.error('Error starting server: ', err);
      process.exit(1);
});