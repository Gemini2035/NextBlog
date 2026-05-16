"use client";

import { useLocale, useTranslations } from "next-intl";
import { TechStackIcon } from "@/assets/icons";
import { FC } from "react";
import { TECH_STACK } from "@/constants";
import { IconMap } from "./constants";

interface TechStackBriefProps {
  className?: string;
}

const TechStackBrief: FC<TechStackBriefProps> = ({ className }) => {
  const locale = useLocale();
  const t = useTranslations("AboutPage");

  const techStack = TECH_STACK[locale as keyof typeof TECH_STACK];

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
        {techStack.map(({ id, icon, summary, name }) => {
          const IconComponent = IconMap[icon];
          return (
            <div className="text-center" key={id}>
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                {IconComponent ? (
                  <IconComponent className="w-5 h-5 text-gray-700" />
                ) : (
                  <TechStackIcon className="w-5 h-5 text-gray-700" />
                )}
              </div>
              <h3 className="font-medium text-gray-900 text-xs mb-1">{name}</h3>
              <p className="text-xs text-gray-600">{summary}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechStackBrief;
