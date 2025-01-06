'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { User } from '@supabase/supabase-js';
import Image from 'next/image';

interface WatchHistoryItem {
  video_id: string
  progress: number
  video: {
    title: string
    thumbnail_url: string
  }
  chapter_id: string;
  sort_order: number;
}

interface VideoDetails {
  [key: string]: {
    title: string;
    thumbnail_url: string;
    chapter_id: string;
    sort_order: number;
  };
}


export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([])
  const [username, setUsername] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        console.log('user', user)
        fetchWatchHistory(user.id)
        fetchUsername(user.id)
      } else {
        router.push('/login')
      }
    }
    getUser()
  }, [router])


  const fetchUsername = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('user_id', userId)
        .maybeSingle()

      if (error) {
        console.error('Error fetching username:', error)
        setUsername(null)
      } else {
        setUsername(data?.username || null)
      }
    } catch (error) {
      console.error('Error fetching username:', error)
      setUsername(null)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUsername(user.id)
    }
  }, [user])

  const fetchWatchHistory = useCallback(async (userId: string) => {
    console.log('fetchWatchHistory called', userId)
    try {
      const { data: watchStatusData, error: watchStatusError } = await supabase
        .from('video_watch_status')
        .select('video_id, completion_rate')
        .eq('user_id', userId)
        .order('last_watched_at', { ascending: false })
        .limit(3)

      console.log('supabase query data (watchStatusData)', watchStatusData)
      console.log('supabase query error (watchStatusError)', watchStatusError)

      if (watchStatusError) {
        console.error('Error fetching watch history:', watchStatusError)
        setWatchHistory([])
        return
      }

      if (!watchStatusData || watchStatusData.length === 0) {
        setWatchHistory([])
        return
      }

      const videoIds = watchStatusData.map(item => item.video_id);
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('id, title, thumbnail_url, chapter_id, sort_order')
        .in('id', videoIds)

      console.log('supabase query data (videosData)', videosData)
      console.log('supabase query error (videosError)', videosError)

      if (videosError) {
        console.error('Error fetching videos:', videosError)
        setWatchHistory([])
        return
      }

      if (!videosData || videosData.length === 0) {
        setWatchHistory([])
        return
      }

      const videoDetails: VideoDetails = videosData.reduce((acc, video) => {
        acc[video.id] = { 
          title: video.title, 
          thumbnail_url: video.thumbnail_url,
          chapter_id: video.chapter_id,
          sort_order: video.sort_order
         };
        return acc;
      }, {} as VideoDetails);

      console.log('videoDetails', videoDetails)

      const formattedData = watchStatusData.map(item => ({
        video_id: item.video_id,
        progress: item.completion_rate,
        video: { 
          title: videoDetails[item.video_id]?.title || '不明', 
          thumbnail_url: videoDetails[item.video_id]?.thumbnail_url || '' 
        },
        chapter_id: videoDetails[item.video_id]?.chapter_id || '',
        sort_order: videoDetails[item.video_id]?.sort_order || 0
      }));

      console.log('formattedData', formattedData)

      setWatchHistory(formattedData)
      console.log('watchHistory', watchHistory)
    } catch (error) {
      console.error('Error in fetchWatchHistory:', error)
      setWatchHistory([])
    }
  }, [])


  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!user) return null

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.div 
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="bg-white bg-opacity-60 backdrop-blur-md shadow-xl rounded-xl p-6 md:p-8 lg:p-12 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <motion.h1 
            className="text-3xl md:text-4xl font-extrabold mb-2 text-orange-600"
          >
            ダッシュボード
          </motion.h1>
          <motion.p 
            className="text-base md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            ようこそ、<motion.span 
              className="font-semibold"
            >{username}</motion.span>さん！
          </motion.p>
        </motion.div>

        <motion.div 
          className="flex justify-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="w-full max-w-3xl"
            variants={itemVariants}
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-4 text-orange-500 text-center">
              視聴履歴
            </h2>
            <AnimatePresence>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {watchHistory.map((item, index) => (
                  <motion.div
                    key={item.video_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                    className="bg-white bg-opacity-70 rounded-lg shadow-md p-4 flex flex-col items-center"
                  >
                    <Image 
                      src={item.video.thumbnail_url} 
                      alt={item.video.title} 
                      width={300}
                      height={170}
                      className="w-full h-auto rounded-md mb-2"
                    />
                    <Link
                      href={`/videos/${item.chapter_id}/content/${item.video_id}`}
                      className="text-blue-600 hover:text-blue-700 hover:underline text-center"
                    >
                      {item.video.title}
                    </Link>
                    {/* <motion.span 
                      className="text-gray-500 text-xs md:text-sm mt-1"
                    >
                      (進捗: {Math.round(item.progress)}%)
                    </motion.span> */}
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            onClick={handleLogout}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 md:px-6 rounded-md transition-all duration-300 shadow-lg text-sm md:text-base"
            whileTap={{ scale: 0.95 }}
          >
            ログアウト
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
