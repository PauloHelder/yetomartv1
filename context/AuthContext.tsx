// ─── AuthContext com Supabase Auth real ─────────────────────
import React, {
  createContext, useContext, useState,
  useEffect, useCallback, ReactNode
} from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  authError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: 'user' | 'producer') => Promise<boolean>;
  logout: () => Promise<void>;
  hasAccess: (productId: string) => boolean;
  purchaseProduct: (productId: string, amount: number) => Promise<boolean>;
  saveProduct: (productId: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Carrega o perfil completo (com compras e guardados) do Supabase
  // Carrega o perfil completo (com compras e guardados) do Supabase
  const loadProfile = useCallback(async (userId: string, authUser: any): Promise<User | null> => {
    try {
      console.log('🔄 A carregar perfil para:', userId);
      const [profileRes, purchasesRes, savedRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        supabase.from('purchases').select('product_id').eq('user_id', userId).eq('status', 'completed'),
        supabase.from('saved_products').select('product_id').eq('user_id', userId),
      ]);

      const profileData = profileRes.data || { 
        name: authUser.user_metadata?.name || 'Utilizador', 
        email: authUser.email || '', 
        role: authUser.user_metadata?.role || 'user' 
      };

      console.log('✅ Perfil processado:', profileData.name);

      return {
        id: userId,
        name: profileData.name,
        email: profileData.email,
        role: profileData.role,
        purchasedIds: (purchasesRes.data ?? []).map((p: any) => p.product_id),
        savedIds: (savedRes.data ?? []).map((s: any) => s.product_id),
        subscriptionActive: true,
      };
    } catch (e) {
      console.error("❌ Erro ao carregar perfil:", e);
      return null;
    }
  }, []);

  // Restaura sessão ao iniciar
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        // Define usuário básico imediatamente
        const basicUser: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || 'Utilizador',
          email: session.user.email || '',
          role: session.user.user_metadata?.role || 'user',
          purchasedIds: [],
          savedIds: [],
          subscriptionActive: true
        };
        setUser(basicUser);

        // Carrega detalhes em background
        loadProfile(session.user.id, session.user).then(fullProfile => {
          if (fullProfile) setUser(fullProfile);
        });
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔑 Auth Event:', event);
      if (session?.user) {
        // Se já temos o user e o evento é apenas um refresh, não resetamos tudo
        // Mas se for SIGNED_IN, garantimos o redirecionamento rápido
        const basicUser: User = {
          id: session.user.id,
          name: session.user.user_metadata?.name || 'Utilizador',
          email: session.user.email || '',
          role: session.user.user_metadata?.role || 'user',
          purchasedIds: [],
          savedIds: [],
          subscriptionActive: true
        };
        setUser(basicUser);

        loadProfile(session.user.id, session.user).then(fullProfile => {
          if (fullProfile) setUser(fullProfile);
        });
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [loadProfile]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message === 'Invalid login credentials'
          ? 'E-mail ou senha incorretos.'
          : error.message);
        return false;
      }
      return true;
    } catch (e: any) {
      setAuthError('Erro de conexão: ' + (e.message || 'Desconhecido'));
      return false;
    }
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    role: 'user' | 'producer'
  ): Promise<boolean> => {
    setAuthError(null);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    });
    if (error) {
      setAuthError(error.message.includes('already registered')
        ? 'Este e-mail já está registado.'
        : error.message);
      return false;
    }
    return true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const hasAccess = useCallback((productId: string): boolean => {
    if (!user) return false;
    return user.purchasedIds.includes(productId);
  }, [user]);

  const purchaseProduct = useCallback(async (productId: string, amount: number): Promise<boolean> => {
    if (!user) return false;
    const { error } = await supabase.from('purchases').upsert({
      user_id: user.id,
      product_id: productId,
      amount,
      status: 'completed',
    }, { onConflict: 'user_id,product_id' });

    if (error) return false;

    setUser(prev => prev ? ({
      ...prev,
      purchasedIds: [...new Set([...prev.purchasedIds, productId])],
      savedIds: prev.savedIds.filter(id => id !== productId),
    }) : null);
    return true;
  }, [user]);

  const saveProduct = useCallback(async (productId: string): Promise<void> => {
    if (!user) return;
    await supabase.from('saved_products').upsert({
      user_id: user.id,
      product_id: productId,
    }, { onConflict: 'user_id,product_id' });

    setUser(prev => prev ? ({
      ...prev,
      savedIds: [...new Set([...prev.savedIds, productId])],
    }) : null);
  }, [user]);

  const clearError = useCallback(() => setAuthError(null), []);

  return (
    <AuthContext.Provider value={{
      user, isLoggedIn: !!user, loading, authError,
      login, register, logout,
      hasAccess, purchaseProduct, saveProduct, clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
