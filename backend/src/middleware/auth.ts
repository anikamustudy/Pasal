import { Request, Response, NextFunction } from 'express';
import { auth } from '../config/firebase';

// Extend Express Request to include user information
export interface AuthRequest extends Request {
  user?: {
    uid: string;
    phoneNumber?: string;
    role?: string;
    shopId?: string;
  };
}

/**
 * Middleware to verify Firebase ID token
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'No authorization token provided',
      });
      return;
    }

    const idToken = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req.user = {
        uid: decodedToken.uid,
        phoneNumber: decodedToken.phone_number,
      };
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication error',
    });
  }
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'Admin access required',
    });
    return;
  }
  next();
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const idToken = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = {
          uid: decodedToken.uid,
          phoneNumber: decodedToken.phone_number,
        };
      } catch (error) {
        // Token invalid, continue without user
      }
    }
    next();
  } catch (error) {
    next();
  }
};
