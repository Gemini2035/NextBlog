"use client";

import { useTranslations } from "next-intl";
import { useNavigation, useScrollParallax, useLayoutHeights } from "@/hooks";
import SectionSwitch from "@/components/Home/SectionSwitch";
import HomeSectionSkeleton from "@/components/Home/HomeSectionSkeleton";
import HeroMediaBackground, {
  type HeroMediaBackgroundRef,
} from "@/components/Home/HeroMediaBackground";
import { SITE_CONFIG } from "@/constants";
import { smoothScrollToElement } from "@/utils";
import { ChevronRightIcon } from "@/assets/icons";
import { useRef, useCallback } from "react";

export default function Home() {
  const t = useTranslations("HomePage");
  const { navigationItems } = useNavigation();
  const { headerHeight } = useLayoutHeights();
  const { scrollY, isScrolling, opacity, currentHeight, isClient } =
    useScrollParallax({
      threshold: 400,
      maxHeight: 100,
      minHeight: 0,
    });

  // 过滤掉非内容型导航（如搜索、语言）
  const contentNavs = navigationItems.filter(
    (item) => item.type !== "__search" && item.type !== "__language",
  );
  const getNav = (type: string) => contentNavs.find((n) => n.type === type);

  const sections = [
    getNav("__blog"),
    getNav("__about"),
    getNav("__projects"),
  ].filter(Boolean) as Array<{
    type: "__blog" | "__about" | "__projects";
    href: string;
  }>;

  // 获取博客区域的引用
  const blogSectionRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroMediaRef = useRef<HeroMediaBackgroundRef>(null);

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
        className="relative flex items-center justify-center overflow-hidden will-change-transform cursor-default hover:bg-gradient-to-br hover:from-blue-50 hover:via-blue-25 hover:to-blue-100 transition-all duration-300 touch-manipulation"
        style={{
          height: isClient ? `${currentHeight}px` : "600px",
          minHeight: isClient ? `${currentHeight}px` : "600px",
          paddingTop: isScrolling ? "2rem" : "0",
          paddingBottom: isScrolling ? "2rem" : "0",
          transition: isClient
            ? "height 0.1s ease-out, padding 0.3s ease-out"
            : "none",
        }}
      >
        {/* 视频 + 背景音乐 背景 */}
        <HeroMediaBackground
          ref={heroMediaRef}
          portalTargetRef={heroSectionRef}
        />
        {/* 深色遮盖层，提升文字识别度 */}
        <div
          className="absolute inset-0 z-[5] bg-gradient-to-br from-black/55 via-gray-900/50 to-black/55 transition-opacity duration-500"
          style={{ opacity }}
        />

        {/* Content - 文字液态玻璃效果 */}
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight will-change-transform bg-clip-text text-transparent transition-opacity duration-300 ease-out [background-image:linear-gradient(180deg,rgba(255,255,255,0.78)_0%,rgba(255,255,255,0.62)_45%,rgba(240,242,250,0.68)_100%)] [-webkit-background-clip:text] [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.6))_drop-shadow(0_0_16px_rgba(255,255,255,0.2))]"
            style={{ opacity }}
          >
            {t("welcome", { siteTitle: SITE_CONFIG.title })}
          </h1>
          <p
            className="mt-4 sm:mt-6 text-lg sm:text-xl font-bold max-w-3xl mx-auto will-change-transform bg-clip-text text-transparent transition-[transform,opacity] duration-100 ease-out [background-image:linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(248,249,252,0.58)_50%,rgba(230,234,245,0.65)_100%)] [-webkit-background-clip:text] [filter:drop-shadow(0_0_1px_rgba(255,255,255,0.5))_drop-shadow(0_0_12px_rgba(255,255,255,0.15))]"
            style={{
              transform: isScrolling
                ? "translateY(0)"
                : `translateY(${scrollY * 0.2}px)`,
              opacity,
            }}
          >
            {t("description")}
          </p>

          {/* 点击提示 */}
          <div
            className="mt-8 sm:mt-12 cursor-pointer flex items-center justify-center text-sm text-white/80 will-change-transform transition-[transform,opacity] duration-100 ease-out"
            style={{
              transform: isScrolling
                ? "translateY(0)"
                : `translateY(${scrollY * 0.1}px)`,
              opacity: opacity * 0.8,
            }}
            onClick={scrollToBlogSection}
            role="button"
            tabIndex={0}
            aria-label={t("scrollToBlog")}
          >
            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/25 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]">
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
            if (item.type === "__blog") {
              return (
                <div key={item.type} ref={blogSectionRef}>
                  <SectionSwitch item={item} index={idx} />
                </div>
              );
            }
            return <SectionSwitch key={item.type} item={item} index={idx} />;
          })
        )}
      </div>
    </div>
  );
}
