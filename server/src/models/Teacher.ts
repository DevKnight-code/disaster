import mongoose, { Schema, InferSchemaType } from 'mongoose';

const TeacherSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', index: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    college: { type: String, enum: ['ABESIT', 'ABESEC', 'KIET'], required: true },
    noOfStudents: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type TeacherDoc = InferSchemaType<typeof TeacherSchema> & { _id: mongoose.Types.ObjectId };
export default mongoose.model('Teacher', TeacherSchema);


