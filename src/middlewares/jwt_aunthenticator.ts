import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dbConfig from '../config/environment';
import { errors } from '../middlewares/error';
import redisClient from '../config/redisClient'; // ✅ Import Redis client

interface UserFromToken {
  id: number;
  email: string;
  role: 'user' | 'admin';
}

export type AuthenticatedRequest = Request & {
  authUser?: UserFromToken;
};

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return next(errors.UNAUTHORIZED);
  }

  try {
    // 🛑 Step 1: Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      console.warn('Attempt to use blacklisted token');
      return next(errors.UNAUTHORIZED);
    }

    // ✅ Step 2: Verify token
    const decoded = jwt.verify(token, dbConfig.jwtsecret) as jwt.JwtPayload;

    // ✅ Step 3: Attach user data to request
    req.authUser = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error('Invalid or expired token:', error);
    next(errors.FORBIDDEN);
  }

  
};

export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.authUser?.role !== role) {
      return res.status(403).json({
        status: "failed",
        message: `Access denied: Only ${role}s allowed`
      });
    }
    next();
  };
};
