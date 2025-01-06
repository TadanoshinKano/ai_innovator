// app/videos/page.tsx
// 'use client' ディレクティブは削除します

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupabaseClient } from '@supabase/supabase-js';
import VideosPage from './VideosPage'; // クライアントコンポーネントをインポート

interface Chapter {
  id: string;
  title: string;
  thumbnail_url: string;
  description: string;
}

async function getChapters(supabase: SupabaseClient) {
  const { data: chapters, error } = await supabase
    .from('chapters')
    .select('id, title, thumbnail_url, description');

  if (error) {
    console.error("Error fetching chapters:", error);
    return [];
  }
  
  return (chapters || []) as Chapter[];
}

export default async function VideosPageServer() {
  const supabase = createServerComponentClient({ cookies });
  const chapters = await getChapters(supabase);
  return <VideosPage chapters={chapters} />;
}
