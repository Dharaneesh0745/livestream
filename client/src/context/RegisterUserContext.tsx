import React, { createContext, useState, useContext, ReactNode } from 'react';
import axios from 'axios';

interface RegisterUserContextType {
  user: { name: string; email: string; password: string } | null;
  setUser: React.Dispatch<React.SetStateAction<{ name: string; email: string; password: string; user_type: string } | null>>;
  registerUser: (userData: { name: string; email: string; password: string; user_type: string}) => void;
  loading: boolean;
  error: string | null;
}

const RegisterUserContext = createContext<RegisterUserContextType | undefined>(undefined);

export const useRegisterUser = (): RegisterUserContextType => {
  const context = useContext(RegisterUserContext);
  if (!context) {
    throw new Error('useRegisterUser must be used within a RegisterUserProvider');
  }
  return context;
};

interface RegisterUserProviderProps {
  children: ReactNode;
}

export const RegisterUserProvider: React.FC<RegisterUserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{ name: string; email: string; password: string; user_type: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const registerUser = async (userData: { name: string; email: string; password: string; user_type: string}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8000/api/v1/users/register', userData);
      setUser(response.data); // Set user data in context
    } catch (error) {
      setError('Registration failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterUserContext.Provider value={{ user, setUser, registerUser, loading, error }}>
      {children}
    </RegisterUserContext.Provider>
  );
};
