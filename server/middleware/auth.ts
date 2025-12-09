import { Request, Response, NextFunction } from 'express';
import { UserRole } from '@shared/types';
import { storage } from '../storage';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
        claims: any;
      };
    }
  }
}

// Check if user is authenticated
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'Unauthorized - Please log in' });
  }
  next();
}

// Check if user has one of the allowed roles
export function checkRole(allowedRoles: UserRole[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized - Please log in' });
    }

    try {
      // Fetch fresh user role from database to handle role updates
      const freshUser = await storage.getUser(req.user.id);
      const userRole = freshUser?.role || req.user.role;
      
      if (!allowedRoles.includes(userRole as UserRole)) {
        return res.status(403).json({ 
          message: `Forbidden - This endpoint requires one of these roles: ${allowedRoles.join(', ')}`,
          yourRole: userRole
        });
      }

      // Update request user with fresh role
      req.user.role = userRole as UserRole;
      next();
    } catch (error) {
      console.error("Error checking user role:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

// Specific role checkers for convenience
export const requireCustomer = checkRole(['customer']);
export const requireVendor = checkRole(['vendor']);
export const requireDelivery = checkRole(['delivery']);
export const requireAdmin = checkRole(['admin']);
export const requireCustomerOrAdmin = checkRole(['customer', 'admin']);
export const requireVendorOrAdmin = checkRole(['vendor', 'admin']);
