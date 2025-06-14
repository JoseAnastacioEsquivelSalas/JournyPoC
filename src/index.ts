import 'reflect-metadata';
import express from 'express';
import dotenv from 'dotenv';
import { container } from './container';
import { createRoutes } from './interface/http/routes';

dotenv.config();

const app = express();
app.use(express.json());

createRoutes(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));