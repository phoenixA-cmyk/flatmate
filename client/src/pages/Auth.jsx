import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth({ mode }) {
  const isReg = mode === 'register';
  const { authenticate } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr(''); setBusy(true);
    try {
      const u = await authenticate(mode, f);
      nav(u.profileComplete ? '/discover' : '/onboarding');
    } catch (ex) { setErr(ex.message); } finally { setBusy(false); }
  }

  return (
    <div className="auth-wrap">
      <form className="card pad stack auth-card" onSubmit={submit}>
        <Link to="/" className="logo">flatmate<span>.</span></Link>
        <h2>{isReg ? 'Create your account' : 'Welcome back'}</h2>
        {isReg && <label className="field"><span>Name</span><input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} required /></label>}
        <label className="field"><span>Email</span><input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} required /></label>
        <label className="field"><span>Password</span><input type="password" minLength="6" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} required /></label>
        {err && <p className="error">{err}</p>}
        <button className="btn primary lg" disabled={busy}>{busy ? 'Please wait…' : isReg ? 'Sign up' : 'Log in'}</button>
        <p className="muted center-text">
          {isReg ? <>Already have an account? <Link to="/login">Log in</Link></> : <>New here? <Link to="/signup">Create an account</Link></>}
        </p>
        {!isReg && <p className="hint center-text">Demo: kabir@demo.flatmate / demo1234 (after running the seed)</p>}
      </form>
    </div>
  );
}
