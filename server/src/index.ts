import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();

import { PORT, CLIENT_ORIGIN } from './constants';
import vacancyRoutes from './routes/vacancy.routes';
import authRoutes from './routes/auth.routes';


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/api', vacancyRoutes);
app.use('/api/auth', authRoutes); 

app.listen(PORT, () => {
  console.log(`Сервер успішно запущено на порту ${PORT}`);
});