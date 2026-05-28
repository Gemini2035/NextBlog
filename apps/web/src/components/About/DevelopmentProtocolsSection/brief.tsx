"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import { useRandomSort } from "@/hooks";
import { IconMap } from "./constants";
import { FC } from "react";
import { useAboutList } from "@/components/About/AboutDataProvider";

interface DevelopmentProtocolsBriefProps {
  className?: string;
}
const DevelopmentProtocolsBrief: FC<DevelopmentProtocolsBriefProps> = ({
  className,
}) => {
  const t = useTranslations("AboutPage");
  const developmentProtocols = useAboutList<{
    id: string
    icon: keyof typeof IconMap
    color?: {
      bg?: string
      icon?: string
    }
    name: string
  }>("development_protocols");

  const developmentProtocolsWithRandom = useRandomSort(developmentProtocols, 6);

  return (
    <div className={cn(className)}>
      {/* 标题 */}
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <span className="text-lg">🌐</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("DevelopmentProtocols.title")}
        </h2>
      </div>

      {/* 协议卡片网格 */}
      <div className="grid grid-cols-2 gap-3">
        {developmentProtocolsWithRandom.map(({ id, icon, color, name }) => {
          const IconComponent = IconMap[icon];

          return (
            <div
              key={id}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={cn(
                    "shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                    color?.bg
                  )}
                >
                  {IconComponent ? (
                    <IconComponent className={cn("w-4 h-4", color?.icon)} />
                  ) : (
                    <span className={cn("w-4 h-4", color?.icon)}>🌐</span>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 text-sm truncate">
                  {name}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DevelopmentProtocolsBrief;
