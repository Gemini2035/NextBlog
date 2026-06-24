"use client";

import { useTranslations } from "next-intl";
import { TechStackIcon } from "@/assets/icons";
import { FC } from "react";
import { useAboutList } from "@/components/About/AboutDataProvider";
import { FallbackImage } from "@/components/FallbackImage";
import { cn } from "@/utils";

interface TechStackBriefProps {
  className?: string;
}

const TechStackBrief: FC<TechStackBriefProps> = ({ className }) => {
  const t = useTranslations("AboutPage");
  const techStack = useAboutList<{
    id: number
    iconBase64?: string | null
    isDeprecated?: boolean
    summary: string
    name: string
  }>("tech_stack");

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <TechStackIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("TechStack.title")}
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {techStack.map(({ id, iconBase64, isDeprecated, summary, name }) => {
          return (
            <div className={cn("text-center", isDeprecated && "opacity-50 grayscale")} key={id}>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                <FallbackImage
                  src={iconBase64}
                  className="w-5 h-5 object-contain"
                  fallback={<TechStackIcon className="w-5 h-5 text-gray-700" />}
                />
              </div>
              <h3 className="font-medium text-gray-900 text-xs mb-1">
                {name}
                {isDeprecated ? (
                  <span className="ml-1 align-middle text-[10px] font-normal text-gray-500">
                    Deprecated
                  </span>
                ) : null}
              </h3>
              <p className="text-xs text-gray-600">{summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechStackBrief;
