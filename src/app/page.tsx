import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

export default function RootPage() {
  // 重定向到默认语言路径
  redirect(`/${routing.defaultLocale}`)
}
