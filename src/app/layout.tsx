import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ToastContainer } from "@/ui";
import "gemini-uis/style.css";
import "./globals.css";
// 移动端视口配置
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  // 匹配网站 bg-gray-50 背景色，提供无缝的视觉体验
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f9fafb' },  // Tailwind gray-50
    { media: '(prefers-color-scheme: dark)', color: '#111827' }    // Tailwind gray-900
  ],
};

export const metadata: Metadata = {
  title: "Apodidae",
  description: "分享技术见解、开发经验和生活感悟",
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
  // 移动端 Web App 配置
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Apodidae',
  },
  // 格式检测配置
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  // 其他移动端优化
  other: {
    // 针对 Android Chrome
    'mobile-web-app-capable': 'yes',
    // 针对 Windows Phone - 禁用点击高亮
    'msapplication-tap-highlight': 'no',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="w-full overflow-x-hidden">
      <body className="antialiased w-full">
        {children}
        <ToastContainer />
      </body>
    </html>
  );
}
