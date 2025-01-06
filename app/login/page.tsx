// app/login/page.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseClient } from '@supabase/auth-helpers-react' // フックをインポート
import { motion } from 'framer-motion'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = useSupabaseClient() // フックを使用してクライアントを取得

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      router.push('/dashboard')
    } catch (error) {
      setError((error as Error).message)
    }
  }

  return (
    <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 sm:p-8 
                   bg-white/20 backdrop-blur-lg border border-white/20 
                   rounded-2xl shadow-xl"
      >
        <div className="flex items-center justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
          ログイン
        </h1>
        <p className="text-sm sm:text-base text-center text-gray-700 mb-6">
          AIスクールの学習をはじめましょう
        </p>

        {error && (
          <p className="text-sm text-red-500 mb-4 text-center bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white/50 backdrop-blur-sm p-3 rounded-xl"
          >
            <label
              htmlFor="email"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                         focus:ring-2 focus:ring-orange-300 bg-white/80"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white/50 backdrop-blur-sm p-3 rounded-xl"
          >
            <label
              htmlFor="password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none 
                         focus:ring-2 focus:ring-orange-300 bg-white/80"
            />
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 15px rgba(249, 115, 22, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 
                       text-white font-semibold py-2.5 px-4 
                       rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            ログイン
          </motion.button>
        </form>

        <div className="mt-4 text-center space-y-2">
          <p 
            className="text-sm text-orange-600 cursor-pointer hover:underline"
            onClick={() => router.push('/forgot-password')}
          >
            パスワードをお忘れですか？
          </p>
          <p className="text-sm text-gray-600">
            アカウントをお持ちでない場合は
            <span 
              className="text-orange-600 ml-1 cursor-pointer hover:underline"
              onClick={() => router.push('/register')}
            >
              こちら
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
