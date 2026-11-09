import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Avatar from '../components/Avatar.jsx';
import Ring from '../components/Ring.jsx';
import { AREAS, fmtBudget, fmtSleep } from '../format';

export default function Discover() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [area, setArea] = useState('');
  const [verified, setVerified] = useState(false);
  const [leaving, setLeaving] = useState('');
  const [match, setMatch] = useState(null);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setErr('');
    try {
      const q = new URLSearchParams();
      if (area) q.set('area', area);
      if (verified) q.set('verified', 'true');
      setProfiles((await api(`/discover?${q}`)).profiles);
    } catch (e) { setErr(e.message); } finally { setLoading(false); }
  }, [area, verified]);
  useEffect(() => { load(); }, [load]);

  async function act(kind) {
    const p = profiles[0];
    if (!p || leaving) return;
    setLeaving(kind);
    try {
      const res = await api(`/discover/${p.id}/${kind}`, { method: 'POST' });
      if (res.matched) setMatch({ ...res, score: p.compat.score });
    } catch (e) { setErr(e.message); }
    setTimeout(() => { setProfiles((l) => l.slice(1)); setLeaving(''); }, 280);
  }

  const p = profiles[0];
  return (
    <main className="container">
      <div className="filters">
        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">All areas</option>
          {AREAS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <label className="toggle"><input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} /> Verified only</label>
      </div>
      {err && <p className="error">{err}</p>}

      {loading ? <div className="center-screen short"><div className="spinner" /></div> : !p ? (
        <div className="empty card pad">
          <div className="big-icon">🏠</div>
          <h3>You're all caught up</h3>
          <p className="muted">No more profiles with these filters. Try another area, or check back soon.</p>
          <Link className="btn ghost" to="/matches">View matches</Link>
        </div>
      ) : (
        <div className="deck">
          {profiles[1] && <div className="card ghost-card" />}
          <article className={`card profile-card ${leaving}`}>
            <div className="pc-top" style={{ '--c': 'var(--pink)' }}>
              <Avatar name={p.name} size={96} square />
              <Ring value={p.compat.score} />
            </div>
            <div className="pc-body">
              <h2>{p.name}, {p.age} {p.verified && <span className="vbadge" title="ID verified">✓ Verified</span>}</h2>
              <p className="muted">{p.occupation || 'Flatmate hunter'} · {p.area}</p>
              {p.quirk && <p className="quirk">{p.quirk}</p>}
              {p.bio && <p className="bio">{p.bio}</p>}
              <div className="facts">
                <span>👛 {fmtBudget(p.budgetMin, p.budgetMax)}</span>
                <span>🌙 By {fmtSleep(p.sleepBy)}</span>
                <span>🧹 {p.cleaning === 'daily' ? 'Every day' : p.cleaning}</span>
                <span>🚬 {p.smoking ? 'Smokes' : 'No smoke'}</span>
                <span>🐾 {p.pets ? 'Pets' : 'No pets'}</span>
                <span>🎉 {p.partying}</span>
              </div>
              <div className="tags">
                {p.compat.good.map((t) => <span key={t} className="tag good">{t}</span>)}
                {p.compat.clash.map((t) => <span key={t} className="tag bad">{t}</span>)}
              </div>
            </div>
            <div className="pc-actions">
              <button className="round pass" onClick={() => act('pass')} aria-label="Pass">✕</button>
              <button className="round like" onClick={() => act('like')} aria-label="Like">♥</button>
            </div>
          </article>
        </div>
      )}

      {match && (
        <div className="modal" onClick={() => setMatch(null)}>
          <div className="card pad modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="big-icon">🎉</div>
            <h2>It's a match!</h2>
            <p className="muted">You and {match.with.name} are {match.score}% compatible. Say hi and do a vibe check.</p>
            <Link to={`/chat/${match.matchId}`} className="btn primary lg">Start chatting</Link>
            <button className="btn ghost" onClick={() => setMatch(null)}>Keep browsing</button>
          </div>
        </div>
      )}
    </main>
  );
}
