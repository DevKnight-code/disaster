import mongoose, { Schema, InferSchemaType } from 'mongoose';

const StudentSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User', index: true, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    college: { type: String, enum: ['ABESIT', 'ABESEC', 'KIET'], required: true },
    modulesCompleted: { type: Number, default: 0 },
    drillsCompleted: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    progressByModule: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

export type StudentDoc = InferSchemaType<typeof StudentSchema> & { _id: mongoose.Types.ObjectId };
export default mongoose.model('Student', StudentSchema);


