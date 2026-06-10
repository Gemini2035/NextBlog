"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Card, Button } from "@/ui";
import { PostTag } from "../PostTag";
import { formatDate, cn } from "@/utils";
import { CollapseIcon } from "@/assets/icons";
import type { BlogPostDetail } from "@/types/blog";
import { useLayoutHeights, useWindowSize } from "@/hooks";
import { MobileStickyCard } from "./mobile";

interface PostInfoCardProps {
  post: BlogPostDetail;
}

export function PostInfoCard({ post }: PostInfoCardProps) {
  const t = useTranslations('Posts');
  const [isSticky, setIsSticky] = useState(false);
  const [cardHeight, setCardHeight] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0); // 0-1 表示缩小进度
  const { headerHeight } = useLayoutHeights();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const lastScrollY = useRef(0);

  useEffect(() => {
    // 测量卡片高度
    const measureCardHeight = () => {
      const element = document.getElementById("post-info-card");
      if (element && !isSticky) {
        const height = element.offsetHeight;
        setCardHeight(height);
      }
    };

    let ticking = false;
    const MIN_SCROLL_THRESHOLD = 50; // 最小滚动阈值
    const SCROLL_STEP = 0.02; // 每次滚动改变的进度步长

    // 添加滚动事件监听器
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const previousScrollY = lastScrollY.current;
          
          // 移动端逻辑
          if (isMobile) {
            // 判断是否显示 sticky
            if (currentScrollY > MIN_SCROLL_THRESHOLD) {
              setIsScrolled(true);
              setIsSticky(true);
              
              // 判断滚动方向
              const isScrollingDown = currentScrollY > previousScrollY;
              const scrollDelta = Math.abs(currentScrollY - previousScrollY);
              
              // 根据滚动距离调整步长（滚动越快，变化越大）
              const dynamicStep = Math.min(SCROLL_STEP * (scrollDelta / 5), 0.08);
              
              setScrollProgress(prev => {
                if (isScrollingDown) {
                  // 下滑：缩小（progress 增加）
                  return Math.min(prev + dynamicStep, 1);
                } else {
                  // 上滑：放大（progress 减少）
                  return Math.max(prev - dynamicStep, 0);
                }
              });
            } else {
              // 滚动位置小于阈值，隐藏 sticky
              setIsScrolled(false);
              setIsSticky(false);
              setScrollProgress(0);
            }
          } else {
            // 桌面端：使用原有逻辑
            const articleContent = document.querySelector('article') || 
                                  document.querySelector('main') ||
                                  document.querySelector('[data-article-content]');
            
            if (articleContent) {
              const rect = articleContent.getBoundingClientRect();
              const isArticleTopAboveThreshold = rect.top < headerHeight;
              setIsSticky(isArticleTopAboveThreshold);
            }
          }
          
          // 更新上次滚动位置
          lastScrollY.current = currentScrollY;
          ticking = false;
        });
        
        ticking = true;
      }
    };

    // 初始化
    lastScrollY.current = window.scrollY;
    measureCardHeight();

    // 监听窗口大小变化
    window.addEventListener("resize", measureCardHeight);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", measureCardHeight);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [headerHeight, isSticky, isMobile]);

  useEffect(() => {
    if (!isSticky) {
      setIsCollapsed(false);
    }
  }, [isSticky]);

  return (
    <>
      {/* 移动端 sticky 卡片 - 提取到独立组件 */}
      {isMobile && isScrolled && (
        <MobileStickyCard post={post} scrollProgress={scrollProgress} />
      )}

      {/* 主卡片 - 移动端滚动时隐藏 */}
      <div
        className={cn(
          "transition-opacity duration-500 ease-in-out",
          isMobile && isScrolled && "opacity-0 pointer-events-none"
        )}
      >
      {/* 桌面端占位div - 当卡片变为sticky时保持布局稳定 */}
      {!isMobile && isSticky && (
        <div 
          className="w-full"
          style={{ height: cardHeight || 0 }}
          aria-hidden="true"
        />
      )}
      
      <div className={cn(!isMobile && isSticky ? "relative" : "")}>
        <div className={cn(!isMobile && isSticky && "fixed top-60 right-0 z-50")}>
          <Card
            id="post-info-card"
            shadow="sm"
            border="sm"
            rounded
            disabledHover
            className={cn(
              "liquid-transform transition-all duration-500 ease-in-out",
              // 桌面端样式
              !isMobile && !isSticky && "relative w-full mb-8 animate-slide-in-top",
              !isMobile && isSticky && "relative animate-slide-in-right min-w-80 w-30vw max-h-[calc(100vh-2rem)] shadow-md transform -translate-y-1/2",
              !isMobile && isCollapsed && "transform translate-x-full",
              // 移动端样式
              isMobile && "relative w-full mb-8",
            )}
          >
            <div
              className={cn(
                "p-6 transition-all duration-500 ease-in-out",
                !isMobile && isSticky && "max-h-[calc(100vh-4rem)] overflow-y-auto"
              )}
            >
              {/* 文章标题 */}
              <h1
                className={cn(
                  "font-bold text-gray-900 mb-4 transition-all duration-500 ease-in-out",
                  !isMobile && isSticky ? "text-xl" : "text-3xl"
                )}
              >
                {post.title}
              </h1>

              {/* 日期、描述、标签 */}
              <div>
                {/* 日期信息 */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                  <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>

                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <span>{t('updatedAt')} {formatDate(post.updatedAt)}</span>
                  )}
                </div>

                {/* 文章描述 */}
                {post.description && (
                  <div className="mb-6">
                    <p
                      className={cn(
                        "text-gray-700",
                        !isMobile && isSticky ? "text-sm" : "text-lg"
                      )}
                    >
                      {post.description}
                    </p>
                  </div>
                )}

                {/* 标签 */}
                {post.tags && post.tags.length > 0 && (
                  <div>
                    <h3
                      className={cn(
                        "font-semibold text-gray-800 mb-3",
                        !isMobile && isSticky ? "text-sm" : "text-base"
                      )}
                    >
                      {t('tags')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag: string) => (
                        <PostTag
                          key={tag}
                          size={!isMobile && isSticky ? "small" : "medium"}
                          variant="primary"
                        >
                          {tag}
                        </PostTag>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {!isMobile && isSticky && (
              <Button
                onClick={() => setIsCollapsed(!isCollapsed)}
                type="ghost"
                size="sm"
                className="absolute right-full top-1/2 -translate-y-1/2 px-2 py-4 rounded-full transition-all duration-300 z-50 bg-white border border-gray-200 shadow-sm min-h-[3rem] w-8 flex items-center justify-center"
                aria-label={isCollapsed ? t('expandInfo') : t('collapseInfo')}
              >
                <CollapseIcon 
                  className={cn(
                    "w-5 h-5 scale-250",
                    isCollapsed ? "rotate-90" : "rotate-270"
                  )}
                />
              </Button>
            )}
          </Card>
        </div>
      </div>
      </div>
    </>
  );
}
