"use client";

import { useTranslations } from "next-intl";
import { OPEN_SOURCE_LIBRARIES } from "@/constants";
import { OpenSourceIcon } from "@/assets/icons";
import { IconMap } from "./constants";

interface OpenSourceLibrariesBriefProps {
  className?: string;
}

const OpenSourceLibrariesBrief = ({
  className,
}: OpenSourceLibrariesBriefProps) => {
  const t = useTranslations("AboutPage");

  // 随机获取8个开源库
  const sourcesData = OPEN_SOURCE_LIBRARIES.flatMap(({ sources }) => sources)
    .flatMap(({ key, version, icon }) => ({
      key,
      version,
      icon,
    }))
    .sort(() => Math.random() - 0.5)
    .slice(0, 8);

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <OpenSourceIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("OpenSource.title")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sourcesData.map(({ key, version, icon }) => {
          const IconComponent = IconMap[icon];

          return (
            <div
              key={key}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between"
            >
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
                  {IconComponent ? (
                    <IconComponent className="w-4 h-4 text-gray-700" />
                  ) : (
                    <OpenSourceIcon className="w-4 h-4 text-gray-700" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{key}</h3>
                  <p className="text-xs text-gray-600">
                    {t(`OpenSource.SourcesDetail.${key}.summary`)}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-500">{`v${version}`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpenSourceLibrariesBrief;
