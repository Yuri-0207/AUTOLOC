'use client';

import { createContext, useContext, useEffect, useState } from 'react';


interface UserContextProps {
  user: { uid: string, data: any} | null;
  setUser: (user: { uid: string, data: any } | null) => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({children}: { children: React.ReactNode}) => {
  const [user, setUser] = useState<{ uid: string, data: any } | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}