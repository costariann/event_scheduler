import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, password: hashedPassword });
  try {
    await user.save();
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'secret',
      {
        expiresIn: '1h',
      }
    );
    res.json({ message: 'User registered', token, hashedPassword });
  } catch (err) {
    console.log('Registration error:', err);
    res.status(400).json({ message: 'Username already exists' });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }
  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET || 'secret',
    {
      expiresIn: '1h',
    }
  );
  res.json({ token });
});

export default router;
