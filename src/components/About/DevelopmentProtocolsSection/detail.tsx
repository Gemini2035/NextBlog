"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import { IconMap } from "./constants";
import { useAboutList } from "@/components/About/AboutDataProvider";
import { StickySectionHeader } from "@/components/About/StickySectionHeader";

interface DevelopmentProtocolsDetailProps {
  className?: string;
}

export default function DevelopmentProtocolsDetail({
  className,
}: DevelopmentProtocolsDetailProps) {
  const developmentProtocols = useAboutList<{
    id: string
    icon: keyof typeof IconMap
    color?: {
      bg?: string
      icon?: string
      badge?: string
    }
    category: string
    name: string
    description: string
    features: string[]
    url: string
  }>("development_protocols");
  const t = useTranslations("AboutPage");

  return (
    <div className={cn(className)} id="protocols">
      {/* 标题部分 */}
      <StickySectionHeader>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
            <span className="text-3xl">🌐</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t("DevelopmentProtocols.title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("DevelopmentProtocols.description")}
            </p>
          </div>
        </div>
      </StickySectionHeader>

      {/* 协议列表 */}
      <div className="space-y-6">
        {developmentProtocols.map(
          ({ id, icon, color, category, name, description, features, url }) => {
            const IconComponent = IconMap[icon];

            return (
              <div
                key={id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:border-[var(--site-action)] transition-colors duration-200"
              >
                <div className="p-6">
                  {/* 协议头部 */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={cn(
                        "shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
                        color?.bg
                      )}
                    >
                      {IconComponent ? (
                        <IconComponent className={cn("w-6 h-6", color?.icon)} />
                      ) : (
                        <span className={cn("w-6 h-6", color?.icon)}>🌐</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {name}
                        </h3>
                        <span
                          className={cn(
                            "px-2.5 py-0.5 text-xs font-medium rounded-full",
                            color?.badge
                          )}
                        >
                          {category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* 协议描述 */}
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {description}
                  </p>

                  {/* 特性列表 */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      {t("DevelopmentProtocols.keyFeatures")}
                    </h4>
                    <div className="grid md:grid-cols-2 gap-2">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <span
                            className={cn(
                              "shrink-0 w-1.5 h-1.5 rounded-full mt-2",
                              color?.icon?.replace("text-", "bg-") ?? "bg-gray-500"
                            )}
                          />
                          <span className="text-sm text-gray-700">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 链接 */}
                  <div className="pt-4 border-t border-gray-100">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "inline-flex items-center gap-2 text-sm font-medium hover:underline transition-colors",
                        color?.icon
                      )}
                    >
                      <span>{t("DevelopmentProtocols.viewSpec")}</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* 底部说明 */}
      <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-xl">✨</span>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              {t("DevelopmentProtocols.title")}
            </h4>
            <p className="text-gray-700 leading-relaxed">
              {t("DevelopmentProtocols.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
