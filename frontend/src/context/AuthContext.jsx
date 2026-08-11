import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  setMemoryAccessToken,
  getMemoryAccessToken,
  validateSessionOnStartup,
  GlobalEventBus,
} from '../api/api';
import {
  loginAdmin,
  registerAdmin,
  logoutAdmin,
  getAdminProfile,
} from '../services/auth.service';
import KeyLockLoader from '../components/KeyLockLoader';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  // App Startup Session Validation with Minimum Display Timer for 3D Loader
  useEffect(() => {
    const initSession = async () => {
      const startTime = Date.now();
      const minLoaderTime = 1600; // Minimum 1.6s display to show 3D KeyLockLoader on startup

      try {
        const sessionResult = await validateSessionOnStartup();
        if (sessionResult.success) {
          const profileData = await getAdminProfile();
          setAdmin(profileData.admin);
        } else {
          setAdmin(null);
        }
      } catch (err) {
        setAdmin(null);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoaderTime - elapsedTime);
        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      }
    };

    initSession();

    // Subscribe to GlobalEventBus for auto logout on refresh token expiry
    const unsubLogout = GlobalEventBus.on(GlobalEventBus.LOGOUT, () => {
      setAdmin(null);
    });

    const unsubUnauthorized = GlobalEventBus.on(GlobalEventBus.UNAUTHORIZED, () => {
      setAdmin(null);
    });

    return () => {
      unsubLogout();
      unsubUnauthorized();
    };
  }, []);

  const login = async (email, password) => {
    const data = await loginAdmin({ email, password });
    setMemoryAccessToken(data.accessToken);
    setAdmin(data.admin);
    return data;
  };

  const register = async (name, email, password, otp) => {
    const data = await registerAdmin({ name, email, password, otp });
    setMemoryAccessToken(data.accessToken);
    setAdmin(data.admin);
    return data;
  };

  const logout = async () => {
    try {
      await logoutAdmin();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setMemoryAccessToken(null);
      setAdmin(null);
    }
  };

  if (loading) {
    return <KeyLockLoader text="Initializing KeyMaker Portal..." fullScreen={true} />;
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        accessToken: getMemoryAccessToken(),
        login,
        register,
        logout,
        isAuthenticated: !!admin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
