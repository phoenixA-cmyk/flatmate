import { Link } from 'react-router-dom';

const clashes = [
  ['🌙', '11 PM', 'Lights off. Sleeping.', 'green'],
  ['🎧', '2 AM', 'Playing music. Loudly.', 'pink'],
  ['🧹', 'DAILY', 'Cleans the kitchen every day', 'green'],
  ['🍽️', 'NEVER', 'Dishes. Never.', 'pink'],
];

export default function Landing() {
  return (
    <div className="landing">
      <header className="nav transparent">
        <span className="logo">flatmate<span>.</span></span>
        <div className="row-gap">
          <Link to="/login" className="btn ghost sm">Log in</Link>
          <Link to="/signup" className="btn primary sm">Get started</Link>
        </div>
      </header>

      <section className="hero">
        <span className="pill green">Built for India 🇮🇳</span>
        <h1>Find a flatmate who <mark>actually lives like you</mark></h1>
        <p>No more 2 AM parties vs 11 PM bedtimes. Tell us how you live, and we match you with people who live the same way, before you sign anything.</p>
        <div className="row-gap center">
          <Link to="/signup" className="btn primary lg">Create your profile</Link>
          <Link to="/login" className="btn ghost lg">I have an account</Link>
        </div>
      </section>

      <section className="section">
        <div className="vs-head"><span className="pill outline green">You</span><b>vs</b><span className="pill pink">Your flatmate</span></div>
        <div className="grid4">
          {clashes.map(([i, t, s, c]) => (
            <div key={t} className={`card pad tone-${c} outline`}>
              <div className="big-icon">{i}</div>
              <div className="stat">{t}</div>
              <small>{s}</small>
            </div>
          ))}
        </div>
        <h2 className="center-text">Now imagine an app that fixes this.</h2>
      </section>

      <section className="section">
        <h2 className="center-text">Create your profile in a minute</h2>
        <div className="demo-list">
          {[['yellow', '👛', 'Budget', '₹15–20K'], ['blue', '📍', 'Location', 'Koramangala'], ['pink', '🌙', 'Sleep', 'By 11 PM'], ['green', '🧹', 'Cleaning', 'Every day'], ['yellow', '🚬', 'Smoke?', 'No']].map(([c, i, l, v]) => (
            <div key={l} className={`group tone-${c} compact`}>
              <span className="g-icon">{i}</span>
              <div><small>{l}</small><b>{v}</b></div>
              <span className="tick">✓</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section match-demo">
        <h2 className="center-text">We match you with people who <mark>live like you</mark></h2>
        <div className="venn">
          <div className="circle blue">🙂</div>
          <div className="score">94%</div>
          <div className="circle pink">🙂</div>
        </div>
      </section>

      <section className="section">
        <h2 className="center-text">Before you sign anything</h2>
        <div className="timeline">
          {[['blue', '💬', 'Chat', 'Vibe check first'], ['green', '🛡️', 'Verify IDs', "Know who's real"], ['yellow', '🤝', 'Meet first', 'Before moving in']].map(([c, i, t, s]) => (
            <div key={t} className="t-item">
              <div className={`t-dot tone-${c}`}>{i}</div>
              <div><b className={`txt-${c}`}>{t}</b><small>{s}</small></div>
            </div>
          ))}
        </div>
        <div className="center"><Link to="/signup" className="btn primary lg">Find my flatmate</Link></div>
      </section>

      <footer className="footer">© {new Date().getFullYear()} Flatmate · Made for people who just want a peaceful home.</footer>
    </div>
  );
}
