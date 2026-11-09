import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import { AREAS, BUDGETS, SLEEP, fmtBudget, fmtSleep } from '../format';

function Group({ tone, icon, label, children }) {
  return (
    <section className={`group tone-${tone}`}>
      <div className="group-head"><span className="g-icon">{icon}</span><span className="g-label">{label}</span></div>
      <div className="chips">{children}</div>
    </section>
  );
}
const Chip = ({ on, onClick, children }) => (
  <button type="button" className={`chip ${on ? 'on' : ''}`} onClick={onClick}>{children}</button>
);

export default function ProfileForm({ submitLabel = 'Save profile', onSaved }) {
  const { user, setUser } = useAuth();
  const [f, setF] = useState({
    name: user.name || '', age: user.age || '', gender: user.gender || '', occupation: user.occupation || '',
    bio: user.bio || '', quirk: user.quirk || '', area: user.area || '',
    budgetMin: user.budgetMin ?? null, budgetMax: user.budgetMax ?? null,
    sleepBy: user.sleepBy || null, cleaning: user.cleaning || '', smoking: user.smoking ?? null,
    pets: user.pets ?? null, partying: user.partying || '',
  });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setErr('');
    const missing = [];
    if (!f.age) missing.push('age'); if (!f.gender) missing.push('gender'); if (!f.area) missing.push('area');
    if (f.budgetMin == null) missing.push('budget'); if (!f.sleepBy) missing.push('sleep time'); if (!f.cleaning) missing.push('cleaning');
    if (f.smoking === null) missing.push('smoking'); if (f.pets === null) missing.push('pets'); if (!f.partying) missing.push('parties');
    if (missing.length) return setErr(`Please fill in: ${missing.join(', ')}`);
    setBusy(true);
    try {
      const d = await api('/profile', { method: 'PUT', body: { ...f, age: Number(f.age), city: 'Bengaluru' } });
      setUser(d.user);
      onSaved?.(d.user);
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={submit} className="stack">
      <div className="card pad stack">
        <div className="row2">
          <label className="field"><span>Name</span><input value={f.name} onChange={(e) => set('name', e.target.value)} required /></label>
          <label className="field"><span>Age</span><input type="number" min="18" max="70" value={f.age} onChange={(e) => set('age', e.target.value)} /></label>
        </div>
        <div className="row2">
          <label className="field"><span>I am</span>
            <select value={f.gender} onChange={(e) => set('gender', e.target.value)}>
              <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
            </select>
          </label>
          <label className="field"><span>Occupation</span><input value={f.occupation} placeholder="Software Engineer" onChange={(e) => set('occupation', e.target.value)} /></label>
        </div>
        <label className="field"><span>About me</span><textarea rows="3" maxLength="300" value={f.bio} placeholder="Tell potential flatmates what you're like at home" onChange={(e) => set('bio', e.target.value)} /></label>
        <label className="field"><span>Your honest quirk</span><input maxLength="80" value={f.quirk} placeholder="Parties at 2 AM · Dishes never" onChange={(e) => set('quirk', e.target.value)} /></label>
      </div>

      <Group tone="yellow" icon="👛" label="Budget (per month)">
        {BUDGETS.map(([a, b]) => <Chip key={a} on={f.budgetMin === a} onClick={() => { set('budgetMin', a); set('budgetMax', b); }}>{fmtBudget(a, b)}</Chip>)}
      </Group>
      <Group tone="blue" icon="📍" label="Location · Bengaluru">
        {AREAS.map((a) => <Chip key={a} on={f.area === a} onClick={() => set('area', a)}>{a}</Chip>)}
      </Group>
      <Group tone="pink" icon="🌙" label="Sleep by">
        {SLEEP.map((h) => <Chip key={h} on={f.sleepBy === h} onClick={() => set('sleepBy', h)}>{fmtSleep(h)}</Chip>)}
      </Group>
      <Group tone="green" icon="🧹" label="Cleaning">
        {[['daily', 'Every day'], ['weekly', 'Weekly'], ['rarely', 'Rarely']].map(([v, l]) => <Chip key={v} on={f.cleaning === v} onClick={() => set('cleaning', v)}>{l}</Chip>)}
      </Group>
      <Group tone="yellow" icon="🚬" label="Do you smoke?">
        <Chip on={f.smoking === false} onClick={() => set('smoking', false)}>No</Chip>
        <Chip on={f.smoking === true} onClick={() => set('smoking', true)}>Yes</Chip>
      </Group>
      <Group tone="blue" icon="🐶" label="Pets">
        <Chip on={f.pets === true} onClick={() => set('pets', true)}>Love them / have one</Chip>
        <Chip on={f.pets === false} onClick={() => set('pets', false)}>No pets</Chip>
      </Group>
      <Group tone="pink" icon="🎉" label="Parties at home">
        {[['never', 'Never'], ['sometimes', 'Sometimes'], ['often', 'Often']].map(([v, l]) => <Chip key={v} on={f.partying === v} onClick={() => set('partying', v)}>{l}</Chip>)}
      </Group>

      {err && <p className="error">{err}</p>}
      <button className="btn primary lg" disabled={busy}>{busy ? 'Saving…' : submitLabel}</button>
    </form>
  );
}
