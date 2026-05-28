// src/app/[locale]/layout.tsx
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { getMessages } from 'next-intl/server';
import { LoadingProvider } from '@/components/LoadingProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { SiteDataProvider } from '@/components/SiteDataProvider';
import { getSiteInit } from '@/apis/site/server';

interface LocaleLayoutProps {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function RootIntlLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params;

    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    const [messages, siteInit] = await Promise.all([
        getMessages(),
        getSiteInit(locale),
    ]);

    return (
        <NextIntlClientProvider messages={messages}>
            <SiteDataProvider value={siteInit}>
                <LoadingProvider>
                    <div className="min-h-screen bg-gray-50 flex flex-col relative">
                        <Header />
                        <main className="flex-1">
                            {children}
                        </main>
                        <Footer />
                    </div>
                </LoadingProvider>
            </SiteDataProvider>
        </NextIntlClientProvider>
    );
}
