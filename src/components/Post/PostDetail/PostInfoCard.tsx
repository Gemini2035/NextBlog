"use client";

import { useState, useEffect } from "react";
import { Card, Button } from "@/ui";
import { PostTag } from "../PostTag";
import { formatDate, cn } from "@/utils";
import { CollapseIcon } from "@/assets/icons";
import type { Post } from "../../../../.contentlayer/generated";
import { useLayoutHeights } from "@/hooks";

interface PostInfoCardProps {
  post: Post;
}

export function PostInfoCard({ post }: PostInfoCardProps) {
  // 暂时禁用sticky功能
  const [isSticky, setIsSticky] = useState(false);
  const [cardHeight, setCardHeight] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { headerHeight } = useLayoutHeights();

  useEffect(() => {
    // 测量卡片高度
    const measureCardHeight = () => {
      const element = document.getElementById("post-info-card");
      if (element && !isSticky) {
        const height = element.offsetHeight;
        setCardHeight(height);
      }
    };

    // 使用Intersection Observer检测文章内容区域
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // 当文章内容的上边框距离顶部一个header高度时，卡片变为sticky
          const isArticleTopAboveThreshold = entry.boundingClientRect.top < headerHeight;
          setIsSticky(isArticleTopAboveThreshold);
        });
      },
      {
        root: null, // 使用视窗作为根
        rootMargin: "0px",
        threshold: [0, 0.1, 0.5, 1.0], // 多个阈值来更精确地检测
      }
    );

    // 初始测量
    measureCardHeight();

    // 监听窗口大小变化
    window.addEventListener("resize", measureCardHeight);
    
    // 添加滚动事件监听器作为备用方案
    const handleScroll = () => {
      const articleContent = document.querySelector('article') || 
                            document.querySelector('main') ||
                            document.querySelector('[data-article-content]');
      
      if (articleContent) {
        const rect = articleContent.getBoundingClientRect();
        const isArticleTopAboveThreshold = rect.top < headerHeight;
        setIsSticky(isArticleTopAboveThreshold);
      }
    };
    
    window.addEventListener("scroll", handleScroll);

    // 等待DOM更新后设置observer
    const timer = setTimeout(() => {
      // 查找文章内容区域（通常是main标签或包含文章内容的容器）
      const articleContent = document.querySelector('article') || 
                            document.querySelector('main') ||
                            document.querySelector('[data-article-content]');
      
      if (articleContent) {
        observer.observe(articleContent);
      }
    }, 100);

    return () => {
      window.removeEventListener("resize", measureCardHeight);
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [headerHeight, isSticky]);

  useEffect(() => {
    if (!isSticky) {
      setIsCollapsed(false);
    }
  }, [isSticky]);

  return (
    <>
      {/* 占位div - 当卡片变为sticky时保持布局稳定 */}
      {isSticky && (
        <div 
          className="w-full"
          style={{ height: cardHeight || 0 }}
          aria-hidden="true"
        />
      )}
      
      <div className={cn(isSticky ? "relative" : "")}>
        <div className={cn(isSticky && "fixed top-60 right-0 z-50")}>
          <Card
            id="post-info-card"
            shadow="lg"
            border="sm"
            rounded
            disabledHover
            className={cn(
              "liquid-transform transition-all duration-500 ease-in-out relative",
              isSticky
                ? "animate-slide-in-right min-w-80 w-30vw max-h-[calc(100vh-2rem)] shadow-2xl transform -translate-y-1/2"
                : "w-full mb-8 animate-slide-in-top",
              isCollapsed && "transform translate-x-full"
            )}
          >
            <div
              className={cn(
                "p-6",
                isSticky && "max-h-[calc(100vh-4rem)] overflow-y-auto"
              )}
            >
              {/* 文章标题 */}
              <h1
                className={cn(
                  "font-bold text-gray-900 mb-4",
                  isSticky ? "text-xl" : "text-3xl"
                )}
              >
                {post.title}
              </h1>

              {/* 日期信息 */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <time dateTime={post.date}>{formatDate(post.date)}</time>

                {post.updatedAt && post.updatedAt !== post.date && (
                  <span>更新于 {formatDate(post.updatedAt)}</span>
                )}
              </div>

              {/* 文章描述 */}
              {post.description && (
                <div className="mb-6">
                  <p
                    className={cn(
                      "text-gray-700",
                      isSticky ? "text-sm" : "text-lg"
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
                      isSticky ? "text-sm" : "text-base"
                    )}
                  >
                    标签
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <PostTag
                        key={tag}
                        size={isSticky ? "small" : "medium"}
                        variant="primary"
                      >
                        {tag}
                      </PostTag>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {isSticky && (
              <Button
                onClick={() => setIsCollapsed(!isCollapsed)}
                type="ghost"
                size="sm"
                className="absolute right-full top-1/2 -translate-y-1/2 px-2 py-4 rounded-full transition-all duration-300 z-50 bg-white border border-gray-200 shadow-sm"
                aria-label={isCollapsed ? t('expandInfo') : t('collapseInfo')}
              >
                <CollapseIcon 
                  className={cn(
                    isCollapsed ? "rotate-90" : "rotate-270"
                  )}
                />
              </Button>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
