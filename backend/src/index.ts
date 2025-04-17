import express from 'express';
import cors from 'cors';
import { baseRouter } from './router/base';
const app =  express();

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));
app.use(express.json());
app.use('/api/v1',baseRouter);

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
});