"use client";

import { useTranslations } from "next-intl";
import { OPEN_SOURCE_LIBRARIES } from "@/constants";
import { OpenSourceIcon } from "@/assets/icons";
import { IconMap } from "./constants";
import { useState, useEffect, useMemo } from "react";

interface OpenSourceLibrariesBriefProps {
  className?: string;
}

const OpenSourceLibrariesBrief = ({
  className,
}: OpenSourceLibrariesBriefProps) => {
  const t = useTranslations("AboutPage");
  const [isMounted, setIsMounted] = useState(false);

  // 在客户端挂载后再进行随机排序，避免 hydration 错误
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 所有数据（固定顺序，用于 SSR）
  const allSourcesData = useMemo(
    () =>
      OPEN_SOURCE_LIBRARIES.flatMap(({ sources }) =>
        sources.map(({ key, version, icon }) => ({
          key,
          version,
          icon,
        }))
      ),
    []
  );

  // 随机获取8个开源库（仅在客户端）
  const sourcesData = useMemo(() => {
    if (!isMounted) {
      // SSR 时返回固定的前8个，避免 hydration 错误
      return allSourcesData.slice(0, 8);
    }
    // 客户端时进行随机排序
    return [...allSourcesData]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  }, [isMounted, allSourcesData]);

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
