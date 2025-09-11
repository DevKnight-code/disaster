import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

function requireAuth(req: any, res: any, next: any) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { sub: string; type: string };
    (req as any).userId = payload.sub;
    (req as any).userType = payload.type;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

router.get('/me', requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const userType = (req as any).userType as string;
  if (userType !== 'Admin') return res.status(403).json({ message: 'Forbidden' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const admin = await Admin.findOne({ userId: user._id });
  if (!admin) return res.status(404).json({ message: 'Admin profile not found' });

  res.json({
    id: String(admin._id),
    name: admin.name,
    email: admin.email,
    college: admin.college,
    noOfStudentsAllColleges: admin.noOfStudentsAllColleges,
  });
});

export default router;


