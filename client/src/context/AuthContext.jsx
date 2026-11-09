import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    if (!localStorage.getItem('token')) return;
    api('/auth/me')
      .then((d) => setUser(d.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = useCallback(async (mode, payload) => {
    const d = await api(`/auth/${mode}`, { method: 'POST', body: payload });
    localStorage.setItem('token', d.token);
    setUser(d.user);
    return d.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return <Ctx.Provider value={{ user, setUser, loading, authenticate, logout }}>{children}</Ctx.Provider>;
}
