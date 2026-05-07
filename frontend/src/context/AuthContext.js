import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebase';
import { getMe, verifyPhone } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('token');
      if (stored) {
        setToken(stored);
        try {
          const me = await getMe();
          setUser(me);
        } catch {
          await AsyncStorage.removeItem('token');
        }
      }
      setLoading(false);
    })();
  }, []);

  const loginWithFirebaseToken = async (idToken) => {
    const data = await verifyPhone(idToken);
    await AsyncStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await signOut(auth);
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const me = await getMe();
    setUser(me);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginWithFirebaseToken, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
