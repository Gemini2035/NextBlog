"use client";

import { useTranslations } from "next-intl";
import { TechStackIcon } from "@/assets/icons";
import { FC } from "react";
import { useAboutList } from "@/components/About/AboutDataProvider";
import { StickySectionHeader } from "@/components/About/StickySectionHeader";
import { SanitizedHtml } from "@/components/SanitizedHtml";
import { cn } from "@/utils";

interface TechStackDetailProps {
  className?: string;
}

const TechStackDetail: FC<TechStackDetailProps> = ({ className }) => {
  const t = useTranslations("AboutPage");
  const techStack = useAboutList<{
    id: number
    name: string
    description: string
    iconBase64?: string | null
    isDeprecated?: boolean
  }>("tech_stack");

  return (
    <div className={className}>
      <StickySectionHeader>
        <div className="flex items-center">
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
      </StickySectionHeader>

      <div className="space-y-4 mb-8">
        {techStack.map(({ id, name, description, iconBase64, isDeprecated }) => {
          return (
            <div
              className={cn(
                "flex items-start p-4 bg-white rounded-xl shadow-sm border border-gray-200",
                isDeprecated && "opacity-50 grayscale"
              )}
              key={id}
            >
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 shrink-0">
                {iconBase64 ? (
                  <img src={iconBase64} alt="" className="w-6 h-6 object-contain" />
                ) : (
                  <TechStackIcon className="w-6 h-6 text-gray-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">{name}</h3>
                  {isDeprecated ? (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      Deprecated
                    </span>
                  ) : null}
                </div>
                <SanitizedHtml
                  className="tech-stack-html text-sm text-gray-700"
                  html={description}
                />
              </div>
            </div>
          );
        })}
      </div>
      <style jsx global>{`
        .tech-stack-html {
          overflow-wrap: anywhere;
          line-height: 1.7;
        }

        .tech-stack-html > :first-child {
          margin-top: 0;
        }

        .tech-stack-html > :last-child {
          margin-bottom: 0;
        }

        .tech-stack-html p {
          margin: 0.6rem 0;
        }

        .tech-stack-html ul,
        .tech-stack-html ol {
          margin: 0.6rem 0;
          padding-left: 1.25rem;
        }

        .tech-stack-html ul {
          list-style: disc;
        }

        .tech-stack-html ol {
          list-style: decimal;
        }

        .tech-stack-html a {
          color: #2563eb;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .tech-stack-html code {
          border-radius: 0.25rem;
          background: #f3f4f6;
          padding: 0.1rem 0.25rem;
          color: #111827;
        }
      `}</style>
    </div>
  );
};

export default TechStackDetail;
