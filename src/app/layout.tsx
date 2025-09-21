import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的博客",
  description: "分享技术见解、开发经验和生活感悟",
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
