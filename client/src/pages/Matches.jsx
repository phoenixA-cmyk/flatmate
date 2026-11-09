import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Avatar from '../components/Avatar.jsx';
import { timeAgo } from '../format';

export default function Matches() {
  const [matches, setMatches] = useState(null);
  const [err, setErr] = useState('');
  useEffect(() => { api('/matches').then((d) => setMatches(d.matches)).catch((e) => setErr(e.message)); }, []);

  if (err) return <main className="container"><p className="error">{err}</p></main>;
  if (!matches) return <div className="center-screen"><div className="spinner" /></div>;
  return (
    <main className="container narrow">
      <h1 className="page-title">Your matches</h1>
      {matches.length === 0 ? (
        <div className="empty card pad">
          <div className="big-icon">💬</div>
          <h3>No matches yet</h3>
          <p className="muted">When you and another person like each other, you'll see them here.</p>
          <Link className="btn primary" to="/discover">Discover flatmates</Link>
        </div>
      ) : (
        <div className="stack">
          {matches.map((m) => (
            <Link key={m.id} to={`/chat/${m.id}`} className="card pad match-row">
              <Avatar name={m.other.name} size={56} />
              <div className="grow">
                <div className="between">
                  <b>{m.other.name}, {m.other.age} {m.other.verified && <span className="vbadge">✓</span>}</b>
                  <span className="pill green sm">{m.score}%</span>
                </div>
                <p className="muted ellipsis">{m.lastMessage ? `${m.lastMessage.mine ? 'You: ' : ''}${m.lastMessage.text}` : `New match · say hi to ${m.other.name}`}</p>
                <div className="steps">
                  <span className={m.milestones.chat ? 'done' : ''}>Chat</span>
                  <span className={m.milestones.verify ? 'done' : ''}>Verify</span>
                  <span className={m.milestones.meet ? 'done' : ''}>Meet</span>
                  {m.lastMessageAt && <em>{timeAgo(m.lastMessageAt)}</em>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
