'use client'

import { useTranslations } from 'next-intl'
import { 
  OpenSourceIcon,
  ReactIcon, 
  NextJsIcon, 
  TypeScriptIcon,
  TailwindIcon,
  ContentlayerIcon,
  MdxIcon,
  FramerMotionIcon,
  FuseIcon,
  ClsxIcon,
  DebounceIcon,
  ESLintIcon,
  PrettierIcon,
  HuskyIcon,
  PostCSSIcon,
  OpenAIIcon,
  GrayMatterIcon,
  AnimateIcon,
  EmotionIcon,
  GitHubIcon,
  GlobeIcon
} from '@/assets/icons'
import { cn } from '@/utils'

interface OpenSourceLibrariesDetailProps {
  className?: string
}

interface LibraryCardProps {
  icon: React.ReactNode
  name: string
  category: string
  description: string
  version: string
  docsUrl: string
  githubUrl: string
}

function LibraryCard({ icon, name, category, description, version, docsUrl, githubUrl }: LibraryCardProps) {
  const t = useTranslations('AboutPage')
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">{category}</p>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">
        {description}
      </p>
      <div className="mt-auto pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{version}</span>
        </div>
        <div className="flex items-center justify-between">
          <a 
            href={docsUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(
              "text-blue-600 hover:text-blue-800 text-sm font-medium",
              "flex items-center gap-1 transition-colors"
            )}
          >
            {t('openSourceLibrariesDetail.viewDocs')} →
          </a>
          <a 
            href={githubUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={cn(
              "text-gray-600 hover:text-gray-900 text-sm",
              "flex items-center gap-1 transition-colors"
            )}
          >
            <GitHubIcon className="w-4 h-4" />
            {t('openSourceLibrariesDetail.sourceCode')}
          </a>
        </div>
      </div>
    </div>
  )
}

