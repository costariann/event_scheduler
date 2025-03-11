import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import eventRoutes from './routes/event';

dotenv.config();

export const app = express();
app.use(express.json());
app.use(cors());

const mongoURI = process.env.MONGO_URI;
if (!mongoURI) throw new Error('MONGO_URL is not defined in .env');
mongoose
  .connect(mongoURI)
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB connected');
    }
  })
  .catch((err) => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
  res.send('Event Scheduler Backend is running!');
});

const PORT = process.env.PORT || 3001;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
