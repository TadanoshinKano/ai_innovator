'use client';

import ContentCard from '@/components/ContentCard';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import React from 'react';

async function getChapterData(chapterId: string) {
  const { data: chapter, error: chapterError } = await supabase
    .from('chapters')
    .select('id, title, description')
    .eq('id', chapterId)
    .single();

  if (chapterError || !chapter) {
    console.error('Error fetching chapter:', chapterError);
    return null;
  }

  const { data: contents, error: contentsError } = await supabase
    .from('videos')
    .select('id, title, description, thumbnail_url, access_level')
    .eq('chapter_id', chapterId)
    .eq('is_deleted', false)
    .order('id', { ascending: true });

  if (contentsError) {
    console.error('Error fetching contents:', contentsError);
    return { chapter, contents: [] };
  }

  return { chapter, contents: contents || [] };
}

export default function ChapterPage({ params }: { params: { chapterId: string } }) {
  
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const chapterData = await getChapterData(params.chapterId);
        setData(chapterData);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params.chapterId]);


  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center p-8 bg-gray-100 rounded-3xl shadow-lg border border-gray-200 max-w-2xl mx-auto backdrop-blur-sm"
        >
          <p className="text-gray-600 text-xl font-medium">ロード中...</p>
        </motion.div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center p-8 bg-red-100 rounded-3xl shadow-lg border border-red-200 max-w-2xl mx-auto backdrop-blur-sm"
        >
          <p className="text-red-600 text-xl font-medium">エラーが発生しました。</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200 text-lg"
            href="/videos"
          >
            講座一覧に戻る
          </Link>
        </motion.div>
      </motion.div>
    );
  }


  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center p-8 bg-red-100 rounded-3xl shadow-lg border border-red-200 max-w-2xl mx-auto backdrop-blur-sm"
        >
          <p className="text-red-600 text-xl font-medium">章が見つかりませんでした。</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200 text-lg"
            href="/videos"
          >
            講座一覧に戻る
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  const { chapter, contents } = data;

  // 親コンテナのアニメーション設定
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-12 max-w-7xl"
    >
      {/* ◆◆◆ ChatGPT 紹介部分のカード ◆◆◆ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="
          relative 
          mb-12 
          overflow-hidden
          rounded-3xl 
          shadow-2xl 
          bg-gradient-to-tr 
          from-orange-50
          to-orange-100
        "
      >
        {/* 薄いホワイトのオーバーレイ（読みやすさ調整用） */}
        <div 
          className="
            absolute 
            inset-0 
            bg-white 
            opacity-60 
            backdrop-blur
          "
        ></div>

        {/* 実際のコンテンツ */}
        <div className="relative px-8 py-10 sm:p-12 z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-6">
            {chapter.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 leading-relaxed">
            {chapter.description}
          </p>
        </div>
      </motion.div>

      {/* ◆◆◆ コンテンツ一覧 ◆◆◆ */}
      {contents.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 bg-gray-100 rounded-3xl shadow-lg border border-gray-200 max-w-2xl mx-auto"
        >
          <p className="text-gray-600 text-xl">この章にはコンテンツがありません。</p>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {contents.map((content) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, translateY: -5, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="transform transition-all duration-300 hover:shadow-2xl"
            >
              <ContentCard content={content} chapterId={chapter.id} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ◆◆◆ 戻るリンク ◆◆◆ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-12 text-center"
      >
        <Link
          className="
            inline-flex items-center 
            text-blue-600 
            hover:text-blue-800 
            font-medium text-lg 
            hover:underline 
            transition-colors 
            duration-200
          "
          href="/videos"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          講座一覧に戻る
        </Link>
      </motion.div>
    </motion.div>
  );
}
