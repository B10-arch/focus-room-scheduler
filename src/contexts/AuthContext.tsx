
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Simple user type that doesn't depend on the Supabase types
type User = {
  id: string;
  email?: string;
  isAdmin: boolean;
};

type AuthContextType = {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

// Default context
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

type AuthProviderProps = {
  children: ReactNode;
};

// Simple mock auth provider for now
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    // In a real app, this would authenticate with Supabase
    const mockUser = {
      id: 'guest',
      email: email,
      isAdmin: email.includes('admin'),
    };
    
    setCurrentUser(mockUser);
    localStorage.setItem('user', JSON.stringify(mockUser));
    return;
  };

  // Mock logout function
  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    return;
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
