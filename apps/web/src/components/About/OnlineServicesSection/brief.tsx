"use client";

import { useLocale, useTranslations } from "next-intl";
import { OnlineServiceIcon } from "@/assets/icons";
import { ONLINE_SERVICES } from "@/constants";
import { IconMap } from "./constants";
import { useRandomSort } from "@/hooks";
import { cn } from "@/utils";
import { FC } from "react";

interface OnlineServicesBriefProps {
  className?: string;
}

const OnlineServicesBrief: FC<OnlineServicesBriefProps> = ({ className }) => {
  const t = useTranslations("AboutPage");
  const locale = useLocale();
  const onlineServices =
    ONLINE_SERVICES[locale as keyof typeof ONLINE_SERVICES]?.flatMap(
      ({ services }) =>
        services.map(({ id, icon, name, category, externalDescription }) => ({
          id,
          icon,
          name,
          category,
          externalDescription,
        }))
    ) || [];

  const onlineServicesWithRandom = useRandomSort(onlineServices, 4);

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <OnlineServiceIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("OnlineServies.title")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {onlineServicesWithRandom.map(
          ({
            id,
            icon,
            name,
            category,
            externalDescription: { text, textColor },
          }) => {
            const IconComponent = IconMap[icon as keyof typeof IconMap];

            return (
              <div
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                key={id}
              >
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
                    {IconComponent ? (
                      <IconComponent className="w-4 h-4 text-gray-700" />
                    ) : (
                      <OnlineServiceIcon className="w-4 h-4 text-gray-700" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {name}
                    </h3>
                    <p className="text-xs text-gray-600">{category}</p>
                  </div>
                </div>
                <span className={cn("text-xs", textColor)}>{text}</span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default OnlineServicesBrief;
