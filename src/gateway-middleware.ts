import JWT from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from './error-handler';

const tokens: string[] = [
  'auth',
  'seller',
  'buyer',
  'gig',
  'search',
  'order',
  'message',
  'review',
];

export function verifyGatewayRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.headers?.gatewayToken) {
    throw new UnauthorizedError(
      'Invalid Request',
      'verifyGatewayRequest(): Req token does not match with any vaild token'
    );
  }

  const token: string = req.headers.gatewayToken as string;

  if (!token) {
    throw new UnauthorizedError(
      'Invalid Request',
      'verifyGatewayRequest(): The token does not exist'
    );
  }

  try {
    const payload: { id: string; iat: number } = JWT.verify(token, ' ') as {
      id: string;
      iat: number;
    };
    if (!tokens.includes(payload.id)) {
      throw new UnauthorizedError(
        'Invalid Request',
        'verifyGatewayRequest(): The payload is invalid'
      );
    }
    next();
  } catch (error) {
    throw new UnauthorizedError(
      'Invalid Request',
      'verifyGatewayRequest(): The token does not exist'
    );
  }
}
