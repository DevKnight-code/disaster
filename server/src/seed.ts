import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Alert from './models/Alert.js';
import Student from './models/Student.js';
import Teacher from './models/Teacher.js';
import Admin from './models/Admin.js';

async function runSeed() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/secure_school_shield';
  await mongoose.connect(uri);

  const user = await User.findOneAndUpdate(
    { email: 'admin@example.com' },
    {
      name: 'Admin',
      email: 'admin@example.com',
      passwordHash: 'seeded',
      type: 'Admin',
      college: 'Demo College',
    },
    { upsert: true, new: true }
  );

  await Alert.findOneAndUpdate(
    { alertId: 'SEED-ALERT-1' },
    {
      alertId: 'SEED-ALERT-1',
      title: 'Seed Alert',
      type: 'Test',
      severity: 'Low',
      priority: 'Low',
      area: 'Campus',
      incidentDate: '2025-09-11',
      incidentTime: '12:00',
      description: 'Initial seed alert to create DB and collection',
      instructions: 'None',
      contact: 'admin@example.com',
      channels: ['Email'],
      files: [],
      createdBy: user._id,
    },
    { upsert: true, new: true }
  );

  // Seed Student
  const studentUser = await User.findOneAndUpdate(
    { email: 'student@example.com' },
    {
      name: 'Seed Student',
      email: 'student@example.com',
      passwordHash: 'seeded',
      type: 'Student',
      college: 'ABESIT',
    },
    { upsert: true, new: true }
  );
  await Student.findOneAndUpdate(
    { email: 'student@example.com' },
    {
      userId: studentUser._id,
      name: 'Seed Student',
      email: 'student@example.com',
      password: 'seeded',
      college: 'ABESIT',
      modulesCompleted: 2,
      drillsCompleted: 1,
    },
    { upsert: true, new: true }
  );

  // Seed Teacher
  const teacherUser = await User.findOneAndUpdate(
    { email: 'teacher@example.com' },
    {
      name: 'Seed Teacher',
      email: 'teacher@example.com',
      passwordHash: 'seeded',
      type: 'Teacher',
      college: 'ABESEC',
    },
    { upsert: true, new: true }
  );
  await Teacher.findOneAndUpdate(
    { email: 'teacher@example.com' },
    {
      userId: teacherUser._id,
      name: 'Seed Teacher',
      email: 'teacher@example.com',
      password: 'seeded',
      college: 'ABESEC',
      noOfStudents: 30,
    },
    { upsert: true, new: true }
  );

  // Seed Admin
  const adminUser2 = await User.findOneAndUpdate(
    { email: 'admin2@example.com' },
    {
      name: 'Seed Admin',
      email: 'admin2@example.com',
      passwordHash: 'seeded',
      type: 'Admin',
      college: 'KIET',
    },
    { upsert: true, new: true }
  );
  await Admin.findOneAndUpdate(
    { email: 'admin2@example.com' },
    {
      userId: adminUser2._id,
      name: 'Seed Admin',
      email: 'admin2@example.com',
      password: 'seeded',
      college: 'KIET',
      noOfStudentsAllColleges: 5000,
    },
    { upsert: true, new: true }
  );

  console.log('Seed complete');
  await mongoose.disconnect();
}

runSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});


