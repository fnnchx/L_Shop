import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.cookies.userId;
        
        if (!userId) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const user = await userService.getUserById(userId);
        
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        (req as any).user = user;
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Server error' });
    }
};