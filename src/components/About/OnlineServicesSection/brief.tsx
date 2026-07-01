"use client";

import { useTranslations } from "next-intl";
import { OnlineServiceIcon } from "@/assets/icons";
import { useRandomSort } from "@/hooks";
import Image from "next/image";
import { FC } from "react";
import { useAboutList } from "@/components/About/AboutDataProvider";

interface OnlineServicesBriefProps {
  className?: string;
}

const OnlineServicesBrief: FC<OnlineServicesBriefProps> = ({ className }) => {
  const t = useTranslations("AboutPage");
  const planSuffix = t("OnlineServices.planSuffix");
  const onlineServices = useAboutList<{
    services: Array<{
      id: number
      icon?: string | null
      name: string
      serviceCategory: string
      plan: {
        name: string
        textColor: string
        backgroundColor: string
      }
    }>
  }>("online_services").flatMap(({ services }) =>
    services.map(({ id, icon, name, serviceCategory, plan }) => ({
      id,
      icon,
      name,
      serviceCategory,
      plan,
    }))
  );

  const onlineServicesWithRandom = useRandomSort(onlineServices, 4);

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
          <OnlineServiceIcon className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("OnlineServices.title")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {onlineServicesWithRandom.map(
          ({
            id,
            icon,
            name,
            serviceCategory,
            plan,
          }) => {
            return (
              <div
                className="bg-white p-3 rounded-lg shadow-sm border border-gray-200"
                key={id}
              >
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center mr-2">
                    {icon ? (
                      <Image
                        src={icon}
                        alt=""
                        width={16}
                        height={16}
                        unoptimized
                        className="h-4 w-4 object-contain"
                      />
                    ) : (
                      <OnlineServiceIcon className="w-4 h-4 text-gray-700" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">
                      {name}
                    </h3>
                    <p className="text-xs text-gray-600">{serviceCategory}</p>
                  </div>
                </div>
                <span
                  className="rounded px-1.5 py-0.5 text-xs"
                  style={{
                    backgroundColor: plan.backgroundColor,
                    color: plan.textColor,
                  }}
                >
                  {plan.name}
                  {planSuffix}
                </span>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default OnlineServicesBrief;
