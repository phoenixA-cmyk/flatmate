import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import Avatar from '../components/Avatar.jsx';

export default function Chat() {
  const { id } = useParams();
  const { user } = useAuth();
  const [match, setMatch] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [err, setErr] = useState('');
  const endRef = useRef(null);

  const refreshMatch = () => api(`/matches/${id}`).then((d) => setMatch(d.match));

  useEffect(() => {
    let socket;
    (async () => {
      try {
        const [m, msgs] = await Promise.all([api(`/matches/${id}`), api(`/matches/${id}/messages`)]);
        setMatch(m.match); setMessages(msgs.messages);
      } catch (e) { setErr(e.message); return; }
      socket = io(import.meta.env.VITE_API_URL || undefined, { auth: { token: localStorage.getItem('token') } });
      socket.on('connect', () => socket.emit('join', id));
      socket.on('message', (msg) => {
        setMessages((l) => (l.some((x) => x._id === msg._id) ? l : [...l, msg]));
        refreshMatch();
      });
    })();
    return () => socket?.disconnect();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  async function send(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setText('');
    try {
      const d = await api(`/matches/${id}/messages`, { method: 'POST', body: { text: t } });
      setMessages((l) => (l.some((x) => x._id === d.message._id) ? l : [...l, d.message]));
      refreshMatch();
    } catch (ex) { setErr(ex.message); setText(t); }
  }

  async function markMet() {
    const d = await api(`/matches/${id}/met`, { method: 'POST' });
    setMatch(d.match);
  }

  if (err && !match) return <main className="container"><p className="error">{err}</p></main>;
  if (!match) return <div className="center-screen"><div className="spinner" /></div>;
  const { other, milestones: ms } = match;

  return (
    <main className="container chat-layout">
      <section className="card chat">
        <div className="chat-head">
          <Link to="/matches" className="back">←</Link>
          <Avatar name={other.name} size={44} />
          <div className="grow">
            <b>{other.name} {other.verified && <span className="vbadge">✓ Verified</span>}</b>
            <small className="muted">{match.score}% match · {other.area}</small>
          </div>
        </div>
        <div className="msgs">
          {messages.length === 0 && <p className="muted center-text pad">Say hi 👋 Ask about their routine, cooking, guests, rent split.</p>}
          {messages.map((m) => (
            <div key={m._id} className={`bubble ${m.sender === user.id ? 'me' : 'them'}`}>{m.text}</div>
          ))}
          <div ref={endRef} />
        </div>
        {err && <p className="error pad">{err}</p>}
        <form className="composer" onSubmit={send}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" maxLength="1000" />
          <button className="btn primary">Send</button>
        </form>
      </section>

      <aside className="card pad side">
        <h3>Before you sign anything</h3>
        <ol className="timeline v">
          <li className={ms.chat ? 'done' : ''}>
            <div className="t-dot tone-blue">💬</div>
            <div><b className="txt-blue">Chat</b><small>Vibe check first</small></div>
          </li>
          <li className={ms.verify ? 'done' : ''}>
            <div className="t-dot tone-green">🛡️</div>
            <div>
              <b className="txt-green">Verify IDs</b>
              <small>You: {ms.myVerified ? 'verified ✓' : <Link to="/profile">verify now</Link>} · {other.name}: {ms.theirVerified ? 'verified ✓' : 'not yet'}</small>
            </div>
          </li>
          <li className={ms.meet ? 'done' : ''}>
            <div className="t-dot tone-yellow">🤝</div>
            <div>
              <b className="txt-yellow">Meet first</b>
              <small>Meet in a public place before moving in.</small>
              {!ms.iMet && <button className="btn ghost sm" onClick={markMet}>We met in person</button>}
              {ms.iMet && !ms.meet && <small>Waiting for {other.name} to confirm</small>}
            </div>
          </li>
        </ol>
        <p className="hint">Safety tip: never pay a deposit before seeing the flat and meeting your flatmate in person.</p>
      </aside>
    </main>
  );
}
