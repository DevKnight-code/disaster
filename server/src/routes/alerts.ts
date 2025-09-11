import { Router } from 'express';
import { z } from 'zod';
import Alert from '../models/Alert.js';

const router = Router();

const alertSchema = z.object({
  alertId: z.string(),
  title: z.string().min(1),
  type: z.string().min(1),
  severity: z.enum(['Critical', 'High', 'Medium', 'Low']),
  priority: z.enum(['Immediate', 'Urgent', 'Standard']),
  area: z.string().min(1),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
  incidentDate: z.string().min(1),
  incidentTime: z.string().min(1),
  expectedDuration: z.string().optional(),
  description: z.string().min(20),
  instructions: z.string().min(5),
  resourcesNeeded: z.string().optional(),
  contact: z.string().min(5),
  channels: z.array(z.string()).min(1),
  files: z.array(z.object({ name: z.string(), size: z.number() })).optional(),
});

router.get('/', async (_req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 }).limit(50);
  res.json(alerts);
});

router.post('/', async (req, res) => {
  const parsed = alertSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error.flatten());
  const alert = await Alert.create(parsed.data);
  res.status(201).json(alert);
});

export default router;


