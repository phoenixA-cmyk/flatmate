import { useNavigate } from 'react-router-dom';
import ProfileForm from '../components/ProfileForm.jsx';

export default function Onboarding() {
  const nav = useNavigate();
  return (
    <main className="container narrow">
      <h1 className="page-title">Create your profile</h1>
      <p className="muted">Be honest. The more accurate you are, the better your matches.</p>
      <ProfileForm submitLabel="Find my flatmates →" onSaved={() => nav('/discover')} />
    </main>
  );
}
