// app/layout.tsx 
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Providers from '../components/Providers'

import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
// import type { Database } from '@/types/database'; // 型定義があれば使用

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI INNOVATOR - オンライン動画プラットフォーム',
  description: 'AIを活用した革新的なオンライン動画視聴プラットフォーム'
}

export default async function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  // 1. サーバーサイドで Supabase クライアント生成 & セッション取得
  const supabase = createServerComponentClient(/* <Database> */ { cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log(session)

  return (
    <html lang="ja">
      <body className={inter.className}>
        {/* 
          2. 取得したセッションを Providers に渡す 
             -> Providers.tsx で initialSession として扱われる 
        */}
        <Providers session={session}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  )
}
