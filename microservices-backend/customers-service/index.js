import express from 'express';
import cors from 'cors';
import logRequest  from './app/middlewares/logRequest.js';
import handleError from './app/middlewares/handleError.js';
import setRoutes   from './app/routes/index.js';

const PORT = process.env.PORT || 3500;
const app  = express();

app.disable('etag');
app.use(cors());
app.use(express.json());
app.use(logRequest);

setRoutes(app);

app.use(handleError);

app.listen(PORT, () => {
    console.log(`Customers service escuchando en el puerto ${PORT}`);
});