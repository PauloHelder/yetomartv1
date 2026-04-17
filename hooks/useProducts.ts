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
    learningOutcomes: row.learning_outcomes ?? [],
    pricingType: row.pricing_type ?? 'one-time',
    producerId: row.producer_id,
    instructor: row.profiles ? {
      name: row.profiles.name,
      bio: row.profiles.bio,
      avatarUrl: row.profiles.avatar_url
    } : undefined,
    contentCount: row.content_count ?? 0,
    status: row.status,
    modules: (row.modules ?? []).map((m: any) => ({
      id: m.id,
      title: m.title,
      lessons: (m.lessons ?? []).map((l: any) => ({
        id: l.id,
        title: l.title,
        duration: l.duration,
        videoUrl: l.video_url,
        description: l.description,
        locked: l.is_locked,
        attachments: (row.category === 'Ebook' && l.video_url) ? [{
          id: 'attach-' + l.id,
          name: 'Material do E-book',
          url: l.video_url,
          size: 'PDF'
        }] : []
      })),
    })),
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
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    setLoading(false);
    if (error) { setError(error.message); return []; }
    return (data ?? []).map(mapProduct);
  }, []);

  // Busca produto por ID com todos os detalhes (incluindo aulas)
  const fetchById = useCallback(async (id: string): Promise<Product | null> => {
    setLoading(true);
    
    try {
      // 1. Busca os dados básicos do produto primeiro para evitar joins ambíguos
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError || !productData) {
        setLoading(false);
        return null;
      }

      // 2. Busca módulos
      const { data: modulesData, error: mErr } = await supabase
        .from('modules')
        .select('*')
        .eq('product_id', id)
        .order('order_index', { ascending: true });

      // 3. Busca aulas para todos os módulos encontrados
      let lessonsData: any[] = [];
      if (modulesData && modulesData.length > 0) {
        const moduleIds = modulesData.map(m => m.id);
        const { data: lRes, error: lErr } = await supabase
          .from('lessons')
          .select('*')
          .in('module_id', moduleIds)
          .order('order_index', { ascending: true });
        
        lessonsData = lRes || [];
      }

      // 4. Busca Quiz e Perguntas separadamente
      const { data: quizData } = await supabase.from('quizzes').select('*').eq('product_id', id).single();
      let quizQuestions: any[] = [];
      if (quizData) {
        const { data: qQuestRes } = await supabase.from('quiz_questions').select('*').eq('quiz_id', quizData.id).order('order_index', { ascending: true });
        quizQuestions = qQuestRes || [];
      }

      // 5. Busca Perfil do Instrutor
      const { data: profileData } = await supabase.from('profiles').select('name, bio, avatar_url').eq('id', productData.producer_id).single();

      // Reconstrói a estrutura de módulos com aulas aninhadas
      const modulesWithLessons = (modulesData || []).map(m => ({
        ...m,
        lessons: lessonsData.filter(l => l.module_id === m.id)
      }));

      // Consolida o Quiz
      const consolidatedQuizzes = quizData ? [{
        ...quizData,
        quiz_questions: quizQuestions
      }] : [];

      const mapped = mapProduct({ 
        ...productData, 
        modules: modulesWithLessons, 
        quizzes: consolidatedQuizzes,
        profiles: profileData 
      });

      setLoading(false);
      return mapped;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      return null;
    }
  }, []);

  // Busca produtos do produtor autenticado
  const fetchMine = useCallback(async (): Promise<Product[]> => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return []; }

    const { data, error } = await supabase
      .from('products')
      .select('*')
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
      learningOutcomes: string[];
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
            video_url: (l as any).attachments?.[0]?.url || l.videoUrl || null,
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
      learningOutcomes: string[];
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
        content_count: formData.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0),
      })
      .eq('id', id);

    if (productError) {
      setError(productError.message);
      setLoading(false);
      return false;
    }

    // 2. Atualizar Módulos e Aulas (Estratégia: Delete & Insert para simplificar sincronização)
    // Remove módulos antigos (as FKs com cascade deletam as lessons)
    await supabase.from('modules').delete().eq('product_id', id);

    // Insere novos módulos
    for (const [mIdx, mod] of formData.modules.entries()) {
      const { data: module } = await supabase
        .from('modules')
        .insert({
          product_id: id,
          title: mod.title,
          order_index: mIdx
        })
        .select()
        .single();

      if (module && mod.lessons?.length > 0) {
        await supabase.from('lessons').insert(
          mod.lessons.map((l, lIdx) => ({
            module_id: module.id,
            title: l.title,
            duration: l.duration || '00:00',
            video_url: (l as any).attachments?.[0]?.url || l.videoUrl || null,
            order_index: lIdx,
            is_locked: l.locked ?? (lIdx > 0),
          }))
        );
      }
    }

    // 3. Atualizar Quiz (Delete & Insert)
    await supabase.from('quizzes').delete().eq('product_id', id);
    
    if (formData.quiz.questions.length > 0) {
      const { data: quiz } = await supabase
        .from('quizzes')
        .insert({ product_id: id, title: formData.quiz.title || 'Quiz Final' })
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
    return true;
  }, []);

  // Apaga produto
  const deleteProduct = useCallback(async (id: string): Promise<void> => {
    await supabase.from('products').delete().eq('id', id);
  }, []);

  return { loading, error, fetchPublished, fetchById, fetchMine, createProduct, updateProduct, toggleStatus, deleteProduct };
}
