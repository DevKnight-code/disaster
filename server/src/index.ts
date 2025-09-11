import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';

import authRouter from './routes/auth.js';
import alertsRouter from './routes/alerts.js';
import drillsRouter from './routes/drills.js';
import studentsRouter from './routes/students.js';
import teachersRouter from './routes/teachers.js';
import adminsRouter from './routes/admins.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/drills', drillsRouter);
app.use('/api/students', studentsRouter);
app.use('/api/teachers', teachersRouter);
app.use('/api/admins', adminsRouter);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/secure_school_shield';
const PORT = Number(process.env.PORT || 4000);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });


