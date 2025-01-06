// /school_apps/app/reset-password/page.tsx
"use client"; 
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { AuthError } from '@supabase/supabase-js';

const ResetPasswordPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // トークンの取得
  const accessToken = searchParams.get('access_token');

  useEffect(() => {
    if (!accessToken) {
      setMessage('無効なリセットリンクです。');
    }
  }, [accessToken]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken) {
      setMessage('無効なリセットリンクです。');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('パスワードが一致しません。');
      return;
    }

    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser(
      { password }
    );

    setLoading(false);

    if (error) {
      setMessage(`エラーが発生しました: ${(error as AuthError).message}`);
    } else {
      setMessage('パスワードが正常にリセットされました。ログインしてください。');
      // 必要に応じてリダイレクト
      // router.push('/login');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>パスワードリセット</h2>
      {message && <p>{message}</p>}
      {!message || message.includes('エラー') ? (
        <form onSubmit={handleResetPassword}>
          <div>
            <label htmlFor="password">新しいパスワード:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword">新しいパスワード（確認）:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'リセット中...' : 'パスワードをリセット'}
          </button>
        </form>
      ) : null}
    </div>
  );
};

export default ResetPasswordPage;
