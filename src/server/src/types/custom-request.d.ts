import { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      /**
       * The JWT payload, which contains the username and email of the authenticated user.
       * This is populated when the user is authenticated.
       */
      account?: {
        /**
         * The username of the authenticated user.
         */
        username: string;
        /**
         * The email of the authenticated user.
         */
        email: string;
      } & JwtPayload;
    }
  }
}
