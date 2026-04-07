
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: () => void;
  logout: () => void;
  hasAccess: (productId: string) => boolean;
  purchaseProduct: (productId: string) => void;
  saveProduct: (productId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(() => {
    setUser({
      id: 'u123',
      name: 'João Silva',
      email: 'joao@exemplo.com',
      purchasedIds: ['2'],
      savedIds: [],
      subscriptionActive: true,
      role: 'producer' // Simulating a producer login
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const hasAccess = useCallback((productId: string) => {
    if (!user) return false;
    return user.purchasedIds.includes(productId);
  }, [user]);

  const purchaseProduct = useCallback((productId: string) => {
    if (!user) return;
    setUser(prev => prev ? ({
      ...prev,
      purchasedIds: [...new Set([...prev.purchasedIds, productId])],
      savedIds: prev.savedIds.filter(id => id !== productId)
    }) : null);
  }, [user]);

  const saveProduct = useCallback((productId: string) => {
    if (!user) return;
    setUser(prev => prev ? ({
      ...prev,
      savedIds: [...new Set([...prev.savedIds, productId])]
    }) : null);
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, hasAccess, purchaseProduct, saveProduct }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
