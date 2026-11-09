import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User, { privateUser } from '../models/User.js';
import { requireAuth, signToken, wrap } from '../middleware/auth.js';

const router = Router();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/register', wrap(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name?.trim() || !emailRe.test(email || '') || (password || '').length < 6)
    return res.status(400).json({ message: 'Enter a name, a valid email and a password of 6+ characters' });
  if (await User.findOne({ email: email.toLowerCase() }))
    return res.status(409).json({ message: 'An account with this email already exists' });
  const user = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ token: signToken(user._id), user: privateUser(user) });
}));

router.post('/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
  if (!user || !(await bcrypt.compare(password || '', user.password)))
    return res.status(401).json({ message: 'Wrong email or password' });
  res.json({ token: signToken(user._id), user: privateUser(user) });
}));

router.get('/me', requireAuth, (req, res) => res.json({ user: privateUser(req.user) }));

export default router;
