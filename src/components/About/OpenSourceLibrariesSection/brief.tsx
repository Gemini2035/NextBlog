"use client";

import { useTranslations } from "next-intl";
import { OpenSourceIcon } from "@/assets/icons";
import { useMemo } from "react";
import { useRandomSort } from "@/hooks/useRandomSort";
import { useAboutList } from "@/components/About/AboutDataProvider";
import { cn } from "@/utils";
import { FallbackImage } from "@/components/FallbackImage";

interface OpenSourceLibrariesBriefProps {
  className?: string;
}


const OpenSourceLibrariesBrief = ({
  className,
}: OpenSourceLibrariesBriefProps) => {
  const t = useTranslations("AboutPage");
  const openSourceLibraries = useAboutList<{
    sources: Array<{
      id?: number
      key?: string
      name: string
      version?: string | null
      iconBase64?: string | null
      summary: string
      isDeprecated?: boolean
    }>
  }>("open_source");

  // 所有数据（固定顺序，用于 SSR）
  const allSourcesData = useMemo(
    () =>
      openSourceLibraries.flatMap(({ sources }) =>
        sources.map(({ id, key, name, version, iconBase64, summary, isDeprecated }) => ({
          id,
          key,
          name,
          version,
          iconBase64,
          summary,
          isDeprecated,
        }))
      ),
    [openSourceLibraries]
  );

  // 随机获取8个开源库（仅在客户端）
  const sourcesData = useRandomSort(allSourcesData, 8);

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
        {sourcesData.map(({ id, key, name, version, iconBase64, summary, isDeprecated }) => {
          return (
            <div
              key={id ?? key ?? name}
              className={cn(
                "bg-white p-3 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between",
                isDeprecated && "opacity-50 grayscale"
              )}
            >
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
                  <FallbackImage
                    src={iconBase64}
                    className="w-4 h-4 object-contain"
                    fallback={<OpenSourceIcon className="w-4 h-4 text-gray-700" />}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{name}</h3>
                  <p className="text-xs text-gray-600">
                    {summary}
                  </p>
                </div>
              </div>
              {version ? <span className="text-xs text-gray-500">{`v${version}`}</span> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpenSourceLibrariesBrief;
