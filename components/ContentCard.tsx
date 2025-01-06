// components/ContentCard.tsx
import Link from 'next/link';
import Image from 'next/image';

interface Content {
  id: number;
  title: string;
  description: string;
  thumbnail_url?: string;
  access_level: 'public' | 'authenticated';
  video_url: string;
  chapter_id: number;
  sort_order: number;
}

interface ContentCardProps {
  content: Content;
  chapterId: number;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, chapterId }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 border-2 border-gray-300 w-full">
      <div className="relative">
        {content.thumbnail_url && (
          <Image
            src={content.thumbnail_url}
            alt={content.title}
            className="w-full h-32 sm:h-40 md:h-48 lg:h-56 object-cover"
            width={500}
            height={300}
          />
        )}
        {content.access_level === 'authenticated' && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs sm:text-sm">
            プレミアム
          </span>
        )}
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 text-gray-800 line-clamp-2">{content.title}</h3>
        <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">{content.description}</p>
        <Link 
          href={`/videos/${chapterId}/content/${content.id}`}
          className="inline-block bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full hover:bg-blue-600 transition-colors duration-300 text-sm sm:text-base w-full sm:w-auto text-center"
        >
          視聴する
        </Link>
      </div>
    </div>
  );
};

export default ContentCard;
