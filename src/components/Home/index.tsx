"use client";

import { useLocale, useTranslations } from "next-intl";
import { useScrollParallax, useLayoutHeights } from "@/hooks";
import SectionSwitch from "./SectionSwitch";
import HomeSectionSkeleton from "./HomeSectionSkeleton";
import HeroMediaBackground, {
  type HeroMediaBackgroundRef,
} from "./HeroMediaBackground";
import { useSiteConfig, useSiteData } from "@/components/SiteDataProvider";
import { smoothScrollToElement } from "@/utils";
import { ChevronRightIcon } from "@/assets/icons";
import { useRef, useCallback, useMemo } from "react";
import type { HomeInitPayload } from "@/types/home";
import type { SiteNavigationItem } from "@/types/site";
import { withProjectSubmenu } from "@/utils/navigation";

interface HomeClientProps {
  homeInit: HomeInitPayload;
}

export default function HomeClient({ homeInit }: HomeClientProps) {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const siteConfig = useSiteConfig();
  const { navigation } = useSiteData();
  const { headerHeight } = useLayoutHeights();
  const { scrollY, opacity } = useScrollParallax({
    threshold: 400,
  });

  // 过滤掉非内容型导航（如搜索、语言）
  const navigationItems = useMemo(
    () => withProjectSubmenu(navigation, locale),
    [navigation, locale]
  );
  const sections = useMemo(() => {
    const contentNavs = navigationItems.filter(
      (item) => !["search", "language"].includes(item.key),
    );
    const getNav = (type: string) => {
      return contentNavs.find((navigationItem) => navigationItem.key === type);
    };

    return [
      getNav("blog"),
      getNav("about"),
      getNav("projects"),
    ].filter(Boolean) as SiteNavigationItem[];
  }, [navigationItems]);

  // 获取博客区域的引用
  const blogSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroMediaRef = useRef<HeroMediaBackgroundRef>(null);
  const heroInitialHeight = "calc(100svh - var(--site-nav-height))";

  // 平滑滚动到博客区域，考虑 header 高度（不在此处播放声音，避免「渐入后立即渐出」）
  const scrollToBlogSection = useCallback(() => {
    if (blogSectionRef.current) {
      smoothScrollToElement(blogSectionRef.current, headerHeight - 4);
    }
  }, [headerHeight]);

  return (
    <div className="relative">
      {/* Hero Section with Parallax Effect */}
      <section
        ref={heroSectionRef}
        className="relative flex items-center justify-center overflow-hidden bg-black will-change-transform cursor-default touch-manipulation"
        style={{
          height: heroInitialHeight,
          minHeight: heroInitialHeight,
        }}
      >
        {/* 视频 + 背景音乐 背景 */}
        <HeroMediaBackground
          ref={heroMediaRef}
          portalTargetRef={heroSectionRef}
        />
        {/* 深色遮盖层，保留视频存在感，同时保证文字可读。 */}
        <div
          className="absolute inset-0 z-5 bg-black/45 transition-opacity duration-500"
          style={{ opacity: Math.max(opacity * 0.92, 0.38) }}
        />

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white will-change-transform transition-opacity duration-300 ease-out"
            style={{ opacity }}
          >
            {t("welcome", { siteTitle: siteConfig.title ?? "Apodidae" })}
          </h1>
          <p
            className="mt-4 sm:mt-6 text-lg sm:text-xl font-medium max-w-3xl mx-auto text-white/90 will-change-transform transition-[transform,opacity] duration-100 ease-out"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity,
            }}
          >
            {t("description")}
          </p>

          {/* 点击提示 */}
          <div
            className="mt-8 sm:mt-12 cursor-pointer flex items-center justify-center text-sm text-white/90 will-change-transform transition-[transform,opacity] duration-100 ease-out"
            style={{
              transform: `translateY(${scrollY * 0.1}px)`,
              opacity: opacity * 0.8,
            }}
            onClick={scrollToBlogSection}
            role="button"
            tabIndex={0}
            aria-label={t("scrollToBlog")}
          >
            <span className="flex items-center gap-2 rounded-[var(--site-radius-control)] border border-white/28 bg-white/10 px-4 py-2 backdrop-blur-sm transition-colors hover:bg-white/16">
              <span>{t("continue")}</span>
              <ChevronRightIcon className="w-4 h-4" strokeWidth={2} />
            </span>
          </div>
        </div>
      </section>

      {/* Full-bleed Sections */}
      <div className="relative z-20">
        {sections.length === 0 ? (
          <HomeSectionSkeleton index={0} />
        ) : (
          sections.map((item, idx) => {
            // 为博客区域添加引用
            if (item.key === "blog") {
              return (
                <div key={item.key} ref={blogSectionRef}>
                  <SectionSwitch item={item} index={idx} homeInit={homeInit} />
                </div>
              );
            }
            return <SectionSwitch key={item.key} item={item} index={idx} homeInit={homeInit} />;
          })
        )}
      </div>
    </div>
  );
}
