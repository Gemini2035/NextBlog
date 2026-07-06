"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/utils";
import { useSiteProtocols } from "@/components/About/AboutDataProvider";
import { StickySectionHeader } from "@/components/About/StickySectionHeader";
import Image from "next/image";

interface DevelopmentProtocolsDetailProps {
  className?: string;
}

export default function DevelopmentProtocolsDetail({
  className,
}: DevelopmentProtocolsDetailProps) {
  const protocols = useSiteProtocols();
  const t = useTranslations("AboutPage");

  return (
    <div className={cn(className)} id="protocols">
      <StickySectionHeader>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
            <span className="text-3xl">🌐</span>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t("DevelopmentProtocols.title")}
            </h2>
          </div>
        </div>
      </StickySectionHeader>

      <div className="space-y-4">
        {protocols.map(({ id, iconBase64, category, name, description, features, url }) => (
            <article
              key={id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-[var(--site-action)] transition-colors duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center">
                  {iconBase64 ? (
                    <Image src={iconBase64} alt="" width={24} height={24} unoptimized className="h-6 w-6 object-contain" />
                  ) : (
                    <span className="w-6 h-6 text-gray-700">🌐</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{name}</h3>
                    {category ? (
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full border border-gray-200 text-gray-600">
                        {category}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{description}</p>
                  {features ? (
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {features}
                    </p>
                  ) : null}
                  {url ? (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--site-action)] hover:underline"
                    >
                      <span>{t("DevelopmentProtocols.viewSpec")}</span>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
        ))}
      </div>
    </div>
  );
}
