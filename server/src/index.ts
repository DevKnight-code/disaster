import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app';

const app = createApp();

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


