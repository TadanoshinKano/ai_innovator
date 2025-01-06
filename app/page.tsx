import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {/* メインコンテンツ（ヒーローセクション） */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 max-w-screen-xl mx-auto">
        <h2 className="text-4xl font-extrabold mb-4 text-gray-800">
          AI INNOVATORへようこそ
        </h2>
        <p className="text-lg md:text-xl mb-8 text-gray-700 leading-relaxed max-w-2xl text-center">
          AIを活用した革新的なオンライン動画視聴プラットフォームです。<br />
          最新のAI講義を好きなときに受講し、スキルアップを加速させましょう。
        </p>

        {/* ボタンセクション */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/login"
            className="inline-block bg-white text-orange-500 border border-orange-500 hover:bg-orange-100 font-bold py-2 px-6 rounded transition-colors"
          >
            ログイン
          </Link>
          <Link
            href="/register"
            className="inline-block bg-orange-500 text-white hover:bg-orange-600 font-bold py-2 px-6 rounded transition-colors"
          >
            新規登録
          </Link>
        </div>
      </main>
    </div>
  )
}
