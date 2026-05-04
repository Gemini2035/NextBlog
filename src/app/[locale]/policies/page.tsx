'use client'

import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { useAnchorScroll } from '@/hooks/useAnchorScroll';
import { Collapse, CollapsePanel } from '@/ui/Collapse';
import Link from '@/ui/Link';
import { ChevronRightIcon } from '@/assets/icons';
import { useState, useEffect, useCallback } from 'react';

interface PoliciesPageProps {
  params: Promise<{ locale: string }>;
}

export default function PoliciesPage({ params }: PoliciesPageProps) {
  const [locale, setLocale] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeCollapseKey, setActiveCollapseKey] = useState<string[]>(['terms']);
  
  // 所有hooks必须在条件渲染之前调用
  const t = useTranslations('Policies');
  
  // 处理collapse展开的函数
  const handleCollapseChange = useCallback((key: string | string[]) => {
    const keys = Array.isArray(key) ? key : [key];
    setActiveCollapseKey(keys);
  }, []);

  // 处理锚点跳转和自动展开collapse
  const handleAnchorClick = useCallback((anchorId: string, collapseKey: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      
      // 先展开对应的collapse面板
      if (!activeCollapseKey.includes(collapseKey)) {
        setActiveCollapseKey([collapseKey]);
      }
      
      // 延迟滚动，等待collapse展开动画完成
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          // 计算元素在屏幕中间的位置
          const elementRect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const elementTop = window.scrollY + elementRect.top;
          const elementHeight = elementRect.height;
          
          // 计算滚动位置，使元素显示在屏幕中间
          const scrollPosition = elementTop - (viewportHeight / 2) + (elementHeight / 2);
          
          window.scrollTo({ 
            top: Math.max(0, scrollPosition), 
            behavior: 'smooth' 
          });
        }
      }, 300);
    };
  }, [activeCollapseKey]);
  
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
      {/* 悬浮导航 */}
      <nav className="fixed left-4 top-1/2 transform -translate-y-1/2 z-10 hidden lg:block">
        <div className="bg-white rounded-lg shadow-lg p-4 w-48">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            {t('navigationTitle')}
          </h3>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={handleAnchorClick('terms', 'terms')}
                className="block text-sm text-blue-600 hover:text-blue-800 transition-colors py-1 text-left w-full cursor-pointer"
              >
                {t('navigationTerms')}
              </button>
            </li>
            <li>
              <button 
                onClick={handleAnchorClick('privacy', 'privacy')}
                className="block text-sm text-blue-600 hover:text-blue-800 transition-colors py-1 text-left w-full cursor-pointer"
              >
                {t('navigationPrivacy')}
              </button>
            </li>
            <li>
              <button 
                onClick={handleAnchorClick('security', 'security')}
                className="block text-sm text-blue-600 hover:text-blue-800 transition-colors py-1 text-left w-full cursor-pointer"
              >
                {t('navigationSecurity')}
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* 主要内容区域 - 完全居中 */}
      <div className="w-full max-w-4xl mx-auto px-6 py-8">
          {/* 页面标题 */}
          <div className="mb-12 border-b border-gray-200 pb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed">
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
                <button 
                  onClick={handleAnchorClick('terms', 'terms')}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-left cursor-pointer"
                >
                  {t('navigationTerms')}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleAnchorClick('privacy', 'privacy')}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-left cursor-pointer"
                >
                  {t('navigationPrivacy')}
                </button>
              </li>
              <li>
                <button 
                  onClick={handleAnchorClick('security', 'security')}
                  className="text-blue-600 hover:text-blue-800 transition-colors text-left cursor-pointer"
                >
                  {t('navigationSecurity')}
                </button>
              </li>
            </ul>
          </nav>

          {/* 使用Collapse组件展示协议内容 */}
          <Collapse 
            activeKey={activeCollapseKey} 
            onChange={handleCollapseChange}
            accordion
          >
            {/* 服务条款 */}
            <CollapsePanel 
              header={
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {t('termsTitle')}
                  </h2>
                  <p className="text-sm text-gray-400 font-medium">
                    {t('termsLastUpdated')}
                  </p>
                </div>
              } 
              key="terms"
            >
              <div id="terms" className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                    {t('termsSection1Title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{t('termsSection1Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                    {t('termsSection2Title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{t('termsSection2Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                    {t('termsSection3Title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{t('termsSection3Content')}</p>
                </div>
              </div>
            </CollapsePanel>

            {/* 隐私政策 */}
            <CollapsePanel 
              header={
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {t('privacyTitle')}
                  </h2>
                  <p className="text-sm text-gray-400 font-medium">
                    {t('privacyLastUpdated')}
                  </p>
                </div>
              } 
              key="privacy"
            >
              <div id="privacy" className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                    {t('privacySection1Title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{t('privacySection1Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                    {t('privacySection2Title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{t('privacySection2Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                    {t('privacySection3Title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{t('privacySection3Content')}</p>
                </div>
              </div>
            </CollapsePanel>

            {/* 安全政策 */}
            <CollapsePanel 
              header={
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {t('securityTitle')}
                  </h2>
                  <p className="text-sm text-gray-400 font-medium">
                    {t('securityLastUpdated')}
                  </p>
                </div>
              } 
              key="security"
            >
              <div id="security" className="space-y-4 text-gray-700">
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                    {t('securitySection1Title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{t('securitySection1Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                    {t('securitySection2Title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{t('securitySection2Content')}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3 border-l-4 border-blue-500 pl-3">
                    {t('securitySection3Title')}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{t('securitySection3Content')}</p>
                </div>
              </div>
            </CollapsePanel>
          </Collapse>

          {/* 联系信息 */}
          <section className="mt-8 bg-gray-50 rounded-lg p-6">
            <div className="mb-4">
              <Link 
                href="/about#contact"
                className="flex items-center justify-between text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors cursor-pointer"
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
  );
}
