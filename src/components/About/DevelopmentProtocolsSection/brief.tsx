"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import { useRandomSort } from "@/hooks";
import { FC } from "react";
import { useSiteProtocols } from "@/components/About/AboutDataProvider";
import Image from "next/image";

interface DevelopmentProtocolsBriefProps {
  className?: string;
}

const DevelopmentProtocolsBrief: FC<DevelopmentProtocolsBriefProps> = ({
  className,
}) => {
  const t = useTranslations("AboutPage");
  const protocols = useRandomSort(useSiteProtocols(), 6);

  return (
    <div className={cn(className)}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
          <span className="text-lg">🌐</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {t("DevelopmentProtocols.title")}
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {protocols.map(({ id, iconBase64, name }) => (
            <div
              key={id}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 hover:border-[var(--site-action)] transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <div className="shrink-0 w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                  {iconBase64 ? (
                    <Image src={iconBase64} alt="" width={16} height={16} unoptimized className="h-4 w-4 object-contain" />
                  ) : (
                    <span className="w-4 h-4 text-gray-700">🌐</span>
                  )}
                </div>
                <h3 className="font-medium text-gray-900 text-sm truncate">
                  {name}
                </h3>
              </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default DevelopmentProtocolsBrief;
