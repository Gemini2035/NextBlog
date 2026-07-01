"use client";

import { useTranslations } from "next-intl";
import { OnlineServiceIcon } from "@/assets/icons";
import { cn } from "@/utils";
import Image from "next/image";
import { FC, ReactNode } from "react";
import { useAboutList } from "@/components/About/AboutDataProvider";
import { StickySectionHeader } from "@/components/About/StickySectionHeader";
import { SanitizedHtml } from "@/components/SanitizedHtml";

interface OnlineServicesDetailProps {
  className?: string;
}

interface OnlineServicePlanBadge {
  name: string;
  textColor: string;
}

const getPlanStyle = (plan: OnlineServicePlanBadge) => ({
  color: plan.textColor,
})

interface ServiceCardProps {
  icon?: ReactNode;
  serviceIcon?: string | null;
  name: string;
  category: string;
  description: string;
  plan: OnlineServicePlanBadge;
  planSuffix: string;
  websiteUrl: string;
  docsUrl?: string;
  interactiveText?: {
    visitWebsite: string;
    viewDocs: string;
  };
}

const ServiceCard: FC<ServiceCardProps> = ({
  icon,
  serviceIcon,
  name,
  category,
  description,
  plan,
  planSuffix,
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
        {serviceIcon ? (
          <Image
            src={serviceIcon}
            alt=""
            width={20}
            height={20}
            unoptimized
            className="h-5 w-5 object-contain"
          />
        ) : (
          icon ?? <OnlineServiceIcon className="w-5 h-5 text-gray-700" />
        )}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{name}</h3>
        <p className="text-sm text-gray-600">{category}</p>
      </div>
    </div>
    <SanitizedHtml html={description} className="prose text-sm mb-4 max-w-none flex-grow text-gray-600" />
    <div className="mt-auto pt-2 border-t border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-medium"
          style={getPlanStyle(plan)}
        >
          {plan.name}
          {planSuffix}
        </span>
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
  const planSuffix = t("OnlineServices.planSuffix");
  const onlineServices = useAboutList<{
    id: number
    name: string
    services: Array<{
      id: number
      icon?: string | null
      name: string
      description: string
      plan: OnlineServicePlanBadge
      serviceCategory: string
      url: string
      documentation?: string
      isDesperate?: boolean
    }>
  }>("online_services");

  return (
    <div className={className} id="online-services">
      <StickySectionHeader>
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6 shrink-0">
            <OnlineServiceIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t("OnlineServices.title")}
            </h2>
            <p className="text-lg text-gray-600">
              {t("OnlineServices.description")}
            </p>
          </div>
        </div>
      </StickySectionHeader>

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
                  plan,
                  serviceCategory,
                  url,
                  documentation,
                }) => {
                  return (
                    <ServiceCard
                      key={id}
                      icon={<OnlineServiceIcon className="w-5 h-5 text-gray-700" />}
                      serviceIcon={icon}
                      name={name}
                      category={serviceCategory}
                      description={description}
                      plan={plan}
                      planSuffix={planSuffix}
                      websiteUrl={url}
                      docsUrl={documentation}
                      interactiveText={{
                        visitWebsite: t(
                          `OnlineServices.InteractiveText.visitWebsite`
                        ),
                        viewDocs: t(`OnlineServices.InteractiveText.viewDocs`),
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
