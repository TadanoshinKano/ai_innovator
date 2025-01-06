// components/Providers.tsx
'use client';

import { ReactNode } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from '../app/lib/supabase';
import { AuthProvider } from '../components/AuthContext'; // AuthProvider をインポート

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider> {/* AuthProvider を追加 */}
        {children}
      </AuthProvider>
    </SessionContextProvider>
  );
}
