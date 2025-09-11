import mongoose, { Schema, InferSchemaType } from 'mongoose';

const DrillSchema = new Schema(
  {
    drillId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    status: { type: String, default: 'Scheduled' },
    type: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    timezone: { type: String, required: true },
    recurring: { type: Boolean, default: false },
    recurringFrequency: { type: String },
    location: { type: String, required: true },
    buildingFloor: { type: String },
    assemblyPoint: { type: String, required: true },
    altLocation: { type: String },
    expectedParticipants: { type: Number, required: true },
    externalAgencies: [{ type: String }],
    scenario: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export type DrillDoc = InferSchemaType<typeof DrillSchema> & { _id: mongoose.Types.ObjectId };
export default mongoose.model('Drill', DrillSchema);


