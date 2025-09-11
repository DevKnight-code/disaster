import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';
import Admin from '../models/Admin.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

const signupSchema = z.object({
  name: z.string().optional(),
  email: z.string().email(),
  password: z.string().min(6),
  type: z.enum(['Student', 'Admin', 'Teacher']),
  college: z.string().min(1),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  type: z.enum(['Student', 'Admin', 'Teacher']),
  college: z.string().min(1),
});

router.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const { email, password, name, type, college } = parsed.data;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already in use' });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name, type, college });
  if (type === 'Student') {
    await Student.create({
      userId: user._id,
      name: name || '',
      email,
      password: passwordHash,
      college,
      modulesCompleted: 0,
      drillsCompleted: 0,
    });
  } else if (type === 'Teacher') {
    await Teacher.create({
      userId: user._id,
      name: name || '',
      email,
      password: passwordHash,
      college,
      noOfStudents: 0,
    });
  } else if (type === 'Admin') {
    await Admin.create({
      userId: user._id,
      name: name || '',
      email,
      password: passwordHash,
      college,
      noOfStudentsAllColleges: 0,
    });
  }
  const token = jwt.sign({ sub: String(user._id), type }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, type: user.type, college: user.college } });
});

router.post('/signin', async (req, res) => {
  const parsed = signinSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const { email, password, type, college } = parsed.data;
  const user = await User.findOne({ email, type, college });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ sub: String(user._id), type }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name, type: user.type, college: user.college } });
});

export default router;


