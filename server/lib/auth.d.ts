import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      /** `User` object populated by `authMiddleware`. */
      user?: {
        userId: number;
      };
    }
  }
}