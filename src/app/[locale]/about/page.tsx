import { useTranslations } from 'next-intl'
import { Card } from '@/ui'
import { Waterfall, BasicInfoSection, SkillsSection, WorkExperienceSection, EducationSection, AchievementsSection, TechStackSection, FeaturesSection } from '@/components/About'

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

        {/* 瀑布流主要内容区域 */}
        <div className="mb-12">
          <Waterfall
            columns={3}
            items={[
              {
                id: 'basic-info',
                content: <BasicInfoSection />,
                height: 'medium'
              },
              {
                id: 'skills',
                content: <SkillsSection />,
                height: 'tall'
              },
              {
                id: 'work-experience',
                content: <WorkExperienceSection />,
                height: 'medium'
              },
              {
                id: 'education',
                content: <EducationSection />,
                height: 'short'
              },
              {
                id: 'achievements',
                content: <AchievementsSection />,
                height: 'medium'
              }
            ]}
          />
        </div>

        {/* 技术栈展示 */}
        <div className="mt-12">
          <Card shadow="lg" border="sm" rounded className="p-8 bg-gradient-to-r from-blue-50 to-white">
            <TechStackSection />
          </Card>
        </div>

        {/* 特色功能 */}
        <div className="mt-12">
          <Card shadow="lg" border="sm" rounded className="p-8 bg-white/80 backdrop-blur-sm">
            <FeaturesSection />
          </Card>
        </div>
      </div>
    </div>
  )
}
