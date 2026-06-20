import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './app/routes';
import { globalErrHandler, notFoundErrHandler } from './app/middleware/errHandler';

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());





// Routes
app.get('/', (req, res) => {
    res.send('😀 Welcome to Anindya API!');
});
app.use('/api/v1', router);

// Error handling middleware
app.use(notFoundErrHandler)
app.use(globalErrHandler)


export default app;