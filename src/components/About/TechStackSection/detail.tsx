"use client";

import { useLocale, useTranslations } from "next-intl";
import { TechStackIcon } from "@/assets/icons";
import { FC } from "react";
import { TECH_STACK } from "@/constants";
import { IconMap } from "./constants";

interface TechStackDetailProps {
  className?: string;
}

const TechStackDetail: FC<TechStackDetailProps> = ({ className }) => {
  const locale = useLocale();
  const t = useTranslations("AboutPage");
  const techStack = TECH_STACK[locale as keyof typeof TECH_STACK];

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6 shrink-0">
          <TechStackIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t("TechStack.title")}
          </h2>
          <p className="text-lg text-gray-600">{t("TechStack.description")}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {techStack.map(({ id, name, description, icon }) => {
          const IconComponent = IconMap[icon];
          return (
            <div
              className="flex items-start p-4 bg-white rounded-xl shadow-sm border border-gray-200"
              key={id}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                {IconComponent ? (
                  <IconComponent className="w-6 h-6 text-gray-700" />
                ) : (
                  <TechStackIcon className="w-6 h-6 text-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
                <p className="text-sm text-gray-700">{description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TechStackDetail;
