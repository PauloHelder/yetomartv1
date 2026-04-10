// ─── Hook: Upload de capa para Supabase Storage ─────────────
import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export function useStorage() {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const uploadCover = useCallback(async (file: File, productId: string): Promise<string | null> => {
    setUploading(true);
    setUploadError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return null; }

    const ext = file.name.split('.').pop();
    const path = `${user.id}/${productId}.${ext}`;

    const { error } = await supabase.storage
      .from('product-covers')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (error) {
      setUploadError(error.message);
      setUploading(false);
      return null;
    }

    const { data } = supabase.storage.from('product-covers').getPublicUrl(path);
    setUploading(false);
    return data.publicUrl;
  }, []);

  return { uploading, uploadError, uploadCover };
}
