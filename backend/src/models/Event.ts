import mongoose from 'mongoose';

interface IEvent extends mongoose.Document {
  title: string;
  date: Date;
  time: string;
  location?: string;
  description?: string;
  userId: mongoose.Types.ObjectId;
}

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  userId: { type: mongoose.Types.ObjectId, required: true },
});

export default mongoose.model<IEvent>('Event', eventSchema);
