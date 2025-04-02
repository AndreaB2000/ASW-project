import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import * as path from 'path';
import rateLimit from 'express-rate-limit';
const cors = require('cors');
import { errorHandler, errorNotFoundHandler } from './middlewares/errorHandler';
import { connectDB } from './config/db-connection';
import cookieParser from 'cookie-parser';

// Routes
import { account } from './routes/account';
import { match } from './routes/match';
import { account } from './routes/account';
import { connectDB } from './db-connection';

// Create Express server
export const app = express();

connectDB();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));
app.use('/account', account);
app.use('/match', match);
app.use('/account', account);
app.get('/ping', (_, res) => {
  res.send('pong');
});

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); //TODO: check if this is needed
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );
}

app.use(
  cors({
    origin: '*',
  }),
);

app.use(helmet());
app.use(errorNotFoundHandler);
app.use(errorHandler);
