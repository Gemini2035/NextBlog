import { useTranslations } from 'next-intl'
import { Card } from '@/ui'
import { BasicInfoBrief, BasicInfoDetail, SkillsBrief, SkillsDetail, EducationBrief, EducationDetail, TechStackBrief, TechStackDetail, DevelopmentProgressBrief, DevelopmentProgressDetail, OpenSourceLibrariesBrief, OpenSourceLibrariesDetail, OnlineServicesBrief, OnlineServicesDetail, DevelopmentProtocolsBrief, DevelopmentProtocolsDetail, ExpandableWaterfall } from '@/components/About'

export default function AboutPage() {
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

        {/* 主要内容区域 - 使用ExpandableWaterfall */}
        <div className="mb-12">
          <ExpandableWaterfall
            columns={2}
            items={[
              {
                id: 'basic-info',
                title: '个人信息',
                description: '查看我的基本信息和联系方式',
                content: (
                  <div id="profile">
                    <BasicInfoBrief />
                  </div>
                ),
                expandedContent: (
                  <div>
                    <BasicInfoDetail />
                  </div>
                ),
                height: 'medium',
                cardClassName: 'bg-gradient-to-r from-blue-50 to-white'
              },
              {
                id: 'skills',
                title: '技能专长',
                description: '查看我的技术技能和专业能力',
                content: (
                  <div id="skills">
                    <SkillsBrief />
                  </div>
                ),
                expandedContent: (
                  <div>
                    <SkillsDetail />
                  </div>
                ),
                height: 'tall',
                cardClassName: 'bg-gradient-to-r from-green-50 to-white'
              },
              {
                id: 'education',
                title: '教育背景',
                description: '查看我的教育经历和学习成果',
                content: (
                  <div id="education">
                    <EducationBrief />
                  </div>
                ),
                expandedContent: (
                  <div>
                    <EducationDetail />
                  </div>
                ),
                height: 'short',
                cardClassName: 'bg-gradient-to-r from-purple-50 to-white'
              },
              {
                id: 'tech-stack',
                title: '技术栈',
                description: '查看项目使用的技术栈',
                content: (
                  <div id="tech-stack">
                    <TechStackBrief />
                  </div>
                ),
                expandedContent: (
                  <div>
                    <TechStackDetail />
                  </div>
                ),
                height: 'medium',
                cardClassName: 'bg-gradient-to-r from-cyan-50 to-white'
              },
              {
                id: 'development',
                title: '发展历史',
                description: '查看项目的发展历程',
                content: (
                  <div id="development">
                    <DevelopmentProgressBrief />
                  </div>
                ),
                expandedContent: (
                  <div>
                    <DevelopmentProgressDetail />
                  </div>
                ),
                height: 'tall',
                cardClassName: 'bg-white/80 backdrop-blur-sm'
              },
              {
                id: 'open-source',
                title: '开源库',
                description: '查看使用的开源库和框架',
                content: (
                  <div id="open-source">
                    <OpenSourceLibrariesBrief />
                  </div>
                ),
                expandedContent: (
                  <div>
                    <OpenSourceLibrariesDetail />
                  </div>
                ),
                height: 'medium',
                cardClassName: 'bg-gradient-to-r from-emerald-50 to-white'
              },
              {
                id: 'online-services',
                title: '在线服务',
                description: '查看使用的在线服务',
                content: (
                  <div id="online-services">
                    <OnlineServicesBrief />
                  </div>
                ),
                expandedContent: (
                  <div>
                    <OnlineServicesDetail />
                  </div>
                ),
                height: 'medium',
                cardClassName: 'bg-gradient-to-r from-violet-50 to-white'
              },
              {
                id: 'protocols',
                title: '开发协议',
                description: '查看开发规范和协议',
                content: (
                  <div id="protocols">
                    <DevelopmentProtocolsBrief />
                  </div>
                ),
                expandedContent: (
                  <div>
                    <DevelopmentProtocolsDetail />
                  </div>
                ),
                height: 'medium',
                cardClassName: 'bg-gradient-to-r from-amber-50 to-white'
              }
            ]}
          />
        </div>


      </div>
    </div>
  )
}
