import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import logger from './middlewares/logger.middleware';
import morgan from 'morgan';

const app = express();

export const morganStream = {
  write(message: string) {
    const trimmedMessage = message.trim();
    logger.info(trimmedMessage);
  }
};

app.use(express.json());

app.use(errorHandler);
app.use(morgan("combined", { stream: morganStream }));

export default app;