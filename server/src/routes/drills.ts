import { Router } from 'express';
import { z } from 'zod';
import Drill from '../models/Drill.js';

const router = Router();

const drillSchema = z.object({
  drillId: z.string(),
  title: z.string().min(1),
  type: z.string().min(1),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  timezone: z.string().min(1),
  recurring: z.boolean().optional(),
  recurringFrequency: z.string().optional(),
  location: z.string().min(1),
  buildingFloor: z.string().optional(),
  assemblyPoint: z.string().min(1),
  altLocation: z.string().optional(),
  expectedParticipants: z.number().min(1),
  externalAgencies: z.array(z.string()).optional(),
  scenario: z.string().min(1),
});

router.get('/', async (_req, res) => {
  const drills = await Drill.find().sort({ createdAt: -1 }).limit(50);
  res.json(drills);
});

router.post('/', async (req, res) => {
  // Support minimal payload: { title, date, time } → map to full model
  const { title, date, time, status } = req.body || {};
  if (title && date && time) {
    const drill = await Drill.create({
      drillId: `DRL-${Date.now()}`,
      title,
      status: status || 'Scheduled',
      type: 'General',
      date,
      startTime: time,
      endTime: time,
      timezone: 'IST (UTC+05:30)',
      recurring: false,
      location: 'TBD',
      assemblyPoint: 'Main Assembly',
      expectedParticipants: 1,
      scenario: 'Scheduled via simple form',
    });
    return res.status(201).json(drill);
  }

  const parsed = drillSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const drill = await Drill.create(parsed.data);
  res.status(201).json(drill);
});

export default router;



