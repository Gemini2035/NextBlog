import { useTranslations } from 'next-intl'
import { Card } from '@/ui'
import { BasicInfoBrief, BasicInfoDetail, SkillsBrief, SkillsDetail, EducationBrief, EducationDetail, TechStackBrief, TechStackDetail, DevelopmentHistoryBrief, DevelopmentHistoryDetail, OpenSourceLibrariesBrief, OpenSourceLibrariesDetail, OnlineServicesBrief, OnlineServicesDetail, DevelopmentProtocolsBrief, DevelopmentProtocolsDetail, ContactLinksBrief, ContactLinksDetail, SocialLinksBrief, SocialLinksDetail, ExpandableWaterfall } from '@/components/About'

export default function AboutPage() {
  const navT = useTranslations('Navigation')
  
  return (
    <div className="min-h-screen bg-gray-50">
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
              // 站主信息 (Owner Information)
              {
                id: 'basic-info',
                title: '个人信息',
                description: '查看我的基本信息和联系方式',
                anchorId: 'profile',
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
                cardClassName: 'bg-gray-50'
              },
              {
                id: 'contact',
                title: '联系方式',
                description: navT('Contact Description'),
                anchorId: 'contact',
                content: (
                  <div id="contact">
                    <ContactLinksBrief />
                  </div>
                ),
                expandedContent: (
                  <div>
                    <ContactLinksDetail />
                  </div>
                ),
                height: 'medium',
                cardClassName: 'bg-gray-50'
              },
              {
                id: 'social',
                title: '社交链接',
                description: '关注我的社交媒体和平台',
                anchorId: 'social',
                content: (
                  <div id="social">
                    <SocialLinksBrief />
                  </div>
                ),
                expandedContent: (
                  <div>
                    <SocialLinksDetail />
                  </div>
                ),
                height: 'short',
                cardClassName: 'bg-gray-50'
              },
              {
                id: 'skills',
                title: '技能专长',
                description: '查看我的技术技能和专业能力',
                anchorId: 'skills',
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
                cardClassName: 'bg-gray-50'
              },
              {
                id: 'education',
                title: '教育背景',
                description: '查看我的教育经历和学习成果',
                anchorId: 'education',
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
                cardClassName: 'bg-gray-50'
              },
              // 站点信息 (Site Information)
              {
                id: 'tech-stack',
                title: '技术栈',
                description: '查看项目使用的技术栈',
                anchorId: 'tech-stack',
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
                cardClassName: 'bg-gray-50'
              },
              {
                id: 'development-history',
                title: '发展历程',
                description: '查看博客从1.0到2.0的完整发展历程',
                anchorId: 'development-history',
                content: (
                  <div id="development-history">
                    <DevelopmentHistoryBrief />
                  </div>
                ),
                expandedContent: (
                  <div>
                    <DevelopmentHistoryDetail />
                  </div>
                ),
                height: 'tall',
                cardClassName: 'bg-gray-50'
              },
              // 相关资源 (Related Resources)
              {
                id: 'open-source',
                title: '开源库',
                description: '查看使用的开源库和框架',
                anchorId: 'open-source',
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
                cardClassName: 'bg-gray-50'
              },
              {
                id: 'online-services',
                title: '在线服务',
                description: '查看使用的在线服务',
                anchorId: 'online-services',
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
                cardClassName: 'bg-gray-50'
              },
              {
                id: 'protocols',
                title: '开发协议',
                description: '查看开发规范和协议',
                anchorId: 'protocols',
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
                cardClassName: 'bg-gray-50'
              }
            ]}
          />
        </div>


      </div>
    </div>
  )
}
