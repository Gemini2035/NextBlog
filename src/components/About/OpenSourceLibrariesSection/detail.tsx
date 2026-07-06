"use client";

import { useTranslations } from "next-intl";
import { OpenSourceIcon, GitHubIcon } from "@/assets/icons";
import { cn } from "@/utils";
import { FC } from "react";
import { useAboutList } from "@/components/About/AboutDataProvider";
import { StickySectionHeader } from "@/components/About/StickySectionHeader";
import { SanitizedHtml } from "@/components/SanitizedHtml";
import { FallbackImage } from "@/components/FallbackImage";

interface OpenSourceLibrariesDetailProps {
  className?: string;
}

interface LibraryCardProps {
  iconBase64?: string | null;
  name: string;
  category: string;
  description: string;
  version?: string | null;
  docsUrl?: string | null;
  githubUrl?: string | null;
  isDeprecated?: boolean;
  interactiveText: {
    viewDocs: string;
    sourceCode: string;
  };
}

const LibraryCard: FC<LibraryCardProps> = ({
  iconBase64,
  name,
  category,
  description,
  version,
  docsUrl,
  githubUrl,
  isDeprecated,
  interactiveText = {
    viewDocs: "View Docs",
    sourceCode: "Source Code",
  },
}) => (
  <div
    className={cn(
      "bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-[var(--site-action)] transition-colors flex flex-col",
      isDeprecated && "opacity-50 grayscale"
    )}
  >
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
        <FallbackImage
          src={iconBase64}
          className="w-5 h-5 object-contain"
          fallback={<OpenSourceIcon className="w-5 h-5 text-gray-700" />}
        />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{category}</p>
      </div>
    </div>
    <SanitizedHtml
      className="open-source-html text-gray-600 text-sm mb-4 flex-grow"
      html={description}
    />
    <div className="mt-auto pt-2 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        {version ? <span className="text-xs text-gray-500">v{version}</span> : null}
      </div>
      <div className="flex items-center justify-between">
        {docsUrl ? (
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-blue-600 hover:text-blue-800 text-sm font-medium",
              "flex items-center gap-1 transition-colors"
            )}
          >
            {interactiveText.viewDocs} →
          </a>
        ) : <span />}
        {githubUrl ? (
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
            {interactiveText.sourceCode}
          </a>
        ) : null}
      </div>
    </div>
  </div>
);

const OpenSourceLibrariesDetail: FC<OpenSourceLibrariesDetailProps> = ({
  className,
}) => {
  const t = useTranslations("AboutPage");
  const openSourceLibraries = useAboutList<{
    id?: number
    key?: string
    name: string
    sources: Array<{
      id?: number
      key?: string
      name: string
      version?: string | null
      documentation?: string | null
      sourceCode?: string | null
      iconBase64?: string | null
      subCategory: string
      description: string
      isDeprecated?: boolean
    }>
  }>("open_source");

  return (
    <div className={className} id="open-source">
      <StickySectionHeader>
        <div className="flex items-start gap-4 sm:items-center sm:gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 sm:h-16 sm:w-16">
            <OpenSourceIcon className="w-7 h-7 text-blue-600 sm:w-8 sm:h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {t("OpenSource.title")}
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">{t("OpenSource.description")}</p>
          </div>
        </div>
      </StickySectionHeader>

      {openSourceLibraries.map(
        ({ id, key, sources, name }) => (
          <div className="mb-8" key={id ?? key ?? name}>
            <h3 className="sticky top-[var(--about-detail-category-top,5.5rem)] z-10 mb-4 bg-white/95 py-2 text-xl font-semibold text-gray-900 backdrop-blur">
              {name}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sources.map(
                ({
                  id,
                  key,
                  name,
                  version,
                  documentation,
                  sourceCode,
                  iconBase64,
                  subCategory,
                  description,
                  isDeprecated,
                }) => {
                  return (
                    <LibraryCard
                      key={id ?? key ?? name}
                      iconBase64={iconBase64}
                      name={name}
                      category={subCategory}
                      description={description}
                      version={version}
                      docsUrl={documentation}
                      githubUrl={sourceCode}
                      isDeprecated={isDeprecated}
                      interactiveText={{
                        viewDocs: t(`OpenSource.InteractiveText.viewDocs`),
                        sourceCode: t(`OpenSource.InteractiveText.sourceCode`),
                      }}
                    />
                  );
                }
              )}
            </div>
          </div>
        )
      )}
      <style jsx global>{`
        .open-source-html {
          overflow-wrap: anywhere;
          line-height: 1.7;
        }

        .open-source-html > :first-child {
          margin-top: 0;
        }

        .open-source-html > :last-child {
          margin-bottom: 0;
        }

        .open-source-html p {
          margin: 0.5rem 0;
        }

        .open-source-html ul,
        .open-source-html ol {
          margin: 0.5rem 0;
          padding-left: 1.25rem;
        }

        .open-source-html ul {
          list-style: disc;
        }

        .open-source-html ol {
          list-style: decimal;
        }

        .open-source-html a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .open-source-html code {
          border-radius: 0.25rem;
          background: #f3f4f6;
          padding: 0.1rem 0.25rem;
          color: #111827;
        }
      `}</style>
    </div>
  );
};

export default OpenSourceLibrariesDetail;
