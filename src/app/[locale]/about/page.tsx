import { SITE_CONFIG } from '@/constants'
import { GitHubIcon, TwitterIcon, LinkedInIcon, GlobeIcon } from '@/assets/icons'
import { Link, Card, Button } from '@/ui'
import { useTranslations } from 'next-intl'
import { Waterfall } from '@/components/About'

export default function AboutPage() {
  const t = useTranslations('AboutPage')
  const navT = useTranslations('Navigation')
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            {navT('About Me')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {navT('Learn about my background, skills, experience and contact information')}
          </p>
        </div>

        {/* 瀑布流主要内容区域 */}
        <div className="mb-12">
          <Waterfall
            columns={3}
            items={[
              {
                id: 'basic-info',
                content: (
                  <Card shadow="lg" border="sm" rounded className="p-8 bg-white/80 backdrop-blur-sm h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <GlobeIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {navT('Basic Information')}
                      </h2>
                    </div>
                    
                    {/* 个人简介 */}
                    <div className="mb-8" id="basic">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {navT('Personal Profile')}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {t('welcome', { siteTitle: SITE_CONFIG.title })}
                      </p>
                      <p className="text-gray-600 leading-relaxed mt-4">
                        我是一名热爱技术的开发者，专注于前端技术和全栈开发。
                        喜欢分享学习心得，致力于构建优秀的用户体验和高质量的代码。
                      </p>
                    </div>

                    {/* 联系方式 */}
                    <div id="contact">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {navT('Contact Information')}
                      </h3>
                      <div className="flex flex-wrap gap-4">
                        {SITE_CONFIG.social.github && (
                          <Link
                            href={SITE_CONFIG.social.github}
                            external
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition-all duration-200"
                          >
                            <GitHubIcon className="w-5 h-5 mr-2" />
                            GitHub
                          </Link>
                        )}
                        {SITE_CONFIG.social.twitter && (
                          <Link
                            href={SITE_CONFIG.social.twitter}
                            external
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition-all duration-200"
                          >
                            <TwitterIcon className="w-5 h-5 mr-2" />
                            Twitter
                          </Link>
                        )}
                        {SITE_CONFIG.social.linkedin && (
                          <Link
                            href={SITE_CONFIG.social.linkedin}
                            external
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition-all duration-200"
                          >
                            <LinkedInIcon className="w-5 h-5 mr-2" />
                            LinkedIn
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                ),
                height: 'medium'
              },
              {
                id: 'skills',
                content: (
                  <Card shadow="lg" border="sm" rounded className="p-8 bg-white/80 backdrop-blur-sm h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {navT('Skills & Expertise')}
                      </h2>
                    </div>

                    <div className="space-y-6" id="skills">
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">前端技术</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">React</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Next.js</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">TypeScript</span>
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Vue.js</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">后端技术</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Node.js</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Express</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Python</span>
                          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">PostgreSQL</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3">工具与平台</h4>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Git</span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Docker</span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">AWS</span>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Vercel</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ),
                height: 'tall'
              },
              {
                id: 'work-experience',
                content: (
                  <Card shadow="lg" border="sm" rounded className="p-8 bg-white/80 backdrop-blur-sm h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {navT('Work Experience')}
                      </h2>
                    </div>

                    <div className="space-y-6" id="work">
                      <div className="border-l-4 border-blue-200 pl-4">
                        <h4 className="font-medium text-gray-800">全栈开发工程师</h4>
                        <p className="text-sm text-gray-600">2022 - 至今</p>
                        <p className="text-gray-600 text-sm mt-2">
                          负责前端和后端开发，参与多个项目的架构设计和实现。
                        </p>
                      </div>
                      <div className="border-l-4 border-gray-200 pl-4">
                        <h4 className="font-medium text-gray-800">前端开发工程师</h4>
                        <p className="text-sm text-gray-600">2020 - 2022</p>
                        <p className="text-gray-600 text-sm mt-2">
                          专注于React和Vue.js开发，提升用户体验和页面性能。
                        </p>
                      </div>
                    </div>
                  </Card>
                ),
                height: 'medium'
              },
              {
                id: 'education',
                content: (
                  <Card shadow="lg" border="sm" rounded className="p-8 bg-white/80 backdrop-blur-sm h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900" id="education">
                        {navT('Education Background')}
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <div className="border-l-4 border-blue-200 pl-4">
                        <h4 className="font-medium text-gray-800">计算机科学与技术</h4>
                        <p className="text-sm text-gray-600">学士学位 | 2016 - 2020</p>
                        <p className="text-gray-600 text-sm mt-2">
                          系统学习计算机基础知识，包括数据结构、算法、数据库、网络等核心课程。
                        </p>
                      </div>
                    </div>
                  </Card>
                ),
                height: 'short'
              },
              {
                id: 'achievements',
                content: (
                  <Card shadow="lg" border="sm" rounded className="p-8 bg-white/80 backdrop-blur-sm h-full">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900" id="achievements">
                        {navT('Personal Achievements')}
                      </h2>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <p className="text-gray-800 font-medium">开源贡献者</p>
                          <p className="text-gray-600 text-sm">为多个开源项目贡献代码，获得社区认可</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <p className="text-gray-800 font-medium">技术博客作者</p>
                          <p className="text-gray-600 text-sm">定期分享技术文章，帮助开发者成长</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <div>
                          <p className="text-gray-800 font-medium">项目经验丰富</p>
                          <p className="text-gray-600 text-sm">参与多个大型项目，具备完整的开发经验</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ),
                height: 'medium'
              }
            ]}
          />
        </div>

        {/* 技术栈展示 */}
        <div className="mt-12">
          <Card shadow="lg" border="sm" rounded className="p-8 bg-gradient-to-r from-blue-50 to-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('techStack')}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('techStackDescription')}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">⚛️</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('nextjs')}</h3>
                <p className="text-sm text-gray-600">React 全栈框架</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('contentlayer')}</h3>
                <p className="text-sm text-gray-600">内容管理系统</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📄</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('mdx')}</h3>
                <p className="text-sm text-gray-600">Markdown + JSX 支持</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🎨</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('tailwind')}</h3>
                <p className="text-sm text-gray-600">实用优先的 CSS 框架</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🔷</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('typescript')}</h3>
                <p className="text-sm text-gray-600">类型安全的 JavaScript</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t('githubPages')}</h3>
                <p className="text-sm text-gray-600">静态网站托管</p>
              </div>
            </div>
          </Card>
        </div>

        {/* 特色功能 */}
        <div className="mt-12">
          <Card shadow="lg" border="sm" rounded className="p-8 bg-white/80 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('features')}
              </h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">📝</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('feature1')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">🎨</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('feature2')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">🔍</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('feature3')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">📱</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('feature4')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">⚡</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('feature5')}</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600">🚀</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{t('feature6')}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
