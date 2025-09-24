import { Link } from '@/ui'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">页面未找到</h2>
          <p className="text-gray-600 mb-8">
            抱歉，您访问的页面不存在。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link 
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            返回首页
          </Link>
          
          <div className="text-sm text-gray-500">
            <Link href="/zh" className="hover:text-blue-600 transition-colors">
              中文
            </Link>
            {' | '}
            <Link href="/en" className="hover:text-blue-600 transition-colors">
              English
            </Link>
            {' | '}
            <Link href="/ja" className="hover:text-blue-600 transition-colors">
              日本語
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
