"use client";

import { GlobeIcon } from "@/assets/icons";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { useBaseInfo } from "@/components/About/AboutDataProvider";
import { SanitizedHtml } from "@/components/SanitizedHtml";
import { StickySectionHeader } from "@/components/About/StickySectionHeader";

interface BasicInfoDetailProps {
  className?: string;
}

const BasicInfoDetail: FC<BasicInfoDetailProps> = ({ className }) => {
  const t = useTranslations("AboutPage");
  const navT = useTranslations("Navigation");
  const baseInfo = useBaseInfo();

  return (
    <div className={className}>
      <StickySectionHeader>
        <div className="flex items-start gap-4 sm:items-center sm:gap-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-blue-100 sm:h-16 sm:w-16">
            <GlobeIcon className="w-7 h-7 text-blue-600 sm:w-8 sm:h-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="mb-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {navT("Personal Profile")}
            </h2>
            <p className="text-base text-gray-600 sm:text-lg">
              {t("BasicInfo.subtitle")}
            </p>
          </div>
        </div>
      </StickySectionHeader>

      {/* 完整的个人简介 */}
      <div className="mb-8" id="basic">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          {t("aboutMe")}
        </h3>
        <SanitizedHtml
          className="prose prose-lg max-w-none text-gray-700 [&_p]:mb-4 [&_p]:leading-relaxed [&_p:last-child]:mb-0"
          html={baseInfo.description}
        />
      </div>
    </div>
  );
}

export default BasicInfoDetail;
