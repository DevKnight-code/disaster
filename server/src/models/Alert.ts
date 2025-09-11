import mongoose, { Schema, InferSchemaType } from 'mongoose';

const severityOptions = ['Critical', 'High', 'Medium', 'Low'] as const;
const priorityOptions = ['Immediate', 'Urgent', 'Standard'] as const;

const FileSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { _id: false }
);

const AlertSchema = new Schema(
  {
    alertId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    severity: { type: String, enum: severityOptions, required: true },
    priority: { type: String, enum: priorityOptions, required: true },
    area: { type: String, required: true },
    latitude: { type: String },
    longitude: { type: String },
    incidentDate: { type: String, required: true },
    incidentTime: { type: String, required: true },
    expectedDuration: { type: String },
    description: { type: String, required: true },
    instructions: { type: String, required: true },
    resourcesNeeded: { type: String },
    contact: { type: String, required: true },
    channels: [{ type: String, required: true }],
    files: { type: [FileSchema], default: [] },
    createdBy: { type: mongoose.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export type AlertDoc = InferSchemaType<typeof AlertSchema> & { _id: mongoose.Types.ObjectId };
export default mongoose.model('Alert', AlertSchema);


