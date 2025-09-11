import { Router } from 'express';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import User from '../models/User.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// Simple auth middleware
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
  if (userType !== 'Student') return res.status(403).json({ message: 'Forbidden' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const student = await Student.findOne({ userId: user._id });
  if (!student) return res.status(404).json({ message: 'Student profile not found' });

  res.json({
    id: String(student._id),
    name: student.name,
    email: student.email,
    college: student.college,
    modulesCompleted: student.modulesCompleted,
    drillsCompleted: student.drillsCompleted,
    points: student.points || 0,
    progressByModule: Object.fromEntries((student.progressByModule || new Map()).entries()),
  });
});

// Update progress and points for a module
router.post('/progress', requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const userType = (req as any).userType as string;
  if (userType !== 'Student') return res.status(403).json({ message: 'Forbidden' });

  const { moduleKey, correctIncrement } = req.body as { moduleKey: string; correctIncrement: number };
  if (!moduleKey || typeof correctIncrement !== 'number') {
    return res.status(400).json({ message: 'moduleKey and correctIncrement required' });
  }

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const student = await Student.findOne({ userId: user._id });
  if (!student) return res.status(404).json({ message: 'Student profile not found' });

  const prev = (student.progressByModule?.get(moduleKey) as number) || 0;
  const addedProgress = 10 * correctIncrement; // 10% per correct answer
  const newProgress = Math.min(100, prev + addedProgress);
  student.progressByModule?.set(moduleKey, newProgress);

  const addedPoints = 10 * correctIncrement; // 10 points per correct answer
  student.points = (student.points || 0) + addedPoints;

  // Count module as completed if reached 100%
  if (prev < 100 && newProgress === 100) {
    student.modulesCompleted = (student.modulesCompleted || 0) + 1;
  }

  await student.save();

  res.json({
    points: student.points,
    progress: newProgress,
    progressByModule: Object.fromEntries((student.progressByModule || new Map()).entries()),
    modulesCompleted: student.modulesCompleted,
  });
});

// List students for the authenticated teacher's college
router.get('/by-college', requireAuth, async (req, res) => {
  const userId = (req as any).userId as string;
  const userType = (req as any).userType as string;
  if (userType !== 'Teacher') return res.status(403).json({ message: 'Forbidden' });

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const students = await Student.find({ college: user.college }).select('name email college modulesCompleted drillsCompleted');
  res.json(students.map((s) => ({
    id: String(s._id),
    name: s.name,
    email: s.email,
    college: s.college,
    modulesCompleted: s.modulesCompleted || 0,
    drillsCompleted: s.drillsCompleted || 0,
  })));
});

export default router;


