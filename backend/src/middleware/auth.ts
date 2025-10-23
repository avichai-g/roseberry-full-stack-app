import { Request, Response, NextFunction } from 'express';
import { verifyJwt } from '../lib/jwt.js';

export interface AuthUser {
  userId: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid Authorization header' });
  }
  const token = header.slice('Bearer '.length);
  try {
    const payload = verifyJwt<AuthUser>(token);
    req.auth = payload;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}


