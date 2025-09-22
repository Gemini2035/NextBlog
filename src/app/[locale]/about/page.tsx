import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SITE_CONFIG } from '@/constants'
import { GitHubIcon, TwitterIcon, LinkedInIcon } from '@/assets/icons'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white  rounded-lg shadow-md overflow-hidden">
          <div className="px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900  mb-8">
              关于我
            </h1>
            
            <div className="prose prose-lg max-w-none ">
              <p className="text-lg text-gray-600  mb-6">
                欢迎来到 {SITE_CONFIG.title}！这里是我分享技术见解、开发经验和生活感悟的地方。
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900  mt-8 mb-4">
                技术栈
              </h2>
              <p className="text-gray-600  mb-6">
                这个博客使用以下现代技术栈构建：
              </p>
              <ul className="list-disc pl-6 text-gray-600  mb-6">
                <li><strong>Next.js 15</strong> - React 全栈框架</li>
                <li><strong>Contentlayer</strong> - 内容管理系统</li>
                <li><strong>MDX</strong> - Markdown + JSX 支持</li>
                <li><strong>Tailwind CSS</strong> - 实用优先的 CSS 框架</li>
                <li><strong>TypeScript</strong> - 类型安全的 JavaScript</li>
                <li><strong>GitHub Pages</strong> - 静态网站托管</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900  mt-8 mb-4">
                特色功能
              </h2>
              <ul className="list-disc pl-6 text-gray-600  mb-6">
                <li>📝 支持 MDX 格式的博客文章</li>
                <li>🎨 响应式设计，支持深色模式</li>
                <li>🔍 标签分类和文章搜索</li>
                <li>📱 移动端友好</li>
                <li>⚡ 快速加载和 SEO 优化</li>
                <li>🚀 自动化部署到 GitHub Pages</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900  mt-8 mb-4">
                联系方式
              </h2>
              <div className="flex space-x-4">
                {SITE_CONFIG.social.github && (
                  <a
                    href={SITE_CONFIG.social.github}
                    className="text-gray-400 hover:text-gray-600  transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <GitHubIcon className="w-6 h-6" />
                  </a>
                )}
                {SITE_CONFIG.social.twitter && (
                  <a
                    href={SITE_CONFIG.social.twitter}
                    className="text-gray-400 hover:text-gray-600  transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                  >
                    <TwitterIcon className="w-6 h-6" />
                  </a>
                )}
                {SITE_CONFIG.social.linkedin && (
                  <a
                    href={SITE_CONFIG.social.linkedin}
                    className="text-gray-400 hover:text-gray-600  transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <LinkedInIcon className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
