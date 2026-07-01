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
        <div className="flex items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mr-6">
            <GlobeIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {navT("Personal Profile")}
            </h2>
            <p className="text-lg text-gray-600">
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
