import React, { createContext, ReactNode, useEffect, useState } from "react";
import { User } from "../../Models/User";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  userLoaded: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      setUser(JSON.parse(userFromStorage));
    }
    setUserLoaded(true);
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("user", JSON.stringify(user));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser, userLoaded }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
