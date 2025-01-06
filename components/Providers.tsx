// components/Providers.tsx
'use client';

import { SessionContextProvider, Session } from '@supabase/auth-helpers-react';
import { useState } from 'react';
import { supabase } from '../app/lib/supabase';

interface ProvidersProps {
  children: React.ReactNode;
  session: Session | null; // SSR から受け取るセッション
}

export default function Providers({ children, session }: ProvidersProps) {
  // すでに作成済みの supabase インスタンスを state に入れて保持
  const [supabaseClient] = useState(() => supabase);

  return (
    <SessionContextProvider 
      supabaseClient={supabaseClient} 
      initialSession={session}
    >
      {children}
    </SessionContextProvider>
  );
}
