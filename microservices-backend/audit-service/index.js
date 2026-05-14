import express from 'express';
import cors from 'cors';
import logRequest  from './app/middlewares/logRequest.js';
import handleError from './app/middlewares/handleError.js';
import setRoutes   from './app/routes/index.js';
import dotenv from 'dotenv';

dotenv.config();

// FORZAR ENTORNO DOCKER
process.env.NODE_ENV = 'docker';

const PORT = process.env.PORT || 3600;
const app  = express();

app.disable('etag');
app.use(cors());
app.use(express.json());
app.use(logRequest);

setRoutes(app);

app.use(handleError);

app.listen(PORT, () => {
    console.log(`Audit service running on port ${PORT}`);
});


