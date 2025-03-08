import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Event from '../models/Event';

const router = express.Router();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as {
      userId: string;
    };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

declare module 'express' {
  interface Request {
    userId?: string;
  }
}

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  const events = await Event.find({ userId: req.userId });
  res.json(events);
});

router.post('/', authMiddleware, async (req: Request, res: Response) => {
  const event = new Event({ ...req.body, userId: req.userId });
  await event.save();
  res.json(event);
});

router.put(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json(event);
  }
);

router.delete(
  '/:id',
  authMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });
    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }
    res.json({ message: 'Event deleted' });
  }
);

export default router;
