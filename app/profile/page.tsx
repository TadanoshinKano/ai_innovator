// app/profile/page.tsx

'use client';

import { useState, useEffect, useCallback } from 'react'
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react' // フックをインポート
import { useRouter } from 'next/navigation'
  
export default function ProfilePage() {
  const supabase = useSupabaseClient() // Supabase クライアントを取得
  const session = useSession() // セッション情報を取得
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const user = session?.user ?? null
  const loading = session === undefined

  const fetchUserProfile = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', user.id)
        .maybeSingle()
  
      console.log('Supabase fetch result:', { data, error })
  
      if (error) {
        alert('fetchUserProfile: エラー発生: ' + error.message)
        console.error('Error fetching user profile:', error)
        return
      }
  
      if (data) {
        setName(data.username || '')
      } else {
        console.warn('No profile data found for user:', user.id)
        setName('')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }, [user, supabase])

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      setEmail(user.email || '')
      console.log('Auth user id:', user.id)
      console.log('Checking profiles for user_id:', String(user.id))
      fetchUserProfile()
    }
  }, [user, loading, router, fetchUserProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      console.error('User not authenticated')
      alert('ユーザー認証に失敗しました。再度ログインしてください。')
      return
    }
    console.log('user?.id:', user.id);
    console.log('username:', name); // ここをusernameに変更
    try {
      // profilesテーブルを更新する処理
      const { error } = await supabase
        .from('profiles')
        .upsert(
          { user_id: user.id, username: name }, // ここをusernameに変更
          { onConflict: 'user_id' }
        )

      if (error) {
        throw error
      }
      alert('プロフィールが更新されました')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('プロフィールの更新中にエラーが発生しました: ' + (error as Error).message)
    }
  }

  if (loading) return <div className="flex justify-center items-center h-screen">読み込み中...</div>
  if (!user) return null

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">プロフィール</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">名前</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
              placeholder="名前を入力してください"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">メールアドレス</label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-2 border rounded bg-gray-200 text-gray-500"
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            更新
          </button>
        </form>
      </div>
    </div>
  )
}
