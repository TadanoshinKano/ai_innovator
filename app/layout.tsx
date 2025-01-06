// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Providers from '../components/Providers' // 新しく作成した Providers コンポーネントをインポート

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI INNOVATOR - オンライン動画プラットフォーム',
  description: 'AIを活用した革新的なオンライン動画視聴プラットフォーム'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
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
