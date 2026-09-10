import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserRole } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  userRole: UserRole;
  userName: string;
  userBadge: string;
  setUserRole: (role: UserRole) => void;
  loginDemo: (role?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<UserRole>('SAFETY_OFFICER');
  const [userName, setUserName] = useState<string>('Er. Vikramaditya Sharma');
  const [userBadge, setUserBadge] = useState<string>('DGMS-SO-884');

  const loginDemo = (role: UserRole = 'SAFETY_OFFICER') => {
    setUserRole(role);
    setIsAuthenticated(true);
    if (role === 'SAFETY_OFFICER') {
      setUserName('Er. Vikramaditya Sharma');
      setUserBadge('DGMS-SO-884');
    } else if (role === 'MINE_ENGINEER') {
      setUserName('Dr. Rajeshwar Rao');
      setUserBadge('STRATA-ENG-42');
    } else if (role === 'OPERATOR') {
      setUserName('Sunil K. Mahato');
      setUserBadge('SURFACE-CTRL-12');
    } else {
      setUserName('Administrator (Mine Mgr)');
      setUserBadge('MINE-MGR-01');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userRole,
        userName,
        userBadge,
        setUserRole,
        loginDemo,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
