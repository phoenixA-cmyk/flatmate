import { Router } from 'express';
import { isProfileComplete, privateUser } from '../models/User.js';
import { requireAuth, wrap } from '../middleware/auth.js';

const router = Router();
const FIELDS = ['name', 'age', 'gender', 'occupation', 'bio', 'quirk', 'city', 'area', 'budgetMin', 'budgetMax', 'sleepBy', 'cleaning', 'smoking', 'pets', 'partying'];

router.put('/', requireAuth, wrap(async (req, res) => {
  const u = req.user;
  for (const f of FIELDS) if (req.body[f] !== undefined) u[f] = req.body[f];
  if (u.age && (u.age < 18 || u.age > 70)) return res.status(400).json({ message: 'Age must be between 18 and 70' });
  if (u.budgetMin > u.budgetMax) return res.status(400).json({ message: 'Invalid budget range' });
  u.profileComplete = isProfileComplete(u);
  await u.save();
  res.json({ user: privateUser(u) });
}));

// ID verification. Demo mode auto-approves. In production, plug in a KYC partner (DigiLocker / Aadhaar eKYC etc.)
router.post('/verify', requireAuth, wrap(async (req, res) => {
  const { idType, idNumber } = req.body;
  if (!['aadhaar', 'pan', 'passport', 'driving_license'].includes(idType) || (idNumber || '').length < 4)
    return res.status(400).json({ message: 'Choose an ID type and enter the ID number' });
  const auto = process.env.VERIFY_AUTO_APPROVE !== 'false';
  req.user.verification = {
    status: auto ? 'verified' : 'pending',
    idType,
    idLast4: String(idNumber).slice(-4),
    verifiedAt: auto ? new Date() : undefined,
  };
  await req.user.save();
  res.json({ user: privateUser(req.user) });
}));

export default router;
