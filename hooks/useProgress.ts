
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

export function useProgress() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async (productId: string): Promise<string[]> => {
    if (!user) return [];
    setLoading(true);
    
    const { data, error } = await supabase
      .from('lesson_completions')
      .select('lesson_id')
      .eq('user_id', user.id);

    setLoading(false);
    if (error) {
      console.error('Error fetching progress:', error);
      return [];
    }
    return data.map((d: any) => d.lesson_id);
  }, [user]);

  const fetchAllCompletions = useCallback(async (): Promise<string[]> => {
    if (!user) return [];
    const { data } = await supabase
      .from('lesson_completions')
      .select('lesson_id')
      .eq('user_id', user.id);
    return data?.map((d: any) => d.lesson_id) || [];
  }, [user]);

  const toggleLesson = useCallback(async (lessonId: string, completed: boolean) => {
    if (!user) return;

    try {
      if (completed) {
        const { error: err } = await supabase
          .from('lesson_completions')
          .insert({ user_id: user.id, lesson_id: lessonId });
        if (err) throw err;
      } else {
        const { error: err } = await supabase
          .from('lesson_completions')
          .delete()
          .eq('user_id', user.id)
          .eq('lesson_id', lessonId);
        if (err) throw err;
      }
    } catch (err: any) {
      console.error('Progress update failed:', err.message);
      // If table doesnt exist, we might want to alert the user in dev
      if (err.code === 'PGRST116' || err.message.includes('not found')) {
        console.warn('The lesson_completions table is missing. Please create it in Supabase.');
      }
    }
  }, [user]);

  return { loading, error, fetchProgress, fetchAllCompletions, toggleLesson };
}
