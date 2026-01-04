"use client";

import { BASE_INFO } from "@/constants";
import { GlobeIcon } from "@/assets/icons";
import { useLocale, useTranslations } from "next-intl";
import { FC } from "react";

interface BasicInfoDetailProps {
  className?: string;
}

const BasicInfoDetail: FC<BasicInfoDetailProps> = ({ className }) => {
  const locale = useLocale();
  const t = useTranslations("AboutPage");
  const navT = useTranslations("Navigation");
  const baseInfo = BASE_INFO[locale as keyof typeof BASE_INFO];

  return (
    <div className={className}>
      <div className="flex items-center mb-8">
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

      {/* 完整的个人简介 */}
      <div className="mb-8" id="basic">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          {t("aboutMe")}
        </h3>
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: baseInfo.description }}
        />
      </div>
    </div>
  );
}

export default BasicInfoDetail;