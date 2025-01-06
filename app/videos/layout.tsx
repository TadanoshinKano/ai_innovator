// app/videos/layout.tsx
import { supabase } from '../lib/supabase';
import { Suspense } from 'react';

async function getChapters() {
  try {
    const { data, error } = await supabase
      .from('chapters')
      .select('id, title, thumbnail_url, description');

    if (error) {
      console.error('Error fetching chapters:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching chapters:', error);
    return [];
  }
}

export default async function VideosLayout({ children }: { children: React.ReactNode }) {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            {children}
        </Suspense>
    )
} 