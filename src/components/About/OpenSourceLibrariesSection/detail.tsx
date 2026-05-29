"use client";

import { useTranslations } from "next-intl";
import { OpenSourceIcon, GitHubIcon } from "@/assets/icons";
import { cn } from "@/utils";
import { FC } from "react";
import { IconMap } from "./constants";
import { useAboutList } from "@/components/About/AboutDataProvider";

interface OpenSourceLibrariesDetailProps {
  className?: string;
}

interface LibraryCardProps {
  icon: React.ReactNode;
  name: string;
  category: string;
  description: string;
  version: string;
  docsUrl: string;
  githubUrl: string;
  interactiveText: {
    viewDocs: string;
    sourceCode: string;
  };
}

const LibraryCard: FC<LibraryCardProps> = ({
  icon,
  name,
  category,
  description,
  version,
  docsUrl,
  githubUrl,
  interactiveText = {
    viewDocs: "View Docs",
    sourceCode: "Source Code",
  },
}) => (
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
    <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
    <div className="mt-auto pt-2 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-gray-500">v{version}</span>
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
          {interactiveText.viewDocs} →
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
          {interactiveText.sourceCode}
        </a>
      </div>
    </div>
  </div>
);

const OpenSourceLibrariesDetail: FC<OpenSourceLibrariesDetailProps> = ({
  className,
}) => {
  const t = useTranslations("AboutPage");
  const openSourceLibraries = useAboutList<{
    key: string
    name: string
    sources: Array<{
      key: string
      name: string
      version: string
      documentation: string
      sourceCode: string
      icon: keyof typeof IconMap
      subCategory: string
      description: string
    }>
  }>("open_source");

  return (
    <div className={className} id="open-source">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6 shrink-0">
          <OpenSourceIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t("OpenSource.title")}
          </h2>
          <p className="text-lg text-gray-600">{t("OpenSource.description")}</p>
        </div>
      </div>

      {openSourceLibraries.map(
        ({ key, sources, name }) => (
          <div className="mb-8" key={key}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {name}
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sources.map(
                ({
                  key,
                  name,
                  version,
                  documentation,
                  sourceCode,
                  icon,
                  subCategory,
                  description,
                }) => {
                  const IconComponent = IconMap[icon];
                  return (
                    <LibraryCard
                      key={key}
                      icon={
                        IconComponent ? (
                          <IconComponent className="w-5 h-5 text-gray-700" />
                        ) : (
                          <OpenSourceIcon className="w-5 h-5 text-gray-700" />
                        )
                      }
                      name={name}
                      category={subCategory}
                      description={description}
                      version={version}
                      docsUrl={documentation}
                      githubUrl={sourceCode}
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
    </div>
  );
};

export default OpenSourceLibrariesDetail;
