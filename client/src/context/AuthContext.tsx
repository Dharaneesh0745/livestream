import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  user_type: "company" | "admin" | "user";
  [key: string]: any;
};

type AuthContextType = {
  user: User | null;
  admin: User | null;
  company: User | null;
  login: (userData: User) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<User | null>(null);
  const [company, setCompany] = useState<User | null>(null);

  // Persist the admin, user, and company data in localStorage
  useEffect(() => {
    const storedAdmin = localStorage.getItem("admin");
    const storedUser = localStorage.getItem("user");
    const storedCompany = localStorage.getItem("company");

    if (storedAdmin) setAdmin(JSON.parse(storedAdmin));
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedCompany) setCompany(JSON.parse(storedCompany));
  }, []);

  const login = (userData: User) => {
    console.log("Setting user data:", userData);
    if (userData.user.user_type === "company") {
      setCompany(userData.user);
      localStorage.setItem('company', JSON.stringify(userData.user)); // Store company data
    } else if (userData.user.user_type === "admin") {
      setAdmin(userData.user);
      localStorage.setItem('admin', JSON.stringify(userData.user)); // Store admin data
      console.log("second")
    } else if (userData.user.user_type === "user") {
      console.log("first")
      setUser(userData.user);
      localStorage.setItem('user', JSON.stringify(userData.user)); // Store user data
    }
  };
  
  const logout = () => {
    setUser(null);
    setAdmin(null);
    setCompany(null);
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('company');
  };
  

  return (
    <AuthContext.Provider value={{ user, admin, company, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
