import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from './config/mongodb.js';

const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(cors({credentials: true}));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to the backend server!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});