// components/ContentPageClient.tsx
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '../app/lib/supabase';
import VideoPlayer from '@/components/VideoPlayer';
import Link from 'next/link';
import Head from 'next/head';
import { Session } from '@supabase/supabase-js';
import ChapterCard from './ChapterCard';

interface Content {
  id: number;
  title: string;
  description: string;
  video_url: string;
  chapter_id: number;
  access_level: 'public' | 'authenticated';
  thumbnail_url?: string;
  sort_order: number;
}

interface Profile {
  role: string;
}

const ContentPageClient = () => {
  const params = useParams<{ chapterId: string; contentId: string }>();
  const chapterIdParam = params?.chapterId;
  const contentIdParam = params?.contentId;
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [nextContent, setNextContent] = useState<Content | null>(null); // 次のコンテンツ

  // 現在のチャプターIDとコンテンツIDを数値に変換
  const currentChapterId = chapterIdParam ? parseInt(chapterIdParam, 10) : null;
  const currentContentId = contentIdParam ? parseInt(contentIdParam, 10) : null;

  // デバッグ用ログ
  useEffect(() => {
    console.log('currentChapterId:', currentChapterId);
    console.log('currentContentId:', currentContentId);
  }, [currentChapterId, currentContentId]);

  useEffect(() => {
    // セッションの取得
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        setErrorMessage('セッションの取得に失敗しました。');
      } else {
        setSession(session);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (currentChapterId !== null && currentContentId !== null) {
      const fetchContent = async () => {
        if (isNaN(currentChapterId) || isNaN(currentContentId)) {
          setErrorMessage('無効なパラメータです。');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('id', currentContentId)
          .eq('is_deleted', false)
          .eq('chapter_id', currentChapterId)
          .single();

        if (error || !data) {
          console.error('Error fetching content:', error);
          setErrorMessage('コンテンツが見つかりません。');
        } else {
          // アクセスレベルのチェック
          if (data.access_level === 'authenticated') {
            if (!session) {
              setErrorMessage('このコンテンツにアクセスするにはログインが必要です。');
              setLoading(false);
              return;
            }

            // ユーザーロールの確認
            const { data: user, error: userError } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single<Profile>();

            if (userError || !user || user.role !== 'authenticated') {
              setErrorMessage('このコンテンツにアクセスする権限がありません。');
              setLoading(false);
              return;
            }
          }

          setContent(data);
        }

        setLoading(false);
      };

      fetchContent();
    }
  }, [currentChapterId, currentContentId, session]);

  useEffect(() => {
    const fetchNextContent = async () => {
      if (!content || currentChapterId === null) return;
      const currentSortOrder = content.sort_order;

      try {
        const { data, error } = await supabase
          .from('videos')
          .select('*')
          .eq('chapter_id', currentChapterId)
          .gt('sort_order', currentSortOrder)
          .order('sort_order', { ascending: true })
          .limit(1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setNextContent(null); // 次の動画がない場合はnullを設定
            return;
          }
          console.error("Failed to fetch next content:", error);
          setNextContent(null);
          return;
        }
        setNextContent(data);
      } catch (error) {
        console.error("Failed to fetch next content:", error);
        setNextContent(null);
      }
    };

    fetchNextContent();
  }, [content, currentChapterId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">読み込み中...</div>;
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4">エラー</h1>
        <p className="text-red-500 mb-2 sm:mb-3 md:mb-4 text-sm sm:text-base">{errorMessage}</p>
        <Link href="/videos" className="text-blue-500 hover:underline text-sm sm:text-base">
          ビデオ一覧に戻る
        </Link>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{content.title} - コンテンツ視聴</title>
        <meta name="description" content={content.description} />
        <meta property="og:title" content={`${content.title} - コンテンツ視聴`} />
        <meta property="og:description" content={content.description} />
        {content.thumbnail_url && (
          <meta property="og:image" content={content.thumbnail_url} />
        )}
      </Head>
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-3/4 lg:pr-8">
            <div className="w-full max-w-4xl mx-auto rounded-lg shadow-md overflow-hidden">
              <VideoPlayer videoUrl={content.video_url} thumbnail_url={content.thumbnail_url} videoId={content.id} />
            </div>
            <div className="mt-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 text-gray-800">{content.title}</h1>
              <p className="text-sm sm:text-base text-gray-700">{content.description}</p>
            </div>
          </div>
          <div className="lg:w-1/4 mt-4 lg:mt-0">
            <div className="bg-gray-50 p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">次の動画</h2>
              {!nextContent && (
                <p className="text-sm text-gray-600">
                  次の動画はまだありません。
                </p>
              )}
              {nextContent && (
                <div className="mt-8">
                  {/* currentChapterId を渡す */}
                  {nextContent && nextContent.thumbnail_url && (
                    <ChapterCard chapter={{...nextContent, thumbnail_url: nextContent.thumbnail_url}} currentChapterId={currentChapterId || 0} />
                  )}
                </div>
              )}
            </div>
            <div className="mt-4 bg-gray-50 p-4 rounded-lg shadow-md">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-gray-500 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                <h2 className="text-lg font-semibold text-gray-800">テキスト</h2>
              </div>
              <p className="text-sm text-gray-600">
                テキストはこちら
              </p>
              {/* TODO: 教材へのリンクを挿入する */}
            </div>
            <div className="mt-4">
              <Link href={`/videos/${currentChapterId}`} className="text-blue-500 hover:underline text-sm sm:text-base">
                章に戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentPageClient;
