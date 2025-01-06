'use client'

import Link from 'next/link'
import { useAuth } from '../components/AuthContext'
import { supabase } from '../app/lib/supabase'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Header() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    // fixed を sticky に変更
    <header className="sticky top-0 left-0 right-0 z-50">
      {/* ▼ グラデーション背景と波形 ▼ */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-400 to-orange-500 w-full shadow-xl">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between relative">
          {/* ロゴ部分 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-white font-extrabold text-3xl tracking-wider uppercase"
          >
            <Link href="/">
              <span className="cursor-pointer hover:opacity-90 transition-all duration-300 hover:text-orange-100">
                AI INNOVATOR
              </span>
            </Link>
          </motion.div>

          {/* ▼ ハンバーガーメニューボタン（モバイル用） ▼ */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none z-50 p-2 hover:bg-orange-400 rounded-lg transition-colors duration-300"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </motion.button>

          {/* ▼ ナビゲーションメニュー (PC) ▼ */}
          <nav className="hidden md:block">
            <ul className="flex items-center space-x-8 text-white font-medium">
              {loading ? (
                <li >
                  <span className="text-gray-300">Loading...</span>
                </li>
              ) : user ? (
                <>
                  <motion.li whileHover={{ y: -2 }}>
                    <Link
                      href="/dashboard"
                      className="hover:text-orange-100 transition-colors duration-300 flex items-center space-x-1"
                    >
                      <span>ダッシュボード</span>
                    </Link>
                  </motion.li>
                  <motion.li whileHover={{ y: -2 }}>
                    <Link
                      href="/videos"
                      className="hover:text-orange-100 transition-colors duration-300 flex items-center space-x-1"
                    >
                      <span>講義一覧</span>
                    </Link>
                  </motion.li>
                  <motion.li whileHover={{ y: -2 }}>
                    <Link
                      href="/profile"
                      className="hover:text-orange-100 transition-colors duration-300 flex items-center space-x-1"
                    >
                      <span>プロフィール</span>
                    </Link>
                  </motion.li>
                  <li>
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-orange-600 font-bold py-2.5 px-6 rounded-full hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      ログアウト
                    </motion.button>
                  </li>
                </>
              ) : (
                <>
                  <motion.li whileHover={{ y: -2 }}>
                    <Link
                      href="/login"
                      className="hover:text-orange-100 transition-colors duration-300"
                    >
                      ログイン
                    </Link>
                  </motion.li>
                  <li>
                    <Link href="/register">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white text-orange-600 font-bold py-2.5 px-6 rounded-full hover:bg-orange-50 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        新規登録
                      </motion.button>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>

          {/* ▼ モバイル用メニュー (ハンバーガー開閉) ▼ */}
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute top-20 left-0 w-full px-4"
            >
              <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl py-6">
                <ul className="flex flex-col space-y-4 text-orange-600 font-semibold px-6">
                  {loading ? (
                    <li>
                      <span className="block py-3 px-4 text-center text-gray-500">Loading...</span>
                    </li>
                  ) : user ? (
                    <>
                      <li>
                        <Link
                          href="/dashboard"
                          className="block hover:bg-orange-50 rounded-xl py-3 px-4 transition-all duration-300"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          ダッシュボード
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/videos"
                          className="block hover:bg-orange-50 rounded-xl py-3 px-4 transition-all duration-300"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          講義一覧
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/profile"
                          className="block hover:bg-orange-50 rounded-xl py-3 px-4 transition-all duration-300"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          プロフィール
                        </Link>
                      </li>
                      <li className="pt-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setIsMenuOpen(false)
                            handleLogout()
                          }}
                          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg"
                        >
                          ログアウト
                        </motion.button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          href="/login"
                          className="block hover:bg-orange-50 rounded-xl py-3 px-4 transition-all duration-300"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          ログイン
                        </Link>
                      </li>
                      <li className="pt-2">
                        <Link
                          href="/register"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-md hover:shadow-lg"
                          >
                            新規登録
                          </motion.button>
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </motion.nav>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-300 via-orange-200 to-orange-300 opacity-30"></div>
      </div>
    </header>
  )
}
