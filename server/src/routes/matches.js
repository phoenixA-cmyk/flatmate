import { Router } from 'express';
import Match from '../models/Match.js';
import Message from '../models/Message.js';
import { publicUser } from '../models/User.js';
import { requireAuth, wrap } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

async function loadMatch(req, res) {
  const match = await Match.findById(req.params.id).populate('users');
  if (!match || !match.users.some((u) => u._id.equals(req.user._id))) {
    res.status(404).json({ message: 'Match not found' });
    return null;
  }
  return match;
}

async function shape(match, meId) {
  const other = match.users.find((u) => !u._id.equals(meId));
  const me = match.users.find((u) => u._id.equals(meId));
  const messageCount = await Message.countDocuments({ match: match._id });
  return {
    id: match._id,
    score: match.score,
    other: publicUser(other),
    lastMessageAt: match.lastMessageAt,
    createdAt: match.createdAt,
    milestones: {
      chat: messageCount > 0,
      verify: me.verification?.status === 'verified' && other.verification?.status === 'verified',
      meet: match.metBy.length >= 2,
      iMet: match.metBy.some((i) => i.equals(meId)),
      myVerified: me.verification?.status === 'verified',
      theirVerified: other.verification?.status === 'verified',
    },
  };
}

router.get('/', wrap(async (req, res) => {
  const matches = await Match.find({ users: req.user._id }).populate('users').sort({ lastMessageAt: -1, createdAt: -1 });
  const out = await Promise.all(matches.map(async (m) => {
    const s = await shape(m, req.user._id);
    const last = await Message.findOne({ match: m._id }).sort({ createdAt: -1 });
    return { ...s, lastMessage: last ? { text: last.text, mine: last.sender.equals(req.user._id) } : null };
  }));
  res.json({ matches: out });
}));

router.get('/:id', wrap(async (req, res) => {
  const match = await loadMatch(req, res);
  if (match) res.json({ match: await shape(match, req.user._id) });
}));

router.post('/:id/met', wrap(async (req, res) => {
  const match = await loadMatch(req, res);
  if (!match) return;
  if (!match.metBy.some((i) => i.equals(req.user._id))) match.metBy.push(req.user._id);
  await match.save();
  res.json({ match: await shape(match, req.user._id) });
}));

router.get('/:id/messages', wrap(async (req, res) => {
  const match = await loadMatch(req, res);
  if (!match) return;
  const messages = await Message.find({ match: match._id }).sort({ createdAt: 1 }).limit(500);
  res.json({ messages });
}));

router.post('/:id/messages', wrap(async (req, res) => {
  const match = await loadMatch(req, res);
  if (!match) return;
  const text = (req.body.text || '').trim();
  if (!text) return res.status(400).json({ message: 'Message is empty' });
  const message = await Message.create({ match: match._id, sender: req.user._id, text });
  match.lastMessageAt = new Date();
  await match.save();
  req.app.get('io').to(String(match._id)).emit('message', message);
  res.status(201).json({ message });
}));

export default router;
