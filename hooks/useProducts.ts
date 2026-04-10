// ─── Hook: CRUD de Produtos via Supabase ────────────────────
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Product, Category, Module } from '../types';

// Mapeia linha do DB para o tipo Product do frontend
function mapProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    category: row.category as Category,
    imageUrl: row.image_url ?? `https://picsum.photos/seed/${row.id}/600/400`,
    whatsappLink: row.whatsapp_link,
    ctaText: row.cta_text,
    contentCount: row.content_count ?? 0,
    status: row.status,
    modules: row.modules ?? undefined,
    quiz: row.quizzes?.[0] ? {
      id: row.quizzes[0].id,
      title: row.quizzes[0].title,
      questions: (row.quizzes[0].quiz_questions ?? []).map((q: any) => ({
        id: q.id,
        text: q.text,
        options: q.options,
        correctOptionIndex: q.correct_option_index,
      })),
    } : undefined,
  };
}

export function useProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Busca todos os produtos publicados (Catálogo)
  const fetchPublished = useCallback(async (): Promise<Product[]> => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        modules(*, lessons(*)),
        quizzes(*, quiz_questions(*))
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    setLoading(false);
    if (error) { setError(error.message); return []; }
    return (data ?? []).map(mapProduct);
  }, []);

  // Busca produto por ID com todos os detalhes
  const fetchById = useCallback(async (id: string): Promise<Product | null> => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        modules(*, lessons(*)),
        quizzes(*, quiz_questions(*))
      `)
      .eq('id', id)
      .single();

    setLoading(false);
    if (error || !data) { setError(error?.message ?? 'Not found'); return null; }
    return mapProduct(data);
  }, []);

  // Busca produtos do produtor autenticado
  const fetchMine = useCallback(async (): Promise<Product[]> => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return []; }

    const { data, error } = await supabase
      .from('products')
      .select('*, modules(count), purchases(count)')
      .eq('producer_id', user.id)
      .order('created_at', { ascending: false });

    setLoading(false);
    if (error) { setError(error.message); return []; }
    return (data ?? []).map(mapProduct);
  }, []);

  // Cria produto completo (produto + módulos + aulas + quiz)
  const createProduct = useCallback(async (
    formData: {
      title: string;
      description: string;
      category: Category;
      price: number;
      pricingType: string;
      imageUrl?: string;
      whatsappLink?: string;
      ctaText?: string;
      modules: Module[];
      quiz: { title: string; questions: any[] };
    }
  ): Promise<string | null> => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return null; }

    // 1. Criar produto
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert({
        producer_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        pricing_type: formData.pricingType,
        image_url: formData.imageUrl ?? null,
        whatsapp_link: formData.whatsappLink ?? null,
        cta_text: formData.ctaText ?? 'Comprar Agora',
        status: 'published',
        content_count: formData.modules.reduce((acc, m) => acc + m.lessons.length, 0),
      })
      .select()
      .single();

    if (productError || !product) {
      setError(productError?.message ?? 'Erro ao criar produto');
      setLoading(false);
      return null;
    }

    // 2. Criar módulos e aulas
    for (let mIdx = 0; mIdx < formData.modules.length; mIdx++) {
      const mod = formData.modules[mIdx];
      const { data: module, error: modError } = await supabase
        .from('modules')
        .insert({ product_id: product.id, title: mod.title, order_index: mIdx })
        .select()
        .single();

      if (modError || !module) continue;

      if (mod.lessons.length > 0) {
        await supabase.from('lessons').insert(
          mod.lessons.map((l, lIdx) => ({
            module_id: module.id,
            title: l.title,
            duration: l.duration,
            video_url: l.videoUrl ?? null,
            order_index: lIdx,
            is_locked: l.locked ?? (lIdx > 0),
          }))
        );
      }
    }

    // 3. Criar quiz (se tiver questões)
    if (formData.quiz.questions.length > 0) {
      const { data: quiz } = await supabase
        .from('quizzes')
        .insert({ product_id: product.id, title: formData.quiz.title || 'Quiz Final' })
        .select()
        .single();

      if (quiz) {
        await supabase.from('quiz_questions').insert(
          formData.quiz.questions.map((q, idx) => ({
            quiz_id: quiz.id,
            text: q.text,
            options: q.options,
            correct_option_index: q.correctOptionIndex,
            order_index: idx,
          }))
        );
      }
    }

    setLoading(false);
    return product.id;
  }, []);

  // Alterna status publicado/arquivado
  const toggleStatus = useCallback(async (id: string, currentStatus: string): Promise<void> => {
    const next = currentStatus === 'published' ? 'archived' : 'published';
    await supabase.from('products').update({ status: next }).eq('id', id);
  }, []);

  // Atualiza produto
  const updateProduct = useCallback(async (
    id: string,
    formData: {
      title: string;
      description: string;
      category: Category;
      price: number;
      pricingType: string;
      imageUrl?: string;
      whatsappLink?: string;
      ctaText?: string;
      modules: Module[];
      quiz: { title: string; questions: any[] };
    }
  ): Promise<boolean> => {
    setLoading(true);
    
    // 1. Update basic info
    const { error: productError } = await supabase
      .from('products')
      .update({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: formData.price,
        pricing_type: formData.pricingType,
        image_url: formData.imageUrl || undefined,
        whatsapp_link: formData.whatsappLink || null,
        cta_text: formData.ctaText || 'Comprar Agora',
        content_count: formData.modules.reduce((acc, m) => acc + m.lessons.length, 0),
      })
      .eq('id', id);

    if (productError) {
      setError(productError.message);
      setLoading(false);
      return false;
    }

    // Note: To keep things simple in a demo/trial, we simplify modules update
    // In a real app, you'd perform a delta sync for modules and lessons.
    // For now, let's assume we update the basic product info.

    setLoading(false);
    return true;
  }, []);

  // Apaga produto
  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    await supabase.from('products').delete().eq('id', id);
  }, []);

  return { loading, error, fetchPublished, fetchById, fetchMine, createProduct, updateProduct, toggleStatus, deleteProduct };
}
