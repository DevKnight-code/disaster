import mongoose, { Schema, InferSchemaType } from 'mongoose';

const AdminSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', index: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    college: { type: String, enum: ['ABESIT', 'ABESEC', 'KIET'], required: true },
    noOfStudentsAllColleges: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type AdminDoc = InferSchemaType<typeof AdminSchema> & { _id: mongoose.Types.ObjectId };
export default mongoose.model('Admin', AdminSchema);


