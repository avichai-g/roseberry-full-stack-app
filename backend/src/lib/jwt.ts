import jwt, { SignOptions } from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET as string;

export function signJwt(payload: object, expiresIn: string | number = '7d'): string {
  return jwt.sign(payload, jwtSecret, { expiresIn } as SignOptions);
}

export function verifyJwt<T>(token: string): T {
  return jwt.verify(token, jwtSecret) as T;
}


