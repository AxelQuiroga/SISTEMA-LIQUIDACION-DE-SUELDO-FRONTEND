import { createContext, useEffect, useMemo, useState } from 'react';
import {
  clearSession,
  getStoredToken,
  getStoredUser,
  login as loginRequest,
  persistSession
} from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getStoredToken();
    const storedUser = getStoredUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    } else {
      clearSession();
    }

    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    const session = await loginRequest(credentials);

    persistSession(session);
    setToken(session.token);
    setUser(session.user);

    return session;
  };

  const logout = () => {
    clearSession();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      logout
    }),
    [isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
