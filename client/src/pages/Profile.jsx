import { useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/AuthContext.jsx';
import ProfileForm from '../components/ProfileForm.jsx';

const ID_TYPES = [['aadhaar', 'Aadhaar'], ['pan', 'PAN'], ['passport', 'Passport'], ['driving_license', 'Driving licence']];

export default function Profile() {
  const { user, setUser } = useAuth();
  const [idType, setIdType] = useState('aadhaar');
  const [idNumber, setIdNumber] = useState('');
  const [err, setErr] = useState('');
  const [saved, setSaved] = useState(false);
  const status = user.verification?.status;

  async function verify(e) {
    e.preventDefault(); setErr('');
    try { setUser((await api('/profile/verify', { method: 'POST', body: { idType, idNumber } })).user); setIdNumber(''); }
    catch (ex) { setErr(ex.message); }
  }

  return (
    <main className="container narrow">
      <h1 className="page-title">Your profile</h1>

      <section className="card pad stack verify-card">
        <h3>🛡️ ID verification</h3>
        {status === 'verified' ? (
          <p className="ok">Verified with {user.verification.idType?.replace('_', ' ')} ending in {user.verification.idLast4}. Others see a ✓ badge on your profile.</p>
        ) : status === 'pending' ? (
          <p className="muted">Your ID is under review.</p>
        ) : (
          <form className="stack" onSubmit={verify}>
            <p className="muted">Verified profiles get more matches. We only keep the last 4 digits of your ID.</p>
            <div className="chips">
              {ID_TYPES.map(([v, l]) => <button type="button" key={v} className={`chip ${idType === v ? 'on' : ''}`} onClick={() => setIdType(v)}>{l}</button>)}
            </div>
            <label className="field"><span>ID number</span><input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="Enter ID number" /></label>
            {err && <p className="error">{err}</p>}
            <button className="btn primary">Verify my ID</button>
          </form>
        )}
      </section>

      <h3 className="section-title">Lifestyle &amp; details</h3>
      <ProfileForm submitLabel="Save changes" onSaved={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }} />
      {saved && <div className="toast">Profile saved ✓</div>}
    </main>
  );
}
