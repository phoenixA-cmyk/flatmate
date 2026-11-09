import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { logout } = useAuth();
  return (
    <header className="nav">
      <Link to="/discover" className="logo">flatmate<span>.</span></Link>
      <nav>
        <NavLink to="/discover">Discover</NavLink>
        <NavLink to="/matches">Matches</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
      <button className="btn ghost sm" onClick={logout}>Log out</button>
    </header>
  );
}
