import { SITE_CONFIG } from '@/constants'
import { GitHubIcon, TwitterIcon, LinkedInIcon } from '@/assets/icons'
import { useTranslations } from 'next-intl'

export default function AboutPage() {
  const t = useTranslations('AboutPage')
  
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white  rounded-lg shadow-md overflow-hidden">
          <div className="px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900  mb-8">
              {t('title')}
            </h1>
            
            <div className="prose prose-lg max-w-none ">
              <p className="text-lg text-gray-600  mb-6">
                {t('welcome', { siteTitle: SITE_CONFIG.title })}
              </p>
              
              <h2 className="text-2xl font-semibold text-gray-900  mt-8 mb-4">
                {t('techStack')}
              </h2>
              <p className="text-gray-600  mb-6">
                {t('techStackDescription')}
              </p>
              <ul className="list-disc pl-6 text-gray-600  mb-6">
                <li><strong>{t('nextjs')}</strong></li>
                <li><strong>{t('contentlayer')}</strong></li>
                <li><strong>{t('mdx')}</strong></li>
                <li><strong>{t('tailwind')}</strong></li>
                <li><strong>{t('typescript')}</strong></li>
                <li><strong>{t('githubPages')}</strong></li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900  mt-8 mb-4">
                {t('features')}
              </h2>
              <ul className="list-disc pl-6 text-gray-600  mb-6">
                <li>{t('feature1')}</li>
                <li>{t('feature2')}</li>
                <li>{t('feature3')}</li>
                <li>{t('feature4')}</li>
                <li>{t('feature5')}</li>
                <li>{t('feature6')}</li>
              </ul>
              
              <h2 className="text-2xl font-semibold text-gray-900  mt-8 mb-4">
                {t('contact')}
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
  )
}
