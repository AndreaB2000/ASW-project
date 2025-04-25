import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import * as path from 'path';
import { connectDB } from './db-connection';

const app = express();
app.use(express.static(path.join(__dirname, '../public/')));
const httpServer = createServer(app);
connectDB();
const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.CLIENT_IP || 'http://localhost:4173'
        : '*',
  },
});

io.on('connection', socket => {
  console.log(socket.id + ' user connected');
});

io.engine.on('connection_error', err => {
  console.log(err.req);
  console.log(err.code);
  console.log(err.message);
});

httpServer.listen(process.env.PORT || 3000);

httpServer.on('listening', () => {
  console.log(
    `Server is running on port ${process.env.PORT || 3000} in ${
      process.env.NODE_ENV || 'development'
    } mode`,
  );
});
