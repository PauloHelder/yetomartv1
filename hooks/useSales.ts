// ─── Hook: Gestão de Vendas (Dashboard do Produtor) ─────────
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { ProducerStats, Sale } from '../types';

export function useSales() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca Vendas para o Dashboard do Produtor
  const fetchMySales = useCallback(async (): Promise<{ sales: Sale[], stats: ProducerStats }> => {
    setLoading(true);
    setError(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return { sales: [], stats: { totalRevenue: 0, totalSales: 0, activeStudents: 0 } }; }

    const { data, error } = await supabase
      .from('purchases')
      .select('*, profiles:user_id(name, email), products!inner(id, title, producer_id)')
      .eq('products.producer_id', user.id)
      .order('created_at', { ascending: false });

    setLoading(false);
    if (error) { setError(error.message); return { sales: [], stats: { totalRevenue: 0, totalSales: 0, activeStudents: 0 } }; }

    const sales: Sale[] = (data ?? []).map((row: any) => ({
      id: row.id,
      studentName: row.profiles.name,
      studentEmail: row.profiles.email,
      productTitle: row.products.title,
      productId: row.product_id,
      date: new Date(row.created_at).toLocaleDateString('pt-AO'),
      amount: Number(row.amount),
      status: row.status as 'completed' | 'pending' | 'refunded',
    }));

    // Calcula Stats
    const stats: ProducerStats = {
      totalRevenue: sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.amount, 0),
      totalSales: sales.length,
      activeStudents: new Set(data?.map((row: any) => row.user_id)).size,
    };

    return { sales, stats };
  }, []);

  // Cria um pedido pendente (Lead)
  const createOrder = useCallback(async (productId: string, amount: number): Promise<boolean> => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return false; }

    const { error } = await supabase.from('purchases').insert({
      user_id: user.id,
      product_id: productId,
      amount: amount,
      status: 'pending'
    });

    setLoading(false);
    return !error;
  }, []);

  return { loading, error, fetchMySales, createOrder };
}
