
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simple user type that doesn't depend on the Supabase types
type User = {
  id: string;
  email?: string;
  isAdmin: boolean;
  name?: string;
};

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loading: boolean;
};

// Default context
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

// Simple mock auth provider for our app
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize with a default guest user to avoid redirection issues
  useEffect(() => {
    // Create a default guest user so we don't get redirected
    const defaultUser = {
      id: 'guest',
      isAdmin: false,
      name: 'Guest User'
    };
    
    setCurrentUser(defaultUser);
    localStorage.setItem('user', JSON.stringify(defaultUser));
    setLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    const mockUser = {
      id: 'guest',
      email: email,
      isAdmin: email.includes('admin'),
      name: email.split('@')[0]
    };
    
    setCurrentUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return;
  };

  // Mock register function
  const register = async (email: string, password: string, name: string) => {
    const mockUser = {
      id: 'guest',
      email: email,
      isAdmin: email.includes('admin'),
      name: name,
    };
    
    setCurrentUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return;
  };

  // Mock logout function
  const logout = async () => {
    // Instead of removing the user completely, set back to default guest
    const defaultUser = {
      id: 'guest',
      isAdmin: false,
      name: 'Guest User'
    };
    
    setCurrentUser(defaultUser);
    localStorage.setItem('user', JSON.stringify(defaultUser));
    return;
  };

  const value = {
    currentUser,
    login,
    logout,
    register,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
