'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { motion } from 'framer-motion'
import { AuthError } from '@supabase/supabase-js';

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      router.push('/login')
    } catch (error) {
      const authError = error as AuthError;
      alert("エラー発生: " + authError.message)
      setError(authError.message)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 sm:p-8 bg-white/20 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl"
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

        <h2 className="text-2xl font-bold text-center mb-4">新規登録</h2>
        {error && (
          <p className="text-sm text-red-500 mb-4 text-center bg-red-50 p-3 rounded-lg">
            {error}
          </p>
        )}
        
        <form onSubmit={handleRegister} className="space-y-4">
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white/80"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white/80"
            />
          </motion.div>

          <motion.button
            type="submit"
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 15px rgba(249, 115, 22, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg hover:shadow-xl transition duration-300"
          >
            登録
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
