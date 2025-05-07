
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, name: string) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  login: async () => { throw new Error('AuthContext not initialized'); },
  register: async () => { throw new Error('AuthContext not initialized'); },
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Mock users database - in a real app, this would be in Supabase
const MOCK_USERS: User[] = [
  { id: '1', email: 'admin@example.com', name: 'Admin User', isAdmin: true },
  { id: '2', email: 'user@example.com', name: 'Regular User' }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem('focusRoomUser');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data', error);
        localStorage.removeItem('focusRoomUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // Simulate API call with mock data
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.email === email);
        if (user) {
          // In a real app, we'd verify the password
          setCurrentUser(user);
          localStorage.setItem('focusRoomUser', JSON.stringify(user));
          toast.success("Logged in successfully!");
          resolve(user);
        } else {
          toast.error("Invalid credentials");
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  };

  const register = async (email: string, password: string, name: string): Promise<User> => {
    // Simulate API call with mock data
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existing = MOCK_USERS.find(u => u.email === email);
        if (existing) {
          toast.error("User already exists");
          reject(new Error('User already exists'));
        } else {
          const newUser: User = {
            id: `${MOCK_USERS.length + 1}`,
            email,
            name
          };
          // In a real app, we'd store this in the database
          setCurrentUser(newUser);
          localStorage.setItem('focusRoomUser', JSON.stringify(newUser));
          toast.success("Account created successfully!");
          resolve(newUser);
        }
      }, 500);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('focusRoomUser');
    toast.info("Logged out successfully");
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
