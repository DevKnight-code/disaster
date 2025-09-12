import type { VercelRequest, VercelResponse } from '@vercel/node';
import mongoose from 'mongoose';
import { createApp } from '../server/dist/app.js';

let cachedApp: ReturnType<typeof createApp> | null = null;
let cachedConn: typeof mongoose | null = null;
let connectingPromise: Promise<typeof mongoose> | null = null;

async function ensureDbConnection() {
  if (cachedConn && mongoose.connection.readyState === 1) return cachedConn;
  if (connectingPromise) return connectingPromise;

  const MONGO_URI = process.env.MONGO_URI as string;
  if (!MONGO_URI) throw new Error('Missing MONGO_URI');

  connectingPromise = mongoose.connect(MONGO_URI).then((conn) => {
    cachedConn = conn;
    return conn;
  }).finally(() => {
    connectingPromise = null;
  });

  return connectingPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await ensureDbConnection();
    if (!cachedApp) {
      cachedApp = createApp();
    }
    // Let Express handle the request
    return (cachedApp as any)(req, res);
  } catch (err: any) {
    console.error('API handler error', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


