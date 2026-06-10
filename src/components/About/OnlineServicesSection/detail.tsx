"use client";

import { useTranslations } from "next-intl";
import { OnlineServiceIcon } from "@/assets/icons";
import { cn } from "@/utils";
import { FC, ReactNode } from "react";
import { IconMap } from "./constants";
import { useAboutList } from "@/components/About/AboutDataProvider";

interface OnlineServicesDetailProps {
  className?: string;
}

interface ServiceCardProps {
  icon: ReactNode;
  name: string;
  category: string;
  description: string;
  externalDescription: {
    text: string;
    textColor: string;
  };
  websiteUrl: string;
  docsUrl?: string;
  interactiveText?: {
    visitWebsite: string;
    viewDocs: string;
  };
}

const ServiceCard: FC<ServiceCardProps> = ({
  icon,
  name,
  category,
  description,
  externalDescription: { text, textColor },
  websiteUrl,
  docsUrl,
  interactiveText = {
    visitWebsite: "Visit Website",
    viewDocs: "View Docs",
  },
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-[var(--site-action)] transition-colors flex flex-col">
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{category}</p>
      </div>
    </div>
    <p className="text-gray-600 text-sm mb-4 flex-grow">{description}</p>
    <div className="mt-auto pt-2 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span className={cn("text-xs font-medium", textColor)}>{text}</span>
      </div>
      <div className="flex items-center justify-between">
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "text-blue-600 hover:text-blue-800 text-sm font-medium",
            "flex items-center gap-1 transition-colors"
          )}
        >
          {interactiveText.visitWebsite} →
        </a>
        {docsUrl && (
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "text-gray-600 hover:text-gray-900 text-sm",
              "flex items-center gap-1 transition-colors"
            )}
          >
            {interactiveText.viewDocs}
          </a>
        )}
      </div>
    </div>
  </div>
);

export default function OnlineServicesDetail({
  className,
}: OnlineServicesDetailProps) {
  const t = useTranslations("AboutPage");
  const onlineServices = useAboutList<{
    id: string
    name: string
    services: Array<{
      id: string
      icon: keyof typeof IconMap
      name: string
      description: string
      externalDescription: {
        text: string
        textColor: string
      }
      category: string
      url: string
      documentation?: string
    }>
  }>("online_services");

  return (
    <div className={className} id="online-services">
      <div className="flex items-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6 shrink-0">
          <OnlineServiceIcon className="w-8 h-8 text-blue-600" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {t("OnlineServies.title")}
          </h2>
          <p className="text-lg text-gray-600">
            {t("OnlineServies.description")}
          </p>
        </div>
      </div>

      {onlineServices.map(
        ({ id, name, services }) => (
          <div className="mb-8" key={id}>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">{name}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(
                ({
                  id,
                  icon,
                  name,
                  description,
                  externalDescription,
                  category,
                  url,
                  documentation,
                }) => {
                  const IconComponent = IconMap[icon as keyof typeof IconMap];

                  return (
                    <ServiceCard
                      key={id}
                      icon={
                        IconComponent ? (
                          <IconComponent className="w-5 h-5 text-gray-700" />
                        ) : (
                          <OnlineServiceIcon className="w-5 h-5 text-gray-700" />
                        )
                      }
                      name={name}
                      category={category}
                      description={description}
                      externalDescription={externalDescription}
                      websiteUrl={url}
                      docsUrl={documentation}
                      interactiveText={{
                        visitWebsite: t(
                          `OnlineServies.InteractiveText.visitWebsite`
                        ),
                        viewDocs: t(`OnlineServies.InteractiveText.viewDocs`),
                      }}
                    />
                  );
                }
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
}
