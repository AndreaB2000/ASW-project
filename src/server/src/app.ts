import express from 'express';
import logger from 'morgan';
import helmet from 'helmet';
import * as path from 'path';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler, errorNotFoundHandler } from './middlewares/errorHandler';
import { connectDB } from './config/db-connection';
import { startRoutines } from './routines/routine';

// Routes
import { router as accountRouter } from './routes/account';
import { match } from './routes/match';

// Create Express server
export const app = express();

connectDB();

// Start background routines
startRoutines();

// Express configuration
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); //TODO: check if this is needed
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );
  let protocol = 'http';
  let ip = 'localhost';
  let port = '4173';
  if (process.env.DOCKER) {
    protocol = process.env.CLIENT_PROTOCOL;
    ip = process.env.CLIENT_IP;
    port = process.env.CLIENT_PORT;
  }
  app.use(cors({ origin: `${protocol}://${ip}:${port}`, credentials: true }));
} else {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
}

app.use(express.static(path.join(__dirname, '../public')));
app.use('/account', accountRouter);
app.use('/match', match);
app.get('/ping', (_, res) => {
  res.send('pong');
});

app.use(helmet());
app.use(errorNotFoundHandler);
app.use(errorHandler);
