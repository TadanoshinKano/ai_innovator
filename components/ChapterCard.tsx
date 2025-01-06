// components/ChapterCard.tsx
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Chapter {
  id: number;
  title: string;
  thumbnail_url: string;
}

interface ChapterCardProps {
  chapter: Chapter;
}

const ChapterCard: React.FC<ChapterCardProps> = ({ chapter }) => {
  return (
    <Link href={`/videos/${chapter.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-orange-100"
      >
        <div className="relative">
          <img
            src={chapter.thumbnail_url}
            alt={chapter.title}
            className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        <div className="p-6 bg-gradient-to-r from-orange-50 to-white">
          <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-orange-600 transition-colors duration-300">
            {chapter.title}
          </h2>
          <div className="flex justify-end">
            <span className="text-orange-500 text-sm font-medium hover:text-orange-600 transition-colors duration-300">
              詳細を見る →
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default ChapterCard;
