import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      account?: {
        username: string;
        email: string;
      } & JwtPayload;
    }
  }
}
