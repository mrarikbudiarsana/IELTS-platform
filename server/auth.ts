import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from './db';
import { User, UserRole } from '../shared/types';

export const JWT_SECRET = process.env.JWT_SECRET || 'ielts-platform-pilot-secret-jwt-key-2026';
export const TEACHER_SETUP_SECRET = process.env.TEACHER_SETUP_SECRET || 'arik-teacher-grant-2026';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return bcrypt.compareSync(password, hash);
}

export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function generateResetToken(): { token: string; expiresAt: string } {
  const token = crypto.randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 mins
  return { token, expiresAt: expires };
}

export function mapUserRow(row: any): User {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role as UserRole,
    testTypePreference: row.test_type_preference,
    targetBand: row.target_band ? Number(row.target_band) : undefined,
    testDate: row.test_date || undefined,
    createdAt: row.created_at,
  };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const row = db.prepare('SELECT * FROM users WHERE id = ?').get(decoded.id);
    if (!row) {
      res.status(401).json({ error: 'User not found' });
      return;
    }
    req.user = mapUserRow(row);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: `Access forbidden: requires one of [${roles.join(', ')}] roles, your role is ${req.user.role}`,
      });
      return;
    }
    next();
  };
}
