import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import * as path from 'path';
import rateLimit from 'express-rate-limit';

import { errorHandler, errorNotFoundHandler } from './middlewares/errorHandler';

// Routes
import { index } from './routes/index';
// Create Express server
export const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev'));

app.use(express.static(path.join(__dirname, '../public')));
app.use('/', index);

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); //TODO: check if this is needed
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );
}

app.use(cors({
  origin: 'TODO', //TODO: insert here the right client IP address
}));

app.use(errorNotFoundHandler);
app.use(errorHandler);

app.use(helmet());
app.use(express.json());
