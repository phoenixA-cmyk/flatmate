import { Router } from 'express';
import User, { publicUser } from '../models/User.js';
import Match from '../models/Match.js';
import { requireAuth, wrap } from '../middleware/auth.js';
import { compatibility } from '../utils/score.js';

const router = Router();
router.use(requireAuth);

router.get('/', wrap(async (req, res) => {
  const me = req.user;
  if (!me.profileComplete) return res.status(400).json({ message: 'Complete your profile first' });
  const { area, verified } = req.query;
  const query = {
    _id: { $nin: [me._id, ...me.likes, ...me.passes] },
    profileComplete: true,
    city: me.city,
  };
  if (area) query.area = area;
  if (verified === 'true') query['verification.status'] = 'verified';

  const candidates = await User.find(query).limit(100);
  const ranked = candidates
    .map((c) => ({ ...publicUser(c), compat: compatibility(me, c) }))
    .sort((a, b) => b.compat.score - a.compat.score)
    .slice(0, 30);
  res.json({ profiles: ranked });
}));

router.post('/:id/like', wrap(async (req, res) => {
  const me = req.user;
  const other = await User.findById(req.params.id);
  if (!other || other._id.equals(me._id)) return res.status(404).json({ message: 'Profile not found' });
  if (!me.likes.some((i) => i.equals(other._id))) me.likes.push(other._id);
  await me.save();

  let match = null;
  if (other.likes.some((i) => i.equals(me._id))) {
    const users = [me._id, other._id].sort((a, b) => String(a).localeCompare(String(b)));
    match = (await Match.findOne({ users })) || (await Match.create({ users, score: compatibility(me, other).score }));
  }
  res.json({ matched: !!match, matchId: match?._id, with: match ? publicUser(other) : undefined });
}));

router.post('/:id/pass', wrap(async (req, res) => {
  if (!req.user.passes.some((i) => i.equals(req.params.id))) req.user.passes.push(req.params.id);
  await req.user.save();
  res.json({ ok: true });
}));

export default router;
