import { useEffect, useMemo, useState } from 'react';
import { AUTH_UNAUTHORIZED_EVENT } from '../constants/events';
import { AuthContext } from './authContextBase';
import { clearSession, getStoredSession, login as loginRequest, persistSession } from '../services/authService';

const getInitialAuthState = () => {
  const { token, user } = getStoredSession();

  return {
    token,
    user,
    isLoading: false
  };
};

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(getInitialAuthState);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearSession();
      setAuthState({
        token: null,
        user: null,
        isLoading: false
      });
    };

    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => {
      window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
    };
  }, []);

  const login = async (credentials) => {
    const session = await loginRequest(credentials);

    persistSession(session);
    setAuthState({
      token: session.token,
      user: session.user,
      isLoading: false
    });

    return session;
  };

  const logout = () => {
    clearSession();
    setAuthState({
      token: null,
      user: null,
      isLoading: false
    });
  };

  const value = useMemo(
    () => ({
      user: authState.user,
      token: authState.token,
      isLoading: authState.isLoading,
      isAuthenticated: Boolean(authState.token && authState.user),
      login,
      logout
    }),
    [authState]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
