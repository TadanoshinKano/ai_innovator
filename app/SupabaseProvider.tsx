
'use client';

import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import {
  Session,
  SessionContextProvider,
} from '@supabase/auth-helpers-react';
import { useState } from 'react';

export default function SupabaseProvider({
  children,
  session,
}: {
  children: React.ReactNode;
  session: Session | null;
}) {
  // クライアントサイドで使う supabase client を生成
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={session}
    >
      {children}
    </SessionContextProvider>
  );
}
