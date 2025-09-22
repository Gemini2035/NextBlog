// src/app/[lang]/layout.tsx
import { NextIntlClientProvider } from 'next-intl';
import type { ReactNode } from 'react';

interface LocaleLayoutProps {
    children: ReactNode;
    params: Promise<{ locale: string }>;
}

export default async function RootIntlLayout({ children, params }: LocaleLayoutProps) {
    const { locale } = await params;
    console.log(locale);

    return (
        <NextIntlClientProvider >
            {children}
        </NextIntlClientProvider>

    );
}
