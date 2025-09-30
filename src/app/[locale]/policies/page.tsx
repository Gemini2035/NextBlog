'use client'

import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { useAnchorScroll } from '@/hooks/useAnchorScroll';
import { Collapse } from '@/ui/Collapse';
import Link from '@/ui/Link';
import { ChevronRightIcon } from '@/assets/icons';
import { useState, useEffect } from 'react';

interface PoliciesPageProps {
  params: Promise<{ locale: string }>;
}

export default function PoliciesPage({ params }: PoliciesPageProps) {
  const [locale, setLocale] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  
  // 所有hooks必须在条件渲染之前调用
  const t = useTranslations('Policies');
  
  // 使用锚点滚动hook
  useAnchorScroll({ anchorId: 'terms' });
  useAnchorScroll({ anchorId: 'privacy' });
  useAnchorScroll({ anchorId: 'security' });
  
  useEffect(() => {
    params.then(({ locale: resolvedLocale }) => {
      setLocale(resolvedLocale);
      setIsLoading(false);
    });
  }, [params]);
  
  if (isLoading) {
    return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;
  }
  
  if (!routing.locales.includes(locale as 'zh' | 'en' | 'ja')) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex">
        {/* 悬浮导航 */}
        <nav className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
          <div className="bg-white rounded-lg shadow-lg p-4 w-48">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {t('navigationTitle')}
            </h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#terms" 
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors py-1"
                >
                  {t('navigationTerms')}
                </a>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors py-1"
                >
                  {t('navigationPrivacy')}
                </a>
              </li>
              <li>
                <a 
                  href="#security" 
                  className="block text-sm text-blue-600 hover:text-blue-800 transition-colors py-1"
                >
                  {t('navigationSecurity')}
                </a>
              </li>
            </ul>
          </div>
        </nav>

        {/* 主要内容区域 */}
        <div className="flex-1 max-w-4xl mx-auto px-4 py-8 lg:ml-64">
          {/* 页面标题 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-600">
              {t('description')}
            </p>
          </div>

          {/* 移动端导航菜单 */}
          <nav className="mb-8 bg-gray-50 rounded-lg p-4 lg:hidden">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              {t('navigationTitle')}
            </h2>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#terms" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {t('navigationTerms')}
                </a>
              </li>
              <li>
                <a 
                  href="#privacy" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {t('navigationPrivacy')}
                </a>
              </li>
              <li>
                <a 
                  href="#security" 
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  {t('navigationSecurity')}
                </a>
              </li>
            </ul>
          </nav>

          {/* 使用Collapse组件展示协议内容 */}
          <Collapse defaultActiveKey={['terms']} accordion>
            {/* 服务条款 */}
            <Collapse.Panel 
              header={
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t('termsTitle')}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('termsLastUpdated')}
                  </p>
                </div>
              } 
              key="terms"
            >
              <div id="terms" className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('termsSection1Title')}
                  </h3>
                  <p className="text-gray-600">{t('termsSection1Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('termsSection2Title')}
                  </h3>
                  <p className="text-gray-600">{t('termsSection2Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('termsSection3Title')}
                  </h3>
                  <p className="text-gray-600">{t('termsSection3Content')}</p>
                </div>
              </div>
            </Collapse.Panel>

            {/* 隐私政策 */}
            <Collapse.Panel 
              header={
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t('privacyTitle')}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('privacyLastUpdated')}
                  </p>
                </div>
              } 
              key="privacy"
            >
              <div id="privacy" className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('privacySection1Title')}
                  </h3>
                  <p className="text-gray-600">{t('privacySection1Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('privacySection2Title')}
                  </h3>
                  <p className="text-gray-600">{t('privacySection2Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('privacySection3Title')}
                  </h3>
                  <p className="text-gray-600">{t('privacySection3Content')}</p>
                </div>
              </div>
            </Collapse.Panel>

            {/* 安全政策 */}
            <Collapse.Panel 
              header={
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {t('securityTitle')}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {t('securityLastUpdated')}
                  </p>
                </div>
              } 
              key="security"
            >
              <div id="security" className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('securitySection1Title')}
                  </h3>
                  <p className="text-gray-600">{t('securitySection1Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('securitySection2Title')}
                  </h3>
                  <p className="text-gray-600">{t('securitySection2Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {t('securitySection3Title')}
                  </h3>
                  <p className="text-gray-600">{t('securitySection3Content')}</p>
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>

          {/* 联系信息 */}
          <section className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="mb-4">
              <Link 
                href="/about#contact"
                className="flex items-center justify-between text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors"
              >
                <span>{t('contactTitle')}</span>
                <ChevronRightIcon className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-gray-700">
              {t('contactDescription')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
