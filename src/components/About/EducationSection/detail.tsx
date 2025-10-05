'use client'

import { useTranslations } from 'next-intl'

interface EducationDetailProps {
  className?: string
}

export default function EducationDetail({ className }: EducationDetailProps) {
  const navT = useTranslations('Navigation')

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mr-6">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2" id="education">
            {navT('Education Background')}
          </h2>
          <p className="text-lg text-gray-600">
            教育经历与学习成果详情
          </p>
        </div>
      </div>

      {/* 主要教育经历 */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">主要教育经历</h3>
        <div className="space-y-6">
          <div className="border-l-4 border-purple-400 pl-6 py-4 bg-purple-50 rounded-r-xl">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">计算机科学与技术</h4>
                <p className="text-purple-600 font-medium">学士学位</p>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                2016 - 2020
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed mb-4">
              系统学习计算机基础知识，包括数据结构、算法、数据库、网络编程、软件工程等核心课程。
              通过四年的学习，掌握了扎实的计算机理论基础和编程实践能力。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium text-gray-800 mb-2">核心课程</h5>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• 数据结构与算法</li>
                  <li>• 数据库系统原理</li>
                  <li>• 计算机网络</li>
                  <li>• 软件工程</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-800 mb-2">实践项目</h5>
                <ul className="space-y-1 text-gray-600 text-sm">
                  <li>• Web应用开发项目</li>
                  <li>• 数据库设计实践</li>
                  <li>• 网络编程实验</li>
                  <li>• 毕业设计项目</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 学习成果 */}
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">学习成果</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-purple-50 rounded-xl">
            <h4 className="text-lg font-semibold text-purple-900 mb-4">学术成就</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-purple-800">专业排名前10%</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-purple-800">多次获得校级奖学金</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-purple-800">优秀毕业生荣誉称号</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span className="text-purple-800">参与多项科研项目</span>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-blue-50 rounded-xl">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">项目经验</h4>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-blue-800">毕业设计优秀奖</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-blue-800">参与多个开源项目</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-blue-800">技术博客写作</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span className="text-blue-800">编程竞赛获奖</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 持续学习 */}
      <div className="p-6 bg-gray-50 rounded-xl">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">持续学习</h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          教育不仅仅是课堂学习，更是一种持续成长的过程。毕业后，我始终保持学习的态度，
          通过在线课程、技术社区、开源项目等方式不断提升自己的技能和知识水平。
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-purple-600 font-bold">20+</span>
            </div>
            <p className="text-sm text-gray-600">在线课程完成</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-blue-600 font-bold">50+</span>
            </div>
            <p className="text-sm text-gray-600">技术文章发布</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-green-600 font-bold">10+</span>
            </div>
            <p className="text-sm text-gray-600">开源项目贡献</p>
          </div>
        </div>
      </div>
    </div>
  )
}