export default function OpenSourceLibrariesDetail({ className }: OpenSourceLibrariesDetailProps) {
  const t = useTranslations('AboutPage')

  return (
    <div className={className} id="open-source">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6 shrink-0">
          <OpenSourceIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t('openSourceLibraries')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('openSourceLibrariesDetail.description')}
          </p>
        </div>
      </div>
      
      {/* 核心框架 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('openSourceLibrariesDetail.coreFrameworks')}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LibraryCard 
            icon={<ReactIcon className="w-5 h-5 text-gray-700" />}
            name="React"
            category={t('openSourceLibrariesDetail.categories.uiLibrary')}
            description={t('openSourceLibrariesDetail.libraries.react')}
            version="v19.1.0"
            docsUrl="https://react.dev"
            githubUrl="https://github.com/facebook/react"
          />
          <LibraryCard 
            icon={<NextJsIcon className="w-5 h-5 text-gray-700" />}
            name="Next.js"
            category={t('openSourceLibrariesDetail.categories.framework')}
            description={t('openSourceLibrariesDetail.libraries.nextjs')}
            version="v15.5.3"
            docsUrl="https://nextjs.org"
            githubUrl="https://github.com/vercel/next.js"
          />
          <LibraryCard 
            icon={<TypeScriptIcon className="w-5 h-5 text-gray-700" />}
            name="TypeScript"
            category={t('openSourceLibrariesDetail.categories.language')}
            description={t('openSourceLibrariesDetail.libraries.typescript')}
            version="v5.x"
            docsUrl="https://www.typescriptlang.org"
            githubUrl="https://github.com/microsoft/TypeScript"
          />
        </div>
      </div>

      {/* 样式与UI */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('openSourceLibrariesDetail.styling')}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LibraryCard 
            icon={<TailwindIcon className="w-5 h-5 text-gray-700" />}
            name="Tailwind CSS"
            category={t('openSourceLibrariesDetail.categories.cssFramework')}
            description={t('openSourceLibrariesDetail.libraries.tailwind')}
            version="v4.0.0"
            docsUrl="https://tailwindcss.com"
            githubUrl="https://github.com/tailwindlabs/tailwindcss"
          />
          <LibraryCard 
            icon={<PostCSSIcon className="w-5 h-5 text-gray-700" />}
            name="PostCSS"
            category={t('openSourceLibrariesDetail.categories.cssProcessor')}
            description={t('openSourceLibrariesDetail.libraries.postcss')}
            version="v4.x (@tailwindcss/postcss)"
            docsUrl="https://postcss.org"
            githubUrl="https://github.com/postcss/postcss"
          />
          <LibraryCard 
            icon={<AnimateIcon className="w-5 h-5 text-gray-700" />}
            name="Tailwind Animate"
            category={t('openSourceLibrariesDetail.categories.animation')}
            description={t('openSourceLibrariesDetail.libraries.tailwindAnimate')}
            version="v1.0.7"
            docsUrl="https://github.com/jamiebuilds/tailwindcss-animate"
            githubUrl="https://github.com/jamiebuilds/tailwindcss-animate"
          />
          <LibraryCard 
            icon={<FramerMotionIcon className="w-5 h-5 text-gray-700" />}
            name="Framer Motion"
            category={t('openSourceLibrariesDetail.categories.animation')}
            description={t('openSourceLibrariesDetail.libraries.framerMotion')}
            version="v12.23.16"
            docsUrl="https://www.framer.com/motion"
            githubUrl="https://github.com/framer/motion"
          />
          <LibraryCard 
            icon={<EmotionIcon className="w-5 h-5 text-gray-700" />}
            name="Emotion"
            category={t('openSourceLibrariesDetail.categories.cssInJs')}
            description={t('openSourceLibrariesDetail.libraries.emotion')}
            version="v1.4.0 (@emotion/is-prop-valid)"
            docsUrl="https://emotion.sh"
            githubUrl="https://github.com/emotion-js/emotion"
          />
        </div>
      </div>

      {/* 内容管理 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('openSourceLibrariesDetail.contentManagement')}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LibraryCard 
            icon={<ContentlayerIcon className="w-5 h-5 text-gray-700" />}
            name="Contentlayer"
            category={t('openSourceLibrariesDetail.categories.cms')}
            description={t('openSourceLibrariesDetail.libraries.contentlayer')}
            version="v0.5.8"
            docsUrl="https://contentlayer.dev"
            githubUrl="https://github.com/contentlayerdev/contentlayer"
          />
          <LibraryCard 
            icon={<MdxIcon className="w-5 h-5 text-gray-700" />}
            name="MDX"
            category={t('openSourceLibrariesDetail.categories.markdown')}
            description={t('openSourceLibrariesDetail.libraries.mdx')}
            version="v3.1.1"
            docsUrl="https://mdxjs.com"
            githubUrl="https://github.com/mdx-js/mdx"
          />
          <LibraryCard 
            icon={<GrayMatterIcon className="w-5 h-5 text-gray-700" />}
            name="gray-matter"
            category={t('openSourceLibrariesDetail.categories.frontmatter')}
            description={t('openSourceLibrariesDetail.libraries.grayMatter')}
            version="v4.0.3"
            docsUrl="https://github.com/jonschlinkert/gray-matter"
            githubUrl="https://github.com/jonschlinkert/gray-matter"
          />
        </div>
      </div>

      {/* 工具库 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('openSourceLibrariesDetail.utilities')}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LibraryCard 
            icon={<GlobeIcon className="w-5 h-5 text-gray-700" />}
            name="next-intl"
            category={t('openSourceLibrariesDetail.categories.i18n')}
            description={t('openSourceLibrariesDetail.libraries.nextIntl')}
            version="v4.3.9"
            docsUrl="https://next-intl-docs.vercel.app"
            githubUrl="https://github.com/amannn/next-intl"
          />
          <LibraryCard 
            icon={<FuseIcon className="w-5 h-5 text-gray-700" />}
            name="Fuse.js"
            category={t('openSourceLibrariesDetail.categories.search')}
            description={t('openSourceLibrariesDetail.libraries.fuse')}
            version="v7.1.0"
            docsUrl="https://fusejs.io"
            githubUrl="https://github.com/krisk/fuse"
          />
          <LibraryCard 
            icon={<ClsxIcon className="w-5 h-5 text-gray-700" />}
            name="clsx"
            category={t('openSourceLibrariesDetail.categories.utility')}
            description={t('openSourceLibrariesDetail.libraries.clsx')}
            version="v2.1.1"
            docsUrl="https://github.com/lukeed/clsx"
            githubUrl="https://github.com/lukeed/clsx"
          />
          <LibraryCard 
            icon={<DebounceIcon className="w-5 h-5 text-gray-700" />}
            name="use-debounce"
            category={t('openSourceLibrariesDetail.categories.hooks')}
            description={t('openSourceLibrariesDetail.libraries.useDebounce')}
            version="v10.0.6"
            docsUrl="https://github.com/xnimorz/use-debounce"
            githubUrl="https://github.com/xnimorz/use-debounce"
          />
        </div>
      </div>

      {/* 开发工具 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{t('openSourceLibrariesDetail.devTools')}</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <LibraryCard 
            icon={<ESLintIcon className="w-5 h-5 text-gray-700" />}
            name="ESLint"
            category={t('openSourceLibrariesDetail.categories.linter')}
            description={t('openSourceLibrariesDetail.libraries.eslint')}
            version="v9.x"
            docsUrl="https://eslint.org"
            githubUrl="https://github.com/eslint/eslint"
          />
          <LibraryCard 
            icon={<PrettierIcon className="w-5 h-5 text-gray-700" />}
            name="Prettier"
            category={t('openSourceLibrariesDetail.categories.formatter')}
            description={t('openSourceLibrariesDetail.libraries.prettier')}
            version="v3.3.3"
            docsUrl="https://prettier.io"
            githubUrl="https://github.com/prettier/prettier"
          />
          <LibraryCard 
            icon={<HuskyIcon className="w-5 h-5 text-gray-700" />}
            name="Husky"
            category={t('openSourceLibrariesDetail.categories.gitHooks')}
            description={t('openSourceLibrariesDetail.libraries.husky')}
            version="v9.0.11"
            docsUrl="https://typicode.github.io/husky"
            githubUrl="https://github.com/typicode/husky"
          />
          <LibraryCard 
            icon={<GitHubIcon className="w-5 h-5 text-gray-700" />}
            name="lint-staged"
            category={t('openSourceLibrariesDetail.categories.gitHooks')}
            description={t('openSourceLibrariesDetail.libraries.lintStaged')}
            version="v15.2.10"
            docsUrl="https://github.com/lint-staged/lint-staged"
            githubUrl="https://github.com/lint-staged/lint-staged"
          />
          <LibraryCard 
            icon={<OpenAIIcon className="w-5 h-5 text-gray-700" />}
            name="OpenAI SDK"
            category={t('openSourceLibrariesDetail.categories.ai')}
            description={t('openSourceLibrariesDetail.libraries.openai')}
            version="v5.22.1"
            docsUrl="https://platform.openai.com/docs"
            githubUrl="https://github.com/openai/openai-node"
          />
        </div>
      </div>
    </div>
  )
}
