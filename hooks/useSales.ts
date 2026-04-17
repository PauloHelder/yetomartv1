// ─── Hook: Gestão de Vendas (Dashboard do Produtor) ─────────
// FORCE_RELOAD_V3: 2026-04-15 14:25
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

    // 1. Busca todos os produtos do produtor primeiro
    const { data: myProducts, error: pErr } = await supabase
      .from('products')
      .select('id, title')
      .eq('producer_id', user.id);

    if (pErr || !myProducts || myProducts.length === 0) {
      setLoading(false);
      return { sales: [], stats: { totalRevenue: 0, totalSales: 0, activeStudents: 0 } };
    }

    const productIds = myProducts.map(p => p.id);

    // 2. Busca todas as compras referentes a esses produtos
    const { data: rawPurchases, error: salesError } = await supabase
      .from('purchases')
      .select('*')
      .in('product_id', productIds)
      .order('created_at', { ascending: false });

    if (salesError) { 
      console.error('!!! ERRO AO BUSCAR VENDAS:', salesError);
      setError(salesError.message); 
      setLoading(false);
      return { sales: [], stats: { totalRevenue: 0, totalSales: 0, activeStudents: 0 } }; 
    }

    // 3. Busca os perfis dos alunos que compraram
    const userIds = Array.from(new Set(rawPurchases.map(p => p.user_id)));
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, name, email')
      .in('id', userIds);

    setLoading(false);

    // 4. Mapeia e junta os dados em memória
    const sales: Sale[] = (rawPurchases ?? []).map((row: any) => {
      const product = myProducts.find(p => p.id === row.product_id);
      const profile = profiles?.find(p => p.id === row.user_id);

      return {
        id: row.id,
        studentName: profile?.name || 'Usuário Desconhecido',
        studentEmail: profile?.email || 'N/A',
        productTitle: product?.title || 'Produto Removido',
        productId: row.product_id,
        date: new Date(row.created_at).toLocaleDateString('pt-AO'),
        amount: Number(row.amount),
        status: row.status as 'completed' | 'pending' | 'refunded',
      };
    });

    // Calcula Stats
    const stats: ProducerStats = {
      totalRevenue: sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.amount, 0),
      totalSales: sales.length,
      activeStudents: userIds.length,
    };

    return { sales, stats };
  }, []);

  // Cria um pedido pendente (Lead)
  const createOrder = useCallback(async (productId: string, amount: number): Promise<boolean> => {
    setLoading(true);
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ createOrder: utilizador não autenticado', authError);
      setLoading(false);
      return false;
    }

    console.log('📦 createOrder: a criar pedido para', { userId: user.id, productId, amount });

    const { error } = await supabase.from('purchases').upsert({
      user_id: user.id,
      product_id: productId,
      amount: amount,
      status: 'pending'
    }, { onConflict: 'user_id,product_id', ignoreDuplicates: false });

    if (error) {
      console.error('❌ createOrder: erro ao inserir compra', error);
      setLoading(false);
      return false;
    }

    console.log('✅ createOrder: pedido criado com sucesso!');
    setLoading(false);
    return true;
  }, []);


  // Atualiza o status de um pedido
  const updateOrderStatus = useCallback(async (purchaseId: string, newStatus: 'completed' | 'pending' | 'refunded'): Promise<boolean> => {
    setLoading(true);
    const { error } = await supabase.from('purchases').update({ status: newStatus }).eq('id', purchaseId);
    setLoading(false);
    return !error;
  }, []);

  return { loading, error, fetchMySales, createOrder, updateOrderStatus };
}
