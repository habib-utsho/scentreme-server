import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import router from './app/routes';

const app = express();

app.use(cors());
app.use(express.json());



app.get('/', (req, res) => {
    res.send('😀 Welcome to Anindya API!');
});

app.use('/api/v1', router);


export default app;