import api from '../api/axios';
import { TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from '../constants/auth';

const normalizeCredentials = (credentialsOrEmail, password) => {
  if (typeof credentialsOrEmail === 'object' && credentialsOrEmail !== null) {
    return {
      email: credentialsOrEmail.email?.trim() ?? '',
      password: credentialsOrEmail.password ?? ''
    };
  }

  return {
    email: credentialsOrEmail?.trim() ?? '',
    password: password ?? ''
  };
};

export const login = async (credentialsOrEmail, password) => {
  const credentials = normalizeCredentials(credentialsOrEmail, password);
  const response = await api.post('/auth/login', credentials);
  const { token, user } = response.data ?? {};

  if (!token || !user) {
    throw new Error('La respuesta de autenticacion no es valida');
  }

  return { token, user };
};

export const register = async ({ email, password }) => {
  const response = await api.post('/auth/register', {
    email: email?.trim() ?? '',
    password: password ?? ''
  });

  return response.data;
};

export const createAdmin = async ({ email, password }) => {
  const response = await api.post('/auth/create-admin', {
    email: email?.trim() ?? '',
    password: password ?? ''
  });

  return response.data;
};

export const persistSession = ({ token, user }) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(USER_STORAGE_KEY);
};

export const getStoredToken = () => localStorage.getItem(TOKEN_STORAGE_KEY);

export const getStoredUser = () => {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY);
    return null;
  }
};
