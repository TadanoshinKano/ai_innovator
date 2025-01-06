// app/videos/VideosPage.tsx
'use client'

import Link from 'next/link';
import { motion } from 'framer-motion';
import React from 'react';

interface Chapter {
  id: string;
  title: string;
  thumbnail_url: string;
  description: string;
}

// クライアントコンポーネントとして定義
function VideosPage({ chapters }: { chapters: Chapter[] }) {
  console.log('videos/page.tsx received chapters:', chapters);
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  };

  // chaptersがnullまたはundefinedの場合に空の配列で初期化
  const safeChapters = chapters || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold text-center mb-8">講座一覧</h1>
      {safeChapters.length === 0 ? (
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-6 bg-gray-100 rounded-2xl shadow-sm border-2 border-gray-300"
        >
          現在、利用可能な講座はありません。
        </motion.p>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {safeChapters.map((chapter) => (
            <motion.div
              key={chapter.id}
              variants={item}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={`/videos/${chapter.id}`}
                className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border-2 border-gray-300"
              >
                <div className="flex items-center p-6">
                  <motion.div
                    whileHover={{ rotate: 5 }}
                    className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 mr-4 border-2 border-gray-300"
                  >
                    <img
                      src={chapter.thumbnail_url}
                      alt={chapter.title}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">{chapter.title}</h2>
                    <p className="text-gray-600 text-sm">{chapter.description}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

export default VideosPage;
